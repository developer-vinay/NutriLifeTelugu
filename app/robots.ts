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
          '/forgot-password',
          '/reset-password',
          '/_next/',
          '/private/',
        ],
        crawlDelay: 1,
      },
      // Special rules for Google
      {
        userAgent: 'Googlebot',
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
      // Special rules for Bing
      {
        userAgent: 'Bingbot',
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
