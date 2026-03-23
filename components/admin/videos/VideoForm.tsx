'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'

type VideoFormProps = {
  mode: 'create' | 'edit'
  initialData?: any
}

const categories = [
  { value: 'cooking', label: 'Cooking' },
  { value: 'health-education', label: 'Health Education' },
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'shorts', label: 'Shorts' },
]

const inputCls = 'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]'

function extractYoutubeId(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '')
    if (u.searchParams.get('v')) return u.searchParams.get('v') ?? ''
    const parts = u.pathname.split('/')
    const idx = parts.findIndex((p) => p === 'embed')
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1]
    return ''
  } catch {
    return ''
  }
}

export default function VideoForm({ mode, initialData }: VideoFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'cooking')
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialData?.language ?? 'en')
  const [tag, setTag] = useState(initialData?.tag ?? '')
  const [durationSeconds, setDurationSeconds] = useState(initialData?.durationSeconds ?? '')
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!initialData && title) {
      setSlug(slugify(title, { lower: true, strict: true }))
    }
  }, [title])

  const youtubeId = extractYoutubeId(youtubeUrl)
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : ''

  const onSubmit = async (publish: boolean) => {
    setSaving(true)
    setError('')
    try {
      const body = {
        title, slug, description, youtubeUrl, youtubeId,
        thumbnailUrl: thumbnailUrl || undefined,
        category, language, tag,
        durationSeconds: durationSeconds ? Number(durationSeconds) : undefined,
        isFeatured,
        isPublished: publish,
      }
      const url = mode === 'create' ? '/api/admin/videos' : `/api/admin/videos/${initialData._id}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to save video')
      router.push('/admin/videos')
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
          placeholder={language === 'te' ? 'వీడియో శీర్షిక...' : language === 'hi' ? 'वीडियो शीर्षक...' : 'Video title...'}
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

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">YouTube URL</label>
        <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..." className={inputCls} />
        {youtubeId && <p className="text-xs text-gray-500">YouTube ID: {youtubeId}</p>}
      </div>

      {thumbnailUrl && (
        <div>
          <p className="mb-1 text-xs text-gray-500">Thumbnail preview:</p>
          <img src={thumbnailUrl} alt="thumbnail" className="h-32 rounded-lg object-cover" />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Tag</label>
          <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Duration (seconds)</label>
          <input type="number" value={durationSeconds} onChange={(e) => setDurationSeconds(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
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
