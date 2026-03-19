import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import SearchClient from '@/components/search/SearchClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams

  await connectDB()

  const [allPosts, allRecipes] = await Promise.all([
    Post.find({ isPublished: true })
      .select('title slug excerpt tag category readTimeMinutes heroImage createdAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean(),
    Recipe.find({ isPublished: true })
      .select('title slug description tag category heroImage prepTimeMinutes cookTimeMinutes')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean(),
  ])

  const posts = allPosts.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? '',
    tag: p.tag ?? '',
    category: p.category ?? '',
    readTimeMinutes: p.readTimeMinutes ?? 5,
    heroImage: p.heroImage ?? '',
    type: 'post' as const,
  }))

  const recipes = allRecipes.map((r: any) => ({
    _id: r._id.toString(),
    title: r.title,
    slug: r.slug,
    excerpt: r.description ?? '',
    tag: r.tag ?? '',
    category: r.category ?? '',
    readTimeMinutes: (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0),
    heroImage: r.heroImage ?? '',
    type: 'recipe' as const,
  }))

  return (
    <SearchClient
      initialPosts={posts}
      initialRecipes={recipes}
      initialQuery={q ?? ''}
      initialCategory={category ?? ''}
    />
  )
}
