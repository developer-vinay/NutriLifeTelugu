'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Trash2, Plus, GripVertical, Edit2, ToggleLeft, ToggleRight, ImageIcon } from 'lucide-react'

type Slide = {
  _id: string
  imageUrl: string
  alt: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  order: number
  isActive: boolean
}

const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]'

function SlideForm({ initial, onSaved, onCancel }: {
  initial?: Partial<Slide>
  onSaved: () => void
  onCancel: () => void
}) {
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [imagePublicId, setImagePublicId] = useState('')
  const [alt, setAlt] = useState(initial?.alt ?? '')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? '')
  const [buttonText, setButtonText] = useState(initial?.buttonText ?? '')
  const [buttonLink, setButtonLink] = useState(initial?.buttonLink ?? '')
  const [order, setOrder] = useState(initial?.order ?? 0)
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(file: File) {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'hero')
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setImageUrl(data.url)
    setImagePublicId(data.publicId)
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!imageUrl) { setError('Image is required'); return }
    setSaving(true)
    setError('')
    const payload = { imageUrl, imagePublicId, alt, title, subtitle, buttonText, buttonLink, order, isActive }
    const url = initial?._id ? `/api/admin/hero-slides/${initial._id}` : '/api/admin/hero-slides'
    const res = await fetch(url, {
      method: initial?._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) { setError('Failed to save'); return }
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {/* Image upload */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">Hero Image *</label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-6 text-sm text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition">
          <ImageIcon size={24} className="mb-2" />
          {uploading ? 'Uploading…' : imageUrl ? 'Replace image' : 'Click to upload hero image'}
          <span className="mt-1 text-[11px] text-gray-400">Recommended: 1920×600px or wider</span>
          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
            const file = e.target.files?.[0]; if (file) await handleUpload(file)
          }} />
        </label>
        {imageUrl && (
          <div className="relative mt-2 overflow-hidden rounded-xl">
            <img src={imageUrl} alt="" className="h-32 w-full object-cover" />
            {/* Live preview overlay */}
            {(title || subtitle) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center text-white p-4">
                {title && <p className="text-base font-bold drop-shadow">{title}</p>}
                {subtitle && <p className="text-xs opacity-90 drop-shadow">{subtitle}</p>}
                {buttonText && (
                  <span className="mt-2 rounded-full bg-[#1A5C38] px-3 py-1 text-xs font-semibold">{buttonText}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Title (optional)</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Healthy Telugu Recipes" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Subtitle (optional)</label>
          <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="e.g. Diabetic friendly meals" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Button Text</label>
          <input value={buttonText} onChange={e => setButtonText(e.target.value)} placeholder="e.g. Explore Recipes" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Button Link</label>
          <input value={buttonLink} onChange={e => setButtonLink(e.target.value)} placeholder="/recipes" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Alt Text</label>
          <input value={alt} onChange={e => setAlt(e.target.value)} placeholder="Image description" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Order (0 = first)</label>
          <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className={inputCls} />
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-800">Active</p>
          <p className="text-xs text-gray-500">Show this slide on the home page</p>
        </div>
        <div className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-[#1A5C38]' : 'bg-gray-300'}`}
          onClick={() => setIsActive(p => !p)}>
          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </label>

      <div className="flex gap-3 border-t pt-4">
        <button type="submit" disabled={saving}
          className="flex-1 rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
          {saving ? 'Saving…' : initial?._id ? '✓ Update Slide' : '+ Add Slide'}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Slide | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchSlides = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/hero-slides')
    const data = await res.json()
    setSlides(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSlides() }, [fetchSlides])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function openNew() { setEditing(null); setDrawerOpen(true) }
  function openEdit(s: Slide) { setEditing(s); setDrawerOpen(true) }
  function closeDrawer() { setDrawerOpen(false); setEditing(null) }
  const handleSaved = () => { closeDrawer(); fetchSlides() }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return
    setDeleting(id)
    await fetch(`/api/admin/hero-slides/${id}`, { method: 'DELETE' })
    setSlides(prev => prev.filter(s => s._id !== id))
    setDeleting(null)
  }

  const handleToggle = async (slide: Slide) => {
    await fetch(`/api/admin/hero-slides/${slide._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !slide.isActive }),
    })
    setSlides(prev => prev.map(s => s._id === slide._id ? { ...s, isActive: !s.isActive } : s))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Hero Slides</h2>
          <p className="text-sm text-gray-500">{slides.length} slides · {slides.filter(s => s.isActive).length} active · auto-rotates every 5s</p>
        </div>
        <button type="button" onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
          <Plus size={15} /> Add Slide
        </button>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
        💡 Slides are shown in order (lowest number first). Upload images at least 1920×600px for best quality. Changes reflect on the home page immediately.
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
      ) : slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <ImageIcon size={32} className="mb-3 text-gray-300" />
          <p className="font-medium text-gray-700">No hero slides yet</p>
          <p className="mt-1 text-sm text-gray-500">Add your first slide to replace the static images</p>
          <button type="button" onClick={openNew}
            className="mt-4 rounded-full bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            + Add First Slide
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide, idx) => (
            <div key={slide._id}
              className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${!slide.isActive ? 'opacity-60' : ''}`}>
              {/* Image */}
              <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                <img src={slide.imageUrl} alt={slide.alt || slide.title} className="h-full w-full object-cover" />
                {/* Overlay preview */}
                {(slide.title || slide.subtitle) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center text-white p-3">
                    {slide.title && <p className="text-sm font-bold drop-shadow">{slide.title}</p>}
                    {slide.subtitle && <p className="text-[11px] opacity-90">{slide.subtitle}</p>}
                    {slide.buttonText && (
                      <span className="mt-1.5 rounded-full bg-[#1A5C38] px-2.5 py-0.5 text-[10px] font-semibold">{slide.buttonText}</span>
                    )}
                  </div>
                )}
                {/* Order badge */}
                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-[11px] font-bold text-white">
                  {idx + 1}
                </span>
                {/* Active toggle */}
                <button type="button" onClick={() => handleToggle(slide)}
                  className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold shadow-sm hover:bg-white">
                  {slide.isActive
                    ? <><ToggleRight size={13} className="text-emerald-600" /><span className="text-emerald-700">Live</span></>
                    : <><ToggleLeft size={13} className="text-gray-400" /><span className="text-gray-500">Off</span></>
                  }
                </button>
              </div>

              <div className="p-3">
                <p className="line-clamp-1 text-sm font-medium text-gray-800">{slide.title || slide.alt || 'Untitled slide'}</p>
                {slide.buttonLink && (
                  <p className="mt-0.5 text-[11px] text-blue-500">{slide.buttonLink}</p>
                )}
              </div>

              <div className="flex border-t border-gray-100">
                <button type="button" onClick={() => openEdit(slide)}
                  className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[#1A5C38] hover:bg-emerald-50 transition">
                  <Edit2 size={12} /> Edit
                </button>
                <div className="w-px bg-gray-100" />
                <button type="button" disabled={deleting === slide._id} onClick={() => handleDelete(slide._id)}
                  className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition disabled:opacity-40">
                  <Trash2 size={12} /> {deleting === slide._id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-in drawer */}
      <div onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
      <div className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{editing ? 'Edit Slide' : 'New Hero Slide'}</h3>
            <p className="text-xs text-gray-500">Changes go live on the home page immediately</p>
          </div>
          <button type="button" onClick={closeDrawer}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {drawerOpen && <SlideForm initial={editing ?? undefined} onSaved={handleSaved} onCancel={closeDrawer} />}
        </div>
      </div>
    </div>
  )
}
