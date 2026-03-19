import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Video } from '@/models/Video'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  await connectDB()

  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') ?? 'en'
  const limit = Number(searchParams.get('limit') ?? '30') || 30

  const videos = await Video.find({ isPublished: true, language: lang })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title slug description tag language thumbnailUrl youtubeUrl youtubeId category durationSeconds views isFeatured createdAt')
    .lean()

  return NextResponse.json(videos)
}
