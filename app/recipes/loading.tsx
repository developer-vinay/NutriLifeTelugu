import { SkeletonList } from '@/components/ui/SkeletonLoader'

export default function RecipesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="mb-4 h-10 w-64 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-6 w-96 rounded bg-gray-200 dark:bg-slate-800" />
        </div>

        {/* Category filters skeleton */}
        <div className="mb-8 flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-slate-800" />
          ))}
        </div>

        {/* Recipe cards skeleton */}
        <SkeletonList count={9} />
      </div>
    </div>
  )
}
