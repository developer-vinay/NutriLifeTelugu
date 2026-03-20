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

type TabKey = 'saved' | 'liked' | 'recipes' | 'videos'

export default function ProfileClient() {
  const { data: session, update } = useSession()
  const { language, setLanguage } = useLanguage()
  const [data, setData] = useState<ProfileData | null>(null)
  const [tab, setTab] = useState<TabKey>('saved')
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

  const initials = (data.user.name?.[0] ?? data.user.email[0]).toUpperCase()

  const tabs: { key: TabKey; icon: string; label: string; count: number }[] = [
    { key: 'saved',   icon: '🔖', label: 'Saved Posts',    count: data.savedPosts.length },
    { key: 'liked',   icon: '❤️', label: 'Liked Posts',    count: data.likedPosts.length },
    { key: 'recipes', icon: '🍲', label: 'Saved Recipes',  count: data.savedRecipes.length },
    { key: 'videos',  icon: '🎬', label: 'Saved Videos',   count: data.savedVideos.length },
  ]

  const stats = [
    { icon: '🔖', label: 'Saved',   val: data.savedPosts.length,   color: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: '❤️', label: 'Liked',   val: data.likedPosts.length,   color: 'bg-red-50 dark:bg-red-900/20' },
    { icon: '🍲', label: 'Recipes', val: data.savedRecipes.length, color: 'bg-amber-50 dark:bg-amber-900/20' },
    { icon: '🎬', label: 'Videos',  val: data.savedVideos.length,  color: 'bg-purple-50 dark:bg-purple-900/20' },
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-slate-950">

      {/* Hero banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#1A5C38] via-emerald-700 to-emerald-500 pb-16 pt-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold text-white shadow-xl">
            {data.user.image
              ? <img src={data.user.image} alt={data.user.name ?? ''} className="h-full w-full object-cover" />
              : initials}
          </div>
          <h1 className="font-nunito text-xl font-bold text-white">{data.user.name ?? 'User'}</h1>
          <p className="mt-0.5 text-xs text-emerald-100">{data.user.email}</p>
        </div>
      </div>

      {/* Stats row — overlaps hero */}
      <div className="mx-auto -mt-10 max-w-4xl px-3">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-4">
          {stats.map((s) => (
            <button key={s.label} type="button"
              onClick={() => setTab(s.label.toLowerCase() === 'saved' ? 'saved' : s.label.toLowerCase() === 'liked' ? 'liked' : s.label.toLowerCase() === 'recipes' ? 'recipes' : 'videos')}
              className={`flex flex-col items-center rounded-xl p-2.5 transition hover:scale-105 ${s.color}`}>
              <span className="text-lg">{s.icon}</span>
              <span className="mt-0.5 text-base font-bold text-gray-900 dark:text-slate-50">{s.val}</span>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-3 py-4">
        <div className="grid gap-4 md:grid-cols-[240px_1fr]">

          {/* Left sidebar — 2-col on mobile, stacked on md+ */}
          <div className="grid grid-cols-2 gap-3 md:block md:space-y-3">
            {/* Edit profile */}
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="mb-2 text-[11px] font-semibold text-gray-900 dark:text-slate-50">Edit Profile</h3>
              <form onSubmit={handleSaveProfile} className="space-y-2">
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-gray-600 dark:text-slate-400">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <button type="submit" disabled={saving}
                  className="w-full rounded-lg bg-[#1A5C38] py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">
                  {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save'}
                </button>
              </form>
            </div>

            {/* Language */}
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="mb-1 text-[11px] font-semibold text-gray-900 dark:text-slate-50">Language</h3>
              <p className="mb-2 text-[10px] text-gray-500 dark:text-slate-400">Content language.</p>
              <div className="flex gap-1.5">
                {(['te', 'en'] as Language[]).map((l) => (
                  <button key={l} type="button" onClick={() => setLanguage(l)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold transition ${
                      language === l
                        ? 'border-[#1A5C38] bg-[#1A5C38] text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-[#1A5C38] hover:text-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: tabs + horizontal scroll content */}
          <div>
            {/* Tab bar — horizontal scroll */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {tabs.map((t) => (
                <button key={t.key} type="button" onClick={() => setTab(t.key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition ${
                    tab === t.key
                      ? 'bg-[#1A5C38] text-white shadow-md'
                      : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}>
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Content — horizontal scroll row */}
            {tab === 'saved'   && <HScrollRow items={data.savedPosts}   renderItem={(p: Post)   => <PostCard   key={p._id} item={p} />} emptyMsg="No saved posts yet. Click 🔖 on any article." />}
            {tab === 'liked'   && <HScrollRow items={data.likedPosts}   renderItem={(p: Post)   => <PostCard   key={p._id} item={p} />} emptyMsg="No liked posts yet. Click ❤️ on any article." />}
            {tab === 'recipes' && <HScrollRow items={data.savedRecipes} renderItem={(r: Recipe) => <RecipeCard key={r._id} item={r} />} emptyMsg="No saved recipes yet. Click 🔖 on any recipe." />}
            {tab === 'videos'  && <HScrollRow items={data.savedVideos}  renderItem={(v: Video)  => <VideoCard  key={v._id} item={v} />} emptyMsg="No saved videos yet. Click 🔖 on any video." />}
          </div>
        </div>
      </div>
    </div>
  )
}

function HScrollRow<T>({ items, renderItem, emptyMsg }: { items: T[]; renderItem: (item: T) => React.ReactNode; emptyMsg: string }) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-gray-400 dark:text-slate-500">{emptyMsg}</p>
      </div>
    )
  }
  return (
    <>
      {/* Mobile: 2-col grid */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {items.map(renderItem)}
      </div>
      {/* Desktop: horizontal scroll */}
      <div className="hidden gap-4 overflow-x-auto pb-3 md:flex scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
        {items.map(renderItem)}
      </div>
    </>
  )
}

function PostCard({ item }: { item: Post }) {
  return (
    <Link href={`/blog/${item.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600 md:w-56 md:shrink-0">
      <div className="h-28 w-full overflow-hidden bg-emerald-50 dark:bg-emerald-900/30 md:h-36">
        {item.heroImage
          ? <img src={item.heroImage} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-105" />
          : <div className="flex h-full items-center justify-center text-3xl">📄</div>}
      </div>
      <div className="flex flex-1 flex-col p-3">
        {item.tag && <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{item.tag}</span>}
        <p className="line-clamp-2 flex-1 text-[12px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400 md:text-[13px]">{item.title}</p>
        {item.readTimeMinutes && <p className="mt-2 text-[10px] text-gray-400 dark:text-slate-500">{item.readTimeMinutes} min read</p>}
      </div>
    </Link>
  )
}

function RecipeCard({ item }: { item: Recipe }) {
  return (
    <Link href={`/recipes/${item.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600 md:w-56 md:shrink-0">
      <div className="h-28 w-full overflow-hidden bg-amber-50 dark:bg-amber-900/20 md:h-36">
        {item.heroImage
          ? <img src={item.heroImage} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-105" />
          : <div className="flex h-full items-center justify-center text-3xl">🍲</div>}
      </div>
      <div className="flex flex-1 flex-col p-3">
        {item.tag && <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">{item.tag}</span>}
        <p className="line-clamp-2 flex-1 text-[12px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400 md:text-[13px]">{item.title}</p>
      </div>
    </Link>
  )
}

function VideoCard({ item }: { item: Video }) {
  return (
    <a href={item.youtubeUrl} target="_blank" rel="noreferrer"
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600 md:w-56 md:shrink-0">
      <div className="relative flex h-28 w-full items-center justify-center overflow-hidden bg-gray-900 md:h-36">
        {item.thumbnailUrl
          ? <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-105" />
          : <span className="text-3xl text-white">▶</span>}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-900 text-sm">▶</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        {item.tag && <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">{item.tag}</span>}
        <p className="line-clamp-2 flex-1 text-[12px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400 md:text-[13px]">{item.title}</p>
        <p className="mt-2 text-[11px] font-semibold text-[#1A5C38] dark:text-emerald-400">Watch →</p>
      </div>
    </a>
  )
}
