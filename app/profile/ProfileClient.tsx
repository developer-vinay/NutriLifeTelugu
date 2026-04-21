'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useLanguage, LANG_LABELS, type Language } from '@/components/LanguageProvider'
import { Bookmark, Heart, ChefHat, Video, FileText, UtensilsCrossed, Play } from 'lucide-react'

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
type TabDef = { key: TabKey; icon: React.ReactNode; label: string; count: number }

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

  const tabs: TabDef[] = [
    { key: 'saved',   icon: <Bookmark size={14} />, label: 'Saved Posts',   count: data.savedPosts.length },
    { key: 'liked',   icon: <Heart size={14} />,    label: 'Liked Posts',   count: data.likedPosts.length },
    { key: 'recipes', icon: <ChefHat size={14} />,  label: 'Saved Recipes', count: data.savedRecipes.length },
    { key: 'videos',  icon: <Video size={14} />,    label: 'Saved Videos',  count: data.savedVideos.length },
  ]

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">

      {/* ── MOBILE layout (hidden on md+) ── */}
      <div className="md:hidden">
        {/* Hero — with top padding for navbar */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1A5C38] via-emerald-700 to-emerald-500 pb-14 pt-8">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
          <div className="relative mx-auto max-w-sm px-4 text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/20 text-2xl font-bold text-white shadow-xl">
              {data.user.image ? <img src={data.user.image} alt="" className="h-full w-full object-cover" /> : initials}
            </div>
            <h1 className="font-nunito text-lg font-bold text-white">{data.user.name ?? 'User'}</h1>
            <p className="text-xs text-emerald-100">{data.user.email}</p>
          </div>
        </div>

        {/* Stats — overlaps hero */}
        <div className="mx-3 -mt-8">
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {tabs.map((t) => (
              <button key={t.key} type="button" onClick={() => setTab(t.key)}
                className={`flex flex-col items-center rounded-xl p-2 transition ${tab === t.key ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                <span className="text-base">{t.icon}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-slate-50">{t.count}</span>
                <span className="text-[9px] leading-tight text-center text-gray-500 dark:text-slate-400">{t.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Edit Profile — full width */}
        <div className="mx-3 mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-3 text-xs font-semibold text-gray-900 dark:text-slate-50">Edit Profile</h3>
          <form onSubmit={handleSaveProfile} className="space-y-2">
            <div>
              <label className="mb-1 block text-[10px] font-medium text-gray-600 dark:text-slate-400">Display Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium text-gray-600 dark:text-slate-400">Email</label>
              <input type="email" value={data.user.email} disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
            </div>
            <button type="submit" disabled={saving}
              className="w-full rounded-lg bg-[#1A5C38] py-2 text-xs font-semibold text-white disabled:opacity-60">
              {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Language — full width, 3 equal buttons */}
        <div className="mx-3 mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-1 text-xs font-semibold text-gray-900 dark:text-slate-50">Content Language</h3>
          <p className="mb-3 text-[10px] text-gray-500 dark:text-slate-400">Choose your preferred language for articles and recipes.</p>
          <div className="grid grid-cols-3 gap-2">
            {(['te', 'en', 'hi'] as Language[]).map((l) => (
              <button key={l} type="button" onClick={() => setLanguage(l)}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                  language === l
                    ? 'border-[#1A5C38] bg-[#1A5C38] text-white'
                    : 'border-gray-300 bg-white text-gray-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="mx-3 mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                tab === t.key ? 'bg-[#1A5C38] text-white' : 'bg-white text-gray-700 shadow-sm dark:bg-slate-800 dark:text-slate-300'
              }`}>
              {t.icon} {t.label}
              <span className={`rounded-full px-1 text-[10px] font-bold ${tab === t.key ? 'bg-white/20' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Content grid — 2 cols on mobile */}
        <div className="mx-3 mt-3 pb-8">
          {tab === 'saved'   && <MobileGrid items={data.savedPosts}   render={(p: Post)   => <PostCard   key={p._id} item={p} />} empty="No saved posts yet." />}
          {tab === 'liked'   && <MobileGrid items={data.likedPosts}   render={(p: Post)   => <PostCard   key={p._id} item={p} />} empty="No liked posts yet." />}
          {tab === 'recipes' && <MobileGrid items={data.savedRecipes} render={(r: Recipe) => <RecipeCard key={r._id} item={r} />} empty="No saved recipes yet." />}
          {tab === 'videos'  && <MobileGrid items={data.savedVideos}  render={(v: Video)  => <VideoCard  key={v._id} item={v} />} empty="No saved videos yet." />}
        </div>
      </div>

      {/* ── DESKTOP layout (hidden on mobile) ── */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-6xl px-6 pb-10">
          <div className="flex gap-8">

            {/* Left sidebar */}
            <aside className="w-72 shrink-0 space-y-5">
              {/* Avatar + name */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="bg-gradient-to-br from-[#1A5C38] to-emerald-500 px-6 py-8 text-center">
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold text-white shadow-xl">
                    {data.user.image ? <img src={data.user.image} alt="" className="h-full w-full object-cover" /> : initials}
                  </div>
                  <h2 className="font-nunito text-lg font-bold text-white">{data.user.name ?? 'User'}</h2>
                  <p className="mt-0.5 text-xs text-emerald-100">{data.user.email}</p>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-px bg-gray-100 dark:bg-slate-700">
                  {tabs.map((t) => (
                    <button key={t.key} type="button" onClick={() => setTab(t.key)}
                      className={`flex flex-col items-center bg-white px-3 py-3 transition hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-900/20 ${tab === t.key ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                      <span className="text-lg">{t.icon}</span>
                      <span className="text-base font-bold text-gray-900 dark:text-slate-50">{t.count}</span>
                      <span className="text-[10px] text-gray-500 dark:text-slate-400">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit profile */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-50">Edit Profile</h3>
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-400">Display Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-400">Email</label>
                    <input type="email" value={data.user.email} disabled className={`${inputCls} cursor-not-allowed opacity-60`} />
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full rounded-lg bg-[#1A5C38] py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
                    {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>

              {/* Language */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-slate-50">Content Language</h3>
                <p className="mb-3 text-xs text-gray-500 dark:text-slate-400">Choose your preferred language for articles and recipes.</p>
                <div className="flex gap-2">
                  {(['te', 'en', 'hi'] as Language[]).map((l) => (
                    <button key={l} type="button" onClick={() => setLanguage(l)}
                      className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                        language === l ? 'border-[#1A5C38] bg-[#1A5C38] text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-[#1A5C38] hover:text-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right content */}
            <div className="min-w-0 flex-1">
              {/* Tab bar */}
              <div className="mb-5 flex gap-2 border-b border-gray-200 pb-4 dark:border-slate-700">
                {tabs.map((t) => (
                  <button key={t.key} type="button" onClick={() => setTab(t.key)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      tab === t.key ? 'bg-[#1A5C38] text-white shadow-md' : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}>
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'}`}>{t.count}</span>
                  </button>
                ))}
              </div>

              {/* Content grid — 3 cols on desktop */}
              {tab === 'saved'   && <DesktopGrid items={data.savedPosts}   render={(p: Post)   => <PostCard   key={p._id} item={p} />} empty="No saved posts yet. Save any article to see it here." />}
              {tab === 'liked'   && <DesktopGrid items={data.likedPosts}   render={(p: Post)   => <PostCard   key={p._id} item={p} />} empty="No liked posts yet. Like any article to see it here." />}
              {tab === 'recipes' && <DesktopGrid items={data.savedRecipes} render={(r: Recipe) => <RecipeCard key={r._id} item={r} />} empty="No saved recipes yet. Save any recipe to see it here." />}
              {tab === 'videos'  && <DesktopGrid items={data.savedVideos}  render={(v: Video)  => <VideoCard  key={v._id} item={v} />} empty="No saved videos yet. Save any video to see it here." />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileGrid<T>({ items, render, empty }: { items: T[]; render: (i: T) => React.ReactNode; empty: string }) {
  if (!items.length) return (
    <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs text-gray-400 dark:text-slate-500">{empty}</p>
    </div>
  )
  return <div className="grid grid-cols-2 gap-3">{items.map(render)}</div>
}

function DesktopGrid<T>({ items, render, empty }: { items: T[]; render: (i: T) => React.ReactNode; empty: string }) {
  if (!items.length) return (
    <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-gray-400 dark:text-slate-500">{empty}</p>
    </div>
  )
  return <div className="grid grid-cols-3 gap-4 xl:grid-cols-4">{items.map(render)}</div>
}

function PostCard({ item }: { item: Post }) {
  return (
    <Link href={`/blog/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600">
      <div className="h-28 w-full overflow-hidden bg-emerald-50 dark:bg-emerald-900/30 md:h-36">
        {item.heroImage
          ? <img src={item.heroImage} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-105" />
          : <div className="flex h-full items-center justify-center bg-emerald-50 dark:bg-emerald-900/30"><FileText size={28} className="text-emerald-300" /></div>}
      </div>
      <div className="flex flex-1 flex-col p-3">
        {item.tag && <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">{item.tag}</span>}
        <p className="line-clamp-2 flex-1 text-[12px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{item.title}</p>
        {item.readTimeMinutes && <p className="mt-2 text-[10px] text-gray-400 dark:text-slate-500">{item.readTimeMinutes} min read</p>}
      </div>
    </Link>
  )
}

function RecipeCard({ item }: { item: Recipe }) {
  return (
    <Link href={`/recipes/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600">
      <div className="h-28 w-full overflow-hidden bg-amber-50 dark:bg-amber-900/20 md:h-36">
        {item.heroImage
          ? <img src={item.heroImage} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-105" />
          : <div className="flex h-full items-center justify-center bg-amber-50 dark:bg-amber-900/20"><UtensilsCrossed size={28} className="text-amber-300" /></div>}
      </div>
      <div className="flex flex-1 flex-col p-3">
        {item.tag && <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">{item.tag}</span>}
        <p className="line-clamp-2 flex-1 text-[12px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{item.title}</p>
      </div>
    </Link>
  )
}

function VideoCard({ item }: { item: Video }) {
  return (
    <a href={item.youtubeUrl} target="_blank" rel="noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600">
      <div className="relative flex h-28 w-full items-center justify-center overflow-hidden bg-gray-900 md:h-36">
        {item.thumbnailUrl
          ? <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-105" />
          : <span className="text-3xl text-white"><Play size={28} /></span>}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-900"><Play size={14} /></div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        {item.tag && <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">{item.tag}</span>}
        <p className="line-clamp-2 flex-1 text-[12px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{item.title}</p>
        <p className="mt-2 text-[11px] font-semibold text-[#1A5C38] dark:text-emerald-400">Watch →</p>
      </div>
    </a>
  )
}
