'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]'

export default function AdminProfilePage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/profile')
      .then((r) => r.json())
      .then((d) => {
        setName(d.name ?? '')
        setEmail(d.email ?? '')
      })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)

    if (newPassword && newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    setSaving(true)
    const res = await fetch('/api/admin/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      }),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setMsg({ type: 'error', text: data.error ?? 'Failed to save.' })
      return
    }

    await update({ name: data.name })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setMsg({ type: 'success', text: 'Profile updated successfully.' })
    setTimeout(() => setMsg(null), 3000)
  }

  const initials = (name || email || 'A')
    .split(' ')
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Admin Profile</h2>
        <p className="text-sm text-gray-500">Update your name and password.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1A5C38] text-xl font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name || 'Admin'}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Admin</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        {msg && (
          <div className={`rounded-lg px-4 py-2.5 text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {msg.text}
          </div>
        )}

        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Display Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Admin name" className={inputCls} />
        </div>

        {/* Email — read only */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
          <p className="text-xs text-gray-400">Email cannot be changed.</p>
        </div>

        <hr className="border-gray-100" />

        <p className="text-sm font-semibold text-gray-700">Change Password</p>
        <p className="text-xs text-gray-400 -mt-3">Leave blank to keep your current password.</p>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters" className={inputCls} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password" className={inputCls} />
        </div>

        <button type="submit" disabled={saving}
          className="w-full rounded-lg bg-[#1A5C38] py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
