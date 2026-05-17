import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Video } from '@/models/Video'

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

  const query = { isPublished: true, language: lang }

  // For popular sort, we need to fetch more and then sort
  if (sort === 'popular') {
    const allVideos = await Video.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .select('title slug description tag language thumbnailUrl youtubeUrl youtubeId category durationSeconds views likes isFeatured createdAt')
      .lean()

    const scored = (allVideos as any[]).map(v => ({ ...v, _id: v._id.toString() }))
    scored.sort((a, b) => popularityScore(b) - popularityScore(a))
    
    // If page parameter is provided, return paginated format
    if (page !== null) {
      const skip = (page - 1) * limit
      const paginatedVideos = scored.slice(skip, skip + limit)
      const hasMore = skip + paginatedVideos.length < scored.length

      return NextResponse.json({
        data: paginatedVideos,
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
    const [videos, total] = await Promise.all([
      Video.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug description tag language thumbnailUrl youtubeUrl youtubeId category durationSeconds views likes isFeatured createdAt')
        .lean(),
      Video.countDocuments(query)
    ])

    const hasMore = skip + videos.length < total

    return NextResponse.json({
      data: videos,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    })
  }

  // Otherwise return old format (backward compatible)
  const videos = await Video.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title slug description tag language thumbnailUrl youtubeUrl youtubeId category durationSeconds views likes isFeatured createdAt')
    .lean()

  return NextResponse.json(videos)
}
