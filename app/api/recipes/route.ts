import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Recipe } from '@/models/Recipe'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  await connectDB()

  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') ?? 'en'
  const limit = Number(searchParams.get('limit') ?? '20') || 20

  const recipes = await Recipe.find({ isPublished: true, language: lang })
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .select('title slug tag language heroImage prepTimeMinutes views createdAt')
    .lean()

  return NextResponse.json(recipes)
}
