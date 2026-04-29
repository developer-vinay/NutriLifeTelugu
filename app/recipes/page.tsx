import type { Metadata } from 'next'
import RecipesClient from '@/components/recipes/RecipesClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Healthy Indian Recipes in Telugu, Hindi & English | NutriLifeMitra',
  description: 'Healthy Indian recipes for weight loss, diabetes & everyday cooking — in Telugu, Hindi & English. తెలుగు రెసిపీలు. हिंदी रेसिपी। Ragi, pesarattu, millet & more.',
  keywords: [
    // English
    'healthy Indian recipes', 'Indian recipes for weight loss', 'diabetic recipes India',
    'millet recipes India', 'ragi recipes', 'breakfast recipes India',
    'lunch recipes Indian', 'dinner recipes healthy India',
    // Telugu
    'తెలుగు రెసిపీలు', 'రాగి రెసిపీలు', 'పెసరట్టు', 'తెలుగు వంటకాలు',
    'తెలుగు బ్రేక్‌ఫాస్ట్ రెసిపీలు', 'డయాబెటిస్ రెసిపీలు తెలుగు',
    // Hindi
    'हिंदी रेसिपी', 'स्वस्थ भारतीय रेसिपी', 'मिलेट रेसिपी हिंदी',
    'डायबिटीज रेसिपी हिंदी', 'वजन घटाने की रेसिपी',
  ],
  alternates: {
    canonical: 'https://nutrilifemitra.com/recipes',
    languages: {
      'te-IN': 'https://nutrilifemitra.com/recipes?lang=te',
      'hi-IN': 'https://nutrilifemitra.com/recipes?lang=hi',
      'en-IN': 'https://nutrilifemitra.com/recipes?lang=en',
      'x-default': 'https://nutrilifemitra.com/recipes',
    },
  },
  openGraph: {
    title: 'Healthy Indian Recipes in Telugu, Hindi & English | NutriLifeMitra',
    description: 'Healthy Indian recipes for weight loss, diabetes & everyday cooking in Telugu, Hindi & English.',
    url: 'https://nutrilifemitra.com/recipes',
    locale: 'en_IN',
    alternateLocale: ['te_IN', 'hi_IN'],
    images: [{ url: 'https://nutrilifemitra.com/api/og', width: 1200, height: 630 }],
  },
}

export default function RecipesPage() {
  return <RecipesClient />
}
