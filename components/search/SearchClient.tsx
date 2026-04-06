'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Search, UtensilsCrossed, FileText, Play } from 'lucide-react'

type Language = 'en' | 'te' | 'hi'

type Item = {
  _id: string
  title: string
  slug: string
  excerpt: string
  tag: string
  category: string
  readTimeMinutes: number
  heroImage: string
  language: string
  type: 'post' | 'recipe' | 'video'
}

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Weight Loss', value: 'weight-loss' },
  { label: 'Diabetes', value: 'diabetes' },
  { label: 'Gut Health', value: 'gut-health' },
  { label: 'Immunity', value: 'immunity' },
  { label: 'Thyroid', value: 'thyroid' },
  { label: 'Kids Nutrition', value: 'kids-nutrition' },
  { label: 'Recipes', value: 'recipes' },
  { label: 'Millets', value: 'millets' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Diabetic Friendly', value: 'diabetic-friendly' },
]

const UI: Record<Language, { heading: string; placeholder: string; results: string; noResults: string; noResultsSub: string; articles: string; recipes: string; videos: string }> = {
  en: { heading: 'Search', placeholder: 'Search articles, recipes, videos...', results: 'result', noResults: 'No results found', noResultsSub: 'Try a different search term or category', articles: 'Articles', recipes: 'Recipes', videos: 'Videos' },
  te: { heading: 'వెతకండి', placeholder: 'వ్యాసాలు, రెసిపీలు, వీడియోలు వెతకండి...', results: 'ఫలితాలు', noResults: 'ఫలితాలు కనుగొనబడలేదు', noResultsSub: 'వేరే పదం లేదా వర్గాన్ని ప్రయత్నించండి', articles: 'వ్యాసాలు', recipes: 'రెసిపీలు', videos: 'వీడియోలు' },
  hi: { heading: 'खोजें', placeholder: 'लेख, रेसिपी, वीडियो खोजें...', results: 'परिणाम', noResults: 'कोई परिणाम नहीं मिला', noResultsSub: 'कोई अलग शब्द या श्रेणी आज़माएं', articles: 'लेख', recipes: 'रेसिपी', videos: 'वीडियो' },
}

export default function SearchClient({
  initialPosts,
  initialRecipes,
  initialVideos,
  initialQuery,
  initialCategory,
}: {
  initialPosts: Item[]
  initialRecipes: Item[]
  initialVideos: Item[]
  initialQuery: string
  initialCategory: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [language, setLanguage] = useState<Language>('en')

  // Read language from localStorage (same source as LanguageProvider)
  useEffect(() => {
    const stored = localStorage.getItem('lang') as Language | null
    if (stored === 'te' || stored === 'en' || stored === 'hi') setLanguage(stored)

    // Also listen for changes from the language toggle on the same page
    const handler = () => {
      const updated = localStorage.getItem('lang') as Language | null
      if (updated === 'te' || updated === 'en' || updated === 'hi') setLanguage(updated)
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const t = UI[language]

  const allItems = useMemo(
    () => [...initialPosts, ...initialRecipes, ...initialVideos],
    [initialPosts, initialRecipes, initialVideos],
  )

  const filtered = useMemo(() => {
    // Always filter by current language first
    let items = allItems.filter((i) => i.language === language)

    if (activeCategory) {
      items = items.filter((i) => i.category === activeCategory)
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.excerpt.toLowerCase().includes(q) ||
          i.tag.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      )
    }

    return items
  }, [allItems, query, activeCategory, language])

  const posts = filtered.filter((i) => i.type === 'post')
  const recipes = filtered.filter((i) => i.type === 'recipe')
  const videos = filtered.filter((i) => i.type === 'video')

  return (
    <div className="min-h-screen bg-white pt-[72px] dark:bg-slate-950">
      {/* Search header */}
      <div className="bg-[#F0FAF4] dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="font-nunito text-2xl font-bold text-[#1A5C38] dark:text-emerald-400">{t.heading}</h1>

          {/* Search bar */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-400">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeCategory === cat.value
                    ? 'bg-[#1A5C38] text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-[#1A5C38] hover:text-[#1A5C38] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="mb-6 text-sm text-gray-500 dark:text-slate-400">
          {filtered.length} {t.results}
          {query ? ` for "${query}"` : ''}
          {activeCategory ? ` in ${CATEGORIES.find((c) => c.value === activeCategory)?.label}` : ''}
        </p>

        {posts.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">
              {t.articles} <span className="ml-1 text-sm font-normal text-gray-400">({posts.length})</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {posts.map((p) => <ResultCard key={p._id} item={p} />)}
            </div>
          </section>
        )}

        {recipes.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">
              {t.recipes} <span className="ml-1 text-sm font-normal text-gray-400">({recipes.length})</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {recipes.map((r) => <ResultCard key={r._id} item={r} />)}
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section>
            <h2 className="mb-3 font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">
              {t.videos} <span className="ml-1 text-sm font-normal text-gray-400">({videos.length})</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {videos.map((v) => <ResultCard key={v._id} item={v} />)}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Search size={40} className="mx-auto text-gray-300 dark:text-slate-600" />
            <p className="mt-3 text-base font-medium text-gray-700 dark:text-slate-300">{t.noResults}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-500">{t.noResultsSub}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultCard({ item }: { item: Item }) {
  const href = item.type === 'recipe' ? `/recipes/${item.slug}` : item.type === 'video' ? `/videos/${item.slug}` : `/blog/${item.slug}`
  const typeLabel = item.type === 'recipe' ? 'Recipe' : item.type === 'video' ? 'Video' : 'Article'
  const TypeIcon = item.type === 'recipe' ? UtensilsCrossed : item.type === 'video' ? Play : FileText

  return (
    <Link
      href={href}
      className="group flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-emerald-50 dark:bg-slate-700">
        {item.heroImage ? (
          <img src={item.heroImage} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <TypeIcon size={22} className="text-gray-400" />
          </div>
        )}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play size={14} className="text-white" fill="white" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {item.tag && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">
              {item.tag}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
            <TypeIcon size={10} /> {typeLabel}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">
          {item.title}
        </p>
        {item.excerpt && (
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-slate-400">{item.excerpt}</p>
        )}
      </div>
    </Link>
  )
}
