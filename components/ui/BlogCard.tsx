import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

type BlogCardProps = {
  post: {
    slug: string
    title: string
    excerpt?: string
    heroImage?: string
    category?: string
    readTimeMinutes?: number
    createdAt?: string | Date
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  const createdDate = post.createdAt ? new Date(post.createdAt) : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {post.heroImage && (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex items-center justify-between">
          {post.category && (
            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-[#1A5C38]">
              {categoryToTelugu(post.category)}
            </span>
          )}
          {post.readTimeMinutes && (
            <span className="text-[10px] text-gray-500">
              {post.readTimeMinutes} నిమి చదవడానికి
            </span>
          )}
        </div>
        <h3 className="mb-1 line-clamp-2 text-[13px] font-semibold text-gray-900 group-hover:text-[#1A5C38]">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mb-2 line-clamp-3 text-[11px] text-gray-600">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-1 text-[11px] text-gray-500">
          {createdDate && (
            <span>
              {formatDistanceToNow(createdDate, { addSuffix: true })
                .replace('about ', '')
                .replace('days', 'రోజులు')
                .replace('day', 'రోజు')}
            </span>
          )}
          <span className="text-[#1A5C38]">మరింత చదవండి →</span>
        </div>
      </div>
    </Link>
  )
}

function categoryToTelugu(category: string) {
  switch (category) {
    case 'weight-loss':
      return 'బరువు తగ్గడం'
    case 'diabetes':
      return 'మధుమేహం'
    case 'gut-health':
      return 'గట్ హెల్త్'
    case 'immunity':
      return 'రోగనిరోధక శక్తి'
    case 'thyroid':
      return 'థైరాయిడ్'
    case 'kids-nutrition':
      return 'పిల్లల పోషణ'
    case 'recipes':
      return 'రెసిపీలు'
    case 'millets':
      return 'మిల్లెట్స్'
    case 'general':
      return 'జనరల్ హెల్త్'
    default:
      return category
  }
}

