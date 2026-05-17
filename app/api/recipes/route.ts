import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Recipe } from '@/models/Recipe'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  await connectDB()

  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') ?? 'en'
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : null
  const limit = Number(searchParams.get('limit') ?? '12') || 12

  const query = { isPublished: true, language: lang }

  // If page parameter is provided, use pagination
  if (page !== null) {
    const skip = (page - 1) * limit

    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .sort({ views: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug tag category language heroImage heroImageObjectFit prepTimeMinutes servings description isFeatured views createdAt')
        .lean(),
      Recipe.countDocuments(query)
    ])

    const hasMore = skip + recipes.length < total

    return NextResponse.json({
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    })
  }

  // Otherwise return old format (backward compatible)
  const recipes = await Recipe.find(query)
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .select('title slug tag category language heroImage heroImageObjectFit prepTimeMinutes servings description isFeatured views createdAt')
    .lean()

  return NextResponse.json(recipes)
}
