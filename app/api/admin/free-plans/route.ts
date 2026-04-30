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
  const plan = await FreeMealPlan.create(body)
  return NextResponse.json(plan, { status: 201 })
}
