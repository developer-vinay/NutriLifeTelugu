import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import BlogPostClient from '@/components/blog/BlogPostClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://nutrilifemitra.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  await connectDB()
  const post = await Post.findOne({ slug, isPublished: true }).lean()
  if (!post) return {}

  const title = `${post.title} | NutriLifeMitra`
  const rawText = post.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  const description = post.excerpt
    ? post.excerpt.slice(0, 160)
    : rawText.slice(0, 160)
  const url = `${SITE_URL}/blog/${slug}`
  const image = post.heroImage ?? `${SITE_URL}/api/og`

  // Build keyword list from tag + category
  const keywords = [
    post.tag,
    post.category,
    'NutriLifeMitra',
    'Telugu health',
    'Indian nutrition',
    post.language === 'te' ? 'తెలుగు ఆరోగ్యం' : post.language === 'hi' ? 'हिंदी स्वास्थ्य' : undefined,
  ].filter(Boolean) as string[]

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'NutriLifeMitra',
      locale: post.language === 'te' ? 'te_IN' : post.language === 'hi' ? 'hi_IN' : 'en_IN',
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.createdAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.author ?? 'NutriLifeMitra'],
      tags: post.tag ? [post.tag, post.category ?? ''].filter(Boolean) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@nutrilifemitra',
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  await connectDB()

  const post = await Post.findOne({ slug, isPublished: true }).lean()
  if (!post) notFound()

  // Increment view count (fire and forget — don't block render)
  Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec().catch(() => {})

  // Try same language + same category first, fall back to same language only
  let related = await Post.find({
    isPublished: true,
    slug: { $ne: slug },
    language: post.language,
    category: post.category,
  })
    .limit(3)
    .lean()

  if (related.length === 0) {
    related = await Post.find({
      isPublished: true,
      slug: { $ne: slug },
      language: post.language,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()
  }

  // Serialize for client
  const plain = JSON.parse(JSON.stringify(post))
  // Calculate read time from content if not stored
  if (!plain.readTimeMinutes) {
    const words = (plain.content ?? '').replace(/<[^>]+>/g, '').trim().split(/\s+/).length
    plain.readTimeMinutes = Math.max(1, Math.ceil(words / 200))
  }
  const relatedPlain = JSON.parse(JSON.stringify(related)).map((r: any) => {
    if (!r.readTimeMinutes) {
      const words = (r.content ?? '').replace(/<[^>]+>/g, '').trim().split(/\s+/).length
      r.readTimeMinutes = Math.max(1, Math.ceil(words / 200))
    }
    return r
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: plain.title,
            description: plain.excerpt ?? '',
            image: plain.heroImage ? [plain.heroImage] : [`${SITE_URL}/api/og`],
            datePublished: plain.createdAt,
            dateModified: plain.updatedAt ?? plain.createdAt,
            inLanguage: plain.language === 'te' ? 'te' : plain.language === 'hi' ? 'hi' : 'en',
            author: {
              '@type': 'Person',
              name: plain.author ?? 'NutriLifeMitra',
              url: SITE_URL,
            },
            publisher: {
              '@type': 'Organization',
              name: 'NutriLifeMitra',
              url: SITE_URL,
              logo: { '@type': 'ImageObject', url: `${SITE_URL}/EnglishLogo.png` },
            },
            url: `${SITE_URL}/blog/${plain.slug}`,
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${plain.slug}` },
            keywords: [plain.tag, plain.category].filter(Boolean).join(', '),
            articleSection: plain.category ?? 'Health',
            wordCount: (plain.content ?? '').replace(/<[^>]+>/g, '').trim().split(/\s+/).length,
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
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
              { '@type': 'ListItem', position: 3, name: plain.title, item: `${SITE_URL}/blog/${plain.slug}` },
            ],
          }),
        }}
      />
      <BlogPostClient post={plain} related={relatedPlain} />
    </>
  )
}
