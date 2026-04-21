'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import TagsInput from '@/components/admin/TagsInput'

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
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'breakfast')
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialData?.language ?? 'en')
  const [tag, setTag] = useState(initialData?.tag ?? '')
  const [tags, setTags] = useState<string[]>(
    initialData?.tags?.length
      ? initialData.tags
      : initialData?.tag ? [initialData.tag] : []
  )
  const [heroImage, setHeroImage] = useState(initialData?.heroImage ?? '')
  const [heroImagePublicId, setHeroImagePublicId] = useState(initialData?.heroImagePublicId ?? '')
  const [prepTime, setPrepTime] = useState(initialData?.prepTimeMinutes ?? '')
  const [cookTime, setCookTime] = useState(initialData?.cookTimeMinutes ?? '')
  const [servings, setServings] = useState(initialData?.servings ?? '')
  // Convert ingredients array → textarea text (one per line)
  const [ingredientsText, setIngredientsText] = useState(
    (initialData?.ingredients ?? []).join('\n')
  )

  // Convert nutrition facts → single text line
  const nf = initialData?.nutritionFacts ?? {}
  const [nutritionText, setNutritionText] = useState(
    Object.entries(nf)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
  )
  const [content, setContent] = useState(initialData?.content ?? '')
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Parse "one ingredient per line" textarea → array
  function parseIngredients(text: string): string[] {
    return text.split('\n').map(s => s.trim()).filter(Boolean)
  }

  // Parse "Calories: 250, Protein: 8g, Carbs: 45g" → object
  function parseNutrition(text: string): Record<string, number | undefined> {
    const result: Record<string, number | undefined> = {}
    text.split(',').forEach(part => {
      const [key, val] = part.split(':').map(s => s.trim())
      if (key && val) {
        const num = parseFloat(val.replace(/[^\d.]/g, ''))
        if (!isNaN(num)) result[key.toLowerCase()] = num
      }
    })
    return result
  }

  function generateSlug(text: string): string {
    let s = slugify(text, { lower: true, strict: true })
    if (!s || s.length < 2) {
      const englishOnly = text.replace(/[^\x00-\x7F\s-]/g, '').trim()
      s = slugify(englishOnly, { lower: true, strict: true })
    }
    return s || ''
  }

  useEffect(() => {
    if (mode === 'create' && !slugManuallyEdited && title) {
      const s = generateSlug(title)
      if (s) setSlug(s)
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
    if (!slug.trim()) { setError('Slug is required. Type a custom English slug like "ragi-dosa-recipe".'); return }
    setSaving(true)
    setError('')
    try {
      const body = {
        title, slug, description, category, language,
        tag: tags[0] ?? tag,
        tags,
        heroImage, heroImagePublicId,
        prepTimeMinutes: prepTime ? Number(prepTime) : undefined,
        cookTimeMinutes: cookTime ? Number(cookTime) : undefined,
        servings: servings ? Number(servings) : undefined,
        ingredients: parseIngredients(ingredientsText),
        content,
        nutritionFacts: nutritionText.trim() ? parseNutrition(nutritionText) : {},
        isFeatured,
        isPublished: publish,
      }
      const url = mode === 'create' ? '/api/admin/recipes' : `/api/admin/recipes/${initialData._id}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to save recipe')
      }
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
          {(['en', 'te', 'hi'] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLanguage(l)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                language === l
                  ? 'bg-[#1A5C38] text-white shadow-sm'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-[#1A5C38]'
              }`}>
              {l === 'en' ? '🇬🇧 English' : l === 'te' ? '🇮🇳 తెలుగు' : '🇮🇳 हिंदी'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder={language === 'te' ? 'రెసిపీ పేరు...' : language === 'hi' ? 'रेसिपी का नाम...' : 'Recipe name...'}
          className={inputCls} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">
            Slug <span className="text-xs font-normal text-gray-400">(English letters, numbers, hyphens only)</span>
          </label>
          <div className="flex gap-2">
            <input type="text" value={slug}
              onChange={(e) => {
                const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-')
                setSlug(clean)
                setSlugManuallyEdited(true)
              }}
              placeholder="e.g. ragi-dosa-recipe"
              className={inputCls} />
            <button type="button"
              onClick={() => { const s = generateSlug(title); if (s) { setSlug(s); setSlugManuallyEdited(false) } }}
              className="shrink-0 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100">
              ↺ Generate
            </button>
          </div>
          {!slug && title && <p className="text-xs text-amber-600">⚠ Type a custom English slug like <code>ragi-dosa-recipe</code></p>}
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
        <label className="text-sm font-medium text-gray-800">
          Search Tags
          <span className="ml-1 text-xs font-normal text-gray-400">— add both Telugu & English phonetic tags</span>
        </label>
        <TagsInput
          tags={tags}
          onChange={setTags}
          placeholder="e.g. పెసరట్టు, pesarattu, green moong dosa, breakfast…"
        />
        <p className="text-xs text-gray-400">
          💡 Add the same concept in multiple languages. Example: <code className="bg-gray-100 px-1 rounded">రాగి</code> + <code className="bg-gray-100 px-1 rounded">ragi</code> + <code className="bg-gray-100 px-1 rounded">finger millet</code>
        </p>
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
        <label className="text-sm font-medium text-gray-800">
          Ingredients
          <span className="ml-2 text-xs font-normal text-gray-400">— one per line</span>
        </label>
        <textarea
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          rows={8}
          placeholder={`1 cup ragi flour\n2 tbsp curd\n1/2 tsp salt\nWater as needed\n1 tsp oil`}
          className={inputCls}
        />
        <p className="text-xs text-gray-400">Type each ingredient on a new line. No need to add bullet points or numbers.</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Instructions (HTML supported)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8}
          placeholder="<ol><li>Step 1...</li></ol>" className={inputCls} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">
          Nutrition Facts
          <span className="ml-2 text-xs font-normal text-gray-400">— optional, comma separated</span>
        </label>
        <input
          type="text"
          value={nutritionText}
          onChange={(e) => setNutritionText(e.target.value)}
          placeholder="Calories: 250, Protein: 8g, Carbs: 45g, Fat: 6g, Fiber: 3g"
          className={inputCls}
        />
        <p className="text-xs text-gray-400">Format: <code className="bg-gray-100 px-1 rounded">Key: Value, Key: Value</code> — units like g/mg are stripped automatically.</p>
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
