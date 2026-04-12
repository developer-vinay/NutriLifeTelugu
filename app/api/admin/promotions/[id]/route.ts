import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Promotion } from '@/models/Promotion'
import { ensureAdminOrApiKey } from '@/lib/apiAuth'

export const runtime = 'nodejs'

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!await ensureAdminOrApiKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await context.params
    await connectDB()
    const body = await req.json()
    const promo = await Promotion.findByIdAndUpdate(id, body, { new: true })
    if (!promo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(promo)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!await ensureAdminOrApiKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await context.params
    await connectDB()
    await Promotion.findByIdAndDelete(id)
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
