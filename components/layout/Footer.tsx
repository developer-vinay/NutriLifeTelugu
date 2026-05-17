'use client'

import Link from 'next/link'
import React from 'react'
import { useLanguage } from '@/components/LanguageProvider'

export default function Footer() {
  const { language } = useLanguage()
  const year = new Date().getFullYear()

  const t = {
    te: {
      tagline: 'స్మార్ట్ న్యూట్రిషన్. బెటర్ లైఫ్.',
      description: 'ఆరోగ్యకరమైన తెలుగు రెసిపీలు, డైట్ ప్లాన్స్, హెల్త్ టిప్స్.',
      newsletter: 'Newsletter',
      newsletterDesc: 'ప్రతి వారం బెస్ట్ రెసిపీలు, హెల్త్ టిప్స్ మీ ఇన్‌బాక్స్ లోకి.',
      emailPlaceholder: 'మీ ఇమెయిల్ ఇక్కడ రాయండి...',
      subscribe: 'Subscribe',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      recipes: 'Recipes',
      dietPlans: 'Diet Plans',
      videos: 'Videos',
      about: 'About',
      advertise: 'Advertise',
      privacy: 'Privacy Policy',
      disclaimer: 'Disclaimer',
      catWeightLoss: 'బరువు తగ్గడం',
      catDiabetes: 'మధుమేహం',
      catGutHealth: 'గట్ హెల్త్',
      catThyroid: 'థైరాయిడ్',
      catKidsNutrition: 'పిల్లల పోషణ',
      catMillets: 'మిల్లెట్స్',
      catHealthTips: 'హెల్త్ చిట్కాలు',
      copyright: 'All rights reserved.',
      madeWith: 'Made with love for Indian families.',
    },
    hi: {
      tagline: 'स्मार्ट न्यूट्रिशन. बेहतर जीवन.',
      description: 'स्वस्थ भारतीय रेसिपी, डाइट प्लान और हेल्थ टिप्स.',
      newsletter: 'Newsletter',
      newsletterDesc: 'हर हफ्ते बेस्ट रेसिपी और हेल्थ टिप्स आपके इनबॉक्स में.',
      emailPlaceholder: 'अपना ईमेल यहाँ लिखें...',
      subscribe: 'Subscribe करें',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      recipes: 'रेसिपी',
      dietPlans: 'डाइट प्लान',
      videos: 'वीडियो',
      about: 'About',
      advertise: 'Advertise',
      privacy: 'Privacy Policy',
      disclaimer: 'Disclaimer',
      catWeightLoss: 'वजन घटाना',
      catDiabetes: 'मधुमेह',
      catGutHealth: 'पाचन स्वास्थ्य',
      catThyroid: 'थायरॉइड',
      catKidsNutrition: 'बच्चों का पोषण',
      catMillets: 'मिलेट्स',
      catHealthTips: 'हेल्थ टिप्स',
      copyright: 'सर्वाधिकार सुरक्षित.',
      madeWith: 'Made with love for Indian families.',
    },
    en: {
      tagline: 'Smart Nutrition. Better Life.',
      description: 'Healthy Indian recipes, diet plans, and health tips.',
      newsletter: 'Newsletter',
      newsletterDesc: 'Get the best recipes and health tips in your inbox every week.',
      emailPlaceholder: 'Enter your email here...',
      subscribe: 'Subscribe',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      recipes: 'Recipes',
      dietPlans: 'Diet Plans',
      videos: 'Videos',
      about: 'About',
      advertise: 'Advertise',
      privacy: 'Privacy Policy',
      disclaimer: 'Disclaimer',
      catWeightLoss: 'Weight Loss',
      catDiabetes: 'Diabetes',
      catGutHealth: 'Gut Health',
      catThyroid: 'Thyroid',
      catKidsNutrition: "Kids' Nutrition",
      catMillets: 'Millets',
      catHealthTips: 'Health Tips',
      copyright: 'All rights reserved.',
      madeWith: 'Made with love for Indian families.',
    },
  }

  const content = t[language]

  return (
    <footer className="mt-12 bg-[#1A5C38] text-sm text-emerald-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top: brand + newsletter — always stacked */}
        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          {/* Brand */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#1A5C38]">NL</div>
              <div>
                <div className="text-sm font-extrabold text-white">NutriLifeMitra</div>
                <div className="text-[11px] text-emerald-100">{content.tagline}</div>
              </div>
            </div>
            <p className="mb-3 text-xs text-emerald-100">{content.description}</p>
            <div className="flex gap-2 text-xs">
              <Link href="https://youtube.com/@nutrilifemitra" target="_blank" className="rounded-full bg-emerald-800 px-3 py-1 hover:bg-emerald-700">YouTube</Link>
              <Link href="https://instagram.com" target="_blank" className="rounded-full bg-emerald-800 px-3 py-1 hover:bg-emerald-700">Instagram</Link>
            </div>
          </div>
          {/* Newsletter */}
          <div id="subscribe">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-100">{content.newsletter}</h3>
            <p className="mb-2 text-xs text-emerald-100">{content.newsletterDesc}</p>
            <NewsletterForm placeholder={content.emailPlaceholder} buttonText={content.subscribe} />
          </div>
        </div>

        {/* Bottom: Quick Links + Categories side by side on all screens */}
        <div className="grid grid-cols-2 gap-4 border-t border-emerald-800 pt-5 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-100">{content.quickLinks}</h3>
            <ul className="space-y-1 text-xs text-emerald-100">
              <li><Link href="/recipes" className="hover:text-white">{content.recipes}</Link></li>
              <li><Link href="/diet-plans" className="hover:text-white">{content.dietPlans}</Link></li>
              <li><Link href="/videos" className="hover:text-white">{content.videos}</Link></li>
              <li><Link href="/about" className="hover:text-white">{content.about}</Link></li>
              <li><Link href="/advertise" className="hover:text-white">{content.advertise}</Link></li>
              <li><Link href="/privacy" className="hover:text-white">{content.privacy}</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">{content.disclaimer}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-100">{content.categories}</h3>
            <ul className="space-y-1 text-xs text-emerald-100">
              <li>{content.catWeightLoss}</li>
              <li>{content.catDiabetes}</li>
              <li>{content.catGutHealth}</li>
              <li>{content.catThyroid}</li>
              <li>{content.catKidsNutrition}</li>
              <li>{content.catMillets}</li>
              <li>{content.catHealthTips}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-emerald-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-[11px] text-emerald-200">
          <p>© {year} NutriLifeMitra. {content.copyright}</p>
          <p>{content.madeWith}</p>
        </div>
      </div>
    </footer>
  )
}

function NewsletterForm({ placeholder, buttonText }: { placeholder: string; buttonText: string }) {
  return (
    <form
      action="/api/subscribe"
      method="post"
      className="flex flex-col gap-2 text-xs"
    >
      <input
        type="email"
        name="email"
        required
        placeholder={placeholder}
        className="w-full rounded-md border border-emerald-700 bg-emerald-900/40 px-3 py-2 text-xs text-emerald-50 placeholder:text-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-[#D97706] px-3 py-2 font-semibold text-white shadow-sm hover:bg-amber-700"
      >
        {buttonText}
      </button>
    </form>
  )
}

