import RecipeForm from '@/components/admin/recipes/RecipeForm'

export const runtime = 'nodejs'

export default function NewRecipePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">New Recipe</h2>
      <RecipeForm mode="create" />
    </div>
  )
}
