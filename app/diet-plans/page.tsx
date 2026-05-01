import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { PremiumPlan } from '@/models/PremiumPlan'
import DietPlansClient from './DietPlansClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Indian Diet Plans in Telugu, Hindi & English — Free & Premium | NutriLifeMitra',
  description: 'Free & premium Indian diet plans for weight loss, diabetes, millets & more — in Telugu, Hindi & English. డైట్ ప్లాన్స్ ఉచిత PDF. मुफ्त डाइट प्लान PDF डाउनलोड।',
  keywords: [
    // English
    'Indian diet plan', 'free diet plan India', 'diabetes diet plan India',
    'weight loss meal plan India', 'millet diet plan', 'Indian meal plan PDF',
    'free meal plan download India', 'healthy Indian diet',
    // Telugu
    'తెలుగు డైట్ ప్లాన్', 'ఉచిత డైట్ ప్లాన్', 'తెలుగు మీల్ ప్లాన్',
    'మధుమేహం డైట్ ప్లాన్ తెలుగు', 'బరువు తగ్గడం ప్లాన్ తెలుగు',
    // Hindi
    'हिंदी डाइट प्लान', 'मुफ्त डाइट प्लान', 'भारतीय आहार योजना',
    'डायबिटीज डाइट प्लान हिंदी', 'वजन घटाने का प्लान हिंदी',
  ],
  alternates: {
    canonical: 'https://nutrilifemitra.com/diet-plans',
    languages: {
      'te-IN': 'https://nutrilifemitra.com/diet-plans?lang=te',
      'hi-IN': 'https://nutrilifemitra.com/diet-plans?lang=hi',
      'en-IN': 'https://nutrilifemitra.com/diet-plans?lang=en',
      'x-default': 'https://nutrilifemitra.com/diet-plans',
    },
  },
  openGraph: {
    title: 'Indian Diet Plans in Telugu, Hindi & English | NutriLifeMitra',
    description: 'Free & premium Indian diet plans for weight loss, diabetes, millets & more.',
    url: 'https://nutrilifemitra.com/diet-plans',
    locale: 'en_IN',
    alternateLocale: ['te_IN', 'hi_IN'],
    images: [{ url: 'https://nutrilifemitra.com/api/og', width: 1200, height: 630 }],
  },
}

export default async function DietPlansPage() {
  await connectDB()
  const plans = await PremiumPlan.find({ isActive: true }).sort({ createdAt: -1 }).lean()
  const serialized = plans.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    description: p.description ?? '',
    price: p.price,
    currency: p.currency,
    durationWeeks: p.durationWeeks,
    features: p.features ?? [],
  }))

  // Get free plans count dynamically
  const { FreeMealPlan } = await import('@/models/FreeMealPlan')
  const freePlansCount = await FreeMealPlan.countDocuments()

  // Get site settings
  const { SiteSettings } = await import('@/models/SiteSettings')
  const settings = await SiteSettings.find().select('key value').lean()
  const settingsObj = settings.reduce((acc: any, s: any) => {
    acc[s.key] = s.value
    return acc
  }, {})

  return <DietPlansClient 
    plans={serialized} 
    freePlansCount={freePlansCount}
    familiesServed={settingsObj.families_served || '10,000+'}
    cuisinePercentage={settingsObj.cuisine_percentage || '100%'}
  />
}
