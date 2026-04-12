import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Promotion } from '@/models/Promotion'
import { ensureAdminOrApiKey } from '@/lib/apiAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (!await ensureAdminOrApiKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const promos = await Promotion.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(promos)
  } catch (err: any) {
    console.error('GET /api/admin/promotions error:', err?.message ?? err)
    return NextResponse.json({ error: err?.message ?? 'Failed to fetch promotions' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!await ensureAdminOrApiKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const promo = await Promotion.create(body)
    return NextResponse.json(promo, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to create promotion' }, { status: 500 })
  }
}
