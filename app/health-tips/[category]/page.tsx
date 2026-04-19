import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import HealthTipsCategoryClient from './HealthTipsCategoryClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const categories = ['weight-loss', 'diabetes', 'gut-health', 'thyroid', 'immunity', 'kids-nutrition'] as const

export function generateStaticParams() {
  return categories.map((category) => ({ category }))
}

export default async function HealthTipsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  if (!categories.includes(category as any)) notFound()

  await connectDB()
  // Fetch all languages — client will filter by selected language
  const posts = await Post.find({ isPublished: true, category })
    .sort({ createdAt: -1 })
    .limit(60)
    .lean()

  const serialized = posts.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? '',
    heroImage: p.heroImage ?? '',
    tag: p.tag ?? '',
    language: p.language ?? 'en',
    readTimeMinutes: p.readTimeMinutes ?? 5,
  }))

  return <HealthTipsCategoryClient category={category} posts={serialized} />
}
