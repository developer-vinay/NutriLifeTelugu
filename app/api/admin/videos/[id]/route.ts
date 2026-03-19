import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Video } from '@/models/Video'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const session = await auth()
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') return null
  return session
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  await connectDB()
  if (!Types.ObjectId.isValid(params.id)) return new NextResponse('Invalid id', { status: 400 })
  const video = await Video.findById(params.id).lean()
  if (!video) return new NextResponse('Not found', { status: 404 })
  return NextResponse.json(video)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  await connectDB()
  if (!Types.ObjectId.isValid(params.id)) return new NextResponse('Invalid id', { status: 400 })
  const body = await request.json()
  try {
    const updated = await Video.findByIdAndUpdate(params.id, body, { new: true }).lean()
    if (!updated) return new NextResponse('Not found', { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    return new NextResponse('Failed to update video', { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  await connectDB()
  if (!Types.ObjectId.isValid(params.id)) return new NextResponse('Invalid id', { status: 400 })
  try {
    const video = await Video.findByIdAndDelete(params.id).lean()
    if (!video) return new NextResponse('Not found', { status: 404 })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse('Failed to delete video', { status: 500 })
  }
}
