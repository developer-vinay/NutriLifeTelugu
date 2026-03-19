import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'

export default async function PopularPosts() {
  await connectDB()
  const posts = await Post.find({ isPublished: true })
    .sort({ views: -1 })
    .limit(5)
    .lean()

  if (posts.length === 0) {
    return (
      <p className="text-[11px] text-gray-500">
        ఇంకా ఆర్టికిల్స్ లేవు. త్వరలో వస్తాయి.
      </p>
    )
  }

  return (
    <ul className="space-y-2 text-[11px]">
      {posts.map((post) => (
        <li key={post._id.toString()}>
          <Link
            href={`/blog/${post.slug}`}
            className="line-clamp-2 text-gray-800 hover:text-[#1A5C38]"
          >
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

