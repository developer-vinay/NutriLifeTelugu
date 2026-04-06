'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Plan = {
  _id?: string
  title: string
  description: string
  price: number
  originalPrice?: number
  discountLabel: string
  currency: string
  durationWeeks: number
  features: string[]
  isActive: boolean
  isFeatured: boolean
  language: 'en' | 'te' | 'hi'
  fileUrl: string
}

const empty: Plan = {
  title: '', description: '', price: 299, originalPrice: undefined,
  discountLabel: '', currency: '₹', durationWeeks: 4,
  features: [''], isActive: true, isFeatured: false, language: 'en', fileUrl: '',
}

const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]'

export default function PlanForm({ initial }: { initial?: Partial<Plan> }) {
  const router = useRouter()
  const [form, setForm] = useState<Plan>({ ...empty, ...initial })
  const [saving, setSaving] = useState(false)

  function set(key: keyof Plan, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function setFeature(i: number, val: string) {
    const arr = [...form.features]
    arr[i] = val
    set('features', arr)
  }

  // Auto-compute discount % label when both prices are set
  const autoDiscount = form.originalPrice && form.originalPrice > form.price
    ? Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      features: form.features.filter(Boolean),
      originalPrice: form.originalPrice || null,
      discountLabel: form.discountLabel || (autoDiscount ? `${autoDiscount}% OFF` : ''),
    }
    const url = form._id ? `/api/admin/plans/${form._id}` : '/api/admin/plans'
    const method = form._id ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    router.push('/admin/plans')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
      <h1 className="text-xl font-bold text-gray-900">{form._id ? 'Edit Plan' : 'New Premium Plan'}</h1>

      {/* Language */}
      <div className="rounded-xl border-2 border-[#1A5C38]/20 bg-emerald-50/50 p-4">
        <label className="mb-2 block text-sm font-semibold text-gray-800">Language</label>
        <div className="flex gap-3">
          {(['en', 'te', 'hi'] as const).map((l) => (
            <button key={l} type="button" onClick={() => set('language', l)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                form.language === l ? 'bg-[#1A5C38] text-white shadow-sm' : 'border border-gray-300 bg-white text-gray-700 hover:border-[#1A5C38]'
              }`}>
              {l === 'en' ? '🇬🇧 English' : l === 'te' ? '🇮🇳 తెలుగు' : '🇮🇳 हिंदी'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">Title *</label>
        <input required value={form.title} onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. 4-Week Weight Loss Plan" className={inputCls} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)}
          placeholder="Short description..." className={inputCls} />
      </div>

      {/* Pricing with discount */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pricing & Discount</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Sale Price (₹) *</label>
            <input type="number" required value={form.price} onChange={(e) => set('price', Number(e.target.value))}
              className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Original Price (₹) — for strikethrough</label>
            <input type="number" value={form.originalPrice ?? ''} onChange={(e) => set('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g. 999" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Discount Label
            {autoDiscount && <span className="ml-2 text-emerald-600">(auto: {autoDiscount}% OFF)</span>}
          </label>
          <input value={form.discountLabel} onChange={(e) => set('discountLabel', e.target.value)}
            placeholder={autoDiscount ? `${autoDiscount}% OFF (auto-filled if blank)` : 'e.g. 50% OFF or LIMITED OFFER'}
            className={inputCls} />
          <p className="mt-1 text-[11px] text-gray-400">Leave blank to auto-calculate from prices above.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Duration (weeks)</label>
          <input type="number" value={form.durationWeeks} onChange={(e) => set('durationWeeks', Number(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Currency symbol</label>
          <input value={form.currency} onChange={(e) => set('currency', e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-gray-700">Features</label>
        {form.features.map((f, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <input value={f} onChange={(e) => setFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} className={inputCls} />
            {form.features.length > 1 && (
              <button type="button" onClick={() => set('features', form.features.filter((_, j) => j !== i))}
                className="text-sm text-red-500 hover:text-red-700">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => set('features', [...form.features, ''])}
          className="text-xs text-[#1A5C38] hover:underline">+ Add feature</button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">PDF / File URL (optional)</label>
        <input value={form.fileUrl} onChange={(e) => set('fileUrl', e.target.value)}
          placeholder="https://..." className={inputCls} />
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)}
            className="h-4 w-4 accent-[#1A5C38]" />
          Active (visible to users)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)}
            className="h-4 w-4 accent-[#1A5C38]" />
          Featured (highlight this plan)
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="rounded-lg bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Plan'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}
