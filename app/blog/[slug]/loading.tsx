import { SkeletonPost } from '@/components/ui/SkeletonLoader'

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <SkeletonPost />
      </div>
    </div>
  )
}
