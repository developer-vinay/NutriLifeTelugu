import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HeroSlide } from '@/models/HeroSlide'
import { ensureAdminOrApiKey } from '@/lib/apiAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (!await ensureAdminOrApiKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 }).lean()
  return NextResponse.json(slides)
}

export async function POST(req: Request) {
  if (!await ensureAdminOrApiKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const slide = await HeroSlide.create(body)
  return NextResponse.json(slide, { status: 201 })
}
