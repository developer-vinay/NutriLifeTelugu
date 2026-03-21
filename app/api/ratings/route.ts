import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Rating } from '@/models/Rating'
import { Types } from 'mongoose'

export const runtime = 'nodejs'

// GET /api/ratings?contentType=recipe&contentId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const contentType = searchParams.get('contentType') as 'recipe' | 'post' | null
  const contentId = searchParams.get('contentId')

  if (!contentType || !contentId || !Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  await connectDB()
  const ratings = await Rating.find({ contentType, contentId }).lean()
  const count = ratings.length
  const avg = count > 0 ? ratings.reduce((s, r) => s + r.stars, 0) / count : 0

  return NextResponse.json({ avg: Math.round(avg * 10) / 10, count })
}

// POST /api/ratings
export async function POST(req: Request) {
  const body = await req.json()
  const { contentType, contentId, stars, userIdentifier } = body

  if (!contentType || !contentId || !stars || !userIdentifier) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (!Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: 'Invalid contentId' }, { status: 400 })
  }
  if (stars < 1 || stars > 5) {
    return NextResponse.json({ error: 'Stars must be 1-5' }, { status: 400 })
  }

  await connectDB()
  // Upsert — one rating per user per content
  await Rating.findOneAndUpdate(
    { contentType, contentId, userIdentifier },
    { stars },
    { upsert: true },
  )

  // Return updated aggregate
  const ratings = await Rating.find({ contentType, contentId }).lean()
  const count = ratings.length
  const avg = count > 0 ? ratings.reduce((s, r) => s + r.stars, 0) / count : 0

  return NextResponse.json({ avg: Math.round(avg * 10) / 10, count })
}
