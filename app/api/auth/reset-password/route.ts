import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const { token, password } = await req.json()
  if (!token || !password || password.length < 6) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  await connectDB()
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  })

  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
  }

  user.password = await bcrypt.hash(password, 10)
  user.resetToken = undefined
  user.resetTokenExpiry = undefined
  await user.save()

  return NextResponse.json({ success: true })
}
