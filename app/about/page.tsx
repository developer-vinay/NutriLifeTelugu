import AboutClient from './AboutClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About NutriLifeMitra — Telugu Nutrition Platform',
  description: 'NutriLifeMitra is a Telugu nutrition platform providing healthy recipes, diet plans and health tips for Telugu, Hindi and English speaking Indian families.',
  keywords: ['about NutriLifeMitra', 'Telugu nutrition platform', 'Indian health website', 'NutriLifeMitra team'],
  alternates: { canonical: 'https://nutrilifemitra.com/about' },
  openGraph: {
    title: 'About NutriLifeMitra — Telugu Nutrition Platform',
    description: 'Telugu nutrition platform providing healthy recipes, diet plans and health tips for Indian families.',
    url: 'https://nutrilifemitra.com/about',
  },
}

export default function AboutPage() {
  return <AboutClient />
}
