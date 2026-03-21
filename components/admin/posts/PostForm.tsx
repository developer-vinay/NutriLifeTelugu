'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'

type PostFormProps = {
  mode: 'create' | 'edit'
  initialData?: any
}

const categories = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'gut-health', label: 'Gut Health' },
  { value: 'immunity', label: 'Immunity' },
  { value: 'thyroid', label: 'Thyroid' },
  { value: 'kids-nutrition', label: 'Kids Nutrition' },
  { value: 'recipes', label: 'Recipes' },
  { value: 'millets', label: 'Millets' },
  { value: 'general', label: 'General' },
]

const inputCls = 'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]'

export default function PostForm({ mode, initialData }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'general')
  const [language, setLanguage] = useState<'en' | 'te'>(initialData?.language ?? 'en')
  const [tag, setTag] = useState(initialData?.tag ?? '')
  const [heroImage, setHeroImage] = useState(initialData?.heroImage ?? '')
  const [heroImagePublicId, setHeroImagePublicId] = useState(initialData?.heroImagePublicId ?? '')
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl ?? '')
  const [contentImages, setContentImages] = useState<string[]>(initialData?.contentImages ?? [])
  const [content, setContent] = useState(initialData?.content ?? '')
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [author, setAuthor] = useState(initialData?.author ?? 'NutriLifeMithra')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!initialData && title) {
      setSlug(slugify(title, { lower: true, strict: true }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  const handleUploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'posts')
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.url
  }

  const handleUploadHero = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'posts')
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
      const words = content.trim().split(/\s+/).length
      const readTimeMinutes = Math.max(1, Math.ceil(words / 200))
      const body = {
        title, slug, excerpt, category, language, tag,
        heroImage, heroImagePublicId, youtubeUrl, content,
        isFeatured, isPublished: publish, readTimeMinutes, contentImages, author,
      }
      const url = mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${initialData._id}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to save post')
      router.push('/admin/posts')
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

      {/* Language selector — prominent at top */}
      <div className="rounded-xl border-2 border-[#1A5C38]/20 bg-emerald-50/50 p-4">
        <label className="mb-2 block text-sm font-semibold text-gray-800">Content Language</label>
        <div className="flex gap-3">
          {(['en', 'te'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLanguage(l)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                language === l
                  ? 'bg-[#1A5C38] text-white shadow-sm'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-[#1A5C38]'
              }`}
            >
              {l === 'en' ? '🇬🇧 English' : '🇮🇳 తెలుగు'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder={language === 'te' ? 'పోస్ట్ శీర్షిక ఇక్కడ రాయండి...' : 'Post title here...'}
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Tag</label>
          <input type="text" value={tag} onChange={(e) => setTag(e.target.value)}
            placeholder={language === 'te' ? 'బరువు తగ్గడం' : 'Weight Loss'}
            className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">YouTube URL (optional)</label>
          <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/..." className={inputCls} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Author Name</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
          placeholder="NutriLifeMithra"
          className={inputCls} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Excerpt (max 200 chars)</label>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value.slice(0, 200))} rows={3}
          placeholder={language === 'te' ? 'సంక్షిప్త వివరణ...' : 'Brief description...'}
          className={inputCls} />
        <div className="text-right text-xs text-gray-500">{excerpt.length}/200</div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Hero Image</label>
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            try { await handleUploadHero(file) } catch { setError('Image upload failed') }
          }} className="text-sm" />
          {heroImage && <img src={heroImage} alt="" className="h-12 w-20 rounded object-cover" />}
        </div>
      </div>

      {/* Content images */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Content Images (optional — distributed inline throughout the article)</label>
        <div className="flex flex-wrap gap-3">
          {contentImages.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} alt="" className="h-20 w-28 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setContentImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white hover:bg-red-600"
              >✕</button>
            </div>
          ))}
          <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-xs text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38]">
            <span className="text-xl">+</span>
            <span>Add image</span>
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                const url = await handleUploadImage(file)
                setContentImages((prev) => [...prev, url])
              } catch { setError('Image upload failed') }
            }} />
          </label>
        </div>
        <p className="text-xs text-gray-400">Images are automatically distributed between paragraphs throughout the article. Upload in the order you want them to appear.</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12}
          placeholder={language === 'te' ? 'వ్యాసం కంటెంట్...' : 'Article content...'}
          className={inputCls} />
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
