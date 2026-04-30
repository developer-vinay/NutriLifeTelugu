'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Pencil, FileText, CreditCard, Gift, Filter } from 'lucide-react'

type DietPlan = {
  _id: string
  planType: 'free' | 'premium'
  titleEn: string
  titleTe?: string
  titleHi?: string
  descEn?: string
  isActive: boolean
  language: string
  price?: number
  originalPrice?: number
  discountLabel?: string
  currency?: string
  durationWeeks?: number
  features?: string[]
  isFeatured?: boolean
  tagEn?: string
  pdfUrl?: string
  iconName?: string
  gradient?: string
  order?: number
}

const LANG_LABEL: Record<string, string> = { en: 'English', te: 'Telugu', hi: 'Hindi' }

export default function AdminPlansPage() {
  const [filterType, setFilterType] = useState<'all' | 'premium' | 'free'>('all')
  const [premiumPlans, setPremiumPlans] = useState<any[]>([])
  const [freePlans, setFreePlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const fetchPremiumPlans = useCallback(async () => {
    const res = await fetch('/api/admin/plans')
    const data = await res.json()
    return Array.isArray(data) ? data.map((p: any) => ({ ...p, planType: 'premium' })) : []
  }, [])

  const fetchFreePlans = useCallback(async () => {
    const res = await fetch('/api/admin/free-plans')
    const data = await res.json()
    return Array.isArray(data) ? data.map((p: any) => ({ ...p, planType: 'free' })) : []
  }, [])

  const fetchAllPlans = useCallback(async () => {
    setLoading(true)
    const [premium, free] = await Promise.all([fetchPremiumPlans(), fetchFreePlans()])
    setPremiumPlans(premium)
    setFreePlans(free)
    setSelected(new Set())
    setLoading(false)
  }, [fetchPremiumPlans, fetchFreePlans])

  useEffect(() => { fetchAllPlans() }, [fetchAllPlans])

  const allPlans = [...premiumPlans, ...freePlans]
  const filteredPlans = allPlans.filter(p => {
    if (filterType === 'all') return true
    return p.planType === filterType
  })

  const premiumCount = premiumPlans.length
  const freeCount = freePlans.length

  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
  })
  const toggleAll = () => setSelected(selected.size === filteredPlans.length ? new Set() : new Set(filteredPlans.map((p) => p._id)))

  const handleDelete = async (id: string, title: string, planType: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    const endpoint = planType === 'premium' ? `/api/admin/plans/${id}` : `/api/admin/free-plans/${id}`
    await fetch(endpoint, { method: 'DELETE' })
    
    if (planType === 'premium') {
      setPremiumPlans((prev) => prev.filter((p) => p._id !== id))
    } else {
      setFreePlans((prev) => prev.filter((p) => p._id !== id))
    }
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setDeleting(null)
  }

  const handleBulkDelete = async () => {
    if (!selected.size) return
    if (!confirm(`Delete ${selected.size} plan${selected.size > 1 ? 's' : ''}? This cannot be undone.`)) return
    setBulkDeleting(true)
    
    await Promise.all([...selected].map((id) => {
      const plan = allPlans.find(p => p._id === id)
      if (!plan) return Promise.resolve()
      const endpoint = plan.planType === 'premium' ? `/api/admin/plans/${id}` : `/api/admin/free-plans/${id}`
      return fetch(endpoint, { method: 'DELETE' })
    }))
    
    setPremiumPlans((prev) => prev.filter((p) => !selected.has(p._id)))
    setFreePlans((prev) => prev.filter((p) => !selected.has(p._id)))
    setSelected(new Set())
    setBulkDeleting(false)
  }

  const handleToggleActive = async (plan: any) => {
    const endpoint = plan.planType === 'premium' ? `/api/admin/plans/${plan._id}` : `/api/admin/free-plans/${plan._id}`
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !plan.isActive }),
    })
    
    if (plan.planType === 'premium') {
      setPremiumPlans(prev => prev.map(p => p._id === plan._id ? { ...p, isActive: !p.isActive } : p))
    } else {
      setFreePlans(prev => prev.map(p => p._id === plan._id ? { ...p, isActive: !p.isActive } : p))
    }
  }

  const allChecked = filteredPlans.length > 0 && selected.size === filteredPlans.length
  const someChecked = selected.size > 0 && selected.size < filteredPlans.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Diet Plans</h1>
          <p className="text-sm text-gray-500">
            {allPlans.length} total · {premiumCount} premium · {freeCount} free
          </p>
        </div>
        <Link href="/admin/plans/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1A5C38] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
          <Plus size={16} /> New Diet Plan
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        <button
          onClick={() => setFilterType('all')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            filterType === 'all'
              ? 'bg-[#1A5C38] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Plans ({allPlans.length})
        </button>
        <button
          onClick={() => setFilterType('premium')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
            filterType === 'premium'
              ? 'bg-[#1A5C38] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <CreditCard size={14} />
          Premium ({premiumCount})
        </button>
        <button
          onClick={() => setFilterType('free')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
            filterType === 'free'
              ? 'bg-[#1A5C38] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Gift size={14} />
          Free ({freeCount})
        </button>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center justify-between">
        {filteredPlans.length > 0 && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={allChecked}
              ref={(el) => { if (el) el.indeterminate = someChecked }}
              onChange={toggleAll}
              className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
            Select all
          </label>
        )}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2">
            <span className="text-sm font-medium text-red-700">{selected.size} selected</span>
            <button type="button" onClick={handleBulkDelete} disabled={bulkDeleting}
              className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              <Trash2 size={13} />
              {bulkDeleting ? 'Deleting...' : `Delete ${selected.size}`}
            </button>
            <button type="button" onClick={() => setSelected(new Set())} className="text-xs text-red-500 hover:text-red-700">Cancel</button>
          </div>
        )}
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-100" />)}
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <CreditCard size={32} className="mb-3 text-gray-300" />
          <p className="font-medium text-gray-700">No {filterType !== 'all' ? filterType : ''} plans yet</p>
          <p className="mt-1 text-sm text-gray-500">Create your first diet plan</p>
          <Link href="/admin/plans/new"
            className="mt-4 rounded-full bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            + Create Plan
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => {
            const isSelected = selected.has(plan._id)
            const isPremium = plan.planType === 'premium'

            return (
              <div key={plan._id}
                className={`relative overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md ${
                  isSelected ? 'border-red-400 ring-2 ring-red-200' : plan.isFeatured ? 'border-[#1A5C38] ring-2 ring-[#1A5C38]/20' : ''
                } ${!plan.isActive ? 'opacity-60' : ''}`}>
                
                {/* Type badge */}
                <div className={`h-2 w-full ${isPremium ? 'bg-gradient-to-r from-amber-400 to-orange-500' : `bg-gradient-to-r ${plan.gradient || 'from-emerald-500 to-teal-500'}`}`} />
                
                <div className="p-4">
                  {/* Checkbox */}
                  <div className="absolute left-3 top-5">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleOne(plan._id)}
                      className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
                  </div>

                  {/* Featured badge */}
                  {plan.isFeatured && !isSelected && (
                    <div className="absolute right-0 top-2 rounded-bl-xl bg-[#1A5C38] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Featured
                    </div>
                  )}

                  <div className="mt-4">
                    {/* Plan type badge */}
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        isPremium ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isPremium ? <CreditCard size={10} /> : <Gift size={10} />}
                        {isPremium ? 'Premium' : 'Free'}
                      </span>
                      {plan.discountLabel && (
                        <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                          🔥 {plan.discountLabel}
                        </span>
                      )}
                    </div>

                    {/* Title and price/tag */}
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{plan.titleEn || plan.title}</p>
                        {plan.titleTe && <p className="text-xs text-gray-500 truncate">{plan.titleTe}</p>}
                        {isPremium && plan.durationWeeks && (
                          <p className="text-xs text-gray-500">{plan.durationWeeks}-week · {LANG_LABEL[plan.language] ?? plan.language}</p>
                        )}
                        {!isPremium && plan.tagEn && (
                          <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                            {plan.tagEn}
                          </span>
                        )}
                      </div>
                      {isPremium && plan.price !== undefined && (
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#D97706]">{plan.currency}{plan.price}</div>
                          {plan.originalPrice && plan.originalPrice > plan.price && (
                            <div className="text-xs text-gray-400 line-through">{plan.currency}{plan.originalPrice}</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {(plan.descEn || plan.description) && <p className="mb-3 text-xs text-gray-600 line-clamp-2">{plan.descEn || plan.description}</p>}

                    {/* Features/Highlights */}
                    {isPremium && plan.features && plan.features.length > 0 && (
                      <ul className="mb-3 space-y-1">
                        {plan.features.slice(0, 3).map((f: string, i: number) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                            <span className="text-emerald-500">✓</span>{f}
                          </li>
                        ))}
                      </ul>
                    )}

                    {!isPremium && (
                      <div className="mb-3 flex items-center gap-2 text-xs">
                        {plan.pdfUrl ? (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <FileText size={12} /> PDF uploaded
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600">
                            <FileText size={12} /> No PDF
                          </span>
                        )}
                        {plan.order !== undefined && <span className="text-gray-400">· Order: {plan.order}</span>}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <button type="button" onClick={() => handleToggleActive(plan)}
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition ${
                          plan.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <div className="flex gap-3 text-xs">
                        <Link 
                          href={isPremium ? `/admin/plans/${plan._id}/edit` : `/admin/free-plans/${plan._id}/edit`} 
                          className="text-[#1A5C38] hover:underline">
                          Edit
                        </Link>
                        <button type="button" disabled={deleting === plan._id} onClick={() => handleDelete(plan._id, plan.titleEn || plan.title, plan.planType)}
                          className="text-red-500 hover:text-red-700 disabled:opacity-40">
                          {deleting === plan._id ? '...' : 'Delete'}
                        </button>
                      </div>
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
