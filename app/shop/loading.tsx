import { SkeletonList } from '@/components/ui/SkeletonLoader'

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8 animate-pulse text-center">
          <div className="mx-auto mb-4 h-12 w-64 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="mx-auto h-6 w-96 rounded bg-gray-200 dark:bg-slate-800" />
        </div>

        {/* Product cards skeleton */}
        <SkeletonList count={6} />
      </div>
    </div>
  )
}
