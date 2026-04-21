'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { FileText, Search, X } from 'lucide-react'
import PromotionBlock from '@/components/promotions/PromotionBlock'

type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  tag?: string
  tags?: string[]
  category?: string
  language?: string
  heroImage?: string
  readTimeMinutes?: number
  views?: number
  createdAt: string
}

/** Fires callback only after user stops typing for `delay` ms */
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function BlogListClient() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce: only filter 300ms after user stops typing
  const query = useDebounce(searchInput, 300)

  useEffect(() => {
    setLoading(true)
    setSearchInput('')
    fetch(`/api/posts?lang=${language}&limit=100`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [language])

  const filtered = useMemo(() => {
    if (!query.trim()) return posts
    const q = query.trim().toLowerCase()
    return posts.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? '').toLowerCase().includes(q) ||
      (p.tag ?? '').toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
      (p.category ?? '').toLowerCase().includes(q) ||
      p.slug.replace(/-/g, ' ').includes(q),
    )
  }, [posts, query])

  const ui = {
    heading:   language === 'te' ? 'తాజా వ్యాసాలు'       : language === 'hi' ? 'नवीनतम लेख'          : 'Latest Articles',
    sub:       language === 'te' ? 'ఆరోగ్య చిట్కాలు, డైట్ గైడ్స్, తెలుగు న్యూట్రిషన్ కంటెంట్.' : language === 'hi' ? 'स्वास्थ्य टिप्स, डाइट गाइड और पोषण सामग्री।' : 'Health tips, diet guides, and nutrition content.',
    placeholder: language === 'te' ? 'వ్యాసాలు వెతకండి...' : language === 'hi' ? 'लेख खोजें...'        : 'Search articles…',
    empty:     language === 'te' ? 'ఈ భాషలో వ్యాసాలు త్వరలో వస్తాయి.' : language === 'hi' ? 'इस भाषा में लेख जल्द आ रहे हैं।' : 'No articles in this language yet.',
    noResults: language === 'te' ? `"${query}" కోసం ఫలితాలు లేవు` : language === 'hi' ? `"${query}" के लिए कोई परिणाम नहीं` : `No results for "${query}"`,
  }

  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Banner promo */}
        <div className="mb-6">
          <PromotionBlock placement="home-banner" language={language} />
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* ── Main content ── */}
          <div className="min-w-0 flex-1">

            {/* Header */}
            <div className="mb-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="font-nunito text-3xl font-bold text-gray-900 dark:text-slate-50">
                    {ui.heading}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{ui.sub}</p>
                </div>
                {!loading && (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
                    {filtered.length} articles
                  </span>
                )}
              </div>

              {/* ── Debounced search bar ── */}
              <div className="relative mt-4">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={ui.placeholder}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => { setSearchInput(''); inputRef.current?.focus() }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Live hint — shows while typing before debounce fires */}
              {searchInput && searchInput !== query && (
                <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">Searching…</p>
              )}
            </div>

            {/* ── Results ── */}
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-500 dark:text-slate-400">{ui.empty}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Search size={36} className="mx-auto mb-3 text-gray-300 dark:text-slate-600" />
                <p className="font-medium text-gray-700 dark:text-slate-300">{ui.noResults}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-500">
                  {language === 'te' ? 'వేరే పదం ప్రయత్నించండి' : language === 'hi' ? 'कोई अलग शब्द आज़माएं' : 'Try a different keyword'}
                </p>
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="mt-3 text-sm font-medium text-[#1A5C38] hover:underline dark:text-emerald-400"
                >
                  {language === 'te' ? 'అన్నీ చూపించు' : language === 'hi' ? 'सभी दिखाएं' : 'Show all articles'}
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((post) => (
                  <PostCard key={post._id} post={post} query={query} />
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full space-y-4 md:w-72 md:shrink-0 md:sticky md:top-20 md:self-start">
            <PromotionBlock placement="sidebar" language={language} />
          </aside>
        </div>
      </div>
    </div>
  )
}

/** Highlights the matched query text inside a string */
function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="rounded bg-yellow-100 px-0.5 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200">{part}</mark>
      : part
  )
}

function PostCard({ post, query }: { post: Post; query: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
    >
      <div className="h-36 w-full overflow-hidden bg-emerald-50 dark:bg-emerald-900/30">
        {post.heroImage
          ? <img src={post.heroImage} alt={post.title} className="h-full w-full object-cover" />
          : <div className="flex h-full items-center justify-center"><FileText size={28} className="text-emerald-300" /></div>
        }
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          {post.tag && (
            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#1A5C38] dark:bg-emerald-900/40 dark:text-emerald-400">
              {post.tag.split(',')[0].trim()}
            </span>
          )}
          <span className="ml-auto text-[11px] text-gray-500 dark:text-slate-400">
            {post.readTimeMinutes ?? 5} min read
          </span>
        </div>
        <h2 className="line-clamp-2 font-nunito text-base font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-50 dark:group-hover:text-emerald-400">
          {highlight(post.title, query)}
        </h2>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-slate-400">
            {highlight(post.excerpt, query)}
          </p>
        )}
        <p className="mt-3 text-[11px] text-gray-500 dark:text-slate-500">
          {new Date(post.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
          {' · '}
          {(post.views ?? 0).toLocaleString('en-IN')} views
        </p>
      </div>
    </Link>
  )
}
