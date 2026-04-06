'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import SendDigestButton from './SendDigestButton'

type Subscriber = {
  _id: string
  email: string
  isActive: boolean
  subscribedAt?: string
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/subscribers')
    const data = await res.json()
    setSubscribers(data ?? [])
    setSelected(new Set())
    setLoading(false)
  }, [])

  useEffect(() => { fetchSubscribers() }, [fetchSubscribers])

  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
  })
  const toggleAll = () => setSelected(selected.size === subscribers.length ? new Set() : new Set(subscribers.map((s) => s._id)))

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove subscriber "${email}"?`)) return
    setDeleting(id)
    await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' })
    setSubscribers((prev) => prev.filter((s) => s._id !== id))
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setDeleting(null)
  }

  const handleBulkDelete = async () => {
    if (!selected.size) return
    if (!confirm(`Remove ${selected.size} subscriber${selected.size > 1 ? 's' : ''}?`)) return
    setBulkDeleting(true)
    await Promise.all([...selected].map((id) => fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' })))
    setSubscribers((prev) => prev.filter((s) => !selected.has(s._id)))
    setSelected(new Set())
    setBulkDeleting(false)
  }

  const activeCount = subscribers.filter((s) => s.isActive).length
  const allChecked = subscribers.length > 0 && selected.size === subscribers.length
  const someChecked = selected.size > 0 && selected.size < subscribers.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Subscribers</h2>
          <p className="text-sm text-gray-500">{subscribers.length} total · {activeCount} active</p>
        </div>
        <SendDigestButton activeCount={activeCount} />
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
          <span className="text-sm font-medium text-red-700">{selected.size} selected</span>
          <button type="button" onClick={handleBulkDelete} disabled={bulkDeleting}
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            <Trash2 size={13} />
            {bulkDeleting ? 'Removing...' : `Remove ${selected.size}`}
          </button>
          <button type="button" onClick={() => setSelected(new Set())} className="text-xs text-red-500 hover:text-red-700">Cancel</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="w-8 px-4 py-2">
                <input type="checkbox" checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
              </th>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Subscribed On</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">Loading...</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">No subscribers yet.</td></tr>
            ) : subscribers.map((sub, idx) => (
              <tr key={sub._id} className={`hover:bg-gray-50 ${selected.has(sub._id) ? 'bg-red-50/40' : ''}`}>
                <td className="px-4 py-2">
                  <input type="checkbox" checked={selected.has(sub._id)} onChange={() => toggleOne(sub._id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{idx + 1}</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{sub.email}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${sub.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {sub.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {sub.subscribedAt ? format(new Date(sub.subscribedAt), 'dd MMM yyyy') : '-'}
                </td>
                <td className="px-4 py-2 text-right">
                  <button type="button" disabled={deleting === sub._id} onClick={() => handleDelete(sub._id, sub.email)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
                    <Trash2 size={12} />{deleting === sub._id ? '...' : 'Remove'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
