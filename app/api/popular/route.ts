import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { Video } from '@/models/Video'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Popularity score:
 * score = (views × 1) + (likes × 10) + recency_boost
 * Last 7 days  → +500
 * Last 30 days → +200
 */
function score(item: any): number {
  const now = Date.now()
  const created = new Date(item.createdAt).getTime()
  const age = now - created
  let boost = 0
  if (age < 7 * 86400000) boost = 500
  else if (age < 30 * 86400000) boost = 200
  return (item.views ?? 0) * 1 + (item.likes ?? 0) * 10 + boost
}

export async function GET(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const lang = searchParams.get('lang') ?? 'en'
    const limit = Number(searchParams.get('limit') ?? '10') || 10

    const [posts, recipes, videos] = await Promise.all([
      Post.find({ isPublished: true, language: lang })
        .select('title slug heroImage tag views likes createdAt')
        .lean(),
      Recipe.find({ isPublished: true, language: lang })
        .select('title slug heroImage tag views likes prepTimeMinutes createdAt')
        .lean(),
      Video.find({ isPublished: true, language: lang })
        .select('title slug thumbnailUrl youtubeUrl tag views likes createdAt')
        .lean(),
    ])

    const all = [
      ...posts.map((p: any) => ({ ...p, _id: p._id.toString(), type: 'post' as const })),
      ...recipes.map((r: any) => ({ ...r, _id: r._id.toString(), type: 'recipe' as const })),
      ...videos.map((v: any) => ({ ...v, _id: v._id.toString(), type: 'video' as const })),
    ]

    all.sort((a, b) => score(b) - score(a))

    return NextResponse.json(all.slice(0, limit))
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
