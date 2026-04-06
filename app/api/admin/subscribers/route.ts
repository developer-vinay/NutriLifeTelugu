import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') return null
  return session
}

export async function GET() {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  await connectDB()
  const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean()
  return NextResponse.json(subscribers)
}
