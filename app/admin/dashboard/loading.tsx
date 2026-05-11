import { SkeletonTable } from '@/components/ui/SkeletonLoader'

export default function AdminDashboardLoading() {
  return (
    <div className="p-6">
      <div className="mb-6 animate-pulse">
        <div className="mb-2 h-8 w-64 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="h-4 w-96 rounded bg-gray-200 dark:bg-slate-800" />
      </div>

      {/* Stats cards skeleton */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 h-4 w-24 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-8 w-16 rounded bg-gray-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <SkeletonTable />
      </div>
    </div>
  )
}
