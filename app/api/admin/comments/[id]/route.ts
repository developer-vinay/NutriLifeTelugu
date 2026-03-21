import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/models/Comment'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') return null
  return session
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  if (!Types.ObjectId.isValid(id)) return new NextResponse('Invalid id', { status: 400 })

  await connectDB()
  await Comment.findByIdAndDelete(id)
  return new NextResponse(null, { status: 204 })
}
