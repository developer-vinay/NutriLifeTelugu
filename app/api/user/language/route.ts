import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ ok: false }, { status: 401 })

  const { language } = await req.json()
  if (language !== 'te' && language !== 'en') {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 })
  }

  await connectDB()
  await User.findOneAndUpdate({ email: session.user.email }, { language })
  return NextResponse.json({ ok: true })
}
