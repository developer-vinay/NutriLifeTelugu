'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useLanguage, LANG_LABELS, type Language } from './LanguageProvider'

const LANGUAGES: Language[] = ['te', 'en']

export default function LanguageToggle({ disabled = false }: { disabled?: boolean }) {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((p) => !p)}
        disabled={disabled}
        title={disabled ? 'Language is set by the article' : 'Select language'}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-bold transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 ${
          disabled
            ? 'cursor-not-allowed opacity-40'
            : 'hover:border-[#1A5C38] hover:text-[#1A5C38] hover:shadow-sm dark:hover:border-emerald-500 dark:hover:text-emerald-400'
        }`}
        aria-label="Select language"
      >
        {LANG_LABELS[language]}
      </button>

      {open && !disabled && (
        <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-gray-100 px-3 py-2 dark:border-slate-700">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">Language</p>
          </div>
          <div className="p-1.5">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => { setLanguage(l); setOpen(false) }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  language === l
                    ? 'bg-emerald-50 text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-xs font-bold dark:border-slate-600">
                  {LANG_LABELS[l]}
                </span>
                <span className="font-medium">{l === 'te' ? 'తెలుగు' : 'English'}</span>
                {language === l && (
                  <svg className="ml-auto h-3.5 w-3.5 shrink-0 text-[#1A5C38] dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
