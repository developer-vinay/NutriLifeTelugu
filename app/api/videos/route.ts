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
  const limit = Number(searchParams.get('limit') ?? '30') || 30
  const sort = searchParams.get('sort') ?? 'latest'

  const videos = await Video.find({ isPublished: true, language: lang })
    .sort({ createdAt: -1 })
    .limit(sort === 'popular' ? 100 : limit)
    .select('title slug description tag language thumbnailUrl youtubeUrl youtubeId category durationSeconds views likes isFeatured createdAt')
    .lean()

  if (sort === 'popular') {
    const scored = (videos as any[]).map(v => ({ ...v, _id: v._id.toString() }))
    scored.sort((a, b) => popularityScore(b) - popularityScore(a))
    return NextResponse.json(scored.slice(0, limit))
  }

  return NextResponse.json(videos)
}
