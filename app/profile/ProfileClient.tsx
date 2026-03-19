'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useLanguage, LANG_LABELS, type Language } from '@/components/LanguageProvider'

type Post = { _id: string; title: string; slug: string; tag?: string; heroImage?: string; readTimeMinutes?: number }
type Recipe = { _id: string; title: string; slug: string; tag?: string; heroImage?: string }
type Video = { _id: string; title: string; slug: string; tag?: string; thumbnailUrl?: string; youtubeUrl: string }

type ProfileData = {
  user: { name?: string; email: string; image?: string; language: Language }
  savedPosts: Post[]
  likedPosts: Post[]
  savedRecipes: Recipe[]
  likedRecipes: Recipe[]
  savedVideos: Video[]
  likedVideos: Video[]
}

export default function ProfileClient() {
  const { data: session, update } = useSession()
  const { language, setLanguage } = useLanguage()
  const [data, setData] = useState<ProfileData | null>(null)
  const [tab, setTab] = useState<'saved' | 'liked' | 'recipes' | 'videos'>('saved')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((d) => { setData(d); setName(d.user?.name ?? '') })
  }, [])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    await update({ name })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A5C38] border-t-transparent" />
      </div>
    )
  }

  const tabs = [
    { key: 'saved' as const, label: '🔖 Saved Posts', count: data.savedPosts.length },
    { key: 'liked' as const, label: '❤️ Liked Posts', count: data.likedPosts.length },
    { key: 'recipes' as const, label: '🍲 Saved Recipes', count: data.savedRecipes.length },
    { key: 'videos' as const, label: '🎬 Saved Videos', count: data.savedVideos.length },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">

          {/* Left: Profile card */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-4 flex flex-col items-center text-center">
                <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-3xl font-bold text-[#1A5C38] dark:bg-emerald-900/40 dark:text-emerald-400">
                  {data.user.image
                    ? <img src={data.user.image} alt={data.user.name ?? ''} className="h-full w-full object-cover" />
                    : (data.user.name?.[0] ?? data.user.email[0]).toUpperCase()
                  }
                </div>
                <p className="font-nunito text-lg font-bold text-gray-900 dark:text-slate-50">{data.user.name ?? 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{data.user.email}</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-[#1A5C38] py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
                >
                  {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Language preference */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-50">Content Language</h3>
              <p className="mb-3 text-xs text-gray-500 dark:text-slate-400">Choose the language for articles, recipes, and videos.</p>
              <div className="flex gap-2">
                {(['te', 'en'] as Language[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLanguage(l)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                      language === l
                        ? 'border-[#1A5C38] bg-[#1A5C38] text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-[#1A5C38] hover:text-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-50">Activity</h3>
              <div className="grid grid-cols-2 gap-2 text-center">
                {[
                  { label: 'Saved', val: data.savedPosts.length },
                  { label: 'Liked', val: data.likedPosts.length },
                  { label: 'Recipes', val: data.savedRecipes.length },
                  { label: 'Videos', val: data.savedVideos.length },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-gray-50 p-3 dark:bg-slate-800">
                    <p className="text-lg font-bold text-[#1A5C38] dark:text-emerald-400">{s.val}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: tabs */}
          <div className="flex flex-col">
            <div className="mb-4 flex gap-2 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    tab === t.key
                      ? 'bg-[#1A5C38] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex-1">
              {tab === 'saved' && <PostGrid posts={data.savedPosts} emptyMsg="No saved posts yet. Click 🔖 on any article to save it." />}
              {tab === 'liked' && <PostGrid posts={data.likedPosts} emptyMsg="No liked posts yet. Click ❤️ on any article to like it." />}
              {tab === 'recipes' && <RecipeGrid recipes={data.savedRecipes} emptyMsg="No saved recipes yet. Click 🔖 on any recipe to save it." />}
              {tab === 'videos' && <VideoGrid videos={data.savedVideos} emptyMsg="No saved videos yet. Click 🔖 on any video to save it." />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostGrid({ posts, emptyMsg }: { posts: Post[]; emptyMsg: string }) {
  if (posts.length === 0) return <EmptyState msg={emptyMsg} />
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <Link key={p._id} href={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600">
          <div className="h-40 w-full overflow-hidden bg-emerald-50 dark:bg-emerald-900/30">
            {p.heroImage ? <img src={p.heroImage} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-4xl">📄</div>}
          </div>
          <div className="flex flex-1 flex-col p-4">
            {p.tag && <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{p.tag}</span>}
            <p className="line-clamp-2 flex-1 text-sm font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{p.title}</p>
            {p.readTimeMinutes && <p className="mt-2 text-[11px] text-gray-400 dark:text-slate-500">{p.readTimeMinutes} min read</p>}
          </div>
        </Link>
      ))}
    </div>
  )
}

function RecipeGrid({ recipes, emptyMsg }: { recipes: Recipe[]; emptyMsg: string }) {
  if (recipes.length === 0) return <EmptyState msg={emptyMsg} />
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((r) => (
        <Link key={r._id} href={`/recipes/${r.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600">
          <div className="h-40 w-full overflow-hidden bg-emerald-50 dark:bg-emerald-900/30">
            {r.heroImage ? <img src={r.heroImage} alt={r.title} className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-4xl">🍲</div>}
          </div>
          <div className="flex flex-1 flex-col p-4">
            {r.tag && <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{r.tag}</span>}
            <p className="line-clamp-2 flex-1 text-sm font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{r.title}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

function VideoGrid({ videos, emptyMsg }: { videos: Video[]; emptyMsg: string }) {
  if (videos.length === 0) return <EmptyState msg={emptyMsg} />
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <a key={v._id} href={v.youtubeUrl} target="_blank" rel="noreferrer" className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600">
          <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-gray-900">
            {v.thumbnailUrl ? <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover transition group-hover:scale-105" /> : <span className="text-4xl text-white">▶</span>}
          </div>
          <div className="flex flex-1 flex-col p-4">
            {v.tag && <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{v.tag}</span>}
            <p className="line-clamp-2 flex-1 text-sm font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{v.title}</p>
            <p className="mt-2 text-[11px] font-semibold text-[#1A5C38] dark:text-emerald-400">Watch on YouTube →</p>
          </div>
        </a>
      ))}
    </div>
  )
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-gray-500 dark:text-slate-400">{msg}</p>
    </div>
  )
}
