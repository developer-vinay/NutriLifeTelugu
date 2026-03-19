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

export const metadata: Metadata = {
  title: 'NutriLife Telugu — స్మార్ట్ న్యూట్రిషన్. బెటర్ లైఫ్.',
  description:
    'NutriLife Telugu — ఆరోగ్యకరమైన తెలుగు రెసిపీలు, డైట్ ప్లాన్స్, హెల్త్ టిప్స్. Smart nutrition, better life for Telugu families.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="te" className={`${inter.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
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
