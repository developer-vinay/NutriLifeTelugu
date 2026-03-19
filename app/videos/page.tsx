'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import LikeSaveButtons from '@/components/ui/LikeSaveButtons'

type DBVideo = {
  _id: string
  title: string
  slug: string
  description?: string
  youtubeUrl: string
  thumbnailUrl?: string
  category?: string
  tag?: string
  durationSeconds?: number
  isFeatured: boolean
  likes?: number
}

const UI = {
  te: {
    heading: 'వీడియోలు',
    sub: 'తెలుగు హెల్త్ టిప్స్ & వంటకాలు — వీడియోల రూపంలో.',
    empty: 'వీడియోలు త్వరలో వస్తాయి.',
    watch: 'YouTube లో చూడండి →',
    ytBanner: 'రోజూ కొత్త వీడియోలు',
    ytSub: 'YouTube లో NutriLife Telugu ను ఫాలో అవ్వండి.',
    subscribe: 'Subscribe on YouTube →',
  },
  en: {
    heading: 'Videos',
    sub: 'Telugu health tips & recipes — in video format.',
    empty: 'Videos coming soon.',
    watch: 'Watch on YouTube →',
    ytBanner: 'New videos every day',
    ytSub: 'Follow NutriLife Telugu on YouTube.',
    subscribe: 'Subscribe on YouTube →',
  },
}

export default function VideosPage() {
  const { language } = useLanguage()
  const t = UI[language] ?? UI.en

  const [videos, setVideos] = useState<DBVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/videos?lang=${language}&limit=30`)
      .then((r) => r.json())
      .then((data) => { setVideos(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [language])

  return (
    <div className="bg-white dark:bg-slate-900">
      <section className="mt-16 bg-[#1A5C38]">
        <div className="mx-auto max-w-6xl px-4 py-10 text-white">
          <h1 className="font-nunito text-3xl font-bold">{t.heading}</h1>
          <p className="mt-1 text-sm text-emerald-100">{t.sub}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">{t.empty}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <a
                key={v._id}
                href={v.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
              >
                <div className="relative flex aspect-video items-center justify-center bg-gray-900 text-white">
                  {v.thumbnailUrl ? (
                    <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl">▶</span>
                  )}
                  {v.durationSeconds && (
                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[11px]">
                      {Math.floor(v.durationSeconds / 60)}:{String(v.durationSeconds % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  {v.category && (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#1A5C38] capitalize dark:bg-emerald-900/30 dark:text-emerald-400">
                      {v.category.replace('-', ' ')}
                    </span>
                  )}
                  <p className="mt-2 line-clamp-2 font-nunito text-base font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-50 dark:group-hover:text-emerald-400">
                    {v.title}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#1A5C38] dark:text-emerald-400">{t.watch}</p>
                  <div className="mt-2" onClick={(e) => e.preventDefault()}>
                    <LikeSaveButtons contentId={v._id} contentType="video" initialLikes={v.likes ?? 0} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-900/20">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="font-nunito text-xl font-bold text-[#1A5C38] dark:text-emerald-400">{t.ytBanner}</p>
              <p className="text-sm text-gray-700 dark:text-slate-300">{t.ytSub}</p>
            </div>
            <Link
              href="https://youtube.com"
              target="_blank"
              className="rounded-full bg-[#D97706] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {t.subscribe}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
