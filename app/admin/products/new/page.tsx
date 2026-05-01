'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nameHi: '',
    nameTe: '',
    description: '',
    descriptionHi: '',
    descriptionTe: '',
    price: '',
    currency: '₹',
    discountType: 'none',
    discountValue: '',
    category: 'ebook',
    duration: '',
    features: '',
    featuresHi: '',
    featuresTe: '',
    imageUrl: '',
    fileUrl: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, fieldName: 'imageUrl' | 'fileUrl') {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (fieldName === 'imageUrl' && !file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    if (fieldName === 'fileUrl' && file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    // Validate file size (max 5MB for images, 10MB for PDFs)
    const maxSize = fieldName === 'imageUrl' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File size must be less than ${fieldName === 'imageUrl' ? '5MB' : '10MB'}`)
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      // You would replace this with your actual upload endpoint
      // For now, we'll use a placeholder that returns a mock URL
      // In production, upload to Cloudinary, AWS S3, or similar
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setFormData(prev => ({ ...prev, [fieldName]: data.url }))
      } else {
        alert('Upload failed. Please try again.')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed. Please enter URL manually.')
    } finally {
      setUploading(false)
    }
  }

  function calculateFinalPrice() {
    const price = parseFloat(formData.price)
    const discountValue = parseFloat(formData.discountValue)
    
    if (!price || !discountValue || formData.discountType === 'none') return price

    if (formData.discountType === 'percentage') {
      return price - (price * discountValue / 100)
    } else if (formData.discountType === 'fixed') {
      return Math.max(0, price - discountValue)
    }
    return price
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      discountValue: formData.discountType !== 'none' ? parseFloat(formData.discountValue) : 0,
      sortOrder: parseInt(String(formData.sortOrder)),
      features: formData.features.split('\n').filter(f => f.trim()),
      featuresHi: formData.featuresHi.split('\n').filter(f => f.trim()),
      featuresTe: formData.featuresTe.split('\n').filter(f => f.trim()),
    }

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/products')
    } else {
      alert('Failed to create product')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Create New Product</h2>
          <p className="text-sm text-gray-500">Add a new product to your shop</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Basic Information</h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name (English) *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name (Hindi)</label>
                <input
                  type="text"
                  name="nameHi"
                  value={formData.nameHi}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name (Telugu)</label>
                <input
                  type="text"
                  name="nameTe"
                  value={formData.nameTe}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description (English) *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description (Hindi)</label>
                <textarea
                  name="descriptionHi"
                  value={formData.descriptionHi}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description (Telugu)</label>
                <textarea
                  name="descriptionTe"
                  value={formData.descriptionTe}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Category */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Pricing & Category</h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Currency *</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                >
                  <option value="₹">₹ INR (Rupee)</option>
                  <option value="$">$ USD (Dollar)</option>
                  <option value="€">€ EUR (Euro)</option>
                  <option value="£">£ GBP (Pound)</option>
                  <option value="¥">¥ JPY (Yen)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                >
                  <option value="ebook">Ebook</option>
                  <option value="course">Course</option>
                  <option value="consultation">Consultation</option>
                  <option value="meal-plan">Meal Plan</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Duration (optional)</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 30 days"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
              </div>
            </div>

            {/* Discount Section */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h4 className="mb-3 text-sm font-semibold text-amber-900">Discount (Optional)</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Discount Type</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                  >
                    <option value="none">No Discount</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                {formData.discountType !== 'none' && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Discount Value {formData.discountType === 'percentage' ? '(%)' : `(${formData.currency})`}
                      </label>
                      <input
                        type="number"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleChange}
                        min="0"
                        step={formData.discountType === 'percentage' ? '1' : '0.01'}
                        max={formData.discountType === 'percentage' ? '100' : undefined}
                        placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 50'}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Final Price</label>
                      <div className="flex h-10 items-center rounded-lg border border-emerald-300 bg-emerald-50 px-3 text-sm font-bold text-emerald-900">
                        {formData.currency}{calculateFinalPrice()?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {formData.discountType !== 'none' && formData.price && formData.discountValue && (
                <p className="mt-2 text-xs text-amber-700">
                  💡 Customers will see: <span className="line-through">{formData.currency}{formData.price}</span>{' '}
                  <span className="font-bold text-emerald-700">{formData.currency}{calculateFinalPrice()?.toFixed(2)}</span>
                  {formData.discountType === 'percentage' && ` (${formData.discountValue}% off)`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Features (one per line)</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Features (English)</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows={5}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Features (Hindi)</label>
              <textarea
                name="featuresHi"
                value={formData.featuresHi}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Features (Telugu)</label>
              <textarea
                name="featuresTe"
                value={formData.featuresTe}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Media & Files</h3>
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Product Image</label>
              <div className="flex gap-3">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'imageUrl')}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter URL or upload image (max 5MB, JPG/PNG/WebP)</p>
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Preview" className="mt-2 h-32 w-32 rounded-lg border object-cover" />
              )}
            </div>

            {/* File Upload (for ebooks/PDFs) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Downloadable File (PDF/Ebook)</label>
              <div className="flex gap-3">
                <input
                  type="url"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/ebook.pdf"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
                />
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, 'fileUrl')}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? 'Uploading...' : 'Upload PDF'}
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter URL or upload PDF (max 10MB) - for digital products only</p>
              {formData.fileUrl && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  <span>✓</span>
                  <span className="truncate">{formData.fileUrl}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]"
                />
                <span className="text-sm font-medium text-gray-700">Active (visible in shop)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
            <div className="w-32">
              <label className="mb-1 block text-sm font-medium text-gray-700">Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#1A5C38] px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Creating...' : 'Create Product'}
          </button>
          <Link
            href="/admin/products"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
