import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  await connectDB()
  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

  const hashed = await bcrypt.hash(password, 10)
  await User.create({ name, email: email.toLowerCase(), password: hashed, provider: 'credentials', role: 'user', language: 'te' })
  return NextResponse.json({ ok: true })
}
