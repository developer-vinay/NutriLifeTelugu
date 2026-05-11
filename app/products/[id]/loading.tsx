export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid animate-pulse gap-8 lg:grid-cols-2">
          {/* Image skeleton */}
          <div className="h-[500px] rounded-2xl bg-gray-200 dark:bg-slate-800" />
          
          {/* Details skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-32 rounded-xl bg-gray-200 dark:bg-slate-800" />
            <div className="h-40 rounded-xl bg-gray-200 dark:bg-slate-800" />
            <div className="h-64 rounded-xl bg-gray-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  )
}
