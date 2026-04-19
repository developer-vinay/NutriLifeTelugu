import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HeroSlide } from '@/models/HeroSlide'
import { ensureAdminOrApiKey } from '@/lib/apiAuth'

export const runtime = 'nodejs'

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!await ensureAdminOrApiKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await context.params
  await connectDB()
  const body = await req.json()
  const slide = await HeroSlide.findByIdAndUpdate(id, body, { new: true })
  if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(slide)
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!await ensureAdminOrApiKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await context.params
  await connectDB()
  await HeroSlide.findByIdAndDelete(id)
  return new NextResponse(null, { status: 204 })
}
