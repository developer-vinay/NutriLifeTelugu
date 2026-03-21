'use client'

import React, { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

type Props = {
  contentType: 'recipe' | 'post'
  contentId: string
}

// Simple fingerprint stored in localStorage
function getFingerprint(): string {
  if (typeof window === 'undefined') return 'anon'
  let fp = localStorage.getItem('nlm_fp')
  if (!fp) {
    fp = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('nlm_fp', fp)
  }
  return fp
}

export default function StarRating({ contentType, contentId }: Props) {
  const [avg, setAvg] = useState(0)
  const [count, setCount] = useState(0)
  const [hover, setHover] = useState(0)
  const [selected, setSelected] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/ratings?contentType=${contentType}&contentId=${contentId}`)
      .then((r) => r.json())
      .then((d) => { setAvg(d.avg ?? 0); setCount(d.count ?? 0) })
      .catch(() => {})
  }, [contentType, contentId])

  async function handleRate(stars: number) {
    if (submitting) return
    setSelected(stars)
    setSubmitting(true)
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId, stars, userIdentifier: getFingerprint() }),
      })
      const d = await res.json()
      setAvg(d.avg ?? stars)
      setCount(d.count ?? 1)
    } catch {
      setSelected(0)
    } finally {
      setSubmitting(false)
    }
  }

  // display: hover > selected > avg
  const display = hover || selected || avg

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            disabled={submitting}
            onClick={() => handleRate(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110 disabled:opacity-60"
            aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
          >
            <Star
              size={20}
              className={
                s <= display
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-300 dark:fill-slate-700 dark:text-slate-600'
              }
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-slate-400">
        {avg > 0 ? `${avg.toFixed(1)} (${count})` : 'Rate this'}
      </span>
      {selected > 0 && (
        <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ Rated</span>
      )}
    </div>
  )
}
