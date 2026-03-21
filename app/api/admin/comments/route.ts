import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/models/Comment'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') return null
  return session
}

// GET /api/admin/comments?page=1&pageSize=20&contentType=post
export async function GET(req: Request) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  await connectDB()

  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? '1') || 1
  const pageSize = Number(searchParams.get('pageSize') ?? '20') || 20
  const contentType = searchParams.get('contentType') // optional filter

  const query = contentType ? { contentType } : {}

  const [items, total] = await Promise.all([
    Comment.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Comment.countDocuments(query),
  ])

  return NextResponse.json({ items, total, page, pageSize })
}
