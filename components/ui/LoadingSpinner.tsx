export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-gray-200 border-t-[#1A5C38] dark:border-slate-700 dark:border-t-emerald-400`}
    />
  )
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  )
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-slate-900">
        <LoadingSpinner size="lg" />
        <p className="mt-4 font-medium text-gray-900 dark:text-slate-50">{message}</p>
      </div>
    </div>
  )
}
