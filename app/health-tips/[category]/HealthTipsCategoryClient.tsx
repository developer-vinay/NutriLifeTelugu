'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { Clock, Eye, FileText } from 'lucide-react'
import PromotionBlock from '@/components/promotions/PromotionBlock'

const CATEGORIES = [
  { slug: 'weight-loss', te: 'బరువు తగ్గడం', hi: 'वजन घटाना', en: 'Weight Loss' },
  { slug: 'diabetes',    te: 'మధుమేహం',      hi: 'मधुमेह',      en: 'Diabetes' },
  { slug: 'gut-health',  te: 'గట్ హెల్త్',   hi: 'पाचन',        en: 'Gut Health' },
  { slug: 'thyroid',     te: 'థైరాయిడ్',     hi: 'थायरॉइड',     en: 'Thyroid' },
  { slug: 'immunity',    te: 'రోగనిరోధకత',   hi: 'रोग प्रतिरोधक', en: 'Immunity' },
  { slug: 'kids-nutrition', te: 'పిల్లల పోషణ', hi: 'बच्चों का पोषण', en: "Kids' Nutrition" },
]

const META: Record<string, { te: string; hi: string; en: string }> = {
  'weight-loss': { te: 'సైన్స్-బేస్డ్ వెయిట్ లాస్ టిప్స్ తెలుగు కుటుంబాల కోసం.', hi: 'विज्ञान-आधारित वजन घटाने के टिप्स।', en: 'Science-backed weight loss tips for Indian families.' },
  'diabetes':    { te: 'షుగర్ కంట్రోల్ కోసం ఆహార సూచనలు & రెసిపీ ఐడియాస్.', hi: 'ब्लड शुगर नियंत्रण के लिए आहार सुझाव।', en: 'Diet tips and recipe ideas for blood sugar control.' },
  'gut-health':  { te: 'జీర్ణశక్తి మెరుగుపడేందుకు సైన్స్-బేస్డ్ హ్యాబిట్స్.', hi: 'पाचन सुधारने के लिए विज्ञान-आधारित आदतें।', en: 'Science-based habits to improve your digestion.' },
  'thyroid':     { te: 'థైరాయిడ్ & హార్మోన్ బ్యాలెన్స్ కోసం ఫుడ్ గైడ్.', hi: 'थायरॉइड और हार्मोन संतुलन के लिए आहार गाइड।', en: 'Food guide for thyroid and hormone balance.' },
  'immunity':    { te: 'ఇమ్యూనిటీ పెంచే దైనందిన ఆహార అలవాట్లు.', hi: 'प्रतिरक्षा प्रणाली बढ़ाने के लिए दैनिक आहार आदतें।', en: 'Daily food habits to boost your immune system.' },
  'kids-nutrition': { te: 'పిల్లల ఎదుగుదలకు బ్యాలెన్స్ డైట్ & టిఫిన్ ఐడియాస్.', hi: 'बच्चों के विकास के लिए संतुलित आहार और टिफिन आइडिया।', en: 'Balanced diet and tiffin ideas for healthy child development.' },
}

type Post = {
  _id: string; title: string; slug: string
  excerpt?: string; heroImage?: string; tag?: string
  language?: string; readTimeMinutes?: number; views?: number
}

export default function HealthTipsCategoryClient({ category, posts }: { category: string; posts: Post[] }) {
  const { language } = useLanguage()

  const current = CATEGORIES.find(c => c.slug === category) ?? CATEGORIES[0]
  const label = language === 'te' ? current.te : language === 'hi' ? current.hi : current.en
  const desc = META[category]?.[language] ?? ''

  const filtered = posts.filter(p => (p.language ?? 'en') === language)

  return (
    <div className="bg-white dark:bg-slate-950">

      {/* Page header */}
      <div className="border-b border-gray-200 bg-[#F9FAFB] dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="mb-1 text-xs text-gray-500 dark:text-slate-400">
            <Link href="/" className="hover:underline">Home</Link>
            {' › '}
            <Link href="/blog" className="hover:underline">Health Tips</Link>
            {' › '}
            <span className="text-[#1A5C38] dark:text-emerald-400">{label}</span>
          </p>
          <h1 className="font-nunito text-3xl font-bold text-gray-900 dark:text-slate-50">{label}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{desc}</p>
        </div>

        {/* Category tabs */}
        <div className="mx-auto max-w-6xl overflow-x-auto px-4">
          <div className="flex gap-0 border-t border-gray-200 dark:border-slate-700">
            {CATEGORIES.map(cat => {
              const catLabel = language === 'te' ? cat.te : language === 'hi' ? cat.hi : cat.en
              const isActive = cat.slug === category
              return (
                <Link key={cat.slug} href={`/health-tips/${cat.slug}`}
                  className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'border-[#1A5C38] text-[#1A5C38] dark:border-emerald-400 dark:text-emerald-400'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}>
                  {catLabel}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <FileText size={40} className="mx-auto mb-3 text-gray-300 dark:text-slate-600" />
            <p className="font-medium text-gray-700 dark:text-slate-300">
              {language === 'te' ? 'వ్యాసాలు త్వరలో వస్తాయి.' : language === 'hi' ? 'लेख जल्द आ रहे हैं।' : 'Articles coming soon.'}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-500">
              {language === 'te' ? 'పై టాబ్‌లు ఉపయోగించి ఇతర కేటగిరీలు చూడండి.' : language === 'hi' ? 'ऊपर के टैब से अन्य श्रेणियाँ देखें।' : 'Use the tabs above to browse other categories.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">

            {/* Articles */}
            <div className="min-w-0 flex-1">
              <p className="mb-5 text-sm text-gray-500 dark:text-slate-400">
                {filtered.length} {language === 'te' ? 'వ్యాసాలు' : language === 'hi' ? 'लेख' : 'articles'}
              </p>

              <div className="space-y-5">
                {filtered.map((p, idx) => (
                  <React.Fragment key={p._id}>
                    {/* Inline promo after 3rd article */}
                    {idx === 3 && <PromotionBlock placement="blog-inline" language={language} />}

                    <Link href={`/blog/${p.slug}`}
                      className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-600">
                      {/* Thumbnail */}
                      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-700">
                        {p.heroImage
                          ? <img src={p.heroImage} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                          : <div className="flex h-full items-center justify-center"><FileText size={22} className="text-gray-300" /></div>
                        }
                      </div>
                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        {p.tag && (
                          <span className="mb-1 inline-block text-[11px] font-semibold uppercase tracking-wide text-[#1A5C38] dark:text-emerald-400">
                            {p.tag.split(',')[0].trim()}
                          </span>
                        )}
                        <h2 className="line-clamp-2 font-nunito text-base font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-50 dark:group-hover:text-emerald-400">
                          {p.title}
                        </h2>
                        {p.excerpt && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-slate-400">{p.excerpt}</p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500">
                          <span className="flex items-center gap-1"><Clock size={11} /> {p.readTimeMinutes ?? 5} min read</span>
                          {p.views ? <span className="flex items-center gap-1"><Eye size={11} /> {p.views.toLocaleString('en-IN')} views</span> : null}
                        </div>
                      </div>
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full space-y-5 lg:w-64 lg:shrink-0 lg:sticky lg:top-28 lg:self-start">

              {/* Other topics */}
              <div className="rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <p className="border-b border-gray-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-slate-700 dark:text-slate-400">
                  {language === 'te' ? 'ఇతర అంశాలు' : language === 'hi' ? 'अन्य विषय' : 'Other Topics'}
                </p>
                <div className="p-2">
                  {CATEGORIES.filter(c => c.slug !== category).map(cat => {
                    const catLabel = language === 'te' ? cat.te : language === 'hi' ? cat.hi : cat.en
                    return (
                      <Link key={cat.slug} href={`/health-tips/${cat.slug}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-[#1A5C38] dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-emerald-400">
                        {catLabel}
                        <span className="text-gray-300 dark:text-slate-600">›</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Sidebar promo */}
              <PromotionBlock placement="sidebar" language={language} />

              {/* Free diet plan */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/50 dark:bg-emerald-900/20">
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                  {language === 'te' ? 'ఉచిత డైట్ ప్లాన్' : language === 'hi' ? 'मुफ्त डाइट प्लान' : 'Free Diet Plan'}
                </p>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                  {language === 'te' ? 'ప్రింటబుల్ PDF · డయాబెటిక్ ఫ్రెండ్లీ' : language === 'hi' ? 'प्रिंटेबल PDF · डायबिटिक फ्रेंडली' : 'Printable PDF · Diabetic friendly'}
                </p>
                <Link href="/diet-plans"
                  className="mt-3 block w-full rounded-lg bg-[#1A5C38] px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-800">
                  {language === 'te' ? 'డౌన్‌లోడ్ చేయండి →' : language === 'hi' ? 'डाउनलोड करें →' : 'Download Free →'}
                </Link>
              </div>

              {/* Health tools */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  {language === 'te' ? 'ఉచిత హెల్త్ టూల్స్' : language === 'hi' ? 'मुफ्त हेल्थ टूल्स' : 'Free Health Tools'}
                </p>
                <Link href="/health-tools"
                  className="block rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-medium text-[#1A5C38] transition hover:bg-emerald-50 dark:border-slate-600 dark:text-emerald-400 dark:hover:bg-emerald-900/20">
                  BMI · Calories · Water · Sugar →
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
