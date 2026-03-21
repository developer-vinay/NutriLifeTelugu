import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { PremiumPlan } from '@/models/PremiumPlan'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  await connectDB()
  const plans = await PremiumPlan.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(plans)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const plan = await PremiumPlan.create(body)
  return NextResponse.json(plan, { status: 201 })
}
