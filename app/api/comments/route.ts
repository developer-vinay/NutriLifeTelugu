import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/models/Comment'
import { Types } from 'mongoose'

export const runtime = 'nodejs'

// GET /api/comments?contentType=post&contentId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const contentType = searchParams.get('contentType') as 'post' | 'recipe' | null
  const contentId = searchParams.get('contentId')

  if (!contentType || !contentId || !Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  await connectDB()
  const comments = await Comment.find({ contentType, contentId, isApproved: true })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

  return NextResponse.json(comments)
}

// POST /api/comments
export async function POST(req: Request) {
  const body = await req.json()
  const { contentType, contentId, name, email, comment } = body

  if (!contentType || !contentId || !name?.trim() || !email?.trim() || !comment?.trim()) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }
  if (!Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: 'Invalid contentId' }, { status: 400 })
  }

  await connectDB()
  const doc = await Comment.create({
    contentType,
    contentId,
    name: name.trim().slice(0, 80),
    email: email.trim().toLowerCase(),
    body: comment.trim().slice(0, 1000),
  })

  return NextResponse.json(doc, { status: 201 })
}
