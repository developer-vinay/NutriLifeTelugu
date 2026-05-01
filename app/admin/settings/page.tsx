'use client'

import React, { useEffect, useState } from 'react'
import { Settings, Save, RefreshCw, BarChart3, Info, Mail, Share2 } from 'lucide-react'

type Setting = {
  _id: string
  key: string
  value: string
  label: string
  description?: string
  category?: string
}

type SettingsByCategory = {
  [category: string]: Setting[]
}

const categoryInfo = {
  statistics: {
    title: 'Site Statistics',
    description: 'Numbers displayed on your public pages',
    icon: BarChart3,
    color: 'emerald',
  },
  site_info: {
    title: 'Site Information',
    description: 'Basic information about your website',
    icon: Info,
    color: 'blue',
  },
  contact: {
    title: 'Contact Information',
    description: 'Email addresses for different purposes',
    icon: Mail,
    color: 'purple',
  },
  social: {
    title: 'Social Media',
    description: 'Social media profile URLs',
    icon: Share2,
    color: 'pink',
  },
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    setLoading(true)
    const res = await fetch('/api/admin/site-settings')
    const data = await res.json()
    setSettings(data)
    setLoading(false)
  }

  async function handleSave(key: string, value: string) {
    setSaving(key)
    setMessage(null)
    
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save')
      }
      
      setMessage({ type: 'success', text: `✓ ${key} updated successfully!` })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      console.error('Save error:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to save setting' })
    } finally {
      setSaving(null)
    }
  }

  function handleChange(key: string, value: string) {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s))
  }

  // Group settings by category
  const settingsByCategory: SettingsByCategory = settings.reduce((acc, setting) => {
    const category = setting.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(setting)
    return acc
  }, {} as SettingsByCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-gray-400" size={24} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings size={20} />
            Site Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update site-wide statistics and information
          </p>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Settings by Category */}
      <div className="space-y-8">
        {Object.entries(settingsByCategory).map(([category, categorySettings]) => {
          const info = categoryInfo[category as keyof typeof categoryInfo]
          if (!info) return null
          
          const Icon = info.icon
          const colorClasses = {
            emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
            blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
            purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
            pink: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
          }
          
          return (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className={`rounded-xl border p-4 ${colorClasses[info.color as keyof typeof colorClasses]}`}>
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <div>
                    <h3 className="font-semibold text-sm">{info.title}</h3>
                    <p className="text-xs opacity-80">{info.description}</p>
                  </div>
                </div>
              </div>

              {/* Settings in this category */}
              <div className="grid gap-4 md:grid-cols-2">
                {categorySettings.map((setting) => (
                  <div key={setting.key} className="rounded-xl border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-1">
                        {setting.label}
                      </label>
                      {setting.description && (
                        <p className="text-xs text-gray-500 dark:text-slate-400">{setting.description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        placeholder={`Enter ${setting.label.toLowerCase()}`}
                      />
                      <button
                        onClick={() => handleSave(setting.key, setting.value)}
                        disabled={saving === setting.key}
                        className="flex items-center gap-1.5 rounded-lg bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving === setting.key ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Save size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <strong>💡 Tip:</strong> These settings are displayed on your public pages. 
          Update them regularly to keep your site fresh and accurate. Changes take effect immediately.
        </p>
      </div>
    </div>
  )
}
