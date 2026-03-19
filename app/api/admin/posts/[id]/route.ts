import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { deleteImage } from '@/lib/cloudinary'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const session = await auth()
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    return null
  }
  return session
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const session = await ensureAdmin()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  await connectDB()

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse('Invalid id', { status: 400 })
  }

  const post = await Post.findById(id).lean()
  if (!post) return new NextResponse('Not found', { status: 404 })

  return NextResponse.json(post)
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const session = await ensureAdmin()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  await connectDB()

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse('Invalid id', { status: 400 })
  }

  const body = await request.json()

  try {
    const updated = await Post.findByIdAndUpdate(id, body, { new: true }).lean()
    if (!updated) return new NextResponse('Not found', { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update post', error)
    return new NextResponse('Failed to update post', { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const session = await ensureAdmin()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  await connectDB()

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse('Invalid id', { status: 400 })
  }

  const body = await request.json()

  try {
    const updated = await Post.findByIdAndUpdate(id, { $set: body }, { new: true }).lean()
    if (!updated) return new NextResponse('Not found', { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to patch post', error)
    return new NextResponse('Failed to patch post', { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const session = await ensureAdmin()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  await connectDB()

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse('Invalid id', { status: 400 })
  }

  try {
    const post = await Post.findByIdAndDelete(id).lean()
    if (!post) return new NextResponse('Not found', { status: 404 })

    if (post.heroImagePublicId) {
      await deleteImage(post.heroImagePublicId)
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete post', error)
    return new NextResponse('Failed to delete post', { status: 500 })
  }
}
