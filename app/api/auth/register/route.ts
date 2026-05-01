import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { rateLimit, RateLimits, getClientIp, createRateLimitResponse } from '@/lib/ratelimit'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 5 registration attempts per hour per IP
    // Prevents automated account creation and abuse
    const ip = getClientIp(req)
    const rateLimitResult = rateLimit(ip, RateLimits.STRICT)
    
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult)
    }
    const body = await req.json()
    const { name, email, password } = body

    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    await connectDB()
    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 10)
    await User.create({
      name: name?.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      provider: 'credentials',
      role: 'user',
      language: 'en',
    })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('register error:', err)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
