import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== 'admin') return null
  return user
}

export async function GET() {
  const admin = await ensureAdmin()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  await connectDB()
  const user = await User.findOne({ email: admin.email }).select('-password').lean()
  if (!user) return new NextResponse('Not found', { status: 404 })

  return NextResponse.json(user)
}

export async function PATCH(request: Request) {
  const admin = await ensureAdmin()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  await connectDB()
  const body = await request.json()
  const { name, currentPassword, newPassword } = body

  const user = await User.findOne({ email: admin.email })
  if (!user) return new NextResponse('Not found', { status: 404 })

  const updates: Record<string, string> = {}

  if (name?.trim()) updates.name = name.trim()

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password required' }, { status: 400 })
    }
    const valid = await bcrypt.compare(currentPassword, user.password ?? '')
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
    }
    updates.password = await bcrypt.hash(newPassword, 12)
  }

  const updated = await User.findByIdAndUpdate(user._id, { $set: updates }, { new: true }).select('-password').lean()
  return NextResponse.json(updated)
}
