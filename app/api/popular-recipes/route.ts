import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Recipe } from '@/models/Recipe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Popularity score algorithm (same as YouTube/Medium/Healthline):
 * score = (views × 1) + (likes × 10) + recency_boost
 *
 * Recency boost: posts from last 7 days get +500, last 30 days +200
 * This prevents old viral posts from permanently dominating.
 * Sorted by score descending.
 */
export async function GET(request: Request) {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') ?? 'en'
  const limit = Number(searchParams.get('limit') ?? '5') || 5

  const now = Date.now()
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)

  // Fetch more than needed so we can score and sort in JS
  const recipes = await Recipe.find({ isPublished: true, language: lang })
    .select('title slug tag category heroImage prepTimeMinutes views likes createdAt')
    .lean()

  const scored = recipes.map((r: any) => {
    let recencyBoost = 0
    const created = new Date(r.createdAt)
    if (created >= sevenDaysAgo) recencyBoost = 500
    else if (created >= thirtyDaysAgo) recencyBoost = 200

    const score = (r.views ?? 0) * 1 + (r.likes ?? 0) * 10 + recencyBoost
    return { ...r, _id: r._id.toString(), score }
  })

  scored.sort((a, b) => b.score - a.score)

  return NextResponse.json(scored.slice(0, limit))
}
