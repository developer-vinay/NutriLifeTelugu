'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'email' | 'google'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/admin/dashboard',
    })

    setLoading(false)

    if (!result || result.error) {
      setError('Invalid credentials')
      return
    }

    router.push('/admin/dashboard')
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    const result = await signIn('google', {
      redirect: false,
      callbackUrl: '/admin/dashboard',
    })
    setLoading(false)
    if (!result || result.error) {
      setError('Invalid credentials')
      return
    }
    router.push('/admin/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6]">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A5C38] text-lg font-bold text-white">
            NL
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            NutriLife Telugu
          </h1>
          <p className="text-sm text-gray-500">Admin Login</p>
        </div>

        <div className="mb-4 flex rounded-full border bg-gray-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setTab('email')}
            className={`flex-1 rounded-full px-3 py-2 ${
              tab === 'email'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Email Login
          </button>
          <button
            type="button"
            onClick={() => setTab('google')}
            className={`flex-1 rounded-full px-3 py-2 ${
              tab === 'google'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Google Login
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {tab === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-md bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="mt-2 flex w-full items-center justify-center rounded-md bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
            <p className="text-xs text-gray-500">
              Only the configured admin Google account can access this panel.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

