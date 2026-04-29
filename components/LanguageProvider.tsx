'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'te' | 'en' | 'hi'

export const LANG_LABELS: Record<Language, string> = {
  te: 'తె',
  en: 'EN',
  hi: 'हि',
}

export const LANG_LOGOS: Record<Language, string> = {
  te: '/logo.png',
  en: '/logo.png',
  hi: '/logo.png',
}

export const BRAND_NAME = 'NutriLifeMitra'

const LanguageContext = createContext<{
  language: Language
  setLanguage: (l: Language) => void
}>({ language: 'en', setLanguage: () => {} })

export function useLanguage() {
  return useContext(LanguageContext)
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Language | null
    if (stored === 'te' || stored === 'en' || stored === 'hi') setLang(stored)
  }, [])

  const setLanguage = (l: Language) => {
    setLang(l)
    localStorage.setItem('lang', l)
    fetch('/api/user/language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: l }),
    }).catch(() => {})
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
