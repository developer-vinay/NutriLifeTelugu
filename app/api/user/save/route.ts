import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { type, id, action } = await req.json()
    if (!type || !id || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const field = type === 'recipe' ? 'savedRecipes' : type === 'video' ? 'savedVideos' : 'savedPosts'
    const op = action === 'unsave' ? { $pull: { [field]: id } } : { $addToSet: { [field]: id } }

    await connectDB()
    await User.findOneAndUpdate({ email: session.user.email }, op)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('save error:', err)
    return NextResponse.json({ error: 'Failed to update save' }, { status: 500 })
  }
}
