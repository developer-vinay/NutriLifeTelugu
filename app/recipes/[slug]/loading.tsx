import { SkeletonRecipe } from '@/components/ui/SkeletonLoader'

export default function RecipeDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <SkeletonRecipe />
      </div>
    </div>
  )
}
