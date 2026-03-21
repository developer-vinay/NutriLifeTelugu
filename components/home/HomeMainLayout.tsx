'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { Play } from 'lucide-react'

type DBPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  tag?: string
  language?: string
  readTimeMinutes?: number
  createdAt: string
}

type DBRecipe = {
  _id: string
  title: string
  slug: string
  tag?: string
  language?: string
  heroImage?: string
  prepTimeMinutes?: number
}

type DBVideo = {
  _id: string
  title: string
  youtubeUrl: string
  youtubeId: string
  thumbnailUrl?: string
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-50">{title}</h2>
      {href && (
        <a href={href} className="text-xs font-medium text-[#1A5C38] hover:underline dark:text-emerald-400">
          View all →
        </a>
      )}
    </div>
  )
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function PostSkeleton() {
  return <div className="h-52 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
}

export default function HomeMainLayout({ latestVideo }: { latestVideo: DBVideo | null }) {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<DBPost[]>([])
  const [recipes, setRecipes] = useState<DBRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/subscribers/count').then(r => r.json()).then(d => setSubscriberCount(d.count)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/posts?lang=${language}&limit=9`).then((r) => r.json()),
      fetch(`/api/recipes?lang=${language}&limit=4`).then((r) => r.json()),
    ]).then(([postsData, recipesData]) => {
      setPosts(Array.isArray(postsData) ? postsData : [])
      setRecipes(Array.isArray(recipesData) ? recipesData : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [language])

  const mainPosts = posts.slice(0, 6)
  const tipPosts = posts.slice(6, 9)

  return (
    <section className="bg-gray-50 pb-12 pt-6 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row">

        {/* Main content */}
        <div className="w-full space-y-6 md:w-[70%]">

          {/* Latest Articles */}
          <section id="latest">
            <SectionHeader title={language === 'te' ? 'తాజా వ్యాసాలు' : 'Latest Articles'} href="/blog" />
            {loading ? (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">{[...Array(6)].map((_, i) => <PostSkeleton key={i} />)}</div>
            ) : mainPosts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">{language === 'te' ? 'వ్యాసాలు త్వరలో వస్తాయి.' : 'Articles coming soon.'}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {mainPosts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-600">
                    <div className="mb-3 h-28 w-full rounded-xl bg-emerald-50 dark:bg-emerald-900/30" />
                    <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{post.tag}</span>
                    <h3 className="mb-1 line-clamp-2 text-[13px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{post.title}</h3>
                    <p className="mb-2 line-clamp-3 text-[11px] text-gray-500 dark:text-slate-400">{post.excerpt}</p>
                    <p className="mt-auto text-[11px] text-gray-400 dark:text-slate-500">
                      {post.readTimeMinutes ?? 5} min read · {timeAgo(post.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Trending Recipes */}
          <section>
            <SectionHeader title={language === 'te' ? 'ట్రెండింగ్ రెసిపీలు' : 'Trending Recipes'} href="/recipes" />
            {loading ? (
              <div className="grid gap-3 md:grid-cols-2">{[...Array(4)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />)}</div>
            ) : recipes.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">{language === 'te' ? 'రెసిపీలు త్వరలో వస్తాయి.' : 'Recipes coming soon.'}</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {recipes.map((recipe) => (
                  <Link key={recipe._id} href={`/recipes/${recipe.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-600">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                      {recipe.heroImage && <img src={recipe.heroImage} alt={recipe.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{recipe.tag}</span>
                      <h3 className="line-clamp-2 text-[13px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{recipe.title}</h3>
                      {recipe.prepTimeMinutes && <p className="text-[11px] text-gray-400 dark:text-slate-500">{recipe.prepTimeMinutes} min</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Promo banner */}
          <section>
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm md:flex-row md:items-center dark:border-emerald-800/50 dark:bg-emerald-900/20">
              <div>
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Free 7-day meal plan — Download now</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">Telugu cuisine · Diabetic friendly · Printable PDF</p>
              </div>
              <Link href="/diet-plans" className="inline-flex items-center rounded-full bg-[#1A5C38] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
                Get free →
              </Link>
            </div>
          </section>

          {/* Health Tips */}
          {tipPosts.length > 0 && (
            <section>
              <SectionHeader title={language === 'te' ? 'హెల్త్ టిప్స్' : 'Health Tips'} href="/health-tips/weight-loss" />
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {tipPosts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-600">
                    <div className="mb-3 h-24 w-full rounded-xl bg-gray-100 dark:bg-slate-700/60" />
                    <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{post.tag}</span>
                    <h3 className="mb-1 line-clamp-2 text-[13px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{post.title}</h3>
                    <p className="mb-2 line-clamp-3 text-[11px] text-gray-500 dark:text-slate-400">{post.excerpt}</p>
                    <p className="mt-auto text-[11px] text-gray-400 dark:text-slate-500">{post.readTimeMinutes ?? 5} min read</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full space-y-4 md:w-[30%] md:sticky md:top-20 md:self-start">
          {/* Ad */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-slate-600 dark:bg-slate-900/40">
              <div className="text-center text-[11px] text-gray-400 dark:text-slate-500">Advertisement — Google AdSense 300×250</div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-slate-50">Get free weekly recipes</h3>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">
              {subscriberCount !== null ? `Join ${subscriberCount.toLocaleString('en-IN')}+ readers getting weekly Telugu nutrition tips.` : 'Join readers getting weekly Telugu nutrition tips.'}
            </p>
            <form action="/api/subscribe" method="post" className="space-y-2 text-xs">
              <input type="email" name="email" placeholder="Your email address"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[11px] text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500" />
              <button type="submit" className="w-full rounded-md bg-[#1A5C38] px-3 py-2 text-[11px] font-semibold text-white hover:bg-emerald-700">
                Subscribe — it&apos;s free
              </button>
            </form>
          </div>

          {/* Popular this week */}
          {posts.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-slate-50">{language === 'te' ? 'ఈ వారం పాపులర్' : 'Popular this week'}</h3>
              <ol className="space-y-2 text-[11px]">
                {posts.slice(0, 5).map((post, index) => (
                  <li key={post._id} className="flex gap-2 border-b border-gray-100 pb-2 last:border-0 last:pb-0 dark:border-slate-700">
                    <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-emerald-50 text-center text-[10px] font-semibold text-[#1A5C38] dark:bg-emerald-900/40 dark:text-emerald-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Link href={`/blog/${post.slug}`} className="flex-1">
                      <p className="line-clamp-2 text-gray-800 hover:text-[#1A5C38] dark:text-slate-200 dark:hover:text-emerald-400">{post.title}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">{post.readTimeMinutes ?? 5} min read</p>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Latest video */}
          {latestVideo && (
            <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-slate-50">Latest video</h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-700">
                {latestVideo.thumbnailUrl
                  ? <img src={latestVideo.thumbnailUrl} alt={latestVideo.title} className="h-full w-full object-cover" />
                  : <div className="absolute inset-0 flex items-center justify-center"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900"><Play size={16} /></div></div>
                }
              </div>
              <p className="text-[11px] font-medium text-gray-800 dark:text-slate-200">{latestVideo.title}</p>
              <a href={latestVideo.youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex text-[11px] font-semibold text-[#1A5C38] hover:underline dark:text-emerald-400">
                Watch on YouTube →
              </a>
            </div>
          )}

          {/* Premium promo */}
          <div className="space-y-2 rounded-2xl bg-amber-500 p-4 text-xs text-white shadow-md">
            <p className="text-sm font-bold">Premium Meal Plan — ₹299</p>
            <p className="text-[11px] text-amber-100">Structured 4-week Telugu meal plan with grocery lists, recipes, and blood-sugar friendly swaps.</p>
            <button type="button" className="w-full rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-amber-700 hover:bg-amber-50">Buy Now</button>
          </div>
        </aside>
      </div>
    </section>
  )
}
