'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'

export default function NewsletterBox({ subscriberCount }: { subscriberCount: number | null }) {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language }), // Send language preference
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to subscribe')
      }

      setSuccess(true)
      setEmail('')
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const translations = {
    te: {
      title: 'ఉచిత వారపు రెసిపీలు పొందండి',
      description: 'తెలుగు పోషకాహార చిట్కాలు పొందే',
      placeholder: 'మీ ఇమెయిల్ చిరునామా',
      button: 'సబ్‌స్క్రైబ్ చేయండి — ఉచితం',
      success: 'విజయవంతంగా సబ్‌స్క్రైబ్ అయ్యారు! 🎉',
      successMsg: 'స్వాగత సందేశం కోసం మీ ఇమెయిల్ చెక్ చేయండి. మీరు ప్రతి వారం తెలుగు రెసిపీలు మరియు ఆరోగ్య చిట్కాలు అందుకుంటారు!',
      another: 'మరొక ఇమెయిల్ సబ్‌స్క్రైబ్ చేయండి →',
      noSpam: 'స్పామ్ లేదు. ఎప్పుడైనా అన్‌సబ్‌స్క్రైబ్ చేయండి.',
    },
    hi: {
      title: 'मुफ्त साप्ताहिक रेसिपी प्राप्त करें',
      description: 'हिंदी पोषण टिप्स प्राप्त करने वाले',
      placeholder: 'आपका ईमेल पता',
      button: 'सब्सक्राइब करें — मुफ्त',
      success: 'सफलतापूर्वक सब्सक्राइब किया! 🎉',
      successMsg: 'स्वागत संदेश के लिए अपना ईमेल चेक करें। आपको हर हफ्ते हिंदी रेसिपी और स्वास्थ्य टिप्स मिलेंगे!',
      another: 'दूसरा ईमेल सब्सक्राइब करें →',
      noSpam: 'कोई स्पैम नहीं। कभी भी अनसब्सक्राइब करें।',
    },
    en: {
      title: 'Get free weekly recipes',
      description: 'readers getting weekly nutrition tips',
      placeholder: 'Your email address',
      button: "Subscribe — it's free",
      success: 'Successfully Subscribed! 🎉',
      successMsg: "Check your email for a welcome message. You'll receive weekly recipes and health tips in English!",
      another: 'Subscribe another email →',
      noSpam: 'No spam. Unsubscribe anytime.',
    },
  }

  const t = translations[language]

  if (success) {
    return (
      <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-700 dark:bg-emerald-900/20">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">
            {t.success}
          </h3>
        </div>
        <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
          {t.successMsg}
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="text-[10px] font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          {t.another}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex items-center gap-2">
        <Mail size={16} className="text-[#1A5C38] dark:text-emerald-400" />
        <h3 className="text-xs font-semibold text-gray-900 dark:text-slate-50">
          {t.title}
        </h3>
      </div>
      <p className="text-[11px] text-gray-500 dark:text-slate-400">
        {subscriberCount !== null 
          ? `${subscriberCount.toLocaleString('en-IN')}+ ${t.description}` 
          : t.description}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
          placeholder={t.placeholder}
          disabled={loading}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[11px] text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        
        {error && (
          <div className="flex items-center gap-1.5 text-[10px] text-red-600 dark:text-red-400">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#1A5C38] px-3 py-2 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {language === 'te' ? 'సబ్‌స్క్రైబ్ అవుతోంది...' : language === 'hi' ? 'सब्सक्राइब हो रहा है...' : 'Subscribing...'}
            </span>
          ) : (
            t.button
          )}
        </button>
      </form>
      
      <p className="text-[9px] text-gray-400 dark:text-slate-500">
        {t.noSpam}
      </p>
    </div>
  )
}
