import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Promotion } from '@/models/Promotion'

export const runtime = 'nodejs'

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await connectDB()
    await Promotion.findByIdAndUpdate(id, { $inc: { clickCount: 1 } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
