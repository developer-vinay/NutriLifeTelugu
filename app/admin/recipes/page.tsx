'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'

type Recipe = {
  _id: string
  title: string
  slug: string
  category?: string
  language?: string
  isPublished: boolean
  createdAt?: string
}

const LANG_BADGE: Record<string, string> = {
  en: 'bg-blue-50 text-blue-700',
  te: 'bg-amber-50 text-amber-700',
  hi: 'bg-purple-50 text-purple-700',
}
const LANG_LABEL: Record<string, string> = { en: 'EN', te: 'తె', hi: 'हि' }

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const fetchRecipes = useCallback(async (q: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/recipes?q=${encodeURIComponent(q)}&pageSize=100`)
    const data = await res.json()
    setRecipes(data.items ?? [])
    setSelected(new Set())
    setLoading(false)
  }, [])

  useEffect(() => { fetchRecipes(query) }, [query, fetchRecipes])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setQuery(search) }

  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const toggleAll = () => setSelected(selected.size === recipes.length ? new Set() : new Set(recipes.map((r) => r._id)))

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/recipes/${id}`, { method: 'DELETE' })
    setRecipes((prev) => prev.filter((r) => r._id !== id))
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setDeleting(null)
  }

  const handleBulkDelete = async () => {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} selected recipe${selected.size > 1 ? 's' : ''}? This cannot be undone.`)) return
    setBulkDeleting(true)
    await Promise.all([...selected].map((id) => fetch(`/api/admin/recipes/${id}`, { method: 'DELETE' })))
    setRecipes((prev) => prev.filter((r) => !selected.has(r._id)))
    setSelected(new Set())
    setBulkDeleting(false)
  }

  const allChecked = recipes.length > 0 && selected.size === recipes.length
  const someChecked = selected.size > 0 && selected.size < recipes.length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recipes</h2>
          <p className="text-sm text-gray-500">{recipes.length} recipes</p>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]" />
            <button type="submit" className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Search</button>
            {query && <button type="button" onClick={() => { setSearch(''); setQuery('') }} className="text-xs text-gray-500 hover:text-gray-800">Clear</button>}
          </form>
          <Link href="/admin/recipes/new" className="rounded-full bg-[#1A5C38] px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
            + New Recipe
          </Link>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
          <span className="text-sm font-medium text-red-700">{selected.size} selected</span>
          <button type="button" onClick={handleBulkDelete} disabled={bulkDeleting}
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            <Trash2 size={13} />
            {bulkDeleting ? 'Deleting...' : `Delete ${selected.size}`}
          </button>
          <button type="button" onClick={() => setSelected(new Set())} className="text-xs text-red-500 hover:text-red-700">Cancel</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2 w-8">
                <input type="checkbox" checked={allChecked} ref={(el) => { if (el) el.indeterminate = someChecked }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
              </th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Lang</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-400">Loading...</td></tr>
            ) : recipes.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                {query ? `No recipes matching "${query}"` : 'No recipes yet. Click "+ New Recipe" to create one.'}
              </td></tr>
            ) : recipes.map((recipe) => (
              <tr key={recipe._id} className={`hover:bg-gray-50 ${selected.has(recipe._id) ? 'bg-red-50/40' : ''}`}>
                <td className="px-4 py-2">
                  <input type="checkbox" checked={selected.has(recipe._id)} onChange={() => toggleOne(recipe._id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]" />
                </td>
                <td className="max-w-xs px-4 py-2">
                  <div className="line-clamp-1 font-medium text-gray-900">{recipe.title}</div>
                  <div className="text-xs text-gray-400">{recipe.slug}</div>
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${LANG_BADGE[recipe.language ?? 'en'] ?? 'bg-gray-100 text-gray-600'}`}>
                    {LANG_LABEL[recipe.language ?? 'en'] ?? recipe.language}
                  </span>
                </td>
                <td className="px-4 py-2 capitalize text-gray-700">{recipe.category ?? '-'}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${recipe.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {recipe.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-700">{recipe.createdAt ? format(new Date(recipe.createdAt), 'dd MMM yyyy') : '-'}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/recipes/${recipe._id}/edit`} className="mr-3 text-[#1A5C38] hover:underline">Edit</Link>
                  <button type="button" disabled={deleting === recipe._id} onClick={() => handleDelete(recipe._id, recipe.title)}
                    className="text-red-500 hover:text-red-700 disabled:opacity-40">
                    {deleting === recipe._id ? '...' : 'Delete'}
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
