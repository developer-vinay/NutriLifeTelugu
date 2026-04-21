'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, CheckCircle } from 'lucide-react'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Reset failed. The link may have expired.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600">Invalid reset link.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm text-[#1A5C38] underline">Request a new one</Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle size={28} className="text-[#1A5C38]" />
        </div>
        <h2 className="font-nunito text-xl font-bold text-gray-900 dark:text-slate-50">Password updated!</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Redirecting you to sign in…</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <KeyRound size={24} className="text-[#1A5C38]" />
        </div>
        <h1 className="font-nunito text-xl font-bold text-gray-900 dark:text-slate-50">Set new password</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Min 6 characters"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Repeat password"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
        >
          {loading ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-8 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading…</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}
