import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Recipe } from '@/models/Recipe'
import RecipeDetailClient from '@/components/recipes/RecipeDetailClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://nutrilifemitra.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  await connectDB()
  const recipe = await Recipe.findOne({ slug, isPublished: true }).lean()
  if (!recipe) return {}

  const title = recipe.title
  const description = recipe.description ?? `${recipe.title} — NutriLifeMitra recipe`
  const url = `${SITE_URL}/recipes/${slug}`
  const image = recipe.heroImage ?? `${SITE_URL}/og-image.png`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  await connectDB()

  const recipe = await Recipe.findOne({ slug, isPublished: true }).lean()
  if (!recipe) return notFound()

  // Increment view count
  Recipe.findByIdAndUpdate(recipe._id, { $inc: { views: 1 } }).exec().catch(() => {})

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Recipe',
            name: plain.title,
            description: plain.description ?? '',
            image: plain.heroImage ? [plain.heroImage] : [],
            author: { '@type': 'Person', name: plain.author ?? 'NutriLifeMitra' },
            datePublished: plain.createdAt,
            prepTime: plain.prepTimeMinutes ? `PT${plain.prepTimeMinutes}M` : undefined,
            cookTime: plain.cookTimeMinutes ? `PT${plain.cookTimeMinutes}M` : undefined,
            recipeYield: plain.servings ? `${plain.servings} servings` : undefined,
            recipeIngredient: plain.ingredients ?? [],
            nutrition: plain.nutritionFacts ? {
              '@type': 'NutritionInformation',
              calories: `${plain.nutritionFacts.calories} calories`,
            } : undefined,
            url: `${SITE_URL}/recipes/${plain.slug}`,
          }),
        }}
      />
      <RecipeDetailClient recipe={plain} related={relatedPlain} />
    </>
  )
}
