'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { Salad } from 'lucide-react'
import PromotionBlock from '@/components/promotions/PromotionBlock'

const categoryMeta: Record<string, { te: { title: string; description: string }; en: { title: string; description: string }; hi: { title: string; description: string } }> = {
  'weight-loss': {
    te: { title: 'బరువు తగ్గడం', description: 'తెలుగు ఇంట్లో పాటించగల సింపుల్ వెయిట్ లాస్ టిప్స్.' },
    en: { title: 'Weight Loss', description: 'Simple weight loss tips you can follow at home.' },
    hi: { title: 'वजन घटाना', description: 'घर पर अपनाने योग्य सरल वजन घटाने के टिप्स।' },
  },
  diabetes: {
    te: { title: 'మధుమేహం', description: 'షుగర్ కంట్రోల్ కోసం ఆహార సూచనలు & రిసిపీ ఐడియాస్.' },
    en: { title: 'Diabetes', description: 'Diet tips and recipe ideas for blood sugar control.' },
    hi: { title: 'मधुमेह', description: 'ब्लड शुगर नियंत्रण के लिए आहार सुझाव और रेसिपी।' },
  },
  'gut-health': {
    te: { title: 'గట్ హెల్త్', description: 'జీర్ణశక్తి మెరుగుపడేందుకు సైన్స్-బేస్డ్ హ్యాబిట్స్.' },
    en: { title: 'Gut Health', description: 'Science-based habits to improve your digestion.' },
    hi: { title: 'पाचन स्वास्थ्य', description: 'पाचन सुधारने के लिए विज्ञान-आधारित आदतें।' },
  },
  thyroid: {
    te: { title: 'థైరాయిడ్', description: 'థైరాయిడ్ & హార్మోన్లకు అనుకూలమైన ఫుడ్ గైడ్.' },
    en: { title: 'Thyroid', description: 'Food guide for thyroid and hormone balance.' },
    hi: { title: 'थायरॉइड', description: 'थायरॉइड और हार्मोन संतुलन के लिए आहार गाइड।' },
  },
  immunity: {
    te: { title: 'రోగనిరోధక శక్తి', description: 'ఇమ్యూనిటీ పెంచే దైనందిన ఆహార అలవాట్లు.' },
    en: { title: 'Immunity', description: 'Daily food habits to boost your immune system.' },
    hi: { title: 'रोग प्रतिरोधक क्षमता', description: 'प्रतिरक्षा प्रणाली बढ़ाने के लिए दैनिक आहार आदतें।' },
  },
  'kids-nutrition': {
    te: { title: 'పిల్లల పోషణ', description: 'పిల్లల ఎదుగుదలకు బ్యాలెన్స్ డైట్ & టిఫిన్ ఐడియాస్.' },
    en: { title: "Kids' Nutrition", description: 'Balanced diet and tiffin ideas for children.' },
    hi: { title: 'बच्चों का पोषण', description: 'बच्चों के विकास के लिए संतुलित आहार और टिफिन आइडिया।' },
  },
}

type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  heroImage?: string
  tag?: string
  readTimeMinutes?: number
}

export default function HealthTipsCategoryClient({ category, posts }: { category: string; posts: Post[] }) {
  const { language } = useLanguage()
  const meta = categoryMeta[category]?.[language] ?? { title: category, description: '' }

  return (
    <div className="bg-white dark:bg-slate-900">
      <section className="mt-16 bg-[#F0FAF4] dark:bg-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">{meta.title}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{meta.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Inline promo for health tips */}
        <div className="mb-6">
          <PromotionBlock placement="blog-inline" language={language} />
        </div>
        {posts.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            {language === 'te' ? 'వ్యాసాలు త్వరలో వస్తాయి.' : language === 'hi' ? 'लेख जल्द आ रहे हैं।' : 'Articles coming soon.'}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p._id}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
              >
                {p.heroImage ? (
                  <img src={p.heroImage} alt={p.title} className="h-32 w-full object-cover" />
                ) : (
                  <div className="flex h-32 items-center justify-center bg-emerald-50">
                    <Salad size={28} className="text-emerald-300" />
                  </div>
                )}
                <div className="p-4">
                  {p.tag && (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#1A5C38]">{p.tag}</span>
                  )}
                  <p className="mt-2 line-clamp-2 font-nunito text-base font-semibold text-gray-900 group-hover:text-[#1A5C38]">{p.title}</p>
                  {p.excerpt && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{p.excerpt}</p>}
                  <p className="mt-2 text-xs text-gray-500">
                    {p.readTimeMinutes ?? 5} {language === 'te' ? 'నిమిషాల చదువు' : language === 'hi' ? 'मिनट पढ़ें' : 'min read'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
