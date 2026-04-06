import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { Video } from '@/models/Video'
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

  const [allPosts, allRecipes, allVideos] = await Promise.all([
    Post.find({ isPublished: true })
      .select('title slug excerpt tag category readTimeMinutes heroImage language createdAt')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean(),
    Recipe.find({ isPublished: true })
      .select('title slug description tag category heroImage language prepTimeMinutes cookTimeMinutes')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean(),
    Video.find({ isPublished: true })
      .select('title slug description tag category thumbnailUrl language')
      .sort({ createdAt: -1 })
      .limit(200)
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
    language: p.language ?? 'en',
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
    language: r.language ?? 'en',
    type: 'recipe' as const,
  }))

  const videos = allVideos.map((v: any) => ({
    _id: v._id.toString(),
    title: v.title,
    slug: v.slug,
    excerpt: v.description ?? '',
    tag: v.tag ?? '',
    category: v.category ?? '',
    readTimeMinutes: 0,
    heroImage: v.thumbnailUrl ?? '',
    language: v.language ?? 'en',
    type: 'video' as const,
  }))

  return (
    <SearchClient
      initialPosts={posts}
      initialRecipes={recipes}
      initialVideos={videos}
      initialQuery={q ?? ''}
      initialCategory={category ?? ''}
    />
  )
}
