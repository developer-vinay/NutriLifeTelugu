'use client'

import React, { useState } from 'react'
import { Mail, Loader2, CheckCircle, X } from 'lucide-react'

export default function SendDigestButton({ activeCount, langCounts }: { activeCount: number; langCounts: { en: number; te: number; hi: number } }) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; breakdown?: { english: number; telugu: number; hindi: number } } | null>(null)

  async function handleConfirmSend() {
    setShowModal(false)
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/admin/send-digest', { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    setResult({ sent: data.sent ?? 0, failed: data.failed ?? 0, breakdown: data.breakdown })
  }

  return (
    <>
      <div className="flex flex-col items-end gap-2">
        {result && (
          <div className="text-right">
            <span className="flex items-center gap-1.5 text-sm text-emerald-700">
              <CheckCircle size={14} /> Sent {result.sent}, failed {result.failed}
            </span>
            {result.breakdown && (
              <p className="text-xs text-gray-500">
                EN: {result.breakdown.english} · TE: {result.breakdown.telugu} · HI: {result.breakdown.hindi}
              </p>
            )}
          </div>
        )}
        <button
          onClick={() => setShowModal(true)}
          disabled={loading || activeCount === 0}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
          {loading ? 'Sending…' : 'Send Weekly Digest'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                Send Weekly Digest
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-6 space-y-3">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Send weekly digest to <strong>{activeCount} active subscriber{activeCount !== 1 ? 's' : ''}</strong>?
              </p>

              {(langCounts.en > 0 || langCounts.te > 0 || langCounts.hi > 0) && (
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="mb-2 text-xs font-semibold text-blue-900 dark:text-blue-100">
                    Language Breakdown:
                  </p>
                  <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    {langCounts.en > 0 && (
                      <div className="flex justify-between">
                        <span>English:</span>
                        <strong>{langCounts.en}</strong>
                      </div>
                    )}
                    {langCounts.te > 0 && (
                      <div className="flex justify-between">
                        <span>తెలుగు (Telugu):</span>
                        <strong>{langCounts.te}</strong>
                      </div>
                    )}
                    {langCounts.hi > 0 && (
                      <div className="flex justify-between">
                        <span>हिंदी (Hindi):</span>
                        <strong>{langCounts.hi}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-slate-400">
                Each subscriber will receive content in their preferred language.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSend}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
