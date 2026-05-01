'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import PromotionBlock from '@/components/promotions/PromotionBlock'
import { ShoppingBag } from 'lucide-react'

type Plan = {
  _id: string
  title: string
  titleTe?: string
  titleHi?: string
  description?: string
  descTe?: string
  descHi?: string
  price: number
  currency: string
  discountType?: 'percentage' | 'fixed' | 'none'
  discountValue?: number
  finalPrice?: number
  durationWeeks?: number
  features?: string[]
}

const t = {
  te: { 
    title: 'షాప్', 
    sub: 'ప్రీమియం మీల్ ప్లాన్స్, ఇబుక్స్ మరియు కోర్సులు.',
    loading: 'లోడ్ అవుతోంది...',
    noProducts: 'ప్రొడక్ట్స్ త్వరలో వస్తాయి',
    noProductsSub: 'మేము మీ కోసం అద్భుతమైన ప్రొడక్ట్స్ తయారు చేస్తున్నాము',
    weeks: 'వారాలు',
  },
  hi: { 
    title: 'शॉप', 
    sub: 'प्रीमियम मील प्लान्स, ईबुक्स और कोर्सेज।',
    loading: 'लोड हो रहा है...',
    noProducts: 'प्रोडक्ट्स जल्द आ रहे हैं',
    noProductsSub: 'हम आपके लिए शानदार प्रोडक्ट्स तैयार कर रहे हैं',
    weeks: 'सप्ताह',
  },
  en: { 
    title: 'Shop', 
    sub: 'Premium meal plans, ebooks, and courses.',
    loading: 'Loading...',
    noProducts: 'Products coming soon',
    noProductsSub: 'We are preparing amazing products for you',
    weeks: 'weeks',
  },
}

export default function ShopPage() {
  const { language } = useLanguage()
  const tx = t[language]
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setPlans(data)
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  function getPlanTitle(plan: Plan) {
    if (language === 'te' && plan.titleTe) return plan.titleTe
    if (language === 'hi' && plan.titleHi) return plan.titleHi
    return plan.title
  }

  function getPlanDesc(plan: Plan) {
    if (language === 'te' && plan.descTe) return plan.descTe
    if (language === 'hi' && plan.descHi) return plan.descHi
    return plan.description || ''
  }

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="bg-[#F0FAF4] dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">{tx.title}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{tx.sub}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Banner promo */}
        <div className="mb-6">
          <PromotionBlock placement="shop" language={language} />
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-12 text-center dark:border-amber-700 dark:bg-amber-900/10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <ShoppingBag size={28} className="text-amber-500" />
            </div>
            <p className="font-nunito text-xl font-bold text-amber-800 dark:text-amber-300">{tx.noProducts}</p>
            <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">{tx.noProductsSub}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Link
                key={plan._id}
                href={`/products/${plan._id}`}
                className="group flex flex-col rounded-2xl border border-amber-200 bg-amber-50 p-6 transition-all hover:border-amber-300 hover:shadow-lg dark:border-amber-700 dark:bg-amber-900/20 dark:hover:border-amber-600"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-nunito text-lg font-bold text-amber-900 group-hover:text-[#D97706] dark:text-amber-200 dark:group-hover:text-amber-400">
                      {getPlanTitle(plan)}
                    </p>
                    {plan.durationWeeks && (
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                        {plan.durationWeeks} {tx.weeks}
                      </p>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm text-amber-800 dark:text-amber-300">
                      {getPlanDesc(plan)}
                    </p>
                  </div>
                  <div className="text-right">
                    {plan.discountType && plan.discountType !== 'none' && plan.discountValue ? (
                      <>
                        <div className="text-sm text-amber-600 line-through dark:text-amber-500">
                          {plan.currency}{plan.price}
                        </div>
                        <div className="text-2xl font-bold text-[#D97706] dark:text-amber-400">
                          {plan.currency}{plan.finalPrice || plan.price}
                        </div>
                        <div className="text-xs text-emerald-700 dark:text-emerald-400">
                          {plan.discountType === 'percentage' ? `${plan.discountValue}% off` : `Save ${plan.currency}${plan.discountValue}`}
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-[#D97706] dark:text-amber-400">
                        {plan.currency}{plan.price}
                      </div>
                    )}
                  </div>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <ul className="mb-4 space-y-1.5">
                    {plan.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                        <span className="mt-0.5 text-amber-600">✓</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                        +{plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                )}

                <div className="mt-auto">
                  <div className="w-full rounded-lg bg-[#D97706] px-4 py-2.5 text-center text-sm font-semibold text-white transition-all group-hover:bg-[#B45309]">
                    {language === 'te' ? 'వివరాలు చూడండి →' : language === 'hi' ? 'विवरण देखें →' : 'View Details →'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
