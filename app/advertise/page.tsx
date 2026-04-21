'use client'

import React from 'react'
import { useLanguage } from '@/components/LanguageProvider'

const t = {
  te: {
    title: 'మాతో ప్రకటన చేయండి',
    sub: 'ప్రతి నెల 50,000+ తెలుగు ఆరోగ్య-స్పృహ పాఠకులను చేరుకోండి.',
    stats: [
      { label: '50K+', desc: 'నెలవారీ పాఠకులు' },
      { label: '10K+', desc: 'న్యూస్‌లెటర్ సబ్‌స్క్రైబర్లు' },
      { label: '500+', desc: 'ప్రచురించిన రెసిపీలు & వ్యాసాలు' },
    ],
    formats_title: 'అందుబాటులో ఉన్న యాడ్ ఫార్మాట్లు',
    formats: ['బ్యానర్ యాడ్స్ (728×90, 300×250)', 'స్పాన్సర్డ్ ఆర్టికల్స్', 'న్యూస్‌లెటర్ స్పాన్సర్‌షిప్స్', 'రెసిపీ స్పాన్సర్‌షిప్స్'],
    contact_title: 'సంప్రదించండి',
    contact_sub: 'ప్రకటన అవకాశాలు చర్చించడానికి మమ్మల్ని సంప్రదించండి.',
  },
  hi: {
    title: 'हमारे साथ विज्ञापन दें',
    sub: 'हर महीने 50,000+ हिंदी स्वास्थ्य-जागरूक पाठकों तक पहुंचें।',
    stats: [
      { label: '50K+', desc: 'मासिक पाठक' },
      { label: '10K+', desc: 'न्यूज़लेटर सब्सक्राइबर' },
      { label: '500+', desc: 'प्रकाशित रेसिपी और लेख' },
    ],
    formats_title: 'उपलब्ध विज्ञापन प्रारूप',
    formats: ['बैनर विज्ञापन (728×90, 300×250)', 'प्रायोजित लेख', 'न्यूज़लेटर प्रायोजन', 'रेसिपी प्रायोजन'],
    contact_title: 'संपर्क करें',
    contact_sub: 'विज्ञापन अवसरों पर चर्चा के लिए हमसे संपर्क करें।',
  },
  en: {
    title: 'Advertise with Us',
    sub: 'Reach 50,000+ Telugu health-conscious readers every month.',
    stats: [
      { label: '50K+', desc: 'Monthly readers' },
      { label: '10K+', desc: 'Newsletter subscribers' },
      { label: '500+', desc: 'Published recipes & articles' },
    ],
    formats_title: 'Ad Formats Available',
    formats: ['Banner ads (728×90, 300×250)', 'Sponsored articles', 'Newsletter sponsorships', 'Recipe sponsorships'],
    contact_title: 'Get in Touch',
    contact_sub: 'Contact us to discuss advertising opportunities.',
  },
}

export default function AdvertisePage() {
  const { language } = useLanguage()
  const tx = t[language]

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="bg-[#F0FAF4] dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">{tx.title}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">{tx.sub}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 text-gray-700 dark:text-slate-300">
        <section className="grid gap-4 md:grid-cols-3">
          {tx.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <p className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">{s.label}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{s.desc}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-3 font-nunito text-xl font-bold text-gray-900 dark:text-slate-50">{tx.formats_title}</h2>
          <ul className="space-y-2 text-sm">
            {tx.formats.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-[#1A5C38] dark:text-emerald-400">✓</span> {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
          <h2 className="mb-2 font-nunito text-xl font-bold text-[#1A5C38] dark:text-emerald-400">{tx.contact_title}</h2>
          <p className="mb-4 text-sm text-gray-700 dark:text-slate-300">{tx.contact_sub}</p>
          <a href="mailto:advertise@nutrilifemitra.com"
            className="inline-flex rounded-full bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            advertise@nutrilifemitra.com
          </a>
        </section>
      </div>
    </div>
  )
}
