'use client'

import Link from 'next/link'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import LikeSaveButtons from '@/components/ui/LikeSaveButtons'
import { Play, Clock, Youtube, Search, X } from 'lucide-react'
import PromotionBlock from '@/components/promotions/PromotionBlock'

type DBVideo = {
  _id: string
  title: string
  slug: string
  description?: string
  youtubeUrl: string
  youtubeId: string
  thumbnailUrl?: string
  category?: string
  tag?: string
  durationSeconds?: number
  isFeatured: boolean
  likes?: number
  views?: number
}

const VIDEO_CATS = ['All', 'cooking', 'health-education', 'weight-loss', 'diabetes', 'shorts'] as const

const UI = {
  te: {
    heading: 'వీడియోలు',
    sub: 'తెలుగు హెల్త్ టిప్స్ & వంటకాలు — వీడియోల రూపంలో.',
    empty: 'వీడియోలు త్వరలో వస్తాయి.',
    watch: 'YouTube లో చూడండి',
    featured: 'ప్రత్యేక వీడియో',
    ytBanner: 'రోజూ కొత్త వీడియోలు',
    ytSub: 'YouTube లో NutriLifeMitra ను ఫాలో అవ్వండి.',
    subscribe: 'Subscribe చేయండి →',
    views: 'వ్యూస్',
    catLabels: { All: 'అన్నీ', cooking: 'వంటకాలు', 'health-education': 'హెల్త్', 'weight-loss': 'వెయిట్ లాస్', diabetes: 'డయాబెటిస్', shorts: 'షార్ట్స్' },
  },
  hi: {
    heading: 'वीडियो',
    sub: 'हिंदी स्वास्थ्य टिप्स और रेसिपी — वीडियो फॉर्मेट में।',
    empty: 'वीडियो जल्द आ रहे हैं।',
    watch: 'YouTube पर देखें',
    featured: 'विशेष वीडियो',
    ytBanner: 'हर हफ्ते नए वीडियो',
    ytSub: 'NutriLifeMitra को YouTube पर सब्सक्राइब करें।',
    subscribe: 'Subscribe करें →',
    views: 'व्यूज',
    catLabels: { All: 'सभी', cooking: 'रेसिपी', 'health-education': 'स्वास्थ्य', 'weight-loss': 'वजन घटाना', diabetes: 'मधुमेह', shorts: 'शॉर्ट्स' },
  },
  en: {
    heading: 'Videos',
    sub: 'Telugu health tips & recipes — in video format.',
    empty: 'Videos coming soon.',
    watch: 'Watch on YouTube',
    featured: 'Featured Video',
    ytBanner: 'New videos every week',
    ytSub: 'Subscribe to NutriLifeMitra on YouTube for daily health tips.',
    subscribe: 'Subscribe on YouTube →',
    views: 'views',
    catLabels: { All: 'All', cooking: 'Cooking', 'health-education': 'Health', 'weight-loss': 'Weight Loss', diabetes: 'Diabetes', shorts: 'Shorts' },
  },
}

function fmtDuration(s: number) {
  const m = Math.floor(s / 60)
  const sec = String(s % 60).padStart(2, '0')
  return `${m}:${sec}`
}

export default function VideosPage() {
  const { language } = useLanguage()
  const t = UI[language] ?? UI.en

  const [videos, setVideos] = useState<DBVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [searchInput, setSearchInput] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  // Debounce: filter 300ms after user stops typing
  const [search, setSearch] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setLoading(true)
    setActiveTab('All')
    setSearchInput('')
    setSearch('')
    fetch(`/api/videos?lang=${language}&limit=40`)
      .then((r) => r.json())
      .then((data) => { setVideos(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [language])

  const featured = videos.find((v) => v.isFeatured) ?? videos[0]

  const filtered = useMemo(() => {
    let items = activeTab === 'All' ? videos : videos.filter((v) => v.category === activeTab)
    const q = search.trim().toLowerCase()
    if (q) {
      items = items.filter((v) =>
        v.title.toLowerCase().includes(q) ||
        (v.tag ?? '').toLowerCase().includes(q) ||
        (v.description ?? '').toLowerCase().includes(q) ||
        (v.category ?? '').toLowerCase().includes(q)
      )
    }
    return items
  }, [videos, activeTab, search])

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero banner */}
      <section className="bg-gradient-to-br from-[#1A5C38] to-emerald-700 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                <Youtube size={13} /> NutriLifeMitra
              </span>
              <h1 className="font-nunito text-4xl font-bold text-white">{t.heading}</h1>
              <p className="mt-2 text-sm text-emerald-100">{t.sub}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search bar */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" />
                <input
                  ref={searchRef}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={language === 'te' ? 'వీడియోలు వెతకండి...' : language === 'hi' ? 'वीडियो खोजें...' : 'Search videos…'}
                  className="w-full rounded-full border border-white/30 bg-white/10 py-2 pl-9 pr-8 text-sm text-white placeholder:text-white/60 focus:border-white/60 focus:outline-none focus:ring-1 focus:ring-white/30 sm:w-56"
                />
                {searchInput && (
                  <button type="button" onClick={() => { setSearchInput(''); setSearch(''); searchRef.current?.focus() }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                    <X size={13} />
                  </button>
                )}
              </div>
              <a
                href="https://youtube.com/@nutrilifemitra"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-red-700 transition"
              >
                <Youtube size={16} /> {t.subscribe}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-16 z-20 border-b bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4">
          <div className="flex gap-1 py-3">
            {VIDEO_CATS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeTab === cat
                    ? 'bg-[#1A5C38] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {(t.catLabels as any)[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
        {/* Videos page specific promo */}
        <PromotionBlock placement="videos-page" language={language} />
        {/* Home banner promo on videos page */}
        <PromotionBlock placement="home-banner" language={language} />
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <>
            {/* Featured video — only on All tab */}
            {activeTab === 'All' && featured && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1 w-6 rounded-full bg-[#1A5C38]" />
                  <h2 className="font-nunito text-lg font-bold text-gray-900 dark:text-slate-50">{t.featured}</h2>
                </div>
                <a
                  href={featured.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 md:flex-row"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-900 md:aspect-auto md:h-auto md:w-[55%]">
                    {featured.thumbnailUrl ? (
                      <img src={featured.thumbnailUrl} alt={featured.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full min-h-[200px] items-center justify-center"><Play size={48} className="text-white/60" /></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-xl">
                        <Play size={24} className="ml-1 text-white" fill="white" />
                      </div>
                    </div>
                    {featured.durationSeconds && (
                      <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 text-[11px] text-white">
                        <Clock size={10} /> {fmtDuration(featured.durationSeconds)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-3 p-6 md:w-[45%]">
                    {featured.tag && (
                      <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
                        {featured.tag}
                      </span>
                    )}
                    <h2 className="font-nunito text-2xl font-bold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-50 dark:group-hover:text-emerald-400">
                      {featured.title}
                    </h2>
                    {featured.description && (
                      <p className="line-clamp-3 text-sm text-gray-600 dark:text-slate-400">{featured.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                        <Play size={14} fill="white" /> {t.watch}
                      </span>
                    </div>
                    <div onClick={(e) => e.preventDefault()}>
                      <LikeSaveButtons contentId={featured._id} contentType="video" initialLikes={featured.likes ?? 0} />
                    </div>
                  </div>
                </a>
              </section>
            )}

            {/* Video grid */}
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500 dark:text-slate-400">{t.empty}</p>
            ) : (
              <section>
                {activeTab !== 'All' && (
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-1 w-6 rounded-full bg-[#1A5C38]" />
                    <h2 className="font-nunito text-lg font-bold text-gray-900 dark:text-slate-50">
                      {(t.catLabels as any)[activeTab]}
                    </h2>
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {(activeTab === 'All' ? filtered.filter((v) => v._id !== featured?._id) : filtered).map((v) => (
                    <a
                      key={v._id}
                      href={v.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-900">
                        {v.thumbnailUrl ? (
                          <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center"><Play size={32} className="text-white/60" /></div>
                        )}
                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 shadow-lg">
                            <Play size={18} className="ml-0.5 text-white" fill="white" />
                          </div>
                        </div>
                        {v.durationSeconds && (
                          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 text-[11px] text-white">
                            <Clock size={10} /> {fmtDuration(v.durationSeconds)}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        {v.tag && (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
                            {v.tag}
                          </span>
                        )}
                        <p className="mt-2 line-clamp-2 font-nunito text-sm font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-50 dark:group-hover:text-emerald-400">
                          {v.title}
                        </p>
                        {v.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-slate-400">{v.description}</p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                            <Play size={12} fill="currentColor" /> {t.watch}
                          </span>
                          <div onClick={(e) => e.preventDefault()}>
                            <LikeSaveButtons contentId={v._id} contentType="video" initialLikes={v.likes ?? 0} />
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* YouTube subscribe banner */}
            <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-red-500 p-6 text-white shadow-lg">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                    <Youtube size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="font-nunito text-xl font-bold">{t.ytBanner}</p>
                    <p className="text-sm text-red-100">{t.ytSub}</p>
                  </div>
                </div>
                <a
                  href="https://youtube.com/@nutrilifemitra"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-red-600 shadow hover:bg-red-50 transition"
                >
                  <Youtube size={16} /> {t.subscribe}
                </a>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
