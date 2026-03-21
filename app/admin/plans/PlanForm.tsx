'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Plan = {
  _id?: string
  title: string
  description: string
  price: number
  currency: string
  durationWeeks: number
  features: string[]
  isActive: boolean
  language: 'en' | 'te'
  fileUrl: string
}

const empty: Plan = {
  title: '', description: '', price: 299, currency: '₹',
  durationWeeks: 4, features: [''], isActive: true, language: 'en', fileUrl: '',
}

export default function PlanForm({ initial }: { initial?: Partial<Plan> }) {
  const router = useRouter()
  const [form, setForm] = useState<Plan>({ ...empty, ...initial })
  const [saving, setSaving] = useState(false)

  function set(key: keyof Plan, val: unknown) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function setFeature(i: number, val: string) {
    const arr = [...form.features]
    arr[i] = val
    set('features', arr)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, features: form.features.filter(Boolean) }
    const url = form._id ? `/api/admin/plans/${form._id}` : '/api/admin/plans'
    const method = form._id ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    router.push('/admin/plans')
    router.refresh()
  }

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]'

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
      <h1 className="text-xl font-bold text-gray-900">{form._id ? 'Edit Plan' : 'New Premium Plan'}</h1>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">Title *</label>
        <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. 4-Week Weight Loss Plan" className={inputCls} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
        <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description..." className={inputCls} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Price</label>
          <input type="number" required value={form.price} onChange={e => set('price', Number(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Duration (weeks)</label>
          <input type="number" value={form.durationWeeks} onChange={e => set('durationWeeks', Number(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Language</label>
          <select value={form.language} onChange={e => set('language', e.target.value)} className={inputCls}>
            <option value="en">English</option>
            <option value="te">Telugu</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">Features (one per line)</label>
        {form.features.map((f, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <input value={f} onChange={e => setFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} className={inputCls} />
            {form.features.length > 1 && (
              <button type="button" onClick={() => set('features', form.features.filter((_, j) => j !== i))} className="text-red-500 text-sm">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => set('features', [...form.features, ''])} className="text-xs text-[#1A5C38] hover:underline">+ Add feature</button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">PDF / File URL (optional)</label>
        <input value={form.fileUrl} onChange={e => set('fileUrl', e.target.value)} placeholder="https://..." className={inputCls} />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="h-4 w-4 accent-[#1A5C38]" />
        <label htmlFor="isActive" className="text-sm text-gray-700">Active (visible to users)</label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Plan'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}
