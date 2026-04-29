import type { Metadata } from 'next'
import VideosClient from './VideosClient'

export const metadata: Metadata = {
  title: 'Indian Health & Cooking Videos in Telugu, Hindi & English | NutriLifeMitra',
  description: 'Watch Indian health tips, cooking videos, diabetes diet & weight loss videos in Telugu, Hindi & English. తెలుగు వంట వీడియోలు. हिंदी स्वास्थ्य वीडियो।',
  keywords: [
    // English
    'Indian health videos', 'Indian cooking videos', 'diabetes diet video India',
    'weight loss video India', 'millet cooking video', 'Indian nutrition YouTube',
    // Telugu
    'తెలుగు వంట వీడియోలు', 'తెలుగు హెల్త్ వీడియోలు', 'తెలుగు యూట్యూబ్ వంటకాలు',
    // Hindi
    'हिंदी स्वास्थ्य वीडियो', 'हिंदी कुकिंग वीडियो', 'भारतीय स्वास्थ्य वीडियो',
  ],
  alternates: {
    canonical: 'https://nutrilifemitra.com/videos',
    languages: {
      'te-IN': 'https://nutrilifemitra.com/videos?lang=te',
      'hi-IN': 'https://nutrilifemitra.com/videos?lang=hi',
      'en-IN': 'https://nutrilifemitra.com/videos?lang=en',
      'x-default': 'https://nutrilifemitra.com/videos',
    },
  },
  openGraph: {
    title: 'Indian Health & Cooking Videos | NutriLifeMitra',
    description: 'Watch Indian health tips, cooking videos, diabetes diet & weight loss videos in Telugu, Hindi & English.',
    url: 'https://nutrilifemitra.com/videos',
    locale: 'en_IN',
    alternateLocale: ['te_IN', 'hi_IN'],
    images: [{ url: 'https://nutrilifemitra.com/api/og', width: 1200, height: 630 }],
  },
}

export default function VideosPage() {
  return <VideosClient />
}
