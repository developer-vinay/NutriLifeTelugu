import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import HealthTipsCategoryClient from './HealthTipsCategoryClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://nutrilifemitra.com'

const categories = ['weight-loss', 'diabetes', 'gut-health', 'thyroid', 'immunity', 'kids-nutrition'] as const

const categoryMeta: Record<string, { title: string; description: string; keywords: string[] }> = {
  'weight-loss': {
    title: 'Weight Loss Tips in Telugu, Hindi & English | NutriLifeMitra',
    description: 'Science-backed weight loss tips for Indian families in Telugu, Hindi & English. బరువు తగ్గడానికి తెలుగు డైట్ టిప్స్. वजन घटाने के टिप्स हिंदी।',
    keywords: [
      'weight loss India', 'weight loss tips Telugu', 'weight loss tips Hindi',
      'బరువు తగ్గడం', 'Telugu weight loss diet', 'Indian weight loss tips',
      'fat loss India', 'वजन घटाना', 'वजन घटाने के टिप्स', 'भारतीय वजन घटाना',
    ],
  },
  'diabetes': {
    title: 'Diabetes Diet Tips in Telugu, Hindi & English | NutriLifeMitra',
    description: 'Diabetes-friendly Indian recipes and diet tips in Telugu, Hindi & English. మధుమేహం కోసం తెలుగు ఆహారం. डायबिटीज डाइट टिप्स हिंदी।',
    keywords: [
      'diabetes diet India', 'diabetes diet Telugu', 'diabetes diet Hindi',
      'మధుమేహం ఆహారం', 'blood sugar control Indian diet', 'diabetic recipes India',
      'low GI Indian food', 'मधुमेह आहार', 'डायबिटीज डाइट हिंदी',
    ],
  },
  'gut-health': {
    title: 'Gut Health Tips in Telugu, Hindi & English | NutriLifeMitra',
    description: 'Improve digestion with Indian probiotic foods in Telugu, Hindi & English. జీర్ణశక్తి మెరుగుపడేందుకు తెలుగు ఆహారం. पाचन स्वास्थ्य टिप्स हिंदी।',
    keywords: [
      'gut health India', 'gut health Telugu', 'gut health Hindi',
      'జీర్ణశక్తి', 'Indian probiotic foods', 'digestion tips India',
      'पाचन स्वास्थ्य', 'पाचन सुधारने के टिप्स', 'भारतीय प्रोबायोटिक',
    ],
  },
  'thyroid': {
    title: 'Thyroid Diet Tips in Telugu, Hindi & English | NutriLifeMitra',
    description: 'Thyroid-friendly Indian diet tips in Telugu, Hindi & English. థైరాయిడ్ కోసం తెలుగు ఆహారం. थायरॉइड डाइट टिप्स हिंदी।',
    keywords: [
      'thyroid diet India', 'thyroid diet Telugu', 'thyroid diet Hindi',
      'థైరాయిడ్ ఆహారం', 'Indian thyroid diet', 'hormone balance food India',
      'थायरॉइड आहार', 'थायरॉइड डाइट हिंदी', 'हार्मोन संतुलन आहार',
    ],
  },
  'immunity': {
    title: 'Immunity Boosting Foods in Telugu, Hindi & English | NutriLifeMitra',
    description: 'Boost immunity with traditional Indian foods in Telugu, Hindi & English. రోగనిరోధకత పెంచే తెలుగు ఆహారం. रोग प्रतिरोधक क्षमता बढ़ाएं।',
    keywords: [
      'immunity foods India', 'immunity foods Telugu', 'immunity foods Hindi',
      'రోగనిరోధకత', 'Indian immunity boosters', 'traditional Indian health foods',
      'इम्युनिटी बूस्टर', 'रोग प्रतिरोधक क्षमता', 'भारतीय इम्युनिटी फूड',
    ],
  },
  'kids-nutrition': {
    title: 'Kids Nutrition Tips in Telugu, Hindi & English | NutriLifeMitra',
    description: 'Healthy tiffin ideas and nutrition tips for Indian kids in Telugu, Hindi & English. పిల్లల పోషణ తెలుగు. बच्चों का पोषण हिंदी।',
    keywords: [
      'kids nutrition India', 'kids nutrition Telugu', 'kids nutrition Hindi',
      'పిల్లల పోషణ', 'Indian kids tiffin ideas', 'healthy school lunch India',
      'बच्चों का पोषण', 'बच्चों के लिए टिफिन', 'भारतीय बच्चों का आहार',
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const meta = categoryMeta[category]
  if (!meta) return {}
  const url = `${SITE_URL}/health-tips/${category}`
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: url,
      languages: {
        'te-IN': `${url}?lang=te`,
        'hi-IN': `${url}?lang=hi`,
        'en-IN': `${url}?lang=en`,
        'x-default': url,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      locale: 'en_IN',
      alternateLocale: ['te_IN', 'hi_IN'],
      images: [{ url: `${SITE_URL}/api/og`, width: 1200, height: 630 }],
    },
  }
}

export function generateStaticParams() {
  return categories.map((category) => ({ category }))
}

export default async function HealthTipsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  if (!categories.includes(category as any)) notFound()

  await connectDB()
  // Fetch all languages — client will filter by selected language
  const posts = await Post.find({ isPublished: true, category })
    .sort({ createdAt: -1 })
    .limit(60)
    .lean()

  const serialized = posts.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? '',
    heroImage: p.heroImage ?? '',
    tag: p.tag ?? '',
    language: p.language ?? 'en',
    readTimeMinutes: p.readTimeMinutes ?? 5,
  }))

  return <HealthTipsCategoryClient category={category} posts={serialized} />
}
