import type { MetadataRoute } from 'next'

const SITE_URL = 'https://nutrilifemitra.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin-login', '/api/', '/profile'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
