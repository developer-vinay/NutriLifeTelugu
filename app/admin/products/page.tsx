'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

type Product = {
  _id: string
  name: string
  price: number
  currency: string
  category: string
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts(products.filter(p => p._id !== id))
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentStatus }),
    })
    if (res.ok) {
      fetchProducts()
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={20} />
            Shop Products
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage ebooks, courses, and other products (not meal plans)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold text-gray-900">No products yet</p>
          <p className="mt-1 text-sm text-gray-500">Create your first product to get started</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      {product.isFeatured && (
                        <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {product.currency}{product.price}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(product._id, product.isActive)}
                      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        product.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      {product.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Note:</strong> Products are for ebooks, courses, and other items. 
          For meal plans (free & paid), use <Link href="/admin/plans" className="underline">Diet Plans</Link>.
        </p>
      </div>
    </div>
  )
}
