import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/models/Comment'
import { format } from 'date-fns'
import AdminCommentDeleteButton from './AdminCommentDeleteButton'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>
}) {
  const { page: pageParam, type } = await searchParams
  const page = Number(pageParam ?? '1') || 1
  const pageSize = 25

  await connectDB()

  const query: any = {}
  if (type === 'post' || type === 'recipe') query.contentType = type

  const [items, total] = await Promise.all([
    Comment.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Comment.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Comments ({total})</h1>
        <div className="flex gap-2 text-sm">
          <a href="/admin/comments" className={`rounded-full px-3 py-1 font-medium ${!type ? 'bg-[#1A5C38] text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>All</a>
          <a href="/admin/comments?type=post" className={`rounded-full px-3 py-1 font-medium ${type === 'post' ? 'bg-[#1A5C38] text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Posts</a>
          <a href="/admin/comments?type=recipe" className={`rounded-full px-3 py-1 font-medium ${type === 'recipe' ? 'bg-[#1A5C38] text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Recipes</a>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-[11px] uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No comments yet.</td>
              </tr>
            )}
            {items.map((c: any) => (
              <tr key={c._id.toString()} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.email}</td>
                <td className="max-w-xs px-4 py-3 text-gray-700">
                  <p className="line-clamp-2">{c.body}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.contentType === 'post' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {c.contentType}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-gray-500">
                  {c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminCommentDeleteButton id={c._id.toString()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <a href={`/admin/comments?page=${page - 1}${type ? `&type=${type}` : ''}`}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50">← Prev</a>
          )}
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <a href={`/admin/comments?page=${page + 1}${type ? `&type=${type}` : ''}`}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50">Next →</a>
          )}
        </div>
      )}
    </div>
  )
}
