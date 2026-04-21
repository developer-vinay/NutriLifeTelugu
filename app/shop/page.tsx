'use client'

import React from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import PromotionBlock from '@/components/promotions/PromotionBlock'

const products = {
  te: [
    { title: 'ప్రీమియం 30-రోజుల మీల్ ప్లాన్', price: '₹299', desc: 'ప్రింటబుల్ PDF · డయాబెటిక్ ఫ్రెండ్లీ · షాపింగ్ లిస్ట్ ఉంది' },
    { title: 'ప్రీమియం 60-రోజుల ట్రాన్స్‌ఫర్మేషన్', price: '₹599', desc: 'మీల్ ప్లాన్ + హ్యాబిట్స్ ట్రాకర్ · వారపు చెక్‌లిస్ట్‌లు' },
    { title: 'తెలుగు న్యూట్రిషన్ గైడ్ ఇబుక్', price: '₹199', desc: 'తెలుగు కుటుంబాలకు ఆరోగ్యకరమైన తినడానికి పూర్తి గైడ్' },
    { title: 'మిల్లెట్ కుకింగ్ మాస్టర్‌క్లాస్', price: '₹499', desc: '10 వీడియో పాఠాలు · రెసిపీలు ఉన్నాయి · లైఫ్‌టైమ్ యాక్సెస్' },
  ],
  hi: [
    { title: 'प्रीमियम 30-दिन मील प्लान', price: '₹299', desc: 'प्रिंटेबल PDF · डायबिटिक फ्रेंडली · शॉपिंग लिस्ट शामिल' },
    { title: 'प्रीमियम 60-दिन ट्रांसफॉर्मेशन', price: '₹599', desc: 'मील प्लान + हैबिट्स ट्रैकर · साप्ताहिक चेकलिस्ट' },
    { title: 'हिंदी न्यूट्रिशन गाइड ईबुक', price: '₹199', desc: 'भारतीय परिवारों के लिए स्वस्थ खाने की पूरी गाइड' },
    { title: 'मिलेट कुकिंग मास्टरक्लास', price: '₹499', desc: '10 वीडियो पाठ · रेसिपी शामिल · लाइफटाइम एक्सेस' },
  ],
  en: [
    { title: 'Premium 30-Day Meal Plan', price: '₹299', desc: 'Printable PDF · Diabetic friendly · Shopping list included' },
    { title: 'Premium 60-Day Transformation', price: '₹599', desc: 'Meal plan + habits tracker · Weekly checklists' },
    { title: 'Telugu Nutrition Guide Ebook', price: '₹199', desc: 'Complete guide to healthy eating for Telugu families' },
    { title: 'Millet Cooking Masterclass', price: '₹499', desc: '10 video lessons · Recipes included · Lifetime access' },
  ],
}

const t = {
  te: { title: 'షాప్', sub: 'తెలుగు కుటుంబాలకు ప్రీమియం మీల్ ప్లాన్స్, ఇబుక్స్ మరియు కోర్సులు.', buy: 'కొనండి (త్వరలో వస్తుంది)' },
  hi: { title: 'शॉप', sub: 'भारतीय परिवारों के लिए प्रीमियम मील प्लान्स, ईबुक्स और कोर्सेज।', buy: 'खरीदें (जल्द आ रहा है)' },
  en: { title: 'Shop', sub: 'Premium meal plans, ebooks, and courses for Telugu families.', buy: 'Buy Now (Coming Soon)' },
}

export default function ShopPage() {
  const { language } = useLanguage()
  const tx = t[language]
  const prods = products[language]

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prods.map((p) => (
            <div key={p.title} className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-900/20">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-nunito text-lg font-bold text-amber-900 dark:text-amber-200">{p.title}</p>
                  <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{p.desc}</p>
                </div>
                <div className="whitespace-nowrap text-2xl font-bold text-[#D97706] dark:text-amber-400">{p.price}</div>
              </div>
              <button type="button" className="w-full rounded-lg bg-[#D97706] px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
                {tx.buy}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
