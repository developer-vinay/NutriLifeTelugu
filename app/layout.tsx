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

const SITE_URL = 'https://nutrilifemitra.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NutriLifeMitra — స్మార్ట్ న్యూట్రిషన్. బెటర్ లైఫ్.',
    template: '%s | NutriLifeMitra',
  },
  description:
    'NutriLifeMitra — ఆరోగ్యకరమైన తెలుగు రెసిపీలు, డైట్ ప్లాన్స్, హెల్త్ టిప్స్. Smart nutrition, better life for Telugu families.',
  keywords: ['Telugu recipes', 'తెలుగు రెసిపీలు', 'diet plans', 'health tips', 'NutriLifeMitra', 'Telugu nutrition', 'millet recipes', 'diabetic diet Telugu'],
  authors: [{ name: 'NutriLifeMitra' }],
  creator: 'NutriLifeMitra',
  openGraph: {
    type: 'website',
    locale: 'te_IN',
    alternateLocale: 'en_IN',
    url: SITE_URL,
    siteName: 'NutriLifeMitra',
    title: 'NutriLifeMitra — స్మార్ట్ న్యూట్రిషన్. బెటర్ లైఫ్.',
    description: 'ఆరోగ్యకరమైన తెలుగు రెసిపీలు, డైట్ ప్లాన్స్, హెల్త్ టిప్స్.',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'NutriLifeMitra' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutriLifeMitra',
    description: 'ఆరోగ్యకరమైన తెలుగు రెసిపీలు, డైట్ ప్లాన్స్, హెల్త్ టిప్స్.',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
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
    <html lang="te" className={`${inter.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A5C38" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
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
