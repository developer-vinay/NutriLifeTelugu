import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { FreeMealPlan } from '@/models/FreeMealPlan'
import { ensureAdminOrApiKey } from '@/lib/apiAuth'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  if (!(await ensureAdminOrApiKey(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const plans = await FreeMealPlan.find().sort({ order: 1, createdAt: -1 }).lean()
  return NextResponse.json(plans)
}

export async function POST(req: Request) {
  if (!(await ensureAdminOrApiKey(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const body = await req.json()
  
  // Validate: At least one language title must be provided
  if (!body.titleEn && !body.titleTe && !body.titleHi) {
    return NextResponse.json(
      { error: 'At least one language title is required (titleEn, titleTe, or titleHi)' },
      { status: 400 }
    )
  }
  
  const plan = await FreeMealPlan.create(body)
  return NextResponse.json(plan, { status: 201 })
}
