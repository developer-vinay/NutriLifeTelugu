import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { ensureAdminOrApiKey } from '@/lib/apiAuth'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  if (!await ensureAdminOrApiKey(request)) return new NextResponse('Unauthorized', { status: 401 })
  await connectDB()

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1') || 1
  const pageSize = Number(searchParams.get('pageSize') ?? '10') || 10
  const queryText = searchParams.get('q') ?? ''
  const query = queryText.trim() ? { title: { $regex: queryText.trim(), $options: 'i' } } : {}

  const [items, total] = await Promise.all([
    Post.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Post.countDocuments(query),
  ])

  return NextResponse.json({ items, total, page, pageSize })
}

export async function POST(request: Request) {
  if (!await ensureAdminOrApiKey(request)) return new NextResponse('Unauthorized', { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const post = await Post.create(body)
    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'A post with this slug already exists. Use a different slug.' }, { status: 409 })
    }
    console.error('Failed to create post', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

