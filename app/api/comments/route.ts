import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/models/Comment'
import { Types } from 'mongoose'

export const runtime = 'nodejs'

// GET /api/comments?contentType=post&contentId=xxx
// Returns all approved comments flat; client builds the tree
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const contentType = searchParams.get('contentType') as 'post' | 'recipe' | null
  const contentId = searchParams.get('contentId')

  if (!contentType || !contentId || !Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  await connectDB()
  const comments = await Comment.find({ contentType, contentId, isApproved: true })
    .sort({ createdAt: 1 }) // oldest first so replies appear after parent
    .lean()

  // Serialize ObjectIds to strings
  const serialized = comments.map((c) => ({
    _id: c._id.toString(),
    parentId: c.parentId ? c.parentId.toString() : null,
    name: c.name,
    body: c.body,
    createdAt: c.createdAt,
  }))

  return NextResponse.json(serialized)
}

// POST /api/comments
export async function POST(req: Request) {
  const body = await req.json()
  const { contentType, contentId, name, email, comment, parentId } = body

  if (!contentType || !contentId || !name?.trim() || !email?.trim() || !comment?.trim()) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }
  if (!Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: 'Invalid contentId' }, { status: 400 })
  }
  if (parentId && !Types.ObjectId.isValid(parentId)) {
    return NextResponse.json({ error: 'Invalid parentId' }, { status: 400 })
  }

  await connectDB()
  const doc = await Comment.create({
    contentType,
    contentId,
    parentId: parentId || null,
    name: name.trim().slice(0, 80),
    email: email.trim().toLowerCase(),
    body: comment.trim().slice(0, 1000),
  })

  return NextResponse.json({
    _id: doc._id.toString(),
    parentId: doc.parentId ? doc.parentId.toString() : null,
    name: doc.name,
    body: doc.body,
    createdAt: doc.createdAt,
  }, { status: 201 })
}
