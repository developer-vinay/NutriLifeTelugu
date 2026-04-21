import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { Video } from '@/models/Video'
import { Subscriber } from '@/models/Subscriber'
import Link from 'next/link'
import { format } from 'date-fns'
import DashboardDeleteButton from './DashboardDeleteButton'
import { FileText, ChefHat, Video as VideoIcon, Users, Plus, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminDashboardPage() {
  await connectDB()

  const [postCount, recipeCount, videoCount, subscriberCount] = await Promise.all([
    Post.countDocuments(),
    Recipe.countDocuments(),
    Video.countDocuments(),
    Subscriber.countDocuments(),
  ])

  const [recentPosts, recentRecipes, recentVideos] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).limit(5).lean(),
    Recipe.find().sort({ createdAt: -1 }).limit(5).lean(),
    Video.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Dashboard</h1>
        <p className="mt-0.5 text-sm text-gray-500">Welcome back — here's what's happening.</p>
      </div>

      {/* ── Stat cards ── */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Posts" value={postCount} icon={FileText} color="blue" href="/admin/posts" />
        <StatCard label="Recipes" value={recipeCount} icon={ChefHat} color="emerald" href="/admin/recipes" />
        <StatCard label="Videos" value={videoCount} icon={VideoIcon} color="purple" href="/admin/videos" />
        <StatCard label="Subscribers" value={subscriberCount} icon={Users} color="amber" href="/admin/subscribers" />
      </section>

      {/* ── Quick actions ── */}
      <section>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-gray-400">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <QuickAction href="/admin/posts/new" label="New Post" color="green" />
          <QuickAction href="/admin/recipes/new" label="New Recipe" color="green" />
          <QuickAction href="/admin/videos/new" label="New Video" color="green" />
          <QuickAction href="/admin/plans/new" label="New Plan" color="amber" />
          <QuickAction href="/admin/subscribers" label="Send Digest" color="blue" emoji="📧" />
        </div>
      </section>

      {/* ── Recent Posts + Recipes (side by side on lg) ── */}
      <section className="grid gap-4 lg:grid-cols-2 min-w-0">
        <RecentList
          title="Recent Posts"
          viewAllHref="/admin/posts"
          rows={recentPosts.map((p) => ({
            id: p._id.toString(),
            title: p.title,
            lang: (p as any).language,
            published: p.isPublished,
            date: p.createdAt ? format(new Date(p.createdAt), 'dd MMM') : '-',
            editHref: `/admin/posts/${p._id.toString()}/edit`,
            type: 'posts' as const,
          }))}
        />
        <RecentList
          title="Recent Recipes"
          viewAllHref="/admin/recipes"
          rows={recentRecipes.map((r) => ({
            id: r._id.toString(),
            title: r.title,
            lang: (r as any).language,
            published: r.isPublished,
            date: r.createdAt ? format(new Date(r.createdAt), 'dd MMM') : '-',
            editHref: `/admin/recipes/${r._id.toString()}/edit`,
            type: 'recipes' as const,
          }))}
        />
      </section>

      {/* ── Recent Videos ── */}
      <section>
        <RecentList
          title="Recent Videos"
          viewAllHref="/admin/videos"
          rows={recentVideos.map((v) => ({
            id: v._id.toString(),
            title: v.title,
            lang: (v as any).language,
            published: v.isPublished,
            date: v.createdAt ? format(new Date(v.createdAt), 'dd MMM') : '-',
            editHref: `/admin/videos/${v._id.toString()}/edit`,
            type: 'videos' as const,
          }))}
        />
      </section>
    </div>
  )
}

/* ─── Types ─── */
type Row = {
  id: string
  title: string
  lang?: string
  published: boolean
  date: string
  editHref: string
  type: 'posts' | 'recipes' | 'videos'
}

/* ─── StatCard ─── */
const colorMap = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-500',    num: 'text-blue-700'    },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', num: 'text-emerald-700' },
  purple:  { bg: 'bg-purple-50',  icon: 'text-purple-500',  num: 'text-purple-700'  },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-500',   num: 'text-amber-700'   },
}

function StatCard({
  label, value, icon: Icon, color, href,
}: {
  label: string; value: number; icon: React.ElementType; color: keyof typeof colorMap; href: string
}) {
  const c = colorMap[color]
  return (
    <Link href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
        <Icon className={`h-5 w-5 ${c.icon}`} />
      </div>
      <div>
        <p className={`text-2xl font-bold ${c.num}`}>{value}</p>
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
    </Link>
  )
}

/* ─── QuickAction ─── */
function QuickAction({ href, label, color, emoji }: { href: string; label: string; color: 'green' | 'amber' | 'blue'; emoji?: string }) {
  const cls = {
    green: 'bg-[#1A5C38] hover:bg-emerald-800 text-white',
    amber: 'bg-amber-500 hover:bg-amber-600 text-white',
    blue:  'bg-blue-600 hover:bg-blue-700 text-white',
  }[color]
  return (
    <Link href={href}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition active:scale-95 ${cls}`}>
      {emoji ? <span>{emoji}</span> : <Plus className="h-3.5 w-3.5" />}
      {label}
    </Link>
  )
}

/* ─── RecentList ─── */
function RecentList({ title, viewAllHref, rows }: { title: string; viewAllHref: string; rows: Row[] }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <Link href={viewAllHref}
          className="flex items-center gap-1 text-xs font-medium text-[#1A5C38] hover:underline">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Rows — single layout that works on all sizes */}
      <ul className="divide-y divide-gray-50">
        {rows.length === 0 ? (
          <li className="px-4 py-6 text-center text-xs text-gray-400">Nothing here yet.</li>
        ) : rows.map((row) => (
          <li key={row.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
            {/* Title + meta */}
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-900">{row.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <LangBadge lang={row.lang} />
                <StatusBadge published={row.published} />
                <span className="text-[11px] text-gray-400">{row.date}</span>
              </div>
            </div>
            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <Link href={row.editHref}
                className="rounded-lg border border-[#1A5C38]/30 px-2.5 py-1 text-[11px] font-semibold text-[#1A5C38] hover:bg-emerald-50 transition-colors">
                Edit
              </Link>
              <DashboardDeleteButton id={row.id} type={row.type} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Badges ─── */
function LangBadge({ lang }: { lang?: string }) {
  if (lang === 'te') return <span className="inline-flex rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">తె</span>
  if (lang === 'hi') return <span className="inline-flex rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">हि</span>
  return <span className="inline-flex rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">EN</span>
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
      {published ? '● Live' : '○ Draft'}
    </span>
  )
}
