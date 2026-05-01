'use client'

import React, { useState } from 'react'
import { Upload, FileText, X, CreditCard, Gift, Sparkles } from 'lucide-react'

type PlanType = 'free' | 'premium'

type DietPlanFormProps = {
  initialData?: any
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}

const GRADIENTS = [
  { label: 'Orange → Red', value: 'from-orange-500 to-red-500' },
  { label: 'Blue → Cyan', value: 'from-blue-500 to-cyan-500' },
  { label: 'Yellow → Amber', value: 'from-yellow-500 to-amber-500' },
  { label: 'Emerald → Teal', value: 'from-emerald-500 to-teal-500' },
  { label: 'Pink → Rose', value: 'from-pink-500 to-rose-500' },
  { label: 'Purple → Violet', value: 'from-purple-500 to-violet-500' },
]

const ICONS = [
  { label: '🔥 Flame (Weight Loss)', value: 'Flame' },
  { label: '⚡ Activity (Diabetes)', value: 'Activity' },
  { label: '🌾 Wheat (Millets)', value: 'Wheat' },
  { label: '🍃 Leaf (Gut Health)', value: 'Leaf' },
  { label: '❤️ Heart (Thyroid)', value: 'Heart' },
  { label: '👶 Baby (Kids)', value: 'Baby' },
]

const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20 transition'
const labelCls = 'mb-2 block text-sm font-semibold text-gray-700'

export default function DietPlanForm({ initialData, onSave, onCancel }: DietPlanFormProps) {
  // Determine if editing or creating, and plan type
  const isEditing = !!initialData?._id
  
  // Determine plan type more reliably
  const determinePlanType = (): PlanType => {
    if (initialData?.planType) return initialData.planType
    if (initialData?.price !== undefined && initialData?.price > 0) return 'premium'
    if (initialData?.pdfUrl) return 'free'
    return 'free' // default for new plans
  }
  
  const [planType, setPlanType] = useState<PlanType>(determinePlanType())

  // Language selection - must be set first
  const [language, setLanguage] = useState(initialData?.language || 'en')

  // Common fields
  const [titleEn, setTitleEn] = useState(initialData?.titleEn || initialData?.title || '')
  const [titleTe, setTitleTe] = useState(initialData?.titleTe || '')
  const [titleHi, setTitleHi] = useState(initialData?.titleHi || '')
  const [descEn, setDescEn] = useState(initialData?.descEn || initialData?.description || '')
  const [descTe, setDescTe] = useState(initialData?.descTe || '')
  const [descHi, setDescHi] = useState(initialData?.descHi || '')
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)

  // Premium fields
  const [price, setPrice] = useState(initialData?.price || 0)
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice || 0)
  const [discountLabel, setDiscountLabel] = useState(initialData?.discountLabel || '')
  const [currency, setCurrency] = useState(initialData?.currency || '₹')
  const [durationWeeks, setDurationWeeks] = useState(initialData?.durationWeeks || 4)
  const [features, setFeatures] = useState(initialData?.features?.join('\n') || '')
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false)

  // Free fields
  const [tagEn, setTagEn] = useState(initialData?.tagEn || '')
  const [tagTe, setTagTe] = useState(initialData?.tagTe || '')
  const [tagHi, setTagHi] = useState(initialData?.tagHi || '')
  const [highlightsEn, setHighlightsEn] = useState(initialData?.highlightsEn?.join(', ') || '')
  const [highlightsTe, setHighlightsTe] = useState(initialData?.highlightsTe?.join(', ') || '')
  const [highlightsHi, setHighlightsHi] = useState(initialData?.highlightsHi?.join(', ') || '')
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || '')
  const [iconName, setIconName] = useState(initialData?.iconName || 'Leaf')
  const [gradient, setGradient] = useState(initialData?.gradient || 'from-emerald-500 to-teal-500')
  const [order, setOrder] = useState(initialData?.order || 0)

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handlePdfUpload(file: File) {
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'free-plans')
      formData.append('resource_type', 'raw')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setPdfUrl(data.url)
    } catch (e: any) {
      setError(e.message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Get the title for the selected language
    const currentTitle = language === 'en' ? titleEn : language === 'te' ? titleTe : titleHi
    
    if (!currentTitle.trim()) {
      setError(`Title is required for ${language === 'en' ? 'English' : language === 'te' ? 'Telugu' : 'Hindi'}`)
      return
    }

    if (planType === 'premium' && !price) {
      setError('Price is required for premium plans')
      return
    }

    if (planType === 'free' && !pdfUrl) {
      setError('PDF file is required for free plans')
      return
    }

    setSaving(true)
    setError('')

    try {
      const data: any = {
        // Set all language fields, but primary one is required
        titleEn: language === 'en' ? titleEn : (titleEn || currentTitle),
        titleTe: language === 'te' ? titleTe : (titleTe || ''),
        titleHi: language === 'hi' ? titleHi : (titleHi || ''),
        descEn: language === 'en' ? descEn : (descEn || ''),
        descTe: language === 'te' ? descTe : (descTe || ''),
        descHi: language === 'hi' ? descHi : (descHi || ''),
        isActive,
        language,
        planType, // Include plan type so the parent knows which API to use
      }

      if (planType === 'premium') {
        // Premium plan data
        data.title = currentTitle
        data.description = language === 'en' ? descEn : language === 'te' ? descTe : descHi
        data.price = Number(price)
        data.originalPrice = originalPrice ? Number(originalPrice) : null
        data.discountLabel = discountLabel
        data.currency = currency
        data.durationWeeks = Number(durationWeeks)
        data.features = features.split('\n').map((f: string) => f.trim()).filter(Boolean)
        data.isFeatured = isFeatured
      } else {
        // Free plan data
        data.tagEn = language === 'en' ? tagEn : (tagEn || '')
        data.tagTe = language === 'te' ? tagTe : (tagTe || '')
        data.tagHi = language === 'hi' ? tagHi : (tagHi || '')
        data.highlightsEn = language === 'en' ? highlightsEn.split(',').map((s: string) => s.trim()).filter(Boolean) : []
        data.highlightsTe = language === 'te' ? highlightsTe.split(',').map((s: string) => s.trim()).filter(Boolean) : []
        data.highlightsHi = language === 'hi' ? highlightsHi.split(',').map((s: string) => s.trim()).filter(Boolean) : []
        data.pdfUrl = pdfUrl
        data.iconName = iconName
        data.gradient = gradient
        data.order = Number(order)
      }

      await onSave(data)
    } catch (e: any) {
      setError(e.message ?? 'Failed to save')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          {error}
        </div>
      )}

      {/* Plan Type Selection - Only for new plans */}
      {!isEditing && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
          <label className={labelCls}>Plan Type *</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPlanType('free')}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition ${
                planType === 'free'
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Gift size={32} className={planType === 'free' ? 'text-emerald-600' : 'text-gray-400'} />
              <div className="text-center">
                <p className="font-semibold text-gray-900">Free Plan</p>
                <p className="mt-1 text-xs text-gray-500">PDF download via email</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPlanType('premium')}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition ${
                planType === 'premium'
                  ? 'border-amber-500 bg-amber-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <CreditCard size={32} className={planType === 'premium' ? 'text-amber-600' : 'text-gray-400'} />
              <div className="text-center">
                <p className="font-semibold text-gray-900">Premium Plan</p>
                <p className="mt-1 text-xs text-gray-500">Paid plan with features</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Language Selection - First Step */}
      <div className="rounded-xl border-2 border-[#1A5C38] bg-emerald-50/50 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 mb-3">
          <Sparkles size={16} className="text-[#1A5C38]" />
          Select Language (Step 1)
        </div>
        <p className="text-xs text-gray-600 mb-4">Choose the language for your PDF content. You'll only need to fill fields for this language.</p>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${
              language === 'en'
                ? 'border-[#1A5C38] bg-white shadow-sm ring-2 ring-[#1A5C38]/20'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">🇬🇧</span>
            <span className={`text-sm font-semibold ${language === 'en' ? 'text-[#1A5C38]' : 'text-gray-600'}`}>
              English
            </span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('te')}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${
              language === 'te'
                ? 'border-[#1A5C38] bg-white shadow-sm ring-2 ring-[#1A5C38]/20'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">🇮🇳</span>
            <span className={`text-sm font-semibold ${language === 'te' ? 'text-[#1A5C38]' : 'text-gray-600'}`}>
              తెలుగు
            </span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${
              language === 'hi'
                ? 'border-[#1A5C38] bg-white shadow-sm ring-2 ring-[#1A5C38]/20'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">🇮🇳</span>
            <span className={`text-sm font-semibold ${language === 'hi' ? 'text-[#1A5C38]' : 'text-gray-600'}`}>
              हिंदी
            </span>
          </button>
        </div>
      </div>

      {/* Common Fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Sparkles size={16} className="text-[#1A5C38]" />
          Basic Information ({language === 'en' ? 'English' : language === 'te' ? 'Telugu' : 'Hindi'})
        </div>

        <div>
          <label className={labelCls}>
            Title * 
            <span className="ml-2 text-xs font-normal text-gray-500">
              ({language === 'en' ? 'English' : language === 'te' ? 'Telugu' : 'Hindi'})
            </span>
          </label>
          <input
            value={language === 'en' ? titleEn : language === 'te' ? titleTe : titleHi}
            onChange={e => {
              if (language === 'en') setTitleEn(e.target.value)
              else if (language === 'te') setTitleTe(e.target.value)
              else setTitleHi(e.target.value)
            }}
            placeholder={
              language === 'en' ? '7-Day Weight Loss Plan' :
              language === 'te' ? '7-రోజుల వెయిట్ లాస్ ప్లాన్' :
              '7-दिन वजन घटाने का प्लान'
            }
            className={inputCls}
            required
          />
        </div>

        <div>
          <label className={labelCls}>
            Description
            <span className="ml-2 text-xs font-normal text-gray-500">
              ({language === 'en' ? 'English' : language === 'te' ? 'Telugu' : 'Hindi'})
            </span>
          </label>
          <textarea
            value={language === 'en' ? descEn : language === 'te' ? descTe : descHi}
            onChange={e => {
              if (language === 'en') setDescEn(e.target.value)
              else if (language === 'te') setDescTe(e.target.value)
              else setDescHi(e.target.value)
            }}
            rows={3}
            placeholder={
              language === 'en' ? 'Describe your diet plan...' :
              language === 'te' ? 'మీ డైట్ ప్లాన్ గురించి వివరించండి...' :
              'अपने डाइट प्लान का वर्णन करें...'
            }
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Status</label>
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
            <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
            <div
              className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-[#1A5C38]' : 'bg-gray-300'}`}
              onClick={() => setIsActive((p: boolean) => !p)}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isActive ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>
        </div>
      </div>

      {/* Premium-specific fields */}
      {planType === 'premium' && (
        <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <CreditCard size={16} />
            Premium Plan Details
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Price *</label>
              <div className="flex gap-2">
                <select value={currency} onChange={e => setCurrency(e.target.value)} className={`${inputCls} w-20`}>
                  <option value="₹">₹</option>
                  <option value="$">$</option>
                  <option value="€">€</option>
                </select>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  placeholder="499"
                  className={inputCls}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Original Price (optional)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={e => setOriginalPrice(Number(e.target.value))}
                placeholder="999"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Duration (weeks)</label>
              <input
                type="number"
                value={durationWeeks}
                onChange={e => setDurationWeeks(Number(e.target.value))}
                placeholder="4"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Discount Label (optional)</label>
            <input
              value={discountLabel}
              onChange={e => setDiscountLabel(e.target.value)}
              placeholder="50% OFF"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Features (one per line)</label>
            <textarea
              value={features}
              onChange={e => setFeatures(e.target.value)}
              rows={5}
              placeholder="Personalized meal plan&#10;Weekly grocery list&#10;WhatsApp support&#10;Recipe videos"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-gray-500">Enter each feature on a new line</p>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">Featured Plan</p>
              <p className="text-xs text-gray-500">Show as highlighted/recommended</p>
            </div>
            <div
              className={`relative h-6 w-11 rounded-full transition-colors ${isFeatured ? 'bg-[#1A5C38]' : 'bg-gray-300'}`}
              onClick={() => setIsFeatured((p: boolean) => !p)}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isFeatured ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>
        </div>
      )}

      {/* Free-specific fields */}
      {planType === 'free' && (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <Gift size={16} />
            Free Plan Details ({language === 'en' ? 'English' : language === 'te' ? 'Telugu' : 'Hindi'})
          </div>

          <div>
            <label className={labelCls}>
              Category Tag
              <span className="ml-2 text-xs font-normal text-gray-500">
                ({language === 'en' ? 'English' : language === 'te' ? 'Telugu' : 'Hindi'})
              </span>
            </label>
            <input
              value={language === 'en' ? tagEn : language === 'te' ? tagTe : tagHi}
              onChange={e => {
                if (language === 'en') setTagEn(e.target.value)
                else if (language === 'te') setTagTe(e.target.value)
                else setTagHi(e.target.value)
              }}
              placeholder={
                language === 'en' ? 'Weight Loss' :
                language === 'te' ? 'వెయిట్ లాస్' :
                'वजन घटाना'
              }
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>
              Highlights - comma separated
              <span className="ml-2 text-xs font-normal text-gray-500">
                ({language === 'en' ? 'English' : language === 'te' ? 'Telugu' : 'Hindi'})
              </span>
            </label>
            <input
              value={language === 'en' ? highlightsEn : language === 'te' ? highlightsTe : highlightsHi}
              onChange={e => {
                if (language === 'en') setHighlightsEn(e.target.value)
                else if (language === 'te') setHighlightsTe(e.target.value)
                else setHighlightsHi(e.target.value)
              }}
              placeholder={
                language === 'en' ? 'Full 7-day menu, Shopping list included, Printable PDF' :
                language === 'te' ? '7 రోజుల పూర్తి మెనూ, షాపింగ్ లిస్ట్' :
                'पूरा 7-दिन का मेनू, शॉपिंग लिस्ट'
              }
              className={inputCls}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Icon</label>
              <select value={iconName} onChange={e => setIconName(e.target.value)} className={inputCls}>
                {ICONS.map(icon => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Display Order</label>
              <input
                type="number"
                value={order}
                onChange={e => setOrder(Number(e.target.value))}
                placeholder="0"
                className={inputCls}
              />
              <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
            </div>
          </div>

          <div>
            <label className={labelCls}>Card Color Gradient</label>
            <div className="grid grid-cols-3 gap-3">
              {GRADIENTS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGradient(g.value)}
                  className={`rounded-xl p-3 transition ${
                    gradient === g.value ? 'ring-2 ring-offset-2 ring-[#1A5C38]' : 'hover:scale-105'
                  }`}
                >
                  <div className={`h-12 w-full rounded-lg bg-gradient-to-r ${g.value}`} />
                  <p className="mt-2 text-xs font-medium text-gray-600">{g.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>PDF File</label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 transition hover:border-[#1A5C38] hover:bg-emerald-50/30">
              <Upload size={20} className="shrink-0 text-gray-400" />
              <div className="min-w-0 flex-1">
                {uploading ? (
                  <p className="text-sm text-gray-500">Uploading...</p>
                ) : pdfUrl ? (
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-emerald-600" />
                    <p className="truncate text-sm font-medium text-emerald-700">PDF uploaded ✓</p>
                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault()
                        setPdfUrl('')
                      }}
                      className="ml-auto text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Click to upload PDF (max 10MB)</p>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={async e => {
                  const f = e.target.files?.[0]
                  if (f) await handlePdfUpload(f)
                }}
              />
            </label>
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block truncate text-xs text-blue-500 hover:underline"
              >
                {pdfUrl}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 border-t pt-6">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-[#1A5C38] py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : isEditing ? '✓ Update Plan' : '+ Create Plan'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
