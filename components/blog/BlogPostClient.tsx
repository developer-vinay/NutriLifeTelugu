'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import LikeSaveButtons from '@/components/ui/LikeSaveButtons'
import { useLanguage } from '@/components/LanguageProvider'
import { UtensilsCrossed } from 'lucide-react'

export type DBPost = {
  _id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  category?: string
  tag?: string
  language?: string
  heroImage?: string
  youtubeUrl?: string
  contentImages?: string[]
  readTimeMinutes?: number
  views: number
  likes?: number
  isPublished: boolean
  author: string
  createdAt: string
}

type Props = {
  post: DBPost
  related: DBPost[]
}

export default function BlogPostClient({ post, related }: Props) {
  const { setLanguage } = useLanguage()
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [newsletterState, setNewsletterState] = useState<'idle' | 'success'>('idle')
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/subscribers/count').then(r => r.json()).then(d => setSubscriberCount(d.count)).catch(() => {})
  }, [])

  // Sync navbar language to match the post's language
  useEffect(() => {
    if (post.language === 'te' || post.language === 'en') {
      setLanguage(post.language)
    }
  }, [post.language, setLanguage])

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('article-root')
      if (!el) return
      const total = el.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      setProgress(total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterState('success')
  }

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed inset-x-0 top-16 z-30 h-0.5 bg-transparent">
        <div
          className="h-0.5 bg-[#1A5C38] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-gray-50 pb-12 pt-6 text-gray-900 dark:bg-slate-950 dark:text-slate-50">
        <div
          id="article-root"
          className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row"
        >
          {/* Article */}
          <article className="w-full md:w-[68%]">
            {/* Breadcrumb */}
            <nav className="mb-3 text-[11px] text-gray-500 dark:text-slate-400">
              <Link href="/" className="text-[#1A5C38] hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200">Home</Link>
              <span className="mx-1">›</span>
              <Link href="/blog" className="text-[#1A5C38] hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200">Blog</Link>
              <span className="mx-1">›</span>
              <span className="text-gray-600 dark:text-slate-300">{post.title.slice(0, 40)}{post.title.length > 40 ? '…' : ''}</span>
            </nav>

            {/* Hero */}
            {post.heroImage ? (
              <img
                src={post.heroImage}
                alt={post.title}
                className="mb-4 h-56 w-full rounded-2xl object-cover md:h-96"
              />
            ) : (
              <div className="mb-4 flex h-56 items-center justify-center rounded-2xl bg-gray-200 dark:bg-slate-900 md:h-80">
                <UtensilsCrossed size={40} className="text-gray-400 dark:text-slate-600" />
              </div>
            )}

            {post.tag && (
              <span className="mb-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:bg-emerald-900/40 dark:text-emerald-300">
                {post.tag}
              </span>
            )}

            <h1 className="mb-3 font-nunito text-2xl font-bold leading-tight text-gray-900 dark:text-slate-50 md:text-3xl">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-gray-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A5C38] text-xs font-semibold text-white">
                  NL
                </div>
                <span className="font-medium text-gray-800 dark:text-slate-200">{post.author ?? 'NutriLife Telugu'}</span>
              </div>
              <span className="mx-1">•</span>
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                {' · '}
                {(() => {
                  const days = Math.floor((Date.now() - new Date(post.createdAt).getTime()) / 86400000)
                  if (days === 0) return 'Today'
                  if (days === 1) return '1 day ago'
                  if (days < 30) return `${days} days ago`
                  if (days < 365) return `${Math.floor(days / 30)} months ago`
                  return `${Math.floor(days / 365)} years ago`
                })()}
              </span>
              <span className="mx-1">•</span>
              <span>{post.readTimeMinutes ?? 5} min read</span>
              <span className="mx-1">•</span>
              <span>{(post.views ?? 0).toLocaleString('en-IN')} views</span>
            </div>

            {/* Share bar */}
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-gray-100 p-3 text-[11px] dark:bg-slate-900/80">
              <span className="text-gray-600 dark:text-slate-300">Share:</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ')}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs text-white hover:opacity-90"
              >
                WhatsApp
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="rounded-full bg-gray-200 px-3 py-1.5 text-xs text-gray-800 hover:opacity-90 dark:bg-slate-800 dark:text-slate-100"
              >
                {copied ? 'Copied!' : 'Copy link'}
              </button>
              <div className="ml-auto">
                <LikeSaveButtons contentId={post._id} contentType="post" initialLikes={post.likes ?? 0} />
              </div>
            </div>

            {/* YouTube embed */}
            {post.youtubeUrl && (
              <div className="mb-6 aspect-video w-full overflow-hidden rounded-2xl">
                <iframe
                  src={post.youtubeUrl.replace('watch?v=', 'embed/')}
                  title={post.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-emerald max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-[#1A5C38] prose-strong:text-gray-900 dark:prose-invert dark:text-slate-200 dark:prose-headings:text-slate-50 dark:prose-a:text-emerald-300 dark:prose-strong:text-slate-100"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Content images — shown only if admin uploaded them */}
            {post.contentImages && post.contentImages.length > 0 && (
              <div className="mt-6 space-y-4">
                {post.contentImages.map((img, i) => (
                  <figure key={i} className="overflow-hidden rounded-2xl">
                    <img
                      src={img}
                      alt={`${post.title} — image ${i + 1}`}
                      className="w-full object-cover"
                    />
                  </figure>
                ))}
              </div>
            )}

            {/* Author box */}
            <section className="mt-8 rounded-2xl bg-gray-100 p-5 dark:bg-slate-900/70">
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1A5C38] text-sm font-semibold text-white">
                  NL
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-slate-50">NutriLifeMithra</p>
                  <p className="text-[13px] text-gray-600 dark:text-slate-300">
                    Evidence-based nutrition content for Telugu families. Follow us on YouTube and Instagram.
                  </p>
                  <div className="mt-2 flex gap-2 text-[11px]">
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="rounded-full bg-red-600 px-3 py-1 font-semibold text-white hover:opacity-90">YouTube</a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full bg-pink-500 px-3 py-1 font-semibold text-white hover:opacity-90">Instagram</a>
                  </div>
                </div>
              </div>
            </section>

            {/* Related */}
            {related.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">You might also like</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {related.map((rp) => (
                    <Link
                      key={rp.slug}
                      href={`/blog/${rp.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 transition-transform duration-200 hover:scale-105 hover:ring-emerald-400 dark:bg-slate-900/70 dark:ring-slate-800 dark:hover:ring-emerald-600"
                    >
                      {rp.heroImage ? (
                        <img src={rp.heroImage} alt={rp.title} className="h-36 w-full object-cover" />
                      ) : (
                        <div className="flex h-36 items-center justify-center bg-gray-100 dark:bg-slate-800"><UtensilsCrossed size={24} className="text-gray-400 dark:text-slate-600" /></div>
                      )}
                      <div className="p-3">
                        <span className="mb-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-300">{rp.tag}</span>
                        <p className="mb-1 line-clamp-2 text-[13px] font-semibold text-gray-900 dark:text-slate-50">{rp.title}</p>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400">{rp.readTimeMinutes ?? 5} min read</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="w-full space-y-4 md:w-[32%] lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-3 text-xs text-gray-700 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-[11px] text-gray-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500">
                Advertisement — Google AdSense 300×250
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs text-gray-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="mb-1 text-[13px] font-semibold text-gray-900 dark:text-slate-50">Free weekly recipes</p>
              <p className="mb-2 text-[12px] text-gray-600 dark:text-slate-400">
                {subscriberCount !== null ? `Join ${subscriberCount.toLocaleString('en-IN')}+ Telugu health readers.` : 'Join Telugu health readers.'}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1A5C38] px-3 py-2 text-[13px] font-semibold text-white hover:opacity-90"
                >
                  Subscribe free
                </button>
              </form>
              {newsletterState === 'success' && (
                <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">You&apos;re in! Check your inbox.</p>
              )}
            </div>

            {related.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs text-gray-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <p className="mb-2 text-[13px] font-semibold text-gray-900 dark:text-slate-50">Popular this week</p>
                <ul className="space-y-2 text-[12px]">
                  {related.slice(0, 4).map((p, index) => (
                    <li key={p.slug} className="flex gap-2 border-b border-gray-100 pb-2 last:border-0 last:pb-0 dark:border-slate-700">
                      <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-emerald-50 text-center text-[10px] font-semibold text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <Link href={`/blog/${p.slug}`} className="line-clamp-2 text-[12px] text-gray-900 hover:text-[#1A5C38] dark:text-slate-200 dark:hover:text-emerald-400">{p.title}</Link>
                        <p className="text-[11px] text-gray-500 dark:text-slate-500">{p.readTimeMinutes ?? 5} min read</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
              <p className="mb-1 text-[13px] font-semibold">Premium 30-Day Meal Plan</p>
              <p className="mb-2 text-[12px] text-amber-800 dark:text-amber-300">Personalized Telugu diet plan · Diabetic friendly · Shopping list.</p>
              <p className="mb-2 text-xl font-bold text-amber-900 dark:text-amber-200">₹299</p>
              <button type="button" className="w-full rounded-lg bg-[#D97706] px-3 py-2 text-[13px] font-semibold text-white hover:opacity-90">
                Buy Now →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
