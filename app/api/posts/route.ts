import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'

export const runtime = 'nodejs'

function popularityScore(item: any): number {
  const now = Date.now()
  const age = now - new Date(item.createdAt).getTime()
  let boost = 0
  if (age < 7 * 86400000) boost = 500
  else if (age < 30 * 86400000) boost = 200
  return (item.views ?? 0) * 1 + (item.likes ?? 0) * 10 + boost
}

export async function GET(request: Request) {
  await connectDB()

  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') ?? 'en'
  const limit = Number(searchParams.get('limit') ?? '60') || 60
  const sort = searchParams.get('sort') ?? 'latest'
  const categories = searchParams.get('categories') // comma-separated

  const query: any = { isPublished: true, language: lang }
  if (categories) {
    query.category = { $in: categories.split(',') }
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(sort === 'popular' ? 100 : limit)
    .select('title slug excerpt tag language heroImage readTimeMinutes views likes createdAt')
    .lean()

  if (sort === 'popular') {
    const scored = (posts as any[]).map(p => ({ ...p, _id: p._id.toString() }))
    scored.sort((a, b) => popularityScore(b) - popularityScore(a))
    return NextResponse.json(scored.slice(0, limit))
  }

  return NextResponse.json(posts)
}
