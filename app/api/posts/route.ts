import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  await connectDB()

  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') ?? 'en'
  const limit = Number(searchParams.get('limit') ?? '60') || 60

  const posts = await Post.find({ isPublished: true, language: lang })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title slug excerpt tag language heroImage readTimeMinutes views createdAt')
    .lean()

  return NextResponse.json(posts)
}
