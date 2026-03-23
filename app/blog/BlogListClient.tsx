'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { FileText } from 'lucide-react'

type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  tag?: string
  language?: string
  heroImage?: string
  readTimeMinutes?: number
  views?: number
  createdAt: string
}

export default function BlogListClient() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/posts?lang=${language}`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [language])

  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-nunito text-3xl font-bold text-gray-900 dark:text-slate-50">
              {language === 'te' ? 'తాజా వ్యాసాలు' : language === 'hi' ? 'नवीनतम लेख' : 'Latest Articles'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
              {language === 'te'
                ? 'ఆరోగ్య చిట్కాలు, డైట్ గైడ్స్, తెలుగు న్యూట్రిషన్ కంటెంట్.'
                : language === 'hi'
                ? 'स्वास्थ्य टिप्स, डाइट गाइड और पोषण सामग्री।'
                : 'Health tips, diet guides, and nutrition content.'}
            </p>
          </div>
          {!loading && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
              {posts.length} articles
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500 dark:text-slate-400">
              {language === 'te' ? 'ఈ భాషలో వ్యాసాలు త్వరలో వస్తాయి.' : language === 'hi' ? 'इस भाषा में लेख जल्द आ रहे हैं।' : 'No articles in this language yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
              >
                <div className="h-36 w-full overflow-hidden bg-emerald-50 dark:bg-emerald-900/30">
                  {post.heroImage
                    ? <img src={post.heroImage} alt={post.title} className="h-full w-full object-cover" />
                    : <div className="flex h-full items-center justify-center bg-emerald-50 dark:bg-emerald-900/30"><FileText size={28} className="text-emerald-300" /></div>
                  }
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    {post.tag && (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#1A5C38] dark:bg-emerald-900/40 dark:text-emerald-400">
                        {post.tag}
                      </span>
                    )}
                    <span className="ml-auto text-[11px] text-gray-500 dark:text-slate-400">
                      {post.readTimeMinutes ?? 5} min read
                    </span>
                  </div>
                  <h2 className="line-clamp-2 font-nunito text-base font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-50 dark:group-hover:text-emerald-400">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-slate-400">
                    {post.excerpt}
                  </p>
                  <p className="mt-3 text-[11px] text-gray-500 dark:text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {' · '}
                    {(post.views ?? 0).toLocaleString('en-IN')} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
