import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') return null
  return session
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  const { id } = await context.params
  await connectDB()
  await Subscriber.findByIdAndDelete(id)
  return new NextResponse(null, { status: 204 })
}
