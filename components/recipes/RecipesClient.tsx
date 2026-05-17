'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { Search, UtensilsCrossed, X, Loader2 } from 'lucide-react'
import PromotionBlock from '@/components/promotions/PromotionBlock'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

type DBRecipe = {
  _id: string
  title: string
  slug: string
  description?: string
  category?: string
  tag?: string
  heroImage?: string
  heroImageObjectFit?: 'cover' | 'contain' | 'fill'
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
    premiumSub: 'ప్రింటబుల్ PDF · డయాబెటిక్ ఫ్రెండ్లీ · షాపింగ్ లిస్ట్',
    buyNow: 'ఇప్పుడే కొనండి →',
  },
  hi: {
    heading: 'रेसिपी — स्वस्थ, प्रामाणिक, स्वादिष्ट',
    sub: 'वजन घटाने, मधुमेह और रोजमर्रा की सेहत के लिए रेसिपी।',
    search: 'रेसिपी खोजें...',
    featured: 'विशेष रेसिपी',
    viewFull: 'पूरी रेसिपी देखें →',
    viewRecipe: 'रेसिपी देखें →',
    loadMore: 'और रेसिपी लोड करें',
    noResults: 'कोई रेसिपी नहीं मिली।',
    popular: 'सबसे लोकप्रिय रेसिपी',
    premiumSub: 'प्रिंटेबल PDF · डायबिटिक फ्रेंडली · शॉपिंग लिस्ट',
    buyNow: 'अभी खरीदें →',
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
    premiumSub: 'Printable PDF · Diabetic friendly · Shopping list',
    buyNow: 'Buy Now →',
  },
}

export default function RecipesClient() {
  const { language } = useLanguage()
  const t = UI[language] ?? UI.en

  const [searchInput, setSearchInput] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const searchRef = useRef<HTMLInputElement>(null)
  const [featuredPlanPrice, setFeaturedPlanPrice] = useState<string>('₹299')

  // Debounce: filter 300ms after user stops typing
  const [search, setSearch] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  // Fetch function for infinite scroll
  const fetchRecipes = useCallback(async (page: number) => {
    const res = await fetch(`/api/recipes?lang=${language}&page=${page}&limit=12`)
    const json = await res.json()
    return {
      data: json.data || [],
      hasMore: json.pagination?.hasMore || false
    }
  }, [language])

  // Use infinite scroll hook
  const { items: recipes, initialLoading, loading, hasMore, loadMoreRef, error, retry } = useInfiniteScroll<DBRecipe>(
    fetchRecipes,
    [language]
  )

  // Reset search when language changes
  useEffect(() => {
    setSearchInput('')
    setSearch('')
    setActiveTab('All')
  }, [language])

  // Fetch featured plan price
  useEffect(() => {
    fetch('/api/plans?featured=true&limit=1')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setFeaturedPlanPrice(`${data[0].currency}${data[0].price}`)
        }
      })
      .catch(() => {})
  }, [])

  const featured = recipes.find((r) => r.isFeatured) ?? recipes[0]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return recipes.filter((r) => {
      const matchesSearch = q.length === 0
        || r.title.toLowerCase().includes(q)
        || (r.tag ?? '').toLowerCase().includes(q)
        || (r.description ?? '').toLowerCase().includes(q)
        || (r.category ?? '').toLowerCase().includes(q)
      const matchesTab = activeTab === 'All' || r.category === activeTab
      return matchesSearch && matchesTab
    })
  }, [activeTab, search, recipes])

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-[#F0FAF4] dark:bg-slate-800">
        <div className="mx-auto flex h-[180px] max-w-6xl flex-col items-start justify-center gap-4 px-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">{t.heading}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{t.sub}</p>
          </div>
          <div className="w-full max-w-md">
            <div className="relative flex items-center rounded-full border bg-white px-4 py-2 shadow-sm dark:border-slate-600 dark:bg-slate-700">
              <Search size={16} className="shrink-0 text-gray-400" />
              <input
                ref={searchRef}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.search}
                className="w-full bg-transparent pl-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
              />
              {searchInput && (
                <button type="button" onClick={() => { setSearchInput(''); setSearch(''); searchRef.current?.focus() }}
                  className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                  <X size={14} />
                </button>
              )}
              {searchInput && searchInput !== search && (
                <span className="ml-2 shrink-0 text-[10px] text-gray-400">…</span>
              )}
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
                onClick={() => { setActiveTab(tab); }}
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
          {initialLoading ? (
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
                    <img src={featured.heroImage} alt={featured.title} className="h-56 w-full md:h-auto md:w-1/2" style={{ objectFit: featured.heroImageObjectFit || 'cover' }} />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-emerald-100 md:h-auto md:w-1/2 dark:bg-emerald-900/20"><UtensilsCrossed size={40} className="text-emerald-300" /></div>
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
                {filtered.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/recipes/${r.slug}`}
                    className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-transform duration-200 hover:scale-105 hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
                  >
                    {r.heroImage ? (
                      <img src={r.heroImage} alt={r.title} className="h-[200px] w-full" style={{ objectFit: r.heroImageObjectFit || 'cover' }} />
                    ) : (
                      <div className="flex h-[200px] items-center justify-center bg-green-100 dark:bg-emerald-900/20"><UtensilsCrossed size={36} className="text-emerald-300" /></div>
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

              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} className="py-8">
                {loading && (
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">{t.loadMore}</span>
                  </div>
                )}
                {error && (
                  <div className="text-center">
                    <p className="text-sm text-red-600 dark:text-red-400">{t.noResults}</p>
                    <button
                      onClick={retry}
                      className="mt-2 text-sm font-medium text-[#1A5C38] hover:underline dark:text-emerald-400"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {!hasMore && !loading && filtered.length > 12 && (
                  <p className="text-center text-sm text-gray-500 dark:text-slate-400">
                    {language === 'te' ? 'అన్ని రెసిపీలు చూపించబడ్డాయి' : language === 'hi' ? 'सभी रेसिपी दिखाई गईं' : 'All recipes loaded'}
                  </p>
                )}
              </div>

              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-500">{t.noResults}</p>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 md:sticky md:top-20 md:self-start">
          {/* Sidebar promotions */}
          <PromotionBlock placement="sidebar" language={language} />

          {/* Newsletter signup replacing ad block */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 dark:border-emerald-800/50 dark:from-emerald-900/20 dark:to-slate-900">
            <p className="font-nunito text-base font-bold text-emerald-900 dark:text-emerald-100">Free Weekly Recipes</p>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">Get 3 new Telugu recipes every week — free in your inbox.</p>
            <form action="/api/subscribe" method="post" className="mt-3 space-y-2">
              <input type="email" name="email" placeholder="Your email"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
              <button type="submit" className="w-full rounded-lg bg-[#1A5C38] px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
                Subscribe free →
              </button>
            </form>
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
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              {language === 'te' ? 'ప్రీమియం మీల్ ప్లాన్' : language === 'hi' ? 'प्रीमियम मील प्लान' : 'Premium Meal Plan'} {featuredPlanPrice}
            </p>
            <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">{t.premiumSub}</p>
            <Link href="/diet-plans#premium" className="mt-3 block w-full rounded-lg bg-[#D97706] px-3 py-2 text-center text-sm font-semibold text-white hover:opacity-90">
              {t.buyNow}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
