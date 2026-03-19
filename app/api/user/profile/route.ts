import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { Video } from '@/models/Video'

export const runtime = 'nodejs'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const user = await User.findOne({ email: session.user.email })
    .select('name email image language savedPosts likedPosts savedRecipes likedRecipes savedVideos likedVideos')
    .lean()

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const [savedPosts, likedPosts, savedRecipes, likedRecipes, savedVideos, likedVideos] = await Promise.all([
    Post.find({ _id: { $in: user.savedPosts ?? [] } }).select('title slug tag heroImage readTimeMinutes').lean(),
    Post.find({ _id: { $in: user.likedPosts ?? [] } }).select('title slug tag heroImage readTimeMinutes').lean(),
    Recipe.find({ _id: { $in: user.savedRecipes ?? [] } }).select('title slug tag heroImage').lean(),
    Recipe.find({ _id: { $in: user.likedRecipes ?? [] } }).select('title slug tag heroImage').lean(),
    Video.find({ _id: { $in: (user as any).savedVideos ?? [] } }).select('title slug tag thumbnailUrl youtubeUrl').lean(),
    Video.find({ _id: { $in: (user as any).likedVideos ?? [] } }).select('title slug tag thumbnailUrl youtubeUrl').lean(),
  ])

  return NextResponse.json({
    user: { ...user, _id: user._id.toString() },
    savedPosts: savedPosts.map((p: any) => ({ ...p, _id: p._id.toString() })),
    likedPosts: likedPosts.map((p: any) => ({ ...p, _id: p._id.toString() })),
    savedRecipes: savedRecipes.map((r: any) => ({ ...r, _id: r._id.toString() })),
    likedRecipes: likedRecipes.map((r: any) => ({ ...r, _id: r._id.toString() })),
    savedVideos: savedVideos.map((v: any) => ({ ...v, _id: v._id.toString() })),
    likedVideos: likedVideos.map((v: any) => ({ ...v, _id: v._id.toString() })),
  })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  await connectDB()
  await User.findOneAndUpdate({ email: session.user.email }, { name })
  return NextResponse.json({ ok: true })
}
