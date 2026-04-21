'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'

type Comment = {
  _id: string
  name: string
  email: string
  body: string
  contentType: string
  createdAt?: string
}

export default function AdminCommentsPage() {
  const [items, setItems] = useState<Comment[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const pageSize = 25

  const fetchComments = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (typeFilter) params.set('contentType', typeFilter)
    const res = await fetch(`/api/admin/comments?${params}`)
    const data = await res.json()
    setItems(data.items ?? [])
    setTotal(data.total ?? 0)
    setSelected(new Set())
    setLoading(false)
  }, [page, typeFilter])

  useEffect(() => { fetchComments() }, [fetchComments])

  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
  })
  const toggleAll = () => setSelected(selected.size === items.length ? new Set() : new Set(items.map((c) => c._id)))

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment? This cannot be undone.')) return
    setDeleting(id)
    await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((c) => c._id !== id))
    setTotal((t) => t - 1)
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setDeleting(null)
  }

  const handleBulkDelete = async () => {
    if (!selected.size) return
    if (!confirm(`Delete ${selected.size} comment${selected.size > 1 ? 's' : ''}? This cannot be undone.`)) return
    setBulkDeleting(true)
    await Promise.all([...selected].map((id) => fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })))
    setItems((prev) => prev.filter((c) => !selected.has(c._id)))
    setTotal((t) => t - selected.size)
    setSelected(new Set())
    setBulkDeleting(false)
  }

  const totalPages = Math.ceil(total / pageSize)
  const allChecked = items.length > 0 && selected.size === items.length
  const someChecked = selected.size > 0 && selected.size < items.length

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Comments</h1>
          <p className="text-sm text-gray-500">{total} total</p>
        </div>
        <div className="flex gap-1.5">
          {[['', 'All'], ['post', 'Posts'], ['recipe', 'Recipes']].map(([val, label]) => (
            <button key={val} type="button" onClick={() => { setTypeFilter(val); setPage(1) }}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${typeFilter === val ? 'bg-[#1A5C38] text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
              {label}
            </button>
          ))}
        </div>
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

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80">
            <tr>
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
              </th>
              {['Name', 'Email', 'Comment', 'Type', 'Date', 'Action'].map((h) => (
                <th key={h} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${h === 'Action' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">No comments yet.</td></tr>
            ) : items.map((c) => (
              <tr key={c._id} className={`transition-colors hover:bg-gray-50/60 ${selected.has(c._id) ? 'bg-red-50/40' : ''}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(c._id)} onChange={() => toggleOne(c._id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{c.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{c.email}</td>
                <td className="max-w-xs px-4 py-3 text-sm text-gray-700"><p className="line-clamp-2">{c.body}</p></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${c.contentType === 'post' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {c.contentType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" disabled={deleting === c._id} onClick={() => handleDelete(c._id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors">
                    <Trash2 size={11} />{deleting === c._id ? '…' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">No comments yet.</div>
        ) : items.map((c) => (
          <div key={c._id} className={`rounded-2xl border bg-white p-4 shadow-sm transition ${selected.has(c._id) ? 'border-red-300 bg-red-50/20' : 'border-gray-100'}`}>
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={selected.has(c._id)} onChange={() => toggleOne(c._id)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{c.name}</p>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${c.contentType === 'post' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {c.contentType}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{c.email}</p>
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">{c.body}</p>
                <p className="mt-1.5 text-[11px] text-gray-400">{c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : '—'}</p>
              </div>
            </div>
            <div className="mt-3 border-t border-gray-100 pt-3">
              <button type="button" disabled={deleting === c._id} onClick={() => handleDelete(c._id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors">
                <Trash2 size={12} />{deleting === c._id ? 'Deleting…' : 'Delete Comment'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button type="button" onClick={() => setPage(page - 1)} disabled={page <= 1}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 transition">← Prev</button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button type="button" onClick={() => setPage(page + 1)} disabled={page >= totalPages}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 transition">Next →</button>
        </div>
      )}
    </div>
  )
}
