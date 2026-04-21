'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { Play, Leaf, Scale, Stethoscope, Wind, Microscope, Shield, Baby, BarChart2, Flame, Droplets, Candy, ArrowRight, UtensilsCrossed } from 'lucide-react'
import PromotionBlock from '@/components/promotions/PromotionBlock'

type DBPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  tag?: string
  language?: string
  heroImage?: string
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

function HomeVideos({ language }: { language: string }) {
  const [videos, setVideos] = useState<{ _id: string; title: string; youtubeUrl: string; youtubeId: string; thumbnailUrl?: string; tag?: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/videos?lang=${language}&limit=6`)
      .then(r => r.json())
      .then(data => { setVideos(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [language])

  if (loading) return (
    <div className="grid grid-cols-3 gap-3">
      {[...Array(6)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />)}
    </div>
  )

  if (videos.length === 0) return (
    <p className="text-sm text-gray-500 dark:text-slate-400">
      {language === 'te' ? 'వీడియోలు త్వరలో వస్తాయి.' : language === 'hi' ? 'वीडियो जल्द आ रहे हैं।' : 'Videos coming soon.'}
    </p>
  )

  return (
    <div className="grid grid-cols-3 gap-3">
      {videos.map((v) => (
        <a key={v._id} href={v.youtubeUrl} target="_blank" rel="noreferrer"
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60">
          <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
            {v.thumbnailUrl
              ? <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              : <div className="flex h-full items-center justify-center bg-gray-800"><Play size={24} className="text-white/50" /></div>
            }
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 shadow-lg">
                <Play size={14} className="ml-0.5 text-white" fill="white" />
              </div>
            </div>
          </div>
          <div className="p-2.5">
            {v.tag && <span className="text-[9px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{v.tag.split(',')[0].trim()}</span>}
            <p className="mt-0.5 line-clamp-2 text-[12px] font-semibold text-gray-900 group-hover:text-red-600 dark:text-slate-100">{v.title}</p>
          </div>
        </a>
      ))}
    </div>
  )
}

function SidebarPopularPosts({ language }: { language: string }) {
  const [posts, setPosts] = useState<{ _id: string; title: string; slug: string; heroImage?: string; tag?: string; readTimeMinutes?: number; views?: number }[]>([])

  useEffect(() => {
    fetch(`/api/posts?lang=${language}&limit=5&sort=popular`)
      .then(r => r.json())
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [language])

  if (posts.length === 0) return (
    <p className="text-[11px] text-gray-400 dark:text-slate-500">
      {language === 'te' ? 'వ్యాసాలు త్వరలో వస్తాయి.' : language === 'hi' ? 'लेख जल्द आ रहे हैं।' : 'Articles coming soon.'}
    </p>
  )

  return (
    <ol className="space-y-3">
      {posts.map((post, idx) => (
        <li key={post._id} className="flex gap-2.5 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-slate-700">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <Link href={`/blog/${post.slug}`} className="flex-1 group">
            <p className="line-clamp-2 text-[12px] font-medium text-gray-800 group-hover:text-[#1A5C38] dark:text-slate-200 dark:group-hover:text-emerald-400">{post.title}</p>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400 dark:text-slate-500">
              <span>{post.readTimeMinutes ?? 5} min read</span>
              {post.views ? <span>· {post.views.toLocaleString('en-IN')} views</span> : null}
            </div>
          </Link>
        </li>
      ))}
    </ol>
  )
}

function SidebarPopularRecipes({ language }: { language: string }) {
  const [recipes, setRecipes] = useState<{ _id: string; title: string; slug: string; heroImage?: string; tag?: string; prepTimeMinutes?: number; views?: number; likes?: number }[]>([])

  useEffect(() => {
    fetch(`/api/popular-recipes?lang=${language}&limit=5`)
      .then(r => r.json())
      .then(data => setRecipes(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [language])

  if (recipes.length === 0) return (
    <p className="text-[11px] text-gray-400 dark:text-slate-500">
      {language === 'te' ? 'రెసిపీలు త్వరలో వస్తాయి.' : language === 'hi' ? 'रेसिपी जल्द आ रहे हैं।' : 'Recipes coming soon.'}
    </p>
  )

  return (
    <div className="space-y-3">
      {recipes.map((r, idx) => (
        <Link key={r._id} href={`/recipes/${r.slug}`}
          className="group flex items-center gap-2.5">
          {/* Rank number */}
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
            {String(idx + 1).padStart(2, '0')}
          </span>
          {/* Thumbnail */}
          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-emerald-50 dark:bg-slate-700">
            {r.heroImage
              ? <img src={r.heroImage} alt={r.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              : <div className="flex h-full items-center justify-center"><UtensilsCrossed size={14} className="text-emerald-300" /></div>
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-[12px] font-medium text-gray-800 group-hover:text-[#1A5C38] dark:text-slate-200 dark:group-hover:text-emerald-400">{r.title}</p>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400 dark:text-slate-500">
              {r.prepTimeMinutes && <span>{r.prepTimeMinutes} min</span>}
              {r.views ? <span>· {r.views.toLocaleString('en-IN')} views</span> : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function SidebarVideos({ language }: { language: string }) {
  const [videos, setVideos] = useState<{ _id: string; title: string; youtubeUrl: string; thumbnailUrl?: string; tag?: string }[]>([])

  useEffect(() => {
    fetch(`/api/videos?lang=${language}&limit=3&sort=popular`)
      .then(r => r.json())
      .then(data => setVideos(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [language])

  if (videos.length === 0) return (
    <p className="text-[11px] text-gray-400 dark:text-slate-500">
      {language === 'te' ? 'వీడియోలు త్వరలో వస్తాయి.' : language === 'hi' ? 'वीडियो जल्द आ रहे हैं।' : 'Videos coming soon.'}
    </p>
  )

  return (
    <div className="space-y-3">
      {videos.map((v) => (
        <a key={v._id} href={v.youtubeUrl} target="_blank" rel="noreferrer"
          className="group flex gap-2.5 items-start">
          <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-900">
            {v.thumbnailUrl
              ? <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              : <div className="flex h-full items-center justify-center"><Play size={14} className="text-white/50" /></div>
            }
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600">
                <Play size={10} className="ml-0.5 text-white" fill="white" />
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            {v.tag && <p className="text-[9px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{v.tag.split(',')[0].trim()}</p>}
            <p className="line-clamp-2 text-[12px] font-medium text-gray-800 group-hover:text-red-600 dark:text-slate-200">{v.title}</p>
          </div>
        </a>
      ))}
    </div>
  )
}

export default function HomeMainLayout({ latestVideo }: { latestVideo: DBVideo | null }) {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<DBPost[]>([])
  const [recipes, setRecipes] = useState<DBRecipe[]>([])
  const [healthTipPosts, setHealthTipPosts] = useState<DBPost[]>([])
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

  // Fetch health tip posts separately — from health-specific categories
  useEffect(() => {
    const cats = ['weight-loss', 'diabetes', 'gut-health', 'thyroid', 'immunity', 'kids-nutrition']
    fetch(`/api/posts?lang=${language}&limit=3&categories=${cats.join(',')}`)
      .then(r => r.json())
      .then(data => setHealthTipPosts(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {})
  }, [language])

  const mainPosts = posts.slice(0, 6)

  return (
    <section className="bg-gray-50 pb-12 pt-6 dark:bg-slate-950">
      {/* Popup promo — renders after 5s */}
      <PromotionBlock placement="popup" language={language} />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row">

        {/* Main content */}
        <div className="w-full space-y-6 md:w-[70%]">

          {/* Home banner promo — auto-rotating */}
          <PromotionBlock placement="home-banner" language={language} />

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
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-600">
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-t-2xl">
                      {post.heroImage
                        ? <img src={post.heroImage} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                        : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-slate-700"><Leaf size={28} className="text-emerald-400 dark:text-emerald-600" /></div>
                      }
                    </div>
                    <div className="px-3 pb-3 pt-2">
                      {post.tag && (
                        <div className="mb-1 flex flex-wrap gap-1">
                          {post.tag.split(',').slice(0, 2).map((t) => (
                            <span key={t} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="mb-1 line-clamp-2 text-[13px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{post.title}</h3>
                      <p className="mb-2 line-clamp-2 text-[11px] text-gray-500 dark:text-slate-400">{post.excerpt}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">
                        {post.readTimeMinutes ?? 5} min read · {timeAgo(post.createdAt)}
                      </p>
                    </div>
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
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">
                        {recipe.tag?.split(',')[0]?.trim()}
                      </span>
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
            <div className="flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A5C38] to-emerald-600 px-5 py-4 text-white shadow-md md:flex-row md:items-center">
              <div>
                <p className="font-nunito text-base font-bold">Free 7-day meal plan</p>
                <p className="text-[12px] text-emerald-100">Telugu cuisine · Diabetic friendly · Printable PDF</p>
              </div>
              <Link href="/diet-plans" className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-bold text-[#1A5C38] shadow hover:bg-emerald-50 transition whitespace-nowrap">
                Download Free →
              </Link>
            </div>
          </section>

          {/* Health Tips — 3 columns, dedicated fetch from health categories */}
          <section>
            <SectionHeader
              title={language === 'te' ? 'హెల్త్ టిప్స్' : language === 'hi' ? 'हेल्थ टिप्स' : 'Health Tips'}
              href="/health-tips/weight-loss"
            />
            {loading ? (
              <div className="grid grid-cols-3 gap-3">{[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}</div>
            ) : healthTipPosts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {language === 'te' ? 'హెల్త్ టిప్స్ త్వరలో వస్తాయి.' : language === 'hi' ? 'हेल्थ टिप्स जल्द आ रहे हैं।' : 'Health tips coming soon.'}
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {healthTipPosts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-600">
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-t-2xl">
                      {post.heroImage
                        ? <img src={post.heroImage} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                        : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-slate-700"><Leaf size={28} className="text-emerald-400 dark:text-emerald-600" /></div>
                      }
                    </div>
                    <div className="px-3 pb-3 pt-2">
                      {post.tag && (
                        <div className="mb-1 flex flex-wrap gap-1">
                          {post.tag.split(',').slice(0, 1).map((t) => (
                            <span key={t} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="mb-1 line-clamp-2 text-[13px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{post.title}</h3>
                      <p className="mb-2 line-clamp-2 text-[11px] text-gray-500 dark:text-slate-400">{post.excerpt}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">
                        {post.readTimeMinutes ?? 5} min read · {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Health Categories — visual cards */}
          <section>
            <SectionHeader
              title={language === 'te' ? 'హెల్త్ కేటగిరీలు' : language === 'hi' ? 'स्वास्थ्य श्रेणियाँ' : 'Browse by Health Topic'}
              href="/blog"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                {
                  href: '/health-tips/weight-loss',
                  icon: <Scale size={22} />,
                  gradient: 'from-orange-400 to-amber-500',
                  te: 'బరువు తగ్గడం', hi: 'वजन घटाना', en: 'Weight Loss',
                  subTe: 'సైన్స్-బేస్డ్ టిప్స్', subHi: 'विज्ञान-आधारित टिप्स', subEn: 'Science-based tips',
                },
                {
                  href: '/health-tips/diabetes',
                  icon: <Stethoscope size={22} />,
                  gradient: 'from-blue-400 to-cyan-500',
                  te: 'మధుమేహం', hi: 'मधुमेह', en: 'Diabetes',
                  subTe: 'షుగర్ కంట్రోల్ గైడ్', subHi: 'शुगर कंट्रोल गाइड', subEn: 'Sugar control guide',
                },
                {
                  href: '/health-tips/gut-health',
                  icon: <Wind size={22} />,
                  gradient: 'from-emerald-400 to-green-500',
                  te: 'గట్ హెల్త్', hi: 'पाचन स्वास्थ्य', en: 'Gut Health',
                  subTe: 'జీర్ణశక్తి మెరుగు', subHi: 'पाचन सुधारें', subEn: 'Better digestion',
                },
                {
                  href: '/health-tips/thyroid',
                  icon: <Microscope size={22} />,
                  gradient: 'from-purple-400 to-violet-500',
                  te: 'థైరాయిడ్', hi: 'थायरॉइड', en: 'Thyroid',
                  subTe: 'హార్మోన్ బ్యాలెన్స్', subHi: 'हार्मोन संतुलन', subEn: 'Hormone balance',
                },
                {
                  href: '/health-tips/immunity',
                  icon: <Shield size={22} />,
                  gradient: 'from-red-400 to-rose-500',
                  te: 'రోగనిరోధకత', hi: 'रोग प्रतिरोधक', en: 'Immunity',
                  subTe: 'రోజువారీ ఆహారం', subHi: 'दैनिक आहार', subEn: 'Daily food habits',
                },
                {
                  href: '/health-tips/kids-nutrition',
                  icon: <Baby size={22} />,
                  gradient: 'from-pink-400 to-fuchsia-500',
                  te: 'పిల్లల పోషణ', hi: 'बच्चों का पोषण', en: "Kids' Nutrition",
                  subTe: 'టిఫిన్ & గ్రోత్', subHi: 'टिफिन और विकास', subEn: 'Tiffin & growth',
                },
              ].map((cat) => (
                <Link key={cat.href} href={cat.href}
                  className="group relative overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`bg-gradient-to-br ${cat.gradient} p-4 text-white`}>
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                      {cat.icon}
                    </div>
                    <p className="font-nunito text-sm font-bold leading-tight">
                      {language === 'te' ? cat.te : language === 'hi' ? cat.hi : cat.en}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/80">
                      {language === 'te' ? cat.subTe : language === 'hi' ? cat.subHi : cat.subEn}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-white/70 group-hover:text-white">
                      {language === 'te' ? 'చదవండి' : language === 'hi' ? 'पढ़ें' : 'Read more'}
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Health Tools strip */}
          <section>
            <SectionHeader
              title={language === 'te' ? 'ఉచిత హెల్త్ టూల్స్' : language === 'hi' ? 'मुफ्त हेल्थ टूल्स' : 'Free Health Tools'}
              href="/health-tools"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: <BarChart2 size={22} />, te: 'BMI కాలిక్యులేటర్', hi: 'BMI कैलकुलेटर', en: 'BMI Calculator', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40' },
                { icon: <Flame size={22} />, te: 'కేలరీ చెకర్', hi: 'कैलोरी चेकर', en: 'Calorie Checker', bg: 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400', iconBg: 'bg-orange-100 dark:bg-orange-900/40' },
                { icon: <Droplets size={22} />, te: 'నీటి అవసరం', hi: 'पानी की जरूरत', en: 'Water Intake', bg: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-900/40' },
                { icon: <Candy size={22} />, te: 'షుగర్ చెకర్', hi: 'शुगर चेकर', en: 'Sugar Checker', bg: 'bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-900/20 dark:border-pink-800 dark:text-pink-400', iconBg: 'bg-pink-100 dark:bg-pink-900/40' },
              ].map((tool) => (
                <Link key={tool.en} href="/health-tools"
                  className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-center text-[12px] font-semibold transition hover:-translate-y-0.5 hover:shadow-sm ${tool.bg}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tool.iconBg}`}>
                    {tool.icon}
                  </div>
                  <span>{language === 'te' ? tool.te : language === 'hi' ? tool.hi : tool.en}</span>
                  <span className="flex items-center gap-0.5 text-[10px] font-normal text-[#1A5C38] dark:text-emerald-400">
                    Try free <ArrowRight size={9} />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Videos section */}
          <section>
            <SectionHeader
              title={language === 'te' ? 'తాజా వీడియోలు' : language === 'hi' ? 'नवीनतम वीडियो' : 'Latest Videos'}
              href="/videos"
            />
            <HomeVideos language={language} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full space-y-4 md:w-[30%] md:sticky md:top-20 md:self-start">
          {/* Sidebar promotions — replaces static ad placeholder */}
          <PromotionBlock placement="sidebar" language={language} />
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4 shadow-sm dark:border-emerald-800/50 dark:from-emerald-900/20 dark:to-slate-800">
            <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Free 7-Day Meal Plan</p>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">Telugu cuisine · Diabetic friendly · Printable PDF</p>
            <Link href="/diet-plans" className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-[#1A5C38] px-3 py-2 text-xs font-semibold text-white hover:opacity-90">
              Download Free →
            </Link>
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

          {/* Popular Posts */}
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-slate-50">
                {language === 'te' ? 'పాపులర్ వ్యాసాలు' : language === 'hi' ? 'लोकप्रिय लेख' : 'Popular Articles'}
              </h3>
              <a href="/blog" className="text-[11px] font-medium text-[#1A5C38] hover:underline dark:text-emerald-400">View all →</a>
            </div>
            <SidebarPopularPosts language={language} />
          </div>

          {/* Popular Videos */}
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-slate-50">
                {language === 'te' ? 'పాపులర్ వీడియోలు' : language === 'hi' ? 'लोकप्रिय वीडियो' : 'Popular Videos'}
              </h3>
              <a href="/videos" className="text-[11px] font-medium text-[#1A5C38] hover:underline dark:text-emerald-400">View all →</a>
            </div>
            <SidebarVideos language={language} />
          </div>

          {/* Trending Recipes sidebar */}
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-slate-50">
                {language === 'te' ? 'ట్రెండింగ్ రెసిపీలు' : language === 'hi' ? 'ट्रेंडिंग रेसिपी' : 'Trending Recipes'}
              </h3>
              <a href="/recipes" className="text-[11px] font-medium text-[#1A5C38] hover:underline dark:text-emerald-400">View all →</a>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-slate-500">
              {language === 'te' ? 'వ్యూస్ & లైక్స్ ఆధారంగా' : language === 'hi' ? 'व्यूज और लाइक्स के आधार पर' : 'Ranked by views & likes'}
            </p>
            <SidebarPopularRecipes language={language} />
          </div>

          <div className="space-y-2 rounded-2xl bg-amber-500 p-4 text-xs text-white shadow-md">
            <p className="text-sm font-bold">Premium Meal Plan — ₹299</p>
            <p className="text-[11px] text-amber-100">Structured 4-week Telugu meal plan with grocery lists, recipes, and blood-sugar friendly swaps.</p>
            <Link href="/diet-plans#premium" className="block w-full rounded-md bg-white px-3 py-2 text-center text-[11px] font-semibold text-amber-700 hover:bg-amber-50">Buy Now →</Link>
          </div>

          {/* Health tools CTA */}
          <div className="space-y-2 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-900/20">
            <p className="text-xs font-bold text-blue-900 dark:text-blue-100">Free Health Tools</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300">BMI · Calorie · Ideal Weight · Sugar · Water calculators</p>
            <Link href="/health-tools" className="block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-[11px] font-semibold text-white hover:bg-blue-700">
              Try Free Tools →
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
