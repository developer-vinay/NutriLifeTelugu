'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

type Post = {
  _id: string
  title: string
  slug: string
  category?: string
  language?: string
  isPublished: boolean
  views?: number
  createdAt?: string
}

const LANG_BADGE: Record<string, string> = {
  en: 'bg-blue-50 text-blue-700',
  te: 'bg-amber-50 text-amber-700',
  hi: 'bg-purple-50 text-purple-700',
}

const LANG_LABEL: Record<string, string> = {
  en: 'EN',
  te: 'తె',
  hi: 'हि',
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPosts = useCallback(async (q: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/posts?q=${encodeURIComponent(q)}&pageSize=100`)
    const data = await res.json()
    setPosts(data.items ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchPosts(query) }, [query, fetchPosts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(search)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    setPosts((prev) => prev.filter((p) => p._id !== id))
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Posts</h2>
          <p className="text-sm text-gray-500">{posts.length} articles</p>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]"
            />
            <button type="submit"
              className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Search
            </button>
            {query && (
              <button type="button" onClick={() => { setSearch(''); setQuery('') }}
                className="text-xs text-gray-500 hover:text-gray-800">Clear</button>
            )}
          </form>
          <Link href="/admin/posts/new"
            className="rounded-full bg-[#1A5C38] px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
            + New Post
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Lang</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Views</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-400">Loading...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                {query ? `No posts matching "${query}"` : 'No posts yet. Click "+ New Post" to create one.'}
              </td></tr>
            ) : posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="max-w-xs px-4 py-2">
                  <div className="line-clamp-1 font-medium text-gray-900">{post.title}</div>
                  <div className="text-xs text-gray-400">{post.slug}</div>
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${LANG_BADGE[post.language ?? 'en'] ?? 'bg-gray-100 text-gray-600'}`}>
                    {LANG_LABEL[post.language ?? 'en'] ?? post.language}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-700">{post.category ?? '-'}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${post.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-700">{post.views ?? 0}</td>
                <td className="px-4 py-2 text-gray-700">
                  {post.createdAt ? format(new Date(post.createdAt), 'dd MMM yyyy') : '-'}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/posts/${post._id}/edit`}
                    className="mr-3 text-[#1A5C38] hover:underline">Edit</Link>
                  <button
                    type="button"
                    disabled={deleting === post._id}
                    onClick={() => handleDelete(post._id, post.title)}
                    className="text-red-500 hover:text-red-700 disabled:opacity-40"
                  >
                    {deleting === post._id ? '...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
