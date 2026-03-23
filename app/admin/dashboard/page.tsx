import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { Video } from '@/models/Video'
import { Subscriber } from '@/models/Subscriber'
import Link from 'next/link'
import { format } from 'date-fns'
import DashboardDeleteButton from './DashboardDeleteButton'

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
      {/* Stat cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Posts" value={postCount} />
        <StatCard label="Total Recipes" value={recipeCount} />
        <StatCard label="Total Videos" value={videoCount} />
        <StatCard label="Total Subscribers" value={subscriberCount} />
      </section>

      {/* Quick actions */}
      <section className="flex flex-wrap gap-3">
        <Link href="/admin/posts/new" className="inline-flex items-center rounded-md bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">New Post →</Link>
        <Link href="/admin/recipes/new" className="inline-flex items-center rounded-md bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">New Recipe →</Link>
        <Link href="/admin/videos/new" className="inline-flex items-center rounded-md bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">New Video →</Link>
        <Link href="/admin/plans/new" className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700">New Plan →</Link>
        <Link href="/admin/subscribers" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">📧 Send Weekly Digest →</Link>
      </section>

      {/* Recent Posts + Recipes */}
      <section className="grid gap-6 lg:grid-cols-2">
        <RecentTable title="Recent Posts" viewAllHref="/admin/posts" rows={recentPosts.map((p) => ({
          id: p._id.toString(),
          title: p.title,
          lang: (p as any).language,
          published: p.isPublished,
          date: p.createdAt ? format(new Date(p.createdAt), 'dd MMM yyyy') : '-',
          editHref: `/admin/posts/${p._id.toString()}/edit`,
          type: 'posts' as const,
        }))} />

        <RecentTable title="Recent Recipes" viewAllHref="/admin/recipes" rows={recentRecipes.map((r) => ({
          id: r._id.toString(),
          title: r.title,
          lang: (r as any).language,
          published: r.isPublished,
          date: r.createdAt ? format(new Date(r.createdAt), 'dd MMM yyyy') : '-',
          editHref: `/admin/recipes/${r._id.toString()}/edit`,
          type: 'recipes' as const,
        }))} />
      </section>

      {/* Recent Videos — full width */}
      <section>
        <RecentTable title="Recent Videos" viewAllHref="/admin/videos" rows={recentVideos.map((v) => ({
          id: v._id.toString(),
          title: v.title,
          lang: (v as any).language,
          published: v.isPublished,
          date: v.createdAt ? format(new Date(v.createdAt), 'dd MMM yyyy') : '-',
          editHref: `/admin/videos/${v._id.toString()}/edit`,
          type: 'videos' as const,
        }))} />
      </section>
    </div>
  )
}

type Row = {
  id: string
  title: string
  lang?: string
  published: boolean
  date: string
  editHref: string
  type: 'posts' | 'recipes' | 'videos'
}

function RecentTable({ title, viewAllHref, rows }: { title: string; viewAllHref: string; rows: Row[] }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <Link href={viewAllHref} className="text-xs font-medium text-[#1A5C38] hover:underline">View all</Link>
      </div>
      <table className="min-w-full text-left text-xs">
        <thead className="border-b text-[11px] uppercase text-gray-500">
          <tr>
            <th className="px-2 py-2">Title</th>
            <th className="px-2 py-2">Lang</th>
            <th className="px-2 py-2">Status</th>
            <th className="px-2 py-2">Date</th>
            <th className="px-2 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b last:border-0">
              <td className="max-w-[160px] truncate px-2 py-2 text-[13px] font-medium text-gray-900">{row.title}</td>
              <td className="px-2 py-2"><LangBadge lang={row.lang} /></td>
              <td className="px-2 py-2"><StatusBadge published={row.published} /></td>
              <td className="px-2 py-2 text-[12px] text-gray-600">{row.date}</td>
              <td className="px-2 py-2 text-right text-[12px]">
                <Link href={row.editHref} className="mr-2 text-[#1A5C38] hover:underline">Edit</Link>
                <DashboardDeleteButton id={row.id} type={row.type} />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={5} className="px-2 py-4 text-center text-xs text-gray-500">None yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function LangBadge({ lang }: { lang?: string }) {
  if (lang === 'te') return <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">తె</span>
  if (lang === 'hi') return <span className="inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700">हि</span>
  return <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">EN</span>
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
      {published ? 'Published' : 'Draft'}
    </span>
  )
}
