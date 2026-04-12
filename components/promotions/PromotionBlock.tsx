'use client'

import React, { useEffect, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'

type Promo = {
  _id: string
  title: string
  type: 'image' | 'video' | 'link'
  placement: string
  imageUrl?: string
  youtubeUrl?: string
  youtubeId?: string
  thumbnailUrl?: string
  linkUrl?: string
  linkLabel?: string
  description?: string
}

async function trackClick(id: string) {
  await fetch(`/api/promotions/${id}/click`, { method: 'POST' }).catch(() => {})
}

// ── Single promo card renderer ──────────────────────────────────────────────
function PromoCard({ promo, compact = false }: { promo: Promo; compact?: boolean }) {
  const handleClick = () => trackClick(promo._id)

  if (promo.type === 'image' && promo.imageUrl) {
    const img = (
      <img src={promo.imageUrl} alt={promo.title}
        className="w-full rounded-xl object-cover transition hover:opacity-95"
        style={{ maxHeight: compact ? 120 : 280 }} />
    )
    return promo.linkUrl ? (
      <a href={promo.linkUrl} target="_blank" rel="noreferrer sponsored" onClick={handleClick}
        className="block overflow-hidden rounded-xl">
        {img}
        <p className="mt-1 text-center text-[10px] text-gray-400">Sponsored</p>
      </a>
    ) : <div className="overflow-hidden rounded-xl">{img}<p className="mt-1 text-center text-[10px] text-gray-400">Sponsored</p></div>
  }

  if (promo.type === 'video' && promo.youtubeId) {
    return (
      <div className="overflow-hidden rounded-xl">
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${promo.youtubeId}?rel=0`}
            title={promo.title}
            className="h-full w-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {promo.title && <p className="mt-1.5 text-xs font-medium text-gray-700 dark:text-slate-300">{promo.title}</p>}
        <p className="text-[10px] text-gray-400">Sponsored</p>
      </div>
    )
  }

  if (promo.type === 'link') {
    return (
      <a href={promo.linkUrl} target="_blank" rel="noreferrer sponsored" onClick={handleClick}
        className="group flex gap-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        {promo.imageUrl && (
          <img src={promo.imageUrl} alt={promo.title}
            className="h-16 w-16 shrink-0 rounded-lg object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">Sponsored</p>
          <p className="line-clamp-2 text-[13px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100">{promo.title}</p>
          {promo.description && <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-500 dark:text-slate-400">{promo.description}</p>}
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#1A5C38] px-2.5 py-1 text-[11px] font-semibold text-white">
            {promo.linkLabel || 'Learn More'} <ExternalLink size={10} />
          </span>
        </div>
      </a>
    )
  }

  return null
}

// ── Popup promo ──────────────────────────────────────────────────────────────
function PopupPromo({ promos }: { promos: Promo[] }) {
  const [visible, setVisible] = useState(false)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('promo-popup-dismissed')
    if (!dismissed && promos.length > 0) {
      const t = setTimeout(() => setVisible(true), 5000) // show after 5s
      return () => clearTimeout(t)
    }
  }, [promos])

  if (!visible || promos.length === 0) return null
  const promo = promos[idx]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900">
        <button type="button" onClick={() => { setVisible(false); sessionStorage.setItem('promo-popup-dismissed', '1') }}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-400">
          <X size={14} />
        </button>
        <PromoCard promo={promo} />
        {promos.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {promos.map((_, i) => (
              <button key={i} type="button" onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-[#1A5C38]' : 'w-1.5 bg-gray-300'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Home banner (full-width strip) ──────────────────────────────────────────
function HomeBanner({ promos }: { promos: Promo[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (promos.length <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % promos.length), 5000)
    return () => clearInterval(t)
  }, [promos])

  if (promos.length === 0) return null
  const promo = promos[idx]

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800">
      {promo.type === 'image' && promo.imageUrl && (
        <a href={promo.linkUrl || '#'} target={promo.linkUrl ? '_blank' : '_self'} rel="noreferrer sponsored"
          onClick={() => trackClick(promo._id)}>
          <img src={promo.imageUrl} alt={promo.title} className="w-full object-cover" style={{ maxHeight: 200 }} />
        </a>
      )}
      {promo.type === 'link' && (
        <a href={promo.linkUrl} target="_blank" rel="noreferrer sponsored" onClick={() => trackClick(promo._id)}
          className="flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">Sponsored</p>
            <p className="text-base font-bold">{promo.title}</p>
            {promo.description && <p className="text-sm opacity-90">{promo.description}</p>}
          </div>
          <span className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-amber-600">
            {promo.linkLabel || 'Learn More'} →
          </span>
        </a>
      )}
      {promos.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {promos.map((_, i) => (
            <button key={i} type="button" onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
      )}
      <p className="absolute right-2 top-2 rounded bg-black/30 px-1.5 py-0.5 text-[9px] text-white">Ad</p>
    </div>
  )
}

// ── Main exported component ──────────────────────────────────────────────────
export type PromoPlacement =
  | 'home-banner'
  | 'sidebar'
  | 'blog-inline'
  | 'recipe-inline'
  | 'videos-page'
  | 'diet-plans'
  | 'shop'
  | 'about'
  | 'popup'

export default function PromotionBlock({
  placement,
  language = 'en',
  compact = false,
}: {
  placement: PromoPlacement
  language?: string
  compact?: boolean
}) {
  const [promos, setPromos] = useState<Promo[]>([])

  useEffect(() => {
    fetch(`/api/promotions?placement=${placement}&lang=${language}`)
      .then((r) => r.json())
      .then((data) => setPromos(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [placement, language])

  if (promos.length === 0) return null

  if (placement === 'popup') return <PopupPromo promos={promos} />
  if (placement === 'home-banner') return <HomeBanner promos={promos} />

  // All inline / sidebar / page-level placements render as cards
  return (
    <div className="space-y-3">
      {promos.map((promo) => (
        <PromoCard key={promo._id} promo={promo} compact={compact} />
      ))}
    </div>
  )
}
