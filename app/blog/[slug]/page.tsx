import React from 'react'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import BlogPostClient from '@/components/blog/BlogPostClient'


export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  await connectDB()

  const post = await Post.findOne({ slug, isPublished: true }).lean()
  if (!post) notFound()

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
  const relatedPlain = JSON.parse(JSON.stringify(related))

  return <BlogPostClient post={plain} related={relatedPlain} />
}
