import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { sendEmail, passwordResetEmailHtml } from '@/lib/brevo'

export const runtime = 'nodejs'

const SITE_URL = 'https://nutrilifemitra.vercel.app'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  await connectDB()
  const user = await User.findOne({ email: email.toLowerCase().trim() })

  // Always return success to prevent email enumeration
  if (!user || user.provider !== 'credentials') {
    return NextResponse.json({ success: true })
  }

  const token = crypto.randomBytes(32).toString('hex')
  user.resetToken = token
  user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  await user.save()

  const resetUrl = `${SITE_URL}/reset-password?token=${token}`

  try {
    await sendEmail({
      to: user.email,
      toName: user.name,
      subject: 'Reset your NutriLifeMitra password',
      htmlContent: passwordResetEmailHtml(resetUrl),
    })
  } catch (err) {
    console.error('Password reset email failed:', err)
  }

  return NextResponse.json({ success: true })
}
