import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export const runtime = 'nodejs'

// POST /api/user/save  body: { type: 'post'|'recipe'|'video', id, action: 'save'|'unsave' }
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, id, action } = await req.json()
  const field = type === 'recipe' ? 'savedRecipes' : type === 'video' ? 'savedVideos' : 'savedPosts'
  const op = action === 'unsave' ? { $pull: { [field]: id } } : { $addToSet: { [field]: id } }

  await connectDB()
  await User.findOneAndUpdate({ email: session.user.email }, op)
  return NextResponse.json({ ok: true })
}
