import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Video } from '@/models/Video'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const session = await auth()
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') return null
  return session
}

export async function GET(request: Request) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  await connectDB()

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1') || 1
  const pageSize = Number(searchParams.get('pageSize') ?? '10') || 10
  const q = searchParams.get('q') ?? ''

  const query = q.trim() ? { title: { $regex: q.trim(), $options: 'i' } } : {}

  const [items, total] = await Promise.all([
    Video.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Video.countDocuments(query),
  ])

  return NextResponse.json({ items, total, page, pageSize })
}

export async function POST(request: Request) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  await connectDB()

  const body = await request.json()
  try {
    const video = await Video.create(body)
    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Failed to create video', error)
    return new NextResponse('Failed to create video', { status: 500 })
  }
}
