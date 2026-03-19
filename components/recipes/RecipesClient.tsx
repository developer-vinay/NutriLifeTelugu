'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'

type DBRecipe = {
  _id: string
  title: string
  slug: string
  description?: string
  category?: string
  tag?: string
  heroImage?: string
  servings?: number
  prepTimeMinutes?: number
  cookTimeMinutes?: number
  isFeatured: boolean
  language?: string
}

const tabs = ['All', 'breakfast', 'lunch', 'dinner', 'snacks', 'millets', 'diabetic-friendly'] as const

const UI = {
  te: {
    heading: 'రెసిపీలు — ఆరోగ్యకరమైన, రుచికరమైన',
    sub: 'బరువు తగ్గడానికి, డయాబెటిస్‌కు, రోజువారీ ఆరోగ్యానికి రెసిపీలు.',
    search: 'రెసిపీలు వెతకండి...',
    featured: 'ప్రత్యేక రెసిపీ',
    viewFull: 'పూర్తి రెసిపీ చూడండి →',
    viewRecipe: 'రెసిపీ చూడండి →',
    loadMore: 'మరిన్ని రెసిపీలు',
    noResults: 'రెసిపీలు కనుగొనబడలేదు.',
    popular: 'అత్యంత ప్రజాదరణ పొందిన రెసిపీలు',
    premium: 'ప్రీమియం మీల్ ప్లాన్ ₹299',
    premiumSub: 'ప్రింటబుల్ PDF · డయాబెటిక్ ఫ్రెండ్లీ · షాపింగ్ లిస్ట్',
    buyNow: 'ఇప్పుడే కొనండి →',
  },
  en: {
    heading: 'Recipes — Healthy, Authentic, Delicious',
    sub: 'Recipes for weight loss, diabetes, and everyday wellness.',
    search: 'Search recipes...',
    featured: 'Featured Recipe',
    viewFull: 'View Full Recipe →',
    viewRecipe: 'View Recipe →',
    loadMore: 'Load more recipes',
    noResults: 'No recipes found.',
    popular: 'Most Popular Recipes',
    premium: 'Premium Meal Plan ₹299',
    premiumSub: 'Printable PDF · Diabetic friendly · Shopping list',
    buyNow: 'Buy Now →',
  },
}

export default function RecipesClient() {
  const { language } = useLanguage()
  const t = UI[language] ?? UI.en

  const [recipes, setRecipes] = useState<DBRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [visibleCount, setVisibleCount] = useState(12)

  useEffect(() => {
    setLoading(true)
    setSearch('')
    setActiveTab('All')
    setVisibleCount(12)
    fetch(`/api/recipes?lang=${language}&limit=60`)
      .then((r) => r.json())
      .then((data) => { setRecipes(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [language])

  const featured = recipes.find((r) => r.isFeatured) ?? recipes[0]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return recipes.filter((r) => {
      const matchesSearch = q.length === 0 || r.title.toLowerCase().includes(q) || (r.tag ?? '').toLowerCase().includes(q)
      const matchesTab = activeTab === 'All' || r.category === activeTab
      return matchesSearch && matchesTab
    })
  }, [activeTab, search, recipes])

  const shown = filtered.slice(0, visibleCount)

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="mt-16 bg-[#F0FAF4] dark:bg-slate-800">
        <div className="mx-auto flex h-[180px] max-w-6xl flex-col items-start justify-center gap-4 px-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">{t.heading}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{t.sub}</p>
          </div>
          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm dark:border-slate-600 dark:bg-slate-700">
              <span className="text-gray-400">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-20 border-b bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4">
          <div className="flex gap-5 py-3 text-sm font-medium text-gray-600 dark:text-slate-400">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); setVisibleCount(12) }}
                className={`whitespace-nowrap pb-2 capitalize transition ${
                  activeTab === tab
                    ? 'border-b-2 border-[#1A5C38] text-[#1A5C38] dark:border-emerald-400 dark:text-emerald-400'
                    : 'border-b-2 border-transparent hover:text-[#1A5C38] dark:hover:text-emerald-400'
                }`}
              >
                {tab === 'All' ? 'All' : tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[70%_30%]">
        <div className="space-y-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm md:flex dark:border-slate-700 dark:bg-slate-800">
                  {featured.heroImage ? (
                    <img src={featured.heroImage} alt={featured.title} className="h-56 w-full object-cover md:h-auto md:w-1/2" />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-emerald-100 text-5xl md:h-auto md:w-1/2 dark:bg-emerald-900/20">🍲</div>
                  )}
                  <div className="space-y-3 p-5 md:w-1/2">
                    <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">{t.featured}</span>
                    <h2 className="font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{featured.title}</h2>
                    {featured.description && <p className="text-sm text-gray-600 dark:text-slate-400">{featured.description}</p>}
                    <div className="text-xs text-gray-500">
                      {featured.prepTimeMinutes && `${featured.prepTimeMinutes} min prep`}
                      {featured.servings && ` · Servings ${featured.servings}`}
                    </div>
                    <Link href={`/recipes/${featured.slug}`} className="inline-flex items-center rounded-full bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                      {t.viewFull}
                    </Link>
                  </div>
                </div>
              )}

              {/* Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/recipes/${r.slug}`}
                    className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-transform duration-200 hover:scale-105 hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
                  >
                    {r.heroImage ? (
                      <img src={r.heroImage} alt={r.title} className="h-[200px] w-full object-cover" />
                    ) : (
                      <div className="flex h-[200px] items-center justify-center bg-green-100 text-5xl dark:bg-emerald-900/20">🍲</div>
                    )}
                    <div className="space-y-2 p-4">
                      {r.tag && (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">{r.tag}</span>
                      )}
                      <h3 className="line-clamp-2 font-nunito text-sm font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-50 dark:group-hover:text-emerald-400">{r.title}</h3>
                      {r.description && <p className="line-clamp-1 text-xs text-gray-500 dark:text-slate-400">{r.description}</p>}
                      <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
                        {r.prepTimeMinutes && <span>{r.prepTimeMinutes} min</span>}
                        <span className="font-semibold text-[#1A5C38] dark:text-emerald-400">{t.viewRecipe}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {visibleCount < filtered.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="rounded-full border border-[#1A5C38] px-5 py-2 text-sm font-semibold text-[#1A5C38] hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-600 dark:hover:bg-emerald-900/20"
                >
                  {t.loadMore}
                </button>
              )}

              {shown.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-500">{t.noResults}</p>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-xs text-gray-400 dark:border-slate-600 dark:text-slate-500">
              Advertisement — Google AdSense 300×250
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-slate-50">{t.popular}</h4>
            <ol className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
              {recipes.slice(0, 5).map((r, idx) => (
                <li key={r.slug} className="flex items-start gap-2">
                  <span className="mt-0.5 text-xs font-bold text-[#1A5C38] dark:text-emerald-400">{String(idx + 1).padStart(2, '0')}</span>
                  <Link href={`/recipes/${r.slug}`} className="hover:underline hover:text-[#1A5C38] dark:hover:text-emerald-400">{r.title}</Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">{t.premium}</p>
            <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">{t.premiumSub}</p>
            <button type="button" className="mt-3 w-full rounded-lg bg-[#D97706] px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
              {t.buyNow}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
