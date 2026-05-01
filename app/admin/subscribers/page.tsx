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
  language?: 'en' | 'te' | 'hi'
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string; email: string } | null>(null)
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false)

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
    setDeleteModal({ show: true, id, email })
  }

  const confirmDelete = async () => {
    if (!deleteModal) return
    const { id } = deleteModal
    setDeleteModal(null)
    setDeleting(id)
    await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' })
    setSubscribers((prev) => prev.filter((s) => s._id !== id))
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setDeleting(null)
  }

  const handleBulkDelete = async () => {
    if (!selected.size) return
    setBulkDeleteModal(true)
  }

  const confirmBulkDelete = async () => {
    setBulkDeleteModal(false)
    setBulkDeleting(true)
    await Promise.all([...selected].map((id) => fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' })))
    setSubscribers((prev) => prev.filter((s) => !selected.has(s._id)))
    setSelected(new Set())
    setBulkDeleting(false)
  }

  const activeCount = subscribers.filter((s) => s.isActive).length
  // Count only ACTIVE subscribers by language
  const langCounts = {
    en: subscribers.filter((s) => s.isActive && s.language === 'en').length,
    te: subscribers.filter((s) => s.isActive && s.language === 'te').length,
    hi: subscribers.filter((s) => s.isActive && s.language === 'hi').length,
  }
  
  const allChecked = subscribers.length > 0 && selected.size === subscribers.length
  const someChecked = selected.size > 0 && selected.size < subscribers.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Subscribers</h2>
          <p className="text-sm text-gray-500">
            {subscribers.length} total · {activeCount} active
          </p>
          <p className="text-xs text-gray-400">
            English: {langCounts.en} · Telugu: {langCounts.te} · Hindi: {langCounts.hi}
          </p>
        </div>
        <SendDigestButton activeCount={activeCount} langCounts={langCounts} />
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

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border bg-white md:block">
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
              <th className="px-4 py-2">Language</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Subscribed On</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-400">Loading...</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">No subscribers yet.</td></tr>
            ) : subscribers.map((sub, idx) => (
              <tr key={sub._id} className={`hover:bg-gray-50 ${selected.has(sub._id) ? 'bg-red-50/40' : ''}`}>
                <td className="px-4 py-2">
                  <input type="checkbox" checked={selected.has(sub._id)} onChange={() => toggleOne(sub._id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{idx + 1}</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{sub.email}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    sub.language === 'te' ? 'bg-blue-50 text-blue-700' :
                    sub.language === 'hi' ? 'bg-purple-50 text-purple-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {sub.language === 'te' ? 'తెలుగు' : sub.language === 'hi' ? 'हिंदी' : 'English'}
                  </span>
                </td>
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

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="rounded-xl border bg-white px-4 py-6 text-center text-sm text-gray-400">Loading...</div>
        ) : subscribers.length === 0 ? (
          <div className="rounded-xl border bg-white px-4 py-6 text-center text-sm text-gray-500">No subscribers yet.</div>
        ) : subscribers.map((sub, idx) => (
          <div key={sub._id} className={`rounded-xl border bg-white p-4 shadow-sm ${selected.has(sub._id) ? 'border-red-300 bg-red-50/30' : ''}`}>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={selected.has(sub._id)} onChange={() => toggleOne(sub._id)}
                className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-gray-900">{sub.email}</p>
                  <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${sub.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {sub.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-400">
                  #{idx + 1} · {sub.subscribedAt ? format(new Date(sub.subscribedAt), 'dd MMM yyyy') : '-'}
                </p>
              </div>
            </div>
            <div className="mt-3 border-t border-gray-100 pt-3">
              <button type="button" disabled={deleting === sub._id} onClick={() => handleDelete(sub._id, sub.email)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
                <Trash2 size={13} />{deleting === sub._id ? 'Removing...' : 'Remove Subscriber'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                Remove Subscriber
              </h3>
            </div>

            <p className="mb-6 text-sm text-gray-600 dark:text-slate-400">
              Are you sure you want to remove <strong>{deleteModal.email}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                Remove Multiple Subscribers
              </h3>
            </div>

            <p className="mb-6 text-sm text-gray-600 dark:text-slate-400">
              Are you sure you want to remove <strong>{selected.size} subscriber{selected.size > 1 ? 's' : ''}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setBulkDeleteModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Remove {selected.size}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
