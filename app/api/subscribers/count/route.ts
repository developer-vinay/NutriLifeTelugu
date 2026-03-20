import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  await connectDB()
  const count = await Subscriber.countDocuments()
  return NextResponse.json({ count })
}
