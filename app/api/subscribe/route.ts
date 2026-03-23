import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'
import { sendEmail, welcomeEmailHtml } from '@/lib/brevo'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let email: string | undefined

  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await request.json()
    email = body.email
  } else {
    const formData = await request.formData()
    email = formData.get('email') as string | undefined
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  await connectDB()

  const normalized = email.toLowerCase().trim()
  const existing = await Subscriber.findOne({ email: normalized })

  await Subscriber.findOneAndUpdate(
    { email: normalized },
    { email: normalized, isActive: true },
    { upsert: true, new: true },
  )

  // Send welcome email only for new subscribers
  if (!existing) {
    try {
      await sendEmail({
        to: normalized,
        subject: 'Welcome to NutriLifeMithra! 🌿',
        htmlContent: welcomeEmailHtml(normalized),
      })
    } catch {
      // Don't fail the subscription if email fails
    }
  }

  return NextResponse.json({ success: true })
}
