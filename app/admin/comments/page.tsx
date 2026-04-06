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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Comments ({total})</h1>
        <div className="flex gap-2 text-sm">
          {[['', 'All'], ['post', 'Posts'], ['recipe', 'Recipes']].map(([val, label]) => (
            <button key={val} type="button" onClick={() => { setTypeFilter(val); setPage(1) }}
              className={`rounded-full px-3 py-1 font-medium ${typeFilter === val ? 'bg-[#1A5C38] text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
          <span className="text-sm font-medium text-red-700">{selected.size} selected</span>
          <button type="button" onClick={handleBulkDelete} disabled={bulkDeleting}
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            <Trash2 size={13} />
            {bulkDeleting ? 'Deleting...' : `Delete ${selected.size}`}
          </button>
          <button type="button" onClick={() => setSelected(new Set())} className="text-xs text-red-500 hover:text-red-700">Cancel</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-[11px] uppercase text-gray-500">
            <tr>
              <th className="w-8 px-4 py-3">
                <input type="checkbox" checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
              </th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">No comments yet.</td></tr>
            ) : items.map((c) => (
              <tr key={c._id} className={`hover:bg-gray-50 ${selected.has(c._id) ? 'bg-red-50/40' : ''}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(c._id)} onChange={() => toggleOne(c._id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.email}</td>
                <td className="max-w-xs px-4 py-3 text-gray-700"><p className="line-clamp-2">{c.body}</p></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.contentType === 'post' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {c.contentType}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-gray-500">
                  {c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" disabled={deleting === c._id} onClick={() => handleDelete(c._id)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
                    <Trash2 size={12} />{deleting === c._id ? '...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <button type="button" onClick={() => setPage(page - 1)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50">← Prev</button>
          )}
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <button type="button" onClick={() => setPage(page + 1)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50">Next →</button>
          )}
        </div>
      )}
    </div>
  )
}
