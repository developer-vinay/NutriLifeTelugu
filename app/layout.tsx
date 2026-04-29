import type { Metadata } from 'next'
import React from 'react'
import { Inter, Nunito } from 'next/font/google'
import './globals.css'
import RootShell from '@/components/layout/RootShell'
import ThemeProvider from '@/components/ThemeProvider'
import LanguageProvider from '@/components/LanguageProvider'
import { auth } from '@/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

const SITE_URL = 'https://nutrilifemitra.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NutriLifeMitra — Healthy Indian Recipes, Diet Plans & Nutrition Tips',
    template: '%s | NutriLifeMitra',
  },
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  description:
    'NutriLifeMitra — Healthy Indian recipes, Telugu & Hindi nutrition tips, diabetes diet, weight loss & free meal plans. తెలుగు ఆహారం, డైట్ ప్లాన్స్. पोषण, डाइट प्लान, स्वास्थ्य टिप्स।',
  keywords: [
    // ── English ──
    'Indian nutrition', 'healthy Indian recipes', 'Indian diet plan',
    'Telugu nutrition', 'Telugu diet plan', 'Telugu recipes',
    'Hindi nutrition', 'Hindi diet plan', 'Hindi health tips',
    'diabetes diet India', 'weight loss India', 'millet recipes India',
    'gut health Indian diet', 'thyroid diet India', 'kids nutrition India',
    'free meal plan India', 'Indian health tips', 'NutriLifeMitra',
    'nutrition tips in Telugu', 'nutrition tips in Hindi',
    'healthy breakfast India', 'diabetic friendly Indian food',
    // ── Telugu ──
    'తెలుగు రెసిపీలు', 'తెలుగు ఆహారం', 'తెలుగు డైట్ ప్లాన్',
    'తెలుగు హెల్త్ టిప్స్', 'మధుమేహం ఆహారం', 'బరువు తగ్గడం తెలుగు',
    'రాగి రెసిపీలు', 'పెసరట్టు', 'తెలుగు పోషకాహారం',
    'ఆరోగ్యకరమైన తెలుగు వంటకాలు', 'తెలుగు డయాబెటిస్ డైట్',
    // ── Hindi ──
    'हिंदी पोषण', 'भारतीय आहार', 'हिंदी डाइट प्लान',
    'डायबिटीज डाइट हिंदी', 'वजन घटाने के टिप्स हिंदी',
    'मिलेट रेसिपी हिंदी', 'स्वस्थ भारतीय खाना',
    'हिंदी स्वास्थ्य टिप्स', 'भारतीय पोषण',
  ],
  authors: [{ name: 'NutriLifeMitra', url: SITE_URL }],
  creator: 'NutriLifeMitra',
  publisher: 'NutriLifeMitra',
  category: 'Health & Nutrition',
  alternates: {
    canonical: SITE_URL,
    languages: {
      'te-IN': `${SITE_URL}/?lang=te`,
      'hi-IN': `${SITE_URL}/?lang=hi`,
      'en-IN': `${SITE_URL}/?lang=en`,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['te_IN', 'hi_IN'],
    url: SITE_URL,
    siteName: 'NutriLifeMitra',
    title: 'NutriLifeMitra — Healthy Indian Recipes, Diet Plans & Nutrition Tips',
    description: 'Healthy Indian recipes, Telugu & Hindi nutrition tips, diabetes diet, weight loss & free meal plans. తెలుగు ఆహారం. पोषण टिप्स।',
    images: [{ url: `${SITE_URL}/api/og`, width: 1200, height: 630, alt: 'NutriLifeMitra — Indian Nutrition' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutriLifeMitra — Indian Nutrition, Diet Plans & Health Tips',
    description: 'Healthy Indian recipes, Telugu & Hindi nutrition tips, diabetes diet, weight loss & free meal plans.',
    images: [`${SITE_URL}/api/og`],
    site: '@nutrilifemitra',
    creator: '@nutrilifemitra',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? '',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Wrap in try/catch so a stale/invalid JWT cookie doesn't crash the whole app
  let session = null
  try {
    session = await auth()
  } catch {
    // Invalid or expired session token — treat as logged out
  }

  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A5C38" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NutriLifeMitra" />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}

        {/* OneSignal Push Notifications */}
        {process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.OneSignalDeferred=window.OneSignalDeferred||[];OneSignalDeferred.push(async function(OneSignal){await OneSignal.init({appId:"${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}",notifyButton:{enable:true},allowLocalhostAsSecureOrigin:true});});`,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID && (
          <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer />
        )}

        {/* Theme init (prevent flash) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='dark'||s==='light'?s:(d?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-white font-sans transition-colors duration-200 dark:bg-slate-950">
        <ThemeProvider>
          <LanguageProvider>
            <RootShell session={session}>{children}</RootShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
