import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { PremiumPlan } from '@/models/PremiumPlan'
import { ensureAdminOrApiKey } from '@/lib/apiAuth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectDB()
    const plans = await PremiumPlan.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(plans)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!await ensureAdminOrApiKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const plan = await PremiumPlan.create(body)
    return NextResponse.json(plan, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}
