import { connectDB } from '@/lib/mongodb'
import { Recipe } from '@/models/Recipe'
import RecipeForm from '@/components/admin/recipes/RecipeForm'
import { notFound } from 'next/navigation'

export const runtime = 'nodejs'

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()
  const recipe = await Recipe.findById(id).lean()
  if (!recipe) notFound()

  const plain = JSON.parse(JSON.stringify(recipe))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Edit Recipe</h2>
      <RecipeForm mode="edit" initialData={plain} />
    </div>
  )
}
