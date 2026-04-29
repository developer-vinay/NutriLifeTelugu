import Hero from '@/components/home/Hero'
import HomeMainLayout from '@/components/home/HomeMainLayout'
import { connectDB } from '@/lib/mongodb'
import { Video } from '@/models/Video'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://nutrilifemitra.com'

export default async function Home() {
  await connectDB()
  const latestVideo = await Video.findOne({ isPublished: true }).sort({ createdAt: -1 }).lean()

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NutriLifeMitra',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    description: 'Healthy Indian recipes, Telugu & Hindi nutrition tips, diabetes diet, weight loss & free meal plans for Indian families.',
    sameAs: [
      'https://youtube.com/@nutrilifemitra',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['Telugu', 'English', 'Hindi'],
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NutriLifeMitra',
    url: SITE_URL,
    description: 'Healthy Indian recipes, Telugu & Hindi nutrition tips, diabetes diet plans and health tips.',
    inLanguage: ['te', 'en', 'hi'],
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div>
        <Hero />
        <HomeMainLayout latestVideo={latestVideo ? JSON.parse(JSON.stringify(latestVideo)) : null} />
      </div>
    </>
  )
}
