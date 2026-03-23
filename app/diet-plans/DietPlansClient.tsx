'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import BuyPlanButton from '@/components/payment/BuyPlanButton'
import { Download, CheckCircle2, Leaf, Heart, Baby, Wheat, Activity, Flame } from 'lucide-react'

const freePlans = [
  {
    icon: Flame,
    title: { te: '7-రోజుల వెయిట్ లాస్ ప్లాన్', en: '7-Day Weight Loss Plan', hi: '7-दिन वजन घटाने का प्लान' },
    desc: { te: 'ఉచిత PDF — ప్రారంభించండి.', en: 'Free PDF — get started today.', hi: 'मुफ्त PDF — आज शुरू करें।' },
    color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700',
    iconColor: 'text-orange-500',
  },
  {
    icon: Activity,
    title: { te: 'డయాబెటిస్ ఫ్రెండ్లీ ప్లాన్', en: 'Diabetes Friendly Plan', hi: 'डायबिटीज फ्रेंडली प्लान' },
    desc: { te: 'షుగర్ కంట్రోల్ ఫోకస్.', en: 'Focused on blood sugar control.', hi: 'ब्लड शुगर नियंत्रण पर केंद्रित।' },
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700',
    iconColor: 'text-blue-500',
  },
  {
    icon: Wheat,
    title: { te: 'మిల్లెట్స్ మీల్ చార్ట్', en: 'Millets Meal Chart', hi: 'मिलेट्स मील चार्ट' },
    desc: { te: 'తెలుగు మిల్లెట్స్ రిసిపీలు.', en: 'Telugu millet recipes & meal ideas.', hi: 'भारतीय मिलेट रेसिपी और मील आइडिया।' },
    color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Leaf,
    title: { te: 'గట్ హెల్త్ ప్లాన్', en: 'Gut Health Plan', hi: 'पाचन स्वास्थ्य प्लान' },
    desc: { te: 'జీర్ణశక్తి మెరుగుపడే మెనూ.', en: 'Menu to improve digestion.', hi: 'पाचन सुधारने वाला मेनू।' },
    color: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Heart,
    title: { te: 'థైరాయిడ్ సపోర్ట్ ప్లాన్', en: 'Thyroid Support Plan', hi: 'थायरॉइड सपोर्ट प्लान' },
    desc: { te: 'సింపుల్ రోజువారీ సూచనలు.', en: 'Simple daily dietary guidance.', hi: 'सरल दैनिक आहार मार्गदर्शन।' },
    color: 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-700',
    iconColor: 'text-pink-500',
  },
  {
    icon: Baby,
    title: { te: 'పిల్లల పోషణ ప్లాన్', en: "Kids Nutrition Plan", hi: 'बच्चों का पोषण प्लान' },
    desc: { te: 'టిఫిన్ & డిన్నర్ ఐడియాస్.', en: 'Tiffin & dinner ideas for kids.', hi: 'बच्चों के लिए टिफिन और डिनर आइडिया।' },
    color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700',
    iconColor: 'text-purple-500',
  },
]

const t = {
  te: {
    hero_title: 'డైట్ ప్లాన్స్',
    hero_sub: 'ఉచిత & ప్రీమియం మీల్ ప్లాన్స్ — తెలుగు కుటుంబాల కోసం ప్రత్యేకంగా రూపొందించబడ్డాయి.',
    features: ['100% తెలుగు వంటకాలు', 'డయాబెటిక్ ఫ్రెండ్లీ ఆప్షన్స్', 'ప్రింటబుల్ PDF ఫార్మాట్', 'నిపుణుల పోషకాహార నిపుణులు ఆమోదించారు'],
    free_nav: 'ఉచిత ప్లాన్స్', premium_nav: 'ప్రీమియం ప్లాన్స్', tools_nav: 'హెల్త్ టూల్స్',
    free_title: 'ఉచిత ప్లాన్స్',
    premium_title: 'ప్రీమియం ప్లాన్స్',
    premium_badge: 'నిపుణులు రూపొందించారు',
    no_plans: 'ప్రీమియం ప్లాన్స్ త్వరలో వస్తాయి',
    no_plans_sub: 'వ్యక్తిగతీకరించిన మీల్ ప్లాన్స్ నిపుణుల మార్గదర్శకత్వంతో — త్వరలో లాంచ్ అవుతాయి.',
    email_placeholder: 'మీ ఇమెయిల్',
    download: 'ఉచిత PDF డౌన్‌లోడ్',
    week_plan: '-వారాల ప్లాన్',
    one_time: 'ఒకసారి చెల్లింపు',
    tools_title: 'మీకు ఏ ప్లాన్ సరిపోతుందో తెలుసుకోండి',
    tools_sub: 'మా ఉచిత హెల్త్ టూల్స్ ఉపయోగించి మీ BMI, కేలరీలు తనిఖీ చేయండి.',
    tools_btn: 'హెల్త్ టూల్స్ ట్రై చేయండి →',
    trust: [
      { title: 'నిపుణులు ఆమోదించారు', desc: 'అన్ని ప్లాన్స్ సర్టిఫైడ్ పోషకాహార నిపుణులు సమీక్షించారు' },
      { title: 'తెలుగు వంటకాలు', desc: 'సాంప్రదాయ పదార్థాలు, ఆధునిక పోషకాహార శాస్త్రం' },
      { title: 'తక్షణ డౌన్‌లోడ్', desc: 'PDF మీ ఇన్‌బాక్స్‌కు వెంటనే పంపబడుతుంది' },
    ],
  },
  hi: {
    hero_title: 'डाइट प्लान्स',
    hero_sub: 'मुफ्त और प्रीमियम मील प्लान्स — भारतीय परिवारों के लिए विशेष रूप से तैयार।',
    features: ['100% भारतीय व्यंजन', 'डायबिटिक फ्रेंडली विकल्प', 'प्रिंटेबल PDF फॉर्मेट', 'विशेषज्ञ पोषण विशेषज्ञ अनुमोदित'],
    free_nav: 'मुफ्त प्लान्स', premium_nav: 'प्रीमियम प्लान्स', tools_nav: 'हेल्थ टूल्स',
    free_title: 'मुफ्त प्लान्स',
    premium_title: 'प्रीमियम प्लान्स',
    premium_badge: 'विशेषज्ञ डिज़ाइन',
    no_plans: 'प्रीमियम प्लान्स जल्द आ रहे हैं',
    no_plans_sub: 'विशेषज्ञ मार्गदर्शन के साथ व्यक्तिगत मील प्लान्स — जल्द लॉन्च होंगे।',
    email_placeholder: 'आपका ईमेल',
    download: 'मुफ्त PDF डाउनलोड',
    week_plan: '-सप्ताह का प्लान',
    one_time: 'एकमुश्त भुगतान',
    tools_title: 'जानें कौन सा प्लान आपके लिए सही है',
    tools_sub: 'हमारे मुफ्त हेल्थ टूल्स से अपना BMI और कैलोरी जरूरत जांचें।',
    tools_btn: 'हेल्थ टूल्स आज़माएं →',
    trust: [
      { title: 'विशेषज्ञ अनुमोदित', desc: 'सभी प्लान्स प्रमाणित पोषण विशेषज्ञों द्वारा समीक्षित' },
      { title: 'भारतीय व्यंजन', desc: 'पारंपरिक सामग्री, आधुनिक पोषण विज्ञान' },
      { title: 'तुरंत डाउनलोड', desc: 'PDF आपके इनबॉक्स में तुरंत भेजा जाएगा' },
    ],
  },
  en: {
    hero_title: 'Diet Plans',
    hero_sub: 'Free & premium meal plans — specially designed for Telugu families.',
    features: ['100% Telugu cuisine', 'Diabetic friendly options', 'Printable PDF format', 'Expert nutritionist approved'],
    free_nav: 'Free Plans', premium_nav: 'Premium Plans', tools_nav: 'Health Tools',
    free_title: 'Free Plans',
    premium_title: 'Premium Plans',
    premium_badge: 'Expert Designed',
    no_plans: 'Premium plans coming soon',
    no_plans_sub: 'Personalized meal plans with expert guidance — launching soon.',
    email_placeholder: 'Your email',
    download: 'Download Free PDF',
    week_plan: '-week plan',
    one_time: 'one-time',
    tools_title: 'Find out which plan suits you',
    tools_sub: 'Use our free health tools to check your BMI and calorie needs.',
    tools_btn: 'Try Health Tools →',
    trust: [
      { title: 'Expert Approved', desc: 'All plans reviewed by certified nutritionists' },
      { title: 'Telugu Cuisine', desc: 'Traditional ingredients, modern nutrition science' },
      { title: 'Instant Download', desc: 'PDF delivered to your inbox immediately' },
    ],
  },
}

export default function DietPlansClient({ plans }: { plans: any[] }) {
  const { language } = useLanguage()
  const tx = t[language]

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="mt-16 bg-gradient-to-br from-[#1A5C38] to-emerald-600 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                <Leaf size={12} /> Telugu Nutrition
              </span>
              <h1 className="font-nunito text-4xl font-bold text-white">{tx.hero_title}</h1>
              <p className="mt-2 max-w-lg text-sm text-emerald-100">{tx.hero_sub}</p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-emerald-100">
              {tx.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick nav */}
      <div className="border-b bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl gap-6 px-4 py-3 text-sm font-medium">
          <a href="#free" className="text-[#1A5C38] hover:underline dark:text-emerald-400">{tx.free_nav}</a>
          <a href="#premium" className="text-[#1A5C38] hover:underline dark:text-emerald-400">{tx.premium_nav}</a>
          <a href="#tools" className="text-[#1A5C38] hover:underline dark:text-emerald-400">{tx.tools_nav}</a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">

        {/* Free Plans */}
        <section id="free">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-[#1A5C38]" />
            <h2 className="font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{tx.free_title}</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">100% Free</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {freePlans.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.title.en} className={`group rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-md ${p.color}`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800 ${p.iconColor}`}>
                      <Icon size={20} />
                    </div>
                    <p className="font-nunito text-base font-bold text-gray-900 dark:text-slate-50">{p.title[language]}</p>
                  </div>
                  <p className="mb-4 text-sm text-gray-600 dark:text-slate-400">{p.desc[language]}</p>
                  <div className="space-y-2">
                    <input type="email" placeholder={tx.email_placeholder}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500" />
                    <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A5C38] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
                      <Download size={14} /> {tx.download}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Premium Plans */}
        <section id="premium">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-amber-500" />
            <h2 className="font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{tx.premium_title}</h2>
            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">{tx.premium_badge}</span>
          </div>
          {plans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-10 text-center dark:border-amber-700 dark:bg-amber-900/10">
              <p className="font-nunito text-lg font-semibold text-amber-800 dark:text-amber-300">{tx.no_plans}</p>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">{tx.no_plans_sub}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((p) => (
                <div key={p._id} className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white shadow-sm dark:border-amber-700 dark:from-amber-900/20 dark:to-slate-800">
                  <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-400" />
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-nunito text-xl font-bold text-gray-900 dark:text-amber-200">{p.title}</p>
                        {p.description && <p className="mt-1 text-sm text-gray-600 dark:text-amber-300">{p.description}</p>}
                        <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                          {p.durationWeeks}{tx.week_plan}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#D97706] dark:text-amber-400">{p.currency}{p.price}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">{tx.one_time}</div>
                      </div>
                    </div>
                    {p.features?.length > 0 && (
                      <ul className="mb-4 space-y-2">
                        {p.features.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <BuyPlanButton planId={p._id} planTitle={p.title} price={p.price} currency={p.currency} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Health tools CTA */}
        <section id="tools" className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A5C38] to-emerald-600 p-8 text-white shadow-lg">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="font-nunito text-2xl font-bold">{tx.tools_title}</p>
              <p className="mt-1 text-sm text-emerald-100">{tx.tools_sub}</p>
            </div>
            <Link href="/health-tools" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1A5C38] shadow hover:bg-emerald-50 transition">
              <Activity size={16} /> {tx.tools_btn}
            </Link>
          </div>
        </section>

        {/* Trust signals */}
        <section className="grid gap-4 sm:grid-cols-3">
          {tx.trust.map(({ title, desc }, i) => {
            const icons = [CheckCircle2, Leaf, Download]
            const Icon = icons[i]
            return (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1A5C38]/10 dark:bg-emerald-900/30">
                  <Icon size={18} className="text-[#1A5C38] dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-slate-50">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{desc}</p>
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}
