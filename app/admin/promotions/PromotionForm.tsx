'use client'

import React, { useState } from 'react'
import { ExternalLink, Play, ImageIcon, Link2, Eye } from 'lucide-react'

type PromoType = 'image' | 'video' | 'link'

type FormData = {
  _id?: string
  title: string
  type: PromoType
  imageUrl: string
  imagePublicId: string
  youtubeUrl: string
  youtubeId: string
  thumbnailUrl: string
  linkUrl: string
  linkLabel: string
  description: string
  placement: string
  language: string
  isActive: boolean
  startsAt: string
  endsAt: string
}

const empty: FormData = {
  title: '', type: 'image',
  imageUrl: '', imagePublicId: '',
  youtubeUrl: '', youtubeId: '', thumbnailUrl: '',
  linkUrl: '', linkLabel: 'Learn More', description: '',
  placement: 'sidebar', language: 'all',
  isActive: true, startsAt: '', endsAt: '',
}

const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]'

function extractYoutubeId(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '')
    return u.searchParams.get('v') ?? ''
  } catch { return '' }
}

// Live preview of how the promo will look to users
function LivePreview({ form }: { form: FormData }) {
  if (form.type === 'image') {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {form.imageUrl
          ? <img src={form.imageUrl} alt={form.title} className="w-full object-cover" style={{ maxHeight: 180 }} />
          : <div className="flex h-32 items-center justify-center bg-gray-50 text-gray-300"><ImageIcon size={32} /></div>
        }
        <p className="px-2 py-1 text-center text-[10px] text-gray-400">Sponsored</p>
      </div>
    )
  }

  if (form.type === 'video') {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {form.thumbnailUrl
          ? (
            <div className="relative">
              <img src={form.thumbnailUrl} alt="" className="w-full object-cover" style={{ maxHeight: 160 }} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 shadow">
                  <Play size={16} className="ml-0.5 text-white" fill="white" />
                </div>
              </div>
            </div>
          )
          : <div className="flex h-32 items-center justify-center bg-gray-50 text-gray-300"><Play size={32} /></div>
        }
        {form.title && <p className="px-3 py-2 text-xs font-medium text-gray-700">{form.title}</p>}
        <p className="px-3 pb-2 text-[10px] text-gray-400">Sponsored</p>
      </div>
    )
  }

  if (form.type === 'link') {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex gap-3 p-3">
          {form.imageUrl
            ? <img src={form.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
            : <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-purple-50"><Link2 size={20} className="text-purple-300" /></div>
          }
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">Sponsored</p>
            <p className="line-clamp-2 text-[13px] font-semibold text-gray-900">{form.title || 'Your promo title'}</p>
            {form.description && <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500">{form.description}</p>}
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#1A5C38] px-2.5 py-1 text-[11px] font-semibold text-white">
              {form.linkLabel || 'Learn More'} <ExternalLink size={9} />
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default function PromotionForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Partial<FormData>
  onSaved: () => void
  onCancel?: () => void
}) {
  const [form, setForm] = useState<FormData>({
    ...empty,
    ...initial,
    startsAt: initial?.startsAt ?? '',
    endsAt: initial?.endsAt ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  function set(key: keyof FormData, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handleYoutubeUrl(url: string) {
    set('youtubeUrl', url)
    const id = extractYoutubeId(url)
    if (id) {
      set('youtubeId', id)
      set('thumbnailUrl', `https://img.youtube.com/vi/${id}/maxresdefault.jpg`)
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'promotions')
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    set('imageUrl', data.url)
    set('imagePublicId', data.publicId)
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, startsAt: form.startsAt || null, endsAt: form.endsAt || null }
      const url = form._id ? `/api/admin/promotions/${form._id}` : '/api/admin/promotions'
      const res = await fetch(url, {
        method: form._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to save')
      onSaved()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {/* Live preview toggle */}
      <button type="button" onClick={() => setShowPreview(p => !p)}
        className="flex w-full items-center justify-between rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-[#1A5C38] hover:text-[#1A5C38] transition">
        <span className="flex items-center gap-2"><Eye size={15} /> {showPreview ? 'Hide Preview' : 'Show Live Preview'}</span>
        <span className="text-xs text-gray-400">See how it looks to users</span>
      </button>

      {showPreview && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Live Preview</p>
          <LivePreview form={form} />
        </div>
      )}

      {/* Title */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">Title *</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Ragi Dosa Promo" className={inputCls} />
      </div>

      {/* Type selector */}
      <div>
        <label className="mb-2 block text-xs font-medium text-gray-700">Promotion Type</label>
        <div className="grid grid-cols-3 gap-2">
          {(['image', 'video', 'link'] as PromoType[]).map((t) => (
            <button key={t} type="button" onClick={() => set('type', t)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-semibold transition ${
                form.type === t
                  ? 'border-[#1A5C38] bg-emerald-50 text-[#1A5C38]'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}>
              {t === 'image' ? <><ImageIcon size={18} /> Image Banner</> : t === 'video' ? <><Play size={18} /> YouTube Video</> : <><Link2 size={18} /> Link Card</>}
            </button>
          ))}
        </div>
      </div>

      {/* Image upload */}
      {form.type === 'image' && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <label className="block text-xs font-medium text-gray-700">Upload Banner Image</label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-6 text-sm text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition">
            <ImageIcon size={24} className="mb-2" />
            {uploading ? 'Uploading…' : form.imageUrl ? 'Replace image' : 'Click to upload image'}
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0]; if (file) await handleImageUpload(file)
            }} />
          </label>
          {form.imageUrl && <img src={form.imageUrl} alt="" className="h-24 w-full rounded-lg object-cover" />}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Click-through URL (optional)</label>
            <input type="url" value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)}
              placeholder="https://..." className={inputCls} />
          </div>
        </div>
      )}

      {/* YouTube video */}
      {form.type === 'video' && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <label className="block text-xs font-medium text-gray-700">YouTube URL</label>
          <input type="url" value={form.youtubeUrl} onChange={(e) => handleYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..." className={inputCls} />
          {form.youtubeId && <p className="text-[11px] text-gray-500">Video ID: <code className="bg-gray-100 px-1 rounded">{form.youtubeId}</code></p>}
          {form.thumbnailUrl && (
            <div className="relative overflow-hidden rounded-lg">
              <img src={form.thumbnailUrl} alt="" className="w-full object-cover" style={{ maxHeight: 140 }} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
                  <Play size={16} className="ml-0.5 text-white" fill="white" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Link card */}
      {form.type === 'link' && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Destination URL *</label>
            <input type="url" value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)}
              placeholder="https://..." className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Button Label</label>
            <input value={form.linkLabel} onChange={(e) => set('linkLabel', e.target.value)}
              placeholder="Learn More" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Short promo text…" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Card Image (optional)</label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition">
              <ImageIcon size={14} /> {uploading ? 'Uploading…' : form.imageUrl ? 'Replace image' : 'Upload image'}
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0]; if (file) await handleImageUpload(file)
              }} />
            </label>
            {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 h-14 rounded-lg object-cover" />}
          </div>
        </div>
      )}

      {/* Placement + Language */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Placement</label>
          <select value={form.placement} onChange={(e) => set('placement', e.target.value)} className={inputCls}>
            <optgroup label="Global">
              <option value="popup">💬 Popup (all pages, after 5s)</option>
              <option value="sidebar">📌 Sidebar (home, blog list, recipes list)</option>
            </optgroup>
            <optgroup label="Home Page">
              <option value="home-banner">🏠 Home Banner (rotating)</option>
            </optgroup>
            <optgroup label="Content Pages">
              <option value="blog-inline">📝 Blog Post — Inline</option>
              <option value="recipe-inline">🍽 Recipe Detail — Inline</option>
            </optgroup>
            <optgroup label="Listing Pages">
              <option value="videos-page">▶ Videos Page</option>
              <option value="diet-plans">🥗 Diet Plans Page</option>
              <option value="shop">🛒 Shop Page</option>
              <option value="about">ℹ About Page</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Language</label>
          <select value={form.language} onChange={(e) => set('language', e.target.value)} className={inputCls}>
            <option value="all">🌐 All Languages</option>
            <option value="en">🇬🇧 English</option>
            <option value="te">🇮🇳 Telugu</option>
            <option value="hi">🇮🇳 Hindi</option>
          </select>
        </div>
      </div>

      {/* Schedule */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Schedule (optional)</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Start Date</label>
            <input type="datetime-local" value={form.startsAt ?? ''} onChange={(e) => set('startsAt', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">End Date</label>
            <input type="datetime-local" value={form.endsAt ?? ''} onChange={(e) => set('endsAt', e.target.value)} className={inputCls} />
          </div>
        </div>
        <p className="text-[11px] text-gray-400">Leave blank to show always. Set end date to auto-expire.</p>
      </div>

      {/* Active toggle */}
      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-800">Active</p>
          <p className="text-xs text-gray-500">Show this promotion to users immediately</p>
        </div>
        <div className={`relative h-6 w-11 rounded-full transition-colors ${form.isActive ? 'bg-[#1A5C38]' : 'bg-gray-300'}`}
          onClick={() => set('isActive', !form.isActive)}>
          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </label>

      {/* Actions */}
      <div className="flex gap-3 border-t pt-4">
        <button type="submit" disabled={saving}
          className="flex-1 rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 transition">
          {saving ? 'Saving…' : form._id ? '✓ Update Promotion' : '+ Create Promotion'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
