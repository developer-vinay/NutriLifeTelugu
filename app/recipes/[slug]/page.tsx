import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Recipe } from '@/models/Recipe'
import RecipeDetailClient from '@/components/recipes/RecipeDetailClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://nutrilifemitra.com'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  await connectDB()
  const recipe = await Recipe.findOne({ slug, isPublished: true }).lean()
  if (!recipe) return {}

  const langLabel = recipe.language === 'te' ? 'Telugu' : recipe.language === 'hi' ? 'Hindi' : 'English'
  const title = `${recipe.title} | NutriLifeMitra`
  const description = recipe.description
    ? recipe.description.slice(0, 160)
    : `${recipe.title} — healthy ${langLabel} Indian recipe on NutriLifeMitra`
  const url = `${SITE_URL}/recipes/${slug}`
  const image = recipe.heroImage ?? `${SITE_URL}/api/og`
  const locale = recipe.language === 'te' ? 'te_IN' : recipe.language === 'hi' ? 'hi_IN' : 'en_IN'
  const altLocales = ['te_IN', 'hi_IN', 'en_IN'].filter(l => l !== locale)

  const keywords = [
    ...(recipe.tags ?? []),
    recipe.tag,
    recipe.category,
    'NutriLifeMitra recipe',
    'healthy Indian recipe',
    `${langLabel} recipe`,
    recipe.language === 'te' ? 'తెలుగు రెసిపీ' : recipe.language === 'hi' ? 'हिंदी रेसिपी' : 'Indian recipe',
    recipe.language === 'te' ? 'తెలుగు వంటకం' : recipe.language === 'hi' ? 'भारतीय रेसिपी' : 'Telugu recipe',
  ].filter(Boolean) as string[]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        'te-IN': `${url}?lang=te`,
        'hi-IN': `${url}?lang=hi`,
        'en-IN': `${url}?lang=en`,
        'x-default': url,
      },
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'NutriLifeMitra',
      locale,
      alternateLocale: altLocales,
      images: [{ url: image, width: 1200, height: 630, alt: recipe.title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image], site: '@nutrilifemitra' },
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
            image: plain.heroImage ? [plain.heroImage] : [`${SITE_URL}/api/og`],
            author: {
              '@type': 'Person',
              name: plain.author ?? 'NutriLifeMitra',
              url: SITE_URL,
            },
            publisher: {
              '@type': 'Organization',
              name: 'NutriLifeMitra',
              url: SITE_URL,
              logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
            },
            datePublished: plain.createdAt,
            inLanguage: plain.language === 'te' ? 'te' : plain.language === 'hi' ? 'hi' : 'en',
            prepTime: plain.prepTimeMinutes ? `PT${plain.prepTimeMinutes}M` : undefined,
            cookTime: plain.cookTimeMinutes ? `PT${plain.cookTimeMinutes}M` : undefined,
            totalTime: (plain.prepTimeMinutes || plain.cookTimeMinutes)
              ? `PT${(plain.prepTimeMinutes ?? 0) + (plain.cookTimeMinutes ?? 0)}M`
              : undefined,
            recipeYield: plain.servings ? `${plain.servings} servings` : undefined,
            recipeCategory: plain.category ?? 'Indian Recipe',
            recipeCuisine: 'Indian',
            keywords: [plain.tag, plain.category].filter(Boolean).join(', '),
            recipeIngredient: plain.ingredients ?? [],
            nutrition: plain.nutritionFacts?.calories ? {
              '@type': 'NutritionInformation',
              calories: `${plain.nutritionFacts.calories} calories`,
              proteinContent: plain.nutritionFacts.protein ? `${plain.nutritionFacts.protein}g` : undefined,
              carbohydrateContent: plain.nutritionFacts.carbs ? `${plain.nutritionFacts.carbs}g` : undefined,
              fatContent: plain.nutritionFacts.fat ? `${plain.nutritionFacts.fat}g` : undefined,
              fiberContent: plain.nutritionFacts.fiber ? `${plain.nutritionFacts.fiber}g` : undefined,
            } : undefined,
            url: `${SITE_URL}/recipes/${plain.slug}`,
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/recipes/${plain.slug}` },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Recipes', item: `${SITE_URL}/recipes` },
              { '@type': 'ListItem', position: 3, name: plain.title, item: `${SITE_URL}/recipes/${plain.slug}` },
            ],
          }),
        }}
      />
      <RecipeDetailClient recipe={plain} related={relatedPlain} />
    </>
  )
}
