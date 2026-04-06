'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

type Plan = {
  _id: string
  title: string
  description?: string
  price: number
  originalPrice?: number
  discountLabel?: string
  currency: string
  durationWeeks: number
  features?: string[]
  isActive: boolean
  isFeatured?: boolean
  language: string
}

const LANG_LABEL: Record<string, string> = { en: 'English', te: 'Telugu', hi: 'Hindi' }

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/plans')
    const data = await res.json()
    setPlans(data ?? [])
    setSelected(new Set())
    setLoading(false)
  }, [])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
  })
  const toggleAll = () => setSelected(selected.size === plans.length ? new Set() : new Set(plans.map((p) => p._id)))

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' })
    setPlans((prev) => prev.filter((p) => p._id !== id))
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setDeleting(null)
  }

  const handleBulkDelete = async () => {
    if (!selected.size) return
    if (!confirm(`Delete ${selected.size} plan${selected.size > 1 ? 's' : ''}? This cannot be undone.`)) return
    setBulkDeleting(true)
    await Promise.all([...selected].map((id) => fetch(`/api/admin/plans/${id}`, { method: 'DELETE' })))
    setPlans((prev) => prev.filter((p) => !selected.has(p._id)))
    setSelected(new Set())
    setBulkDeleting(false)
  }

  const allChecked = plans.length > 0 && selected.size === plans.length
  const someChecked = selected.size > 0 && selected.size < plans.length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">Premium Plans</h1>
        <div className="flex items-center gap-3">
          {/* Select all toggle */}
          {plans.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={allChecked}
                ref={(el) => { if (el) el.indeterminate = someChecked }}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
              Select all
            </label>
          )}
          <Link href="/admin/plans/new"
            className="rounded-md bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            + New Plan
          </Link>
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

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-400">Loading...</p>
      ) : plans.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">No plans yet. Create your first premium plan.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const discountLabel = plan.discountLabel ||
              (plan.originalPrice && plan.originalPrice > plan.price
                ? `${Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}% OFF`
                : null)
            const isSelected = selected.has(plan._id)

            return (
              <div key={plan._id}
                className={`relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition ${
                  isSelected ? 'border-red-400 ring-2 ring-red-200' : plan.isFeatured ? 'border-[#1A5C38] ring-2 ring-[#1A5C38]/20' : ''
                }`}>

                {/* Checkbox top-left */}
                <div className="absolute left-3 top-3">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleOne(plan._id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
                </div>

                {/* Featured ribbon */}
                {plan.isFeatured && !isSelected && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-[#1A5C38] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Featured
                  </div>
                )}

                <div className="mt-4">
                  {/* Discount badge */}
                  {discountLabel && (
                    <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">
                      🔥 {discountLabel}
                    </div>
                  )}

                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{plan.title}</p>
                      <p className="text-xs text-gray-500">{plan.durationWeeks}-week · {LANG_LABEL[plan.language] ?? plan.language}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#D97706]">{plan.currency}{plan.price}</div>
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <div className="text-xs text-gray-400 line-through">{plan.currency}{plan.originalPrice}</div>
                      )}
                    </div>
                  </div>

                  {plan.description && <p className="mb-3 text-xs text-gray-600">{plan.description}</p>}

                  {plan.features && plan.features.length > 0 && (
                    <ul className="mb-3 space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                          <span className="text-emerald-500">✓</span>{f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${plan.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex gap-3 text-xs">
                      <Link href={`/admin/plans/${plan._id}/edit`} className="text-[#1A5C38] hover:underline">Edit</Link>
                      <button type="button" disabled={deleting === plan._id} onClick={() => handleDelete(plan._id, plan.title)}
                        className="text-red-500 hover:text-red-700 disabled:opacity-40">
                        {deleting === plan._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
