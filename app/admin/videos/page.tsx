'use client'

import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Trash2, Pencil, Plus, Search, X } from 'lucide-react'

type Video = {
  _id: string
  title: string
  youtubeId?: string
  category?: string
  language?: string
  isPublished: boolean
  createdAt?: string
}

const LANG_BADGE: Record<string, string> = {
  en: 'bg-blue-50 text-blue-700',
  te: 'bg-amber-50 text-amber-700',
  hi: 'bg-purple-50 text-purple-700',
}
const LANG_LABEL: Record<string, string> = { en: 'EN', te: 'తె', hi: 'हि' }

function useDebounce<T>(value: T, delay = 300): T {
  const [d, setD] = useState(value)
  useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t) }, [value, delay])
  return d
}

export default function AdminVideosPage() {
  const [allVideos, setAllVideos] = useState<Video[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const query = useDebounce(searchInput, 300)

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/videos?pageSize=200`)
    const data = await res.json()
    setAllVideos(data.items ?? [])
    setSelected(new Set())
    setLoading(false)
  }, [])

  useEffect(() => { fetchVideos() }, [fetchVideos])

  const videos = useMemo(() => {
    if (!query.trim()) return allVideos
    const q = query.trim().toLowerCase()
    return allVideos.filter((v) =>
      v.title.toLowerCase().includes(q) ||
      (v.youtubeId ?? '').toLowerCase().includes(q) ||
      (v.category ?? '').toLowerCase().includes(q) ||
      (v.language ?? '').toLowerCase().includes(q)
    )
  }, [allVideos, query])

  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
  })
  const toggleAll = () => setSelected(selected.size === videos.length ? new Set() : new Set(videos.map((v) => v._id)))

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })
    setAllVideos((prev) => prev.filter((v) => v._id !== id))
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setDeleting(null)
  }

  const handleBulkDelete = async () => {
    if (!selected.size) return
    if (!confirm(`Delete ${selected.size} video${selected.size > 1 ? 's' : ''}? This cannot be undone.`)) return
    setBulkDeleting(true)
    await Promise.all([...selected].map((id) => fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })))
    setAllVideos((prev) => prev.filter((v) => !selected.has(v._id)))
    setSelected(new Set())
    setBulkDeleting(false)
  }

  const allChecked = videos.length > 0 && selected.size === videos.length
  const someChecked = selected.size > 0 && selected.size < videos.length

  return (
    <div className="space-y-5">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Videos</h1>
          <p className="text-sm text-gray-500">{allVideos.length} video{allVideos.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/videos/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A5C38] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-95">
          <Plus className="h-4 w-4" /> New Video
        </Link>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input ref={inputRef} type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search videos…"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm shadow-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20" />
        {searchInput && (
          <button type="button" onClick={() => { setSearchInput(''); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Bulk bar ── */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
          <span className="text-sm font-semibold text-red-700">{selected.size} selected</span>
          <button type="button" onClick={handleBulkDelete} disabled={bulkDeleting}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition">
            <Trash2 size={12} /> {bulkDeleting ? 'Deleting…' : `Delete ${selected.size}`}
          </button>
          <button type="button" onClick={() => setSelected(new Set())} className="text-xs text-red-500 hover:text-red-700">Cancel</button>
        </div>
      )}

      {/* ── Desktop table ── */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr>
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked }}
                  onChange={toggleAll} className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
              </th>
              {['Title', 'Lang', 'Category', 'Status', 'Created', 'Actions'].map((h) => (
                <th key={h} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : videos.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                {query ? `No videos matching "${query}"` : 'No videos yet.'}
              </td></tr>
            ) : videos.map((v) => (
              <tr key={v._id} className={`transition-colors hover:bg-gray-50/60 ${selected.has(v._id) ? 'bg-red-50/40' : ''}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(v._id)} onChange={() => toggleOne(v._id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
                </td>
                <td className="px-4 py-3">
                  <p className="max-w-[220px] truncate font-medium text-gray-900">{v.title}</p>
                  {v.youtubeId && <p className="text-[11px] text-gray-400">ID: {v.youtubeId}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${LANG_BADGE[v.language ?? 'en'] ?? 'bg-gray-100 text-gray-600'}`}>
                    {LANG_LABEL[v.language ?? 'en'] ?? v.language}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm capitalize text-gray-600">{v.category ?? '—'}</td>
                <td className="px-4 py-3"><StatusPill published={v.isPublished} /></td>
                <td className="px-4 py-3 text-sm text-gray-500">{v.createdAt ? format(new Date(v.createdAt), 'dd MMM yyyy') : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/videos/${v._id}/edit`}
                      className="rounded-lg border border-[#1A5C38]/30 px-2.5 py-1 text-[11px] font-semibold text-[#1A5C38] hover:bg-emerald-50 transition-colors">Edit</Link>
                    <button type="button" disabled={deleting === v._id} onClick={() => handleDelete(v._id, v.title)}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors">
                      {deleting === v._id ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-400">Loading…</div>
        ) : videos.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
            {query ? `No videos matching "${query}"` : 'No videos yet.'}
          </div>
        ) : videos.map((v) => (
          <div key={v._id}
            className={`rounded-2xl border bg-white p-4 shadow-sm transition ${selected.has(v._id) ? 'border-red-300 bg-red-50/20' : 'border-gray-100'}`}>
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={selected.has(v._id)} onChange={() => toggleOne(v._id)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 leading-snug line-clamp-2">{v.title}</p>
                {v.youtubeId && <p className="mt-0.5 text-[11px] text-gray-400">ID: {v.youtubeId}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${LANG_BADGE[v.language ?? 'en'] ?? 'bg-gray-100 text-gray-600'}`}>
                    {LANG_LABEL[v.language ?? 'en'] ?? v.language}
                  </span>
                  <StatusPill published={v.isPublished} />
                  {v.category && <span className="text-[11px] capitalize text-gray-500">{v.category}</span>}
                  <span className="text-[11px] text-gray-400">{v.createdAt ? format(new Date(v.createdAt), 'dd MMM yyyy') : '—'}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
              <Link href={`/admin/videos/${v._id}/edit`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#1A5C38]/40 py-2 text-xs font-semibold text-[#1A5C38] hover:bg-emerald-50 transition-colors">
                <Pencil size={12} /> Edit
              </Link>
              <button type="button" disabled={deleting === v._id} onClick={() => handleDelete(v._id, v.title)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors">
                <Trash2 size={12} /> {deleting === v._id ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusPill({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {published ? 'Live' : 'Draft'}
    </span>
  )
}
