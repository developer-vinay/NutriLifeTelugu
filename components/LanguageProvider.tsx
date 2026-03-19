'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'te' | 'en'

export const LANG_LABELS: Record<Language, string> = {
  te: 'తెలుగు',
  en: 'English',
}

export const LANG_LOGOS: Record<Language, string> = {
  te: '/TeluguLogo.png',
  en: '/EnglishLogo.png',
}

export const LANG_SUBTITLE: Record<Language, string> = {
  te: 'తెలుగు',
  en: '',
}

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
    if (stored === 'te' || stored === 'en') setLang(stored)
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
