import { NextRequest, NextResponse } from 'next/server'
import { Model as MongooseModel } from 'mongoose'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { Video } from '@/models/Video'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { type, id, action } = await req.json()
    if (!type || !id || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const userField = type === 'recipe' ? 'likedRecipes' : type === 'video' ? 'likedVideos' : 'likedPosts'
    const userOp = action === 'unlike' ? { $pull: { [userField]: id } } : { $addToSet: { [userField]: id } }
    const countOp = action === 'unlike' ? { $inc: { likes: -1 } } : { $inc: { likes: 1 } }
    const Model = (type === 'recipe' ? Recipe : type === 'video' ? Video : Post) as MongooseModel<{ likes?: number }>

    await connectDB()
    await Promise.all([
      User.findOneAndUpdate({ email: session.user.email }, userOp),
      Model.findOneAndUpdate({ _id: id }, countOp),
    ])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('like error:', err)
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 })
  }
}
