'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Trash2, Plus, ExternalLink, ImageIcon, Video, Link2, Edit2, ToggleLeft, ToggleRight, MousePointerClick } from 'lucide-react'
import PromotionForm from './PromotionForm'

type Promo = {
  _id: string
  title: string
  type: 'image' | 'video' | 'link'
  placement: string
  language: string
  isActive: boolean
  imageUrl?: string
  youtubeUrl?: string
  thumbnailUrl?: string
  linkUrl?: string
  linkLabel?: string
  description?: string
  clickCount: number
  createdAt: string
  startsAt?: string
  endsAt?: string
}

const TYPE_COLOR: Record<string, string> = {
  image: 'bg-blue-100 text-blue-700',
  video: 'bg-red-100 text-red-700',
  link: 'bg-purple-100 text-purple-700',
}
const PLACEMENT_LABEL: Record<string, string> = {
  'home-banner':   '🏠 Home Banner',
  'sidebar':       '📌 Sidebar',
  'blog-inline':   '📝 Blog Post',
  'recipe-inline': '🍽 Recipe Detail',
  'videos-page':   '▶ Videos Page',
  'diet-plans':    '🥗 Diet Plans',
  'shop':          '🛒 Shop',
  'about':         'ℹ About',
  'popup':         '💬 Popup',
}
const LANG_LABEL: Record<string, string> = { all: 'All', en: 'EN', te: 'తె', hi: 'हि' }

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Promo | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPromos = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/promotions')
    const data = await res.json()
    setPromos(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchPromos() }, [fetchPromos])

  // Close drawer on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function openNew() { setEditing(null); setDrawerOpen(true) }
  function openEdit(p: Promo) { setEditing(p); setDrawerOpen(true) }
  function closeDrawer() { setDrawerOpen(false); setEditing(null) }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
    setPromos((prev) => prev.filter((p) => p._id !== id))
    setDeleting(null)
  }

  const handleToggle = async (promo: Promo) => {
    await fetch(`/api/admin/promotions/${promo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !promo.isActive }),
    })
    setPromos((prev) => prev.map((p) => p._id === promo._id ? { ...p, isActive: !p.isActive } : p))
  }

  const handleSaved = () => { closeDrawer(); fetchPromos() }

  const active = promos.filter(p => p.isActive).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Promotions</h2>
          <p className="text-sm text-gray-500">{promos.length} total · <span className="text-emerald-600 font-medium">{active} active</span></p>
        </div>
        <button type="button" onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition">
          <Plus size={15} /> New Promotion
        </button>
      </div>

      {/* Stats bar */}
      {promos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: promos.length, color: 'bg-gray-50 border-gray-200' },
            { label: 'Active', value: active, color: 'bg-emerald-50 border-emerald-200' },
            { label: 'Total Clicks', value: promos.reduce((s, p) => s + p.clickCount, 0), color: 'bg-blue-50 border-blue-200' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl border p-3 text-center ${color}`}>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cards grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
      ) : promos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Plus size={24} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-700">No promotions yet</p>
          <p className="mt-1 text-sm text-gray-500">Create your first promotion to show ads to users</p>
          <button type="button" onClick={openNew}
            className="mt-4 rounded-full bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            + New Promotion
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo) => (
            <div key={promo._id}
              className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${promo.isActive ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>

              {/* Thumbnail */}
              <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                {promo.type === 'image' && promo.imageUrl && (
                  <img src={promo.imageUrl} alt={promo.title} className="h-full w-full object-cover" />
                )}
                {promo.type === 'video' && promo.thumbnailUrl && (
                  <img src={promo.thumbnailUrl} alt={promo.title} className="h-full w-full object-cover" />
                )}
                {promo.type === 'video' && !promo.thumbnailUrl && (
                  <div className="flex h-full items-center justify-center bg-red-50">
                    <Video size={32} className="text-red-300" />
                  </div>
                )}
                {promo.type === 'link' && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 bg-purple-50">
                    {promo.imageUrl
                      ? <img src={promo.imageUrl} alt="" className="h-full w-full object-cover" />
                      : <Link2 size={32} className="text-purple-300" />
                    }
                  </div>
                )}
                {promo.type === 'image' && !promo.imageUrl && (
                  <div className="flex h-full items-center justify-center bg-blue-50">
                    <ImageIcon size={32} className="text-blue-300" />
                  </div>
                )}

                {/* Type badge */}
                <span className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${TYPE_COLOR[promo.type]}`}>
                  {promo.type === 'image' ? <ImageIcon size={10} /> : promo.type === 'video' ? <Video size={10} /> : <Link2 size={10} />}
                  {promo.type}
                </span>

                {/* Active toggle overlay */}
                <button type="button" onClick={() => handleToggle(promo)}
                  className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold shadow-sm transition hover:bg-white">
                  {promo.isActive
                    ? <><ToggleRight size={14} className="text-emerald-600" /><span className="text-emerald-700">Live</span></>
                    : <><ToggleLeft size={14} className="text-gray-400" /><span className="text-gray-500">Off</span></>
                  }
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="line-clamp-1 font-semibold text-gray-900">{promo.title}</p>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 uppercase">
                    {LANG_LABEL[promo.language] ?? promo.language}
                  </span>
                </div>

                <p className="mb-2 text-[11px] text-gray-500">{PLACEMENT_LABEL[promo.placement] ?? promo.placement}</p>

                {promo.linkUrl && (
                  <a href={promo.linkUrl} target="_blank" rel="noreferrer"
                    className="mb-2 flex items-center gap-1 text-[11px] text-blue-500 hover:underline">
                    <ExternalLink size={10} /> {promo.linkUrl.slice(0, 35)}…
                  </a>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <MousePointerClick size={11} /> {promo.clickCount} clicks
                  </span>
                  {promo.endsAt && (
                    <span>Ends {format(new Date(promo.endsAt), 'dd MMM')}</span>
                  )}
                  {!promo.startsAt && !promo.endsAt && <span>Always on</span>}
                </div>
              </div>

              {/* Action bar */}
              <div className="flex border-t border-gray-100">
                <button type="button" onClick={() => openEdit(promo)}
                  className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[#1A5C38] hover:bg-emerald-50 transition">
                  <Edit2 size={13} /> Edit
                </button>
                <div className="w-px bg-gray-100" />
                <button type="button" disabled={deleting === promo._id} onClick={() => handleDelete(promo._id, promo.title)}
                  className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition disabled:opacity-40">
                  <Trash2 size={13} /> {deleting === promo._id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-in drawer */}
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      {/* Drawer panel */}
      <div className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{editing ? 'Edit Promotion' : 'New Promotion'}</h3>
            <p className="text-xs text-gray-500">{editing ? 'Update promotion details' : 'Create a new ad or promo'}</p>
          </div>
          <button type="button" onClick={closeDrawer}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
            ✕
          </button>
        </div>
        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {drawerOpen && <PromotionForm initial={editing ?? undefined} onSaved={handleSaved} onCancel={closeDrawer} />}
        </div>
      </div>
    </div>
  )
}
