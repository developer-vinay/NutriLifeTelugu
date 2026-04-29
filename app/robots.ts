import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin-login',
          '/api/',
          '/profile',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: 'https://nutrilifemitra.com/sitemap.xml',
    host: 'https://nutrilifemitra.com',
  }
}
