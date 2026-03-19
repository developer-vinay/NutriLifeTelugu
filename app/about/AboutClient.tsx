'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'

const content = {
  en: {
    hero_title: 'About NutriLife',
    hero_sub: 'Smart Nutrition. Better Life.',
    mission_title: 'Our Mission',
    mission_body:
      'NutriLife is a health and nutrition platform built to make healthy eating simple, affordable, and culturally relevant. We believe good nutrition starts in your own kitchen — with the ingredients you already know and love. Our goal is to bring evidence-based nutrition guidance to every family, in a language and style that feels familiar.',
    story_title: 'Our Story',
    story_body:
      'NutriLife was born from a simple observation: most nutrition content online is either too generic or too expensive to be useful for everyday families. We set out to change that by creating content rooted in local food culture — traditional recipes made healthier, diet plans that fit real budgets, and health tips that actually work in daily life.',
    what_title: 'What We Offer',
    what_items: [
      '500+ healthy recipes with step-by-step instructions',
      'Free diet plans for weight loss, diabetes, thyroid, and more',
      'Evidence-based health articles written in plain language',
      'YouTube videos with cooking guides and health education',
      'Weekly newsletter with nutrition tips and seasonal recipes',
    ],
    values_title: 'Our Values',
    values: [
      { icon: '🌿', title: 'Evidence-Based', desc: 'Every tip and recipe is grounded in nutritional science, not trends.' },
      { icon: '🏡', title: 'Culturally Rooted', desc: 'We celebrate local ingredients and traditional cooking methods.' },
      { icon: '💚', title: 'Accessible to All', desc: 'Free content for everyone — no paywalls on the basics.' },
      { icon: '🤝', title: 'Community First', desc: 'Built with and for our readers, not just for them.' },
    ],
    team_title: 'Behind NutriLife',
    team_body:
      'NutriLife is run by a small team of nutritionists, food writers, and developers who are passionate about making healthy living accessible. We work with certified dietitians to ensure every piece of content meets the highest standards of accuracy.',
    cta_recipes: 'Browse Recipes',
    cta_plans: 'Free Diet Plans',
    cta_contact: 'Contact Us',
  },
  te: {
    hero_title: 'న్యూట్రిలైఫ్ గురించి',
    hero_sub: 'స్మార్ట్ న్యూట్రిషన్. బెటర్ లైఫ్.',
    mission_title: 'మా లక్ష్యం',
    mission_body:
      'న్యూట్రిలైఫ్ అనేది ఆరోగ్యకరమైన తినడాన్ని సులభంగా, అందుబాటులో మరియు సాంస్కృతికంగా సంబంధితంగా చేయడానికి నిర్మించిన ఒక ఆరోగ్య మరియు పోషకాహార వేదిక. మంచి పోషకాహారం మీ స్వంత వంటగదిలో మొదలవుతుందని మేము నమ్ముతున్నాం — మీకు ఇప్పటికే తెలిసిన మరియు ఇష్టమైన పదార్థాలతో. ప్రతి కుటుంబానికి సాక్ష్యం-ఆధారిత పోషకాహార మార్గదర్శకత్వాన్ని అందించడం మా లక్ష్యం.',
    story_title: 'మా కథ',
    story_body:
      'న్యూట్రిలైఫ్ ఒక సాధారణ పరిశీలన నుండి పుట్టింది: ఆన్‌లైన్‌లో చాలా పోషకాహార కంటెంట్ రోజువారీ కుటుంబాలకు ఉపయోగపడేంత సాధారణంగా లేదా చాలా ఖరీదుగా ఉంటుంది. స్థానిక ఆహార సంస్కృతిలో పాతుకుపోయిన కంటెంట్ సృష్టించడం ద్వారా దాన్ని మార్చాలని మేము నిర్ణయించుకున్నాం — ఆరోగ్యకరంగా చేయబడిన సాంప్రదాయ వంటకాలు, నిజమైన బడ్జెట్‌లకు సరిపోయే డైట్ ప్లాన్‌లు మరియు రోజువారీ జీవితంలో నిజంగా పని చేసే ఆరోగ్య చిట్కాలు.',
    what_title: 'మేము అందించేది',
    what_items: [
      'దశల వారీ సూచనలతో 500+ ఆరోగ్యకరమైన వంటకాలు',
      'బరువు తగ్గడం, మధుమేహం, థైరాయిడ్ మరియు మరిన్నింటికి ఉచిత డైట్ ప్లాన్‌లు',
      'సాధారణ భాషలో రాసిన సాక్ష్యం-ఆధారిత ఆరోగ్య వ్యాసాలు',
      'వంట గైడ్‌లు మరియు ఆరోగ్య విద్యతో YouTube వీడియోలు',
      'పోషకాహార చిట్కాలు మరియు సీజనల్ వంటకాలతో వారపు న్యూస్‌లెటర్',
    ],
    values_title: 'మా విలువలు',
    values: [
      { icon: '🌿', title: 'సాక్ష్యం-ఆధారిత', desc: 'ప్రతి చిట్కా మరియు వంటకం పోషకాహార శాస్త్రంలో ఆధారపడి ఉంటుంది.' },
      { icon: '🏡', title: 'సాంస్కృతికంగా పాతుకుపోయిన', desc: 'మేము స్థానిక పదార్థాలు మరియు సాంప్రదాయ వంట పద్ధతులను జరుపుకుంటాం.' },
      { icon: '💚', title: 'అందరికీ అందుబాటులో', desc: 'అందరికీ ఉచిత కంటెంట్ — ప్రాథమిక విషయాలపై పేవాల్‌లు లేవు.' },
      { icon: '🤝', title: 'కమ్యూనిటీ ఫస్ట్', desc: 'మా పాఠకులతో మరియు వారి కోసం నిర్మించబడింది.' },
    ],
    team_title: 'న్యూట్రిలైఫ్ వెనుక',
    team_body:
      'న్యూట్రిలైఫ్ ఆరోగ్యకరమైన జీవనాన్ని అందుబాటులో ఉంచడంపై మక్కువ ఉన్న పోషకాహార నిపుణులు, ఆహార రచయితలు మరియు డెవలపర్‌ల చిన్న బృందం నడుపుతోంది. ప్రతి కంటెంట్ ఖచ్చితత్వం యొక్క అత్యున్నత ప్రమాణాలను అందుకుంటుందని నిర్ధారించడానికి మేము సర్టిఫైడ్ డైటీషియన్‌లతో కలిసి పని చేస్తాం.',
    cta_recipes: 'వంటకాలు చూడండి',
    cta_plans: 'ఉచిత డైట్ ప్లాన్‌లు',
    cta_contact: 'సంప్రదించండి',
  },
}

export default function AboutClient() {
  const { language } = useLanguage()
  const t = content[language]

  return (
    <div className="bg-white dark:bg-slate-950">

      {/* Hero banner */}
      <section className="bg-gradient-to-br from-[#1A5C38] to-emerald-700">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center text-white">
          <h1 className="font-nunito text-4xl font-bold md:text-5xl">{t.hero_title}</h1>
          <p className="mt-3 text-lg text-emerald-100">{t.hero_sub}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-6 py-14">

        {/* Mission */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-[#1A5C38] dark:bg-emerald-900/40 dark:text-emerald-400">
              {language === 'te' ? 'మా లక్ష్యం' : 'Mission'}
            </span>
            <h2 className="mb-4 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{t.mission_title}</h2>
            <p className="leading-relaxed text-gray-600 dark:text-slate-400">{t.mission_body}</p>
          </div>
          <div className="flex items-center justify-center rounded-2xl bg-emerald-50 p-10 dark:bg-emerald-900/20">
            <span className="text-7xl">🥗</span>
          </div>
        </section>

        {/* Story */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="order-2 flex items-center justify-center rounded-2xl bg-amber-50 p-10 dark:bg-amber-900/10 md:order-1">
            <span className="text-7xl">📖</span>
          </div>
          <div className="order-1 md:order-2">
            <span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              {language === 'te' ? 'మా కథ' : 'Story'}
            </span>
            <h2 className="mb-4 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{t.story_title}</h2>
            <p className="leading-relaxed text-gray-600 dark:text-slate-400">{t.story_body}</p>
          </div>
        </section>

        {/* What we offer */}
        <section>
          <h2 className="mb-6 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{t.what_title}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {t.what_items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1A5C38] text-[10px] font-bold text-white">✓</span>
                <span className="text-sm text-gray-700 dark:text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Values */}
        <section>
          <h2 className="mb-6 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{t.values_title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.values.map((v, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-3 text-3xl">{v.icon}</div>
                <h3 className="mb-1 font-nunito text-sm font-bold text-gray-900 dark:text-slate-50">{v.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-slate-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="rounded-2xl bg-gradient-to-r from-emerald-50 to-white p-8 dark:from-emerald-900/20 dark:to-slate-950">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1A5C38] text-2xl text-white">👨‍⚕️</div>
            <div>
              <h2 className="mb-2 font-nunito text-xl font-bold text-gray-900 dark:text-slate-50">{t.team_title}</h2>
              <p className="leading-relaxed text-gray-600 dark:text-slate-400">{t.team_body}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-wrap gap-3">
          <Link href="/recipes" className="rounded-full bg-[#1A5C38] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800">
            {t.cta_recipes}
          </Link>
          <Link href="/diet-plans" className="rounded-full border border-[#1A5C38] px-6 py-2.5 text-sm font-semibold text-[#1A5C38] transition hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            {t.cta_plans}
          </Link>
          <Link href="/advertise" className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
            {t.cta_contact}
          </Link>
        </section>

      </div>
    </div>
  )
}
