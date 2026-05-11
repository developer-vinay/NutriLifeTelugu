// Reusable skeleton loader components for optimized loading experience

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 h-48 rounded-xl bg-gray-200 dark:bg-slate-800" />
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-800" />
      <div className="mb-3 h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-800" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-800" />
        <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-slate-800" />
      </div>
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-24 w-24 shrink-0 rounded-lg bg-gray-200 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function PostDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero Image */}
      <div className="mb-8 h-96 w-full rounded-2xl bg-gray-200 dark:bg-slate-800" />
      
      {/* Title */}
      <div className="mb-4 h-8 w-3/4 rounded bg-gray-200 dark:bg-slate-800" />
      
      {/* Meta */}
      <div className="mb-6 flex gap-4">
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-800" />
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-4 w-full rounded bg-gray-200 dark:bg-slate-800" />
        ))}
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-slate-800" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[500px] w-full rounded-2xl bg-gray-200 dark:bg-slate-800" />
    </div>
  )
}

// Aliases for backward compatibility
export const SkeletonPost = PostDetailSkeleton
export const SkeletonRecipe = PostDetailSkeleton
export const SkeletonTable = ListSkeleton
export const SkeletonList = GridSkeleton
