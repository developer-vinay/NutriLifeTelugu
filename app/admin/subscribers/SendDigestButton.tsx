'use client'

import React, { useState } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export default function SendDigestButton({ activeCount }: { activeCount: number }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)

  async function handleSend() {
    if (!confirm(`Send weekly digest to ${activeCount} active subscribers?`)) return
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/admin/send-digest', { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    setResult({ sent: data.sent ?? 0, failed: data.failed ?? 0 })
  }

  return (
    <div className="flex items-center gap-3">
      {result && (
        <span className="flex items-center gap-1.5 text-sm text-emerald-700">
          <CheckCircle size={14} /> Sent {result.sent}, failed {result.failed}
        </span>
      )}
      <button
        onClick={handleSend}
        disabled={loading || activeCount === 0}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
        {loading ? 'Sending…' : 'Send Weekly Digest'}
      </button>
    </div>
  )
}
