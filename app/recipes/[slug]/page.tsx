import { notFound } from 'next/navigation'
import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import { Recipe } from '@/models/Recipe'
import RecipeDetailClient from '@/components/recipes/RecipeDetailClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  await connectDB()

  const recipe = await Recipe.findOne({ slug, isPublished: true }).lean()
  if (!recipe) return notFound()

  let related = await Recipe.find({
    isPublished: true,
    slug: { $ne: slug },
    language: recipe.language,
    category: recipe.category,
  })
    .limit(3)
    .lean()

  if (related.length === 0) {
    related = await Recipe.find({
      isPublished: true,
      slug: { $ne: slug },
      language: recipe.language,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()
  }

  const plain = JSON.parse(JSON.stringify(recipe))
  const relatedPlain = JSON.parse(JSON.stringify(related))

  return <RecipeDetailClient recipe={plain} related={relatedPlain} />
}
