'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2, Lock } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

type LimitInfo = {
  used: number
  limit: number
  tier: string
}

const SUGGESTED = [
  'What foods help control blood sugar?',
  'Best millets for weight loss?',
  'Diabetic friendly breakfast ideas',
  'How many calories should I eat daily?',
]

const SUGGESTED_TE = [
  'బ్లడ్ షుగర్ తగ్గించే ఆహారాలు ఏవి?',
  'బరువు తగ్గడానికి మిల్లెట్స్?',
  'డయాబెటిక్ బ్రేక్‌ఫాస్ట్ ఐడియాస్',
  'రోజుకు ఎన్ని కేలరీలు తినాలి?',
]

export default function ChatWidget() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [limitMsg, setLimitMsg] = useState('')
  const [showSuggested, setShowSuggested] = useState(true)
  const [lang, setLang] = useState<'en' | 'te'>('en')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isLoggedIn = !!session?.user
  const isPremium = (session?.user as any)?.purchasedPlans?.length > 0

  // Read language from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'te' || stored === 'en') setLang(stored)
    // Watch for changes (e.g. user switches language while chat is open)
    const handler = () => {
      const v = localStorage.getItem('lang')
      if (v === 'te' || v === 'en') setLang(v)
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading || limitReached) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setShowSuggested(false)

    // Build history for API (exclude system messages)
    const history = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const lang = (typeof window !== 'undefined' ? localStorage.getItem('lang') : null) ?? 'en'

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history, lang }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setLimitReached(true)
        setLimitMsg(data.message ?? 'Daily limit reached.')
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: 'system', content: data.message },
        ])
      } else if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: 'assistant', content: data.error ?? 'Something went wrong. Try again.' },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: 'assistant', content: data.reply },
        ])
        setLimitInfo({ used: data.used, limit: data.limit, tier: data.tier })
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: 'Network error. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  const tierLabel = limitInfo
    ? limitInfo.tier === 'guest'
      ? 'Guest'
      : limitInfo.tier === 'premium'
      ? 'Premium'
      : limitInfo.tier === 'admin'
      ? 'Admin'
      : 'Free'
    : isLoggedIn
    ? 'Free'
    : 'Guest'

  const tierColor =
    tierLabel === 'Premium' ? 'text-amber-500' :
    tierLabel === 'Admin' ? 'text-purple-500' :
    tierLabel === 'Guest' ? 'text-gray-400' : 'text-emerald-500'

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open NutriBot chat"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A5C38] text-white shadow-xl transition hover:scale-110 hover:bg-emerald-700 active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#1A5C38] opacity-30" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="flex items-center gap-3 bg-[#1A5C38] px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">NutriBot</p>
              <p className="text-[11px] text-emerald-200">Your Telugu nutrition assistant</p>
            </div>
            <div className="text-right">
              <span className={`text-[11px] font-semibold ${tierColor}`}>{tierLabel}</span>
              {limitInfo && (
                <p className="text-[10px] text-emerald-200">{limitInfo.used}/{limitInfo.limit} today</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Welcome */}
            {messages.length === 0 && (
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1A5C38]">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-gray-100 px-3 py-2 text-sm text-gray-800 dark:bg-slate-800 dark:text-slate-200">
                  {lang === 'te' ? (
                    <>
                      <p>నమస్కారం! 👋 నేను NutriBot — మీ పోషకాహార సహాయకుడు.</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                        రెసిపీలు, డైట్ ప్లాన్లు, బరువు తగ్గడం, డయాబెటిస్ గురించి అడగండి!
                      </p>
                    </>
                  ) : (
                    <>
                      <p>Hello! 👋 I'm NutriBot — your nutrition assistant.</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                        Ask me about recipes, diet plans, weight loss, diabetes, or any nutrition question!
                      </p>
                    </>
                  )}
                  {!isLoggedIn && (
                    <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">
                      {lang === 'te'
                        ? <>గెస్ట్‌గా 3 ప్రశ్నలు మాత్రమే. <Link href="/login" className="underline font-semibold" onClick={() => setOpen(false)}>సైన్ ఇన్</Link> చేయండి రోజుకు 10 కోసం.</>
                        : <>You have 3 free questions as a guest. <Link href="/login" className="underline font-semibold" onClick={() => setOpen(false)}>Sign in</Link> for 10/day.</>
                      }
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Suggested prompts */}
            {showSuggested && messages.length === 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-medium text-gray-500 dark:text-slate-400 px-1">
                  {lang === 'te' ? 'ఇవి అడగండి:' : 'Try asking:'}
                </p>
                {(lang === 'te' ? SUGGESTED_TE : SUGGESTED).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-600"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Message list */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role !== 'user' && (
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${msg.role === 'system' ? 'bg-amber-500' : 'bg-[#1A5C38]'}`}>
                    {msg.role === 'system' ? <Lock size={13} className="text-white" /> : <Bot size={14} className="text-white" />}
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-slate-600">
                    <User size={14} className="text-gray-700 dark:text-slate-200" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-tr-none bg-[#1A5C38] text-white'
                      : msg.role === 'system'
                      ? 'rounded-tl-none bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                      : 'rounded-tl-none bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1A5C38]">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-3 dark:bg-slate-800">
                  <Loader2 size={16} className="animate-spin text-[#1A5C38] dark:text-emerald-400" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Limit reached banner */}
          {limitReached && (
            <div className="border-t border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-900/20">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">{limitMsg}</p>
              {!isLoggedIn ? (
                <Link href="/login" onClick={() => setOpen(false)}
                  className="mt-1.5 inline-flex rounded-full bg-[#1A5C38] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90">
                  Sign in for more →
                </Link>
              ) : !isPremium ? (
                <Link href="/diet-plans#premium" onClick={() => setOpen(false)}
                  className="mt-1.5 inline-flex rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90">
                  Upgrade to Premium →
                </Link>
              ) : null}
            </div>
          )}

          {/* Input */}
          {!limitReached && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'te' ? 'పోషకాహార ప్రశ్న అడగండి...' : 'Ask a nutrition question...'}
                disabled={loading}
                maxLength={300}
                className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A5C38] text-white transition hover:opacity-90 disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
