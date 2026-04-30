import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { FreeMealPlan } from '@/models/FreeMealPlan'

export const runtime = 'nodejs'

export async function GET() {
  await connectDB()
  const plans = await FreeMealPlan.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean()
  return NextResponse.json(plans)
}
