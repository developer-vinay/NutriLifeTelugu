import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  await connectDB()

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1') || 1
  const pageSize = Number(searchParams.get('pageSize') ?? '10') || 10
  const queryText = searchParams.get('q') ?? ''

  const query =
    queryText.trim().length > 0
      ? {
          title: { $regex: queryText.trim(), $options: 'i' },
        }
      : {}

  const [items, total] = await Promise.all([
    Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Post.countDocuments(query),
  ])

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  await connectDB()

  const body = await request.json()

  try {
    const post = await Post.create(body)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Failed to create post', error)
    return new NextResponse('Failed to create post', { status: 500 })
  }
}

