'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { ShoppingBag, Check, Download, Clock, Star, ArrowLeft } from 'lucide-react'
import BuyPlanButton from '@/components/payment/BuyPlanButton'

type Product = {
  _id: string
  name: string
  nameHi?: string
  nameTe?: string
  description: string
  descriptionHi?: string
  descriptionTe?: string
  price: number
  currency: string
  discountType?: 'percentage' | 'fixed' | 'none'
  discountValue?: number
  finalPrice?: number
  category: string
  duration?: string
  features: string[]
  featuresHi?: string[]
  featuresTe?: string[]
  imageUrl?: string
  fileUrl?: string
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

const translations = {
  te: {
    backToShop: '← షాప్‌కు తిరిగి వెళ్ళండి',
    category: 'వర్గం',
    duration: 'వ్యవధి',
    originalPrice: 'అసలు ధర',
    discount: 'తగ్గింపు',
    finalPrice: 'చివరి ధర',
    youSave: 'మీరు ఆదా చేస్తారు',
    whatYouGet: 'మీరు పొందేది',
    buyNow: 'ఇప్పుడే కొనండి',
    downloadable: 'డౌన్‌లోడ్ చేయగలిగేది',
    instantAccess: 'తక్షణ యాక్సెస్',
    loading: 'లోడ్ అవుతోంది...',
    notFound: 'ప్రొడక్ట్ కనుగొనబడలేదు',
    featured: 'ఫీచర్డ్',
  },
  hi: {
    backToShop: '← शॉप पर वापस जाएं',
    category: 'श्रेणी',
    duration: 'अवधि',
    originalPrice: 'मूल कीमत',
    discount: 'छूट',
    finalPrice: 'अंतिम कीमत',
    youSave: 'आप बचाते हैं',
    whatYouGet: 'आपको क्या मिलेगा',
    buyNow: 'अभी खरीदें',
    downloadable: 'डाउनलोड करने योग्य',
    instantAccess: 'तत्काल पहुंच',
    loading: 'लोड हो रहा है...',
    notFound: 'प्रोडक्ट नहीं मिला',
    featured: 'फीचर्ड',
  },
  en: {
    backToShop: '← Back to Shop',
    category: 'Category',
    duration: 'Duration',
    originalPrice: 'Original Price',
    discount: 'Discount',
    finalPrice: 'Final Price',
    youSave: 'You Save',
    whatYouGet: 'What You Get',
    buyNow: 'Buy Now',
    downloadable: 'Downloadable',
    instantAccess: 'Instant Access',
    loading: 'Loading...',
    notFound: 'Product not found',
    featured: 'Featured',
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { language } = useLanguage()
  const t = translations[language]

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        }
      } catch (err) {
        console.error('Failed to fetch product:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  function getProductName() {
    if (!product) return ''
    if (language === 'te' && product.nameTe) return product.nameTe
    if (language === 'hi' && product.nameHi) return product.nameHi
    return product.name
  }

  function getProductDescription() {
    if (!product) return ''
    if (language === 'te' && product.descriptionTe) return product.descriptionTe
    if (language === 'hi' && product.descriptionHi) return product.descriptionHi
    return product.description
  }

  function getProductFeatures() {
    if (!product) return []
    if (language === 'te' && product.featuresTe && product.featuresTe.length > 0) return product.featuresTe
    if (language === 'hi' && product.featuresHi && product.featuresHi.length > 0) return product.featuresHi
    return product.features || []
  }

  function calculateSavings() {
    if (!product) return 0
    return product.price - (product.finalPrice || product.price)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#1A5C38]" />
          <p className="mt-4 text-gray-600 dark:text-slate-400">{t.loading}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-semibold text-gray-900 dark:text-slate-50">{t.notFound}</p>
          <Link href="/shop" className="mt-4 inline-block text-[#1A5C38] hover:underline dark:text-emerald-400">
            {t.backToShop}
          </Link>
        </div>
      </div>
    )
  }

  const hasDiscount = product.discountType && product.discountType !== 'none' && product.discountValue && product.discountValue > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Breadcrumb */}
      <div className="border-b bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1A5C38] dark:text-slate-400 dark:hover:text-emerald-400">
            <ArrowLeft size={16} />
            {t.backToShop}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={getProductName()}
                  className="h-[500px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[500px] items-center justify-center bg-gray-100 dark:bg-slate-800">
                  <ShoppingBag size={80} className="text-gray-300 dark:text-slate-600" />
                </div>
              )}
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {product.fileUrl && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
                  <Download size={24} className="mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">{t.downloadable}</p>
                </div>
              )}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center dark:border-blue-800 dark:bg-blue-900/20">
                <Clock size={24} className="mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">{t.instantAccess}</p>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              {product.isFeatured && (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  <Star size={12} fill="currentColor" />
                  {t.featured}
                </span>
              )}
              <h1 className="mt-2 font-nunito text-3xl font-bold text-gray-900 dark:text-slate-50">
                {getProductName()}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400">
                <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {t.category}: {product.category}
                </span>
                {product.duration && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {product.duration}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-gray-700 dark:text-slate-300">{getProductDescription()}</p>
            </div>

            {/* Pricing */}
            <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
              {hasDiscount ? (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg text-gray-500 line-through dark:text-slate-500">
                      {product.currency}{product.price}
                    </span>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                      {product.discountType === 'percentage' 
                        ? `${product.discountValue}% OFF` 
                        : `${product.currency}${product.discountValue} OFF`}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#D97706] dark:text-amber-400">
                      {product.currency}{product.finalPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                    <Check size={16} />
                    <span className="font-semibold">
                      {t.youSave} {product.currency}{calculateSavings().toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-4xl font-bold text-[#D97706] dark:text-amber-400">
                  {product.currency}{product.price}
                </div>
              )}

              <div className="mt-6">
                <BuyPlanButton
                  planId={product._id}
                  planTitle={getProductName()}
                  price={product.finalPrice || product.price}
                  currency={product.currency}
                />
              </div>
            </div>

            {/* Features */}
            {getProductFeatures().length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 font-nunito text-lg font-bold text-gray-900 dark:text-slate-50">
                  {t.whatYouGet}
                </h3>
                <ul className="space-y-3">
                  {getProductFeatures().map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-gray-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Check size={24} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-slate-200">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Download size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-slate-200">Instant Access</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Star size={24} className="text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-slate-200">Quality Content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
