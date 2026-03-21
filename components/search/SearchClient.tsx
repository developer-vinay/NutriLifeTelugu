'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, UtensilsCrossed, FileText } from 'lucide-react'

type Item = {
  _id: string
  title: string
  slug: string
  excerpt: string
  tag: string
  category: string
  readTimeMinutes: number
  heroImage: string
  type: 'post' | 'recipe'
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

export default function SearchClient({
  initialPosts,
  initialRecipes,
  initialQuery,
  initialCategory,
}: {
  initialPosts: Item[]
  initialRecipes: Item[]
  initialQuery: string
  initialCategory: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(initialCategory)

  const allItems = useMemo(() => [...initialPosts, ...initialRecipes], [initialPosts, initialRecipes])

  const filtered = useMemo(() => {
    let items = allItems

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
  }, [allItems, query, activeCategory])

  const posts = filtered.filter((i) => i.type === 'post')
  const recipes = filtered.filter((i) => i.type === 'recipe')

  return (
    <div className="min-h-screen bg-white pt-[72px] dark:bg-slate-950">
      {/* Search header */}
      <div className="bg-[#F0FAF4] dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="font-nunito text-2xl font-bold text-[#1A5C38] dark:text-emerald-400">Search</h1>

          {/* Search bar */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-400">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, recipes..."
              className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
              >
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
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          {query ? ` for "${query}"` : ''}
          {activeCategory ? ` in ${CATEGORIES.find((c) => c.value === activeCategory)?.label}` : ''}
        </p>

        {posts.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">
              Articles <span className="ml-1 text-sm font-normal text-gray-400">({posts.length})</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {posts.map((p) => (
                <ResultCard key={p._id} item={p} />
              ))}
            </div>
          </section>
        )}

        {recipes.length > 0 && (
          <section>
            <h2 className="mb-3 font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">
              Recipes <span className="ml-1 text-sm font-normal text-gray-400">({recipes.length})</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {recipes.map((r) => (
                <ResultCard key={r._id} item={r} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Search size={40} className="mx-auto text-gray-300 dark:text-slate-600" />
            <p className="mt-3 text-base font-medium text-gray-700 dark:text-slate-300">No results found</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-500">Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultCard({ item }: { item: Item }) {
  const href = item.type === 'post' ? `/blog/${item.slug}` : `/recipes/${item.slug}`
  return (
    <Link
      href={href}
      className="group flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
    >
      {/* Thumbnail */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-emerald-50 dark:bg-slate-700">
        {item.heroImage ? (
          <img src={item.heroImage} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {item.type === 'recipe' ? <UtensilsCrossed size={22} className="text-emerald-300" /> : <FileText size={22} className="text-gray-400" />}
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
          <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1">
            {item.type === 'recipe' ? <><UtensilsCrossed size={10} /> Recipe</> : <><FileText size={10} /> Article</>}
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
