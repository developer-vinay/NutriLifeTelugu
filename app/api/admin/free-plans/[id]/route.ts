import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { FreeMealPlan } from '@/models/FreeMealPlan'
import { ensureAdminOrApiKey } from '@/lib/apiAuth'

export const runtime = 'nodejs'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdminOrApiKey(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await connectDB()
  const plan = await FreeMealPlan.findById(id).lean()
  if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(plan)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdminOrApiKey(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await connectDB()
  const body = await req.json()
  const plan = await FreeMealPlan.findByIdAndUpdate(id, body, { new: true })
  if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(plan)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdminOrApiKey(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await connectDB()
  await FreeMealPlan.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
