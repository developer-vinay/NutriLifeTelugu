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
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : null
  const limit = Number(searchParams.get('limit') ?? '12') || 12
  const sort = searchParams.get('sort') ?? 'latest'
  const categories = searchParams.get('categories') // comma-separated

  const query: any = { isPublished: true, language: lang }
  if (categories) {
    query.category = { $in: categories.split(',') }
  }

  // For popular sort, we need to fetch more and then sort
  if (sort === 'popular') {
    const allPosts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .select('title slug excerpt tag language heroImage heroImageObjectFit readTimeMinutes views likes createdAt')
      .lean()

    const scored = (allPosts as any[]).map(p => ({ ...p, _id: p._id.toString() }))
    scored.sort((a, b) => popularityScore(b) - popularityScore(a))
    
    // If page parameter is provided, return paginated format
    if (page !== null) {
      const skip = (page - 1) * limit
      const paginatedPosts = scored.slice(skip, skip + limit)
      const hasMore = skip + paginatedPosts.length < scored.length

      return NextResponse.json({
        data: paginatedPosts,
        pagination: {
          page,
          limit,
          total: scored.length,
          hasMore
        }
      })
    }
    
    // Otherwise return old format (backward compatible)
    return NextResponse.json(scored.slice(0, limit))
  }

  // For latest sort
  // If page parameter is provided, use pagination
  if (page !== null) {
    const skip = (page - 1) * limit
    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug excerpt tag language heroImage heroImageObjectFit readTimeMinutes views likes createdAt')
        .lean(),
      Post.countDocuments(query)
    ])

    const hasMore = skip + posts.length < total

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    })
  }

  // Otherwise return old format (backward compatible)
  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title slug excerpt tag language heroImage heroImageObjectFit readTimeMinutes views likes createdAt')
    .lean()

  return NextResponse.json(posts)
}
