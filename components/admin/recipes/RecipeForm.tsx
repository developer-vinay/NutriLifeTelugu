'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'

type RecipeFormProps = {
  mode: 'create' | 'edit'
  initialData?: any
}

const categories = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'millets', label: 'Millets' },
  { value: 'diabetic-friendly', label: 'Diabetic Friendly' },
]

const inputCls = 'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]'

export default function RecipeForm({ mode, initialData }: RecipeFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'breakfast')
  const [language, setLanguage] = useState<'en' | 'te'>(initialData?.language ?? 'en')
  const [tag, setTag] = useState(initialData?.tag ?? '')
  const [heroImage, setHeroImage] = useState(initialData?.heroImage ?? '')
  const [heroImagePublicId, setHeroImagePublicId] = useState(initialData?.heroImagePublicId ?? '')
  const [prepTime, setPrepTime] = useState(initialData?.prepTimeMinutes ?? '')
  const [cookTime, setCookTime] = useState(initialData?.cookTimeMinutes ?? '')
  const [servings, setServings] = useState(initialData?.servings ?? '')
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients ?? [''])
  const [content, setContent] = useState(initialData?.content ?? '')
  const [calories, setCalories] = useState(initialData?.nutritionFacts?.calories ?? '')
  const [protein, setProtein] = useState(initialData?.nutritionFacts?.protein ?? '')
  const [carbs, setCarbs] = useState(initialData?.nutritionFacts?.carbs ?? '')
  const [fat, setFat] = useState(initialData?.nutritionFacts?.fat ?? '')
  const [fiber, setFiber] = useState(initialData?.nutritionFacts?.fiber ?? '')
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!initialData && title) {
      setSlug(slugify(title, { lower: true, strict: true }))
    }
  }, [title])

  const handleUploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'recipes')
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    setHeroImage(data.url)
    setHeroImagePublicId(data.publicId)
  }

  const onSubmit = async (publish: boolean) => {
    setSaving(true)
    setError('')
    try {
      const body = {
        title, slug, description, category, language, tag,
        heroImage, heroImagePublicId,
        prepTimeMinutes: prepTime ? Number(prepTime) : undefined,
        cookTimeMinutes: cookTime ? Number(cookTime) : undefined,
        servings: servings ? Number(servings) : undefined,
        ingredients: ingredients.filter(Boolean),
        content,
        nutritionFacts: {
          calories: calories ? Number(calories) : undefined,
          protein: protein ? Number(protein) : undefined,
          carbs: carbs ? Number(carbs) : undefined,
          fat: fat ? Number(fat) : undefined,
          fiber: fiber ? Number(fiber) : undefined,
        },
        isFeatured,
        isPublished: publish,
      }
      const url = mode === 'create' ? '/api/admin/recipes' : `/api/admin/recipes/${initialData._id}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to save recipe')
      router.push('/admin/recipes')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-4">
      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {/* Language selector */}
      <div className="rounded-xl border-2 border-[#1A5C38]/20 bg-emerald-50/50 p-4">
        <label className="mb-2 block text-sm font-semibold text-gray-800">Content Language</label>
        <div className="flex gap-3">
          {(['en', 'te'] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLanguage(l)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                language === l
                  ? 'bg-[#1A5C38] text-white shadow-sm'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-[#1A5C38]'
              }`}>
              {l === 'en' ? '🇬🇧 English' : '🇮🇳 తెలుగు'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder={language === 'te' ? 'రెసిపీ పేరు...' : 'Recipe name...'}
          className={inputCls} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Prep Time (min)</label>
          <input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Cook Time (min)</label>
          <input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Servings</label>
          <input type="number" value={servings} onChange={(e) => setServings(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Tag</label>
        <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} className={inputCls} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Hero Image</label>
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            try { await handleUploadImage(file) } catch { setError('Image upload failed') }
          }} className="text-sm" />
          {heroImage && <img src={heroImage} alt="" className="h-12 w-20 rounded object-cover" />}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Ingredients</label>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2">
            <input type="text" value={ing} onChange={(e) => {
              const updated = [...ingredients]
              updated[idx] = e.target.value
              setIngredients(updated)
            }} placeholder={`Ingredient ${idx + 1}`} className={inputCls} />
            <button type="button" onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
              className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => setIngredients([...ingredients, ''])}
          className="text-xs font-medium text-[#1A5C38] hover:underline">+ Add ingredient</button>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Instructions (HTML supported)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8}
          placeholder="<ol><li>Step 1...</li></ol>" className={inputCls} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-800">Nutrition Facts (optional)</label>
        <div className="grid gap-3 md:grid-cols-5">
          {[
            { label: 'Calories', value: calories, set: setCalories },
            { label: 'Protein (g)', value: protein, set: setProtein },
            { label: 'Carbs (g)', value: carbs, set: setCarbs },
            { label: 'Fat (g)', value: fat, set: setFat },
            { label: 'Fiber (g)', value: fiber, set: setFiber },
          ].map(({ label, value, set }) => (
            <div key={label} className="space-y-1">
              <label className="text-xs text-gray-600">{label}</label>
              <input type="number" value={value} onChange={(e) => set(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-800">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#1A5C38]" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-800">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#1A5C38]" />
          Published
        </label>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" disabled={saving} onClick={() => onSubmit(false)}
          className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:opacity-60">
          Save as Draft
        </button>
        <button type="button" disabled={saving} onClick={() => onSubmit(true)}
          className="rounded-full bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
          {saving ? 'Saving...' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
