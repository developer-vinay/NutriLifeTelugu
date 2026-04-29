import type { Metadata } from 'next'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'Health Articles — Indian Nutrition Blog in Telugu, Hindi & English | NutriLifeMitra',
  description: 'Health articles in Telugu, Hindi & English. Diabetes diet, weight loss, gut health, thyroid & kids nutrition tips. తెలుగు ఆరోగ్య వ్యాసాలు. हिंदी स्वास्थ्य लेख।',
  keywords: [
    // English
    'Indian health articles', 'Indian nutrition blog', 'health tips India',
    'diabetes tips India', 'weight loss articles India', 'gut health India',
    'thyroid diet articles', 'kids nutrition India', 'millet health benefits',
    // Telugu
    'తెలుగు ఆరోగ్య వ్యాసాలు', 'తెలుగు హెల్త్ టిప్స్', 'తెలుగు ఆరోగ్య బ్లాగ్',
    'తెలుగు పోషకాహారం', 'మధుమేహం తెలుగు', 'బరువు తగ్గడం తెలుగు',
    // Hindi
    'हिंदी स्वास्थ्य लेख', 'हिंदी स्वास्थ्य ब्लॉग', 'हिंदी पोषण टिप्स',
    'डायबिटीज टिप्स हिंदी', 'वजन घटाने के लेख',
  ],
  alternates: {
    canonical: 'https://nutrilifemitra.com/blog',
    languages: {
      'te-IN': 'https://nutrilifemitra.com/blog?lang=te',
      'hi-IN': 'https://nutrilifemitra.com/blog?lang=hi',
      'en-IN': 'https://nutrilifemitra.com/blog?lang=en',
      'x-default': 'https://nutrilifemitra.com/blog',
    },
  },
  openGraph: {
    title: 'Health Articles — Indian Nutrition Blog | NutriLifeMitra',
    description: 'Health articles in Telugu, Hindi & English. Diabetes diet, weight loss, gut health & more.',
    url: 'https://nutrilifemitra.com/blog',
    locale: 'en_IN',
    alternateLocale: ['te_IN', 'hi_IN'],
    images: [{ url: 'https://nutrilifemitra.com/api/og', width: 1200, height: 630 }],
  },
}

export default function BlogListPage() {
  return <BlogListClient />
}
