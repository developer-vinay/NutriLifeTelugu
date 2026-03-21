'use client'

import React, { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

type Comment = {
  _id: string
  name: string
  body: string
  createdAt: string
}

type Props = {
  contentType: 'post' | 'recipe'
  contentId: string
  lang?: 'te' | 'en'
}

const UI = {
  te: {
    title: 'వ్యాఖ్యలు',
    namePlaceholder: 'మీ పేరు',
    emailPlaceholder: 'మీ ఇమెయిల్ (చూపించబడదు)',
    commentPlaceholder: 'మీ వ్యాఖ్య రాయండి...',
    submit: 'పంపించు',
    submitting: 'పంపిస్తున్నాం...',
    success: 'మీ వ్యాఖ్య జోడించబడింది!',
    noComments: 'ఇంకా వ్యాఖ్యలు లేవు. మొదటిగా రాయండి!',
  },
  en: {
    title: 'Comments',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Your email (not shown)',
    commentPlaceholder: 'Write your comment...',
    submit: 'Post comment',
    submitting: 'Posting...',
    success: 'Comment posted!',
    noComments: 'No comments yet. Be the first!',
  },
}

const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500'

export default function CommentsSection({ contentType, contentId, lang = 'en' }: Props) {
  const t = UI[lang]
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetch(`/api/comments?contentType=${contentType}&contentId=${contentId}`)
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setComments(d))
      .catch(() => {})
  }, [contentType, contentId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !comment.trim()) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId, name, email, comment }),
      })
      if (!res.ok) throw new Error()
      const newComment = await res.json()
      setComments((prev) => [newComment, ...prev])
      setName('')
      setEmail('')
      setComment('')
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 flex items-center gap-2 font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">
        <MessageCircle size={20} className="text-[#1A5C38] dark:text-emerald-400" />
        {t.title} ({comments.length})
      </h2>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            maxLength={80}
            className={inputCls}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className={inputCls}
          />
        </div>
        <textarea
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t.commentPlaceholder}
          rows={3}
          maxLength={1000}
          className={inputCls}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{comment.length}/1000</span>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="rounded-full bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {status === 'submitting' ? t.submitting : t.submit}
          </button>
        </div>
        {status === 'success' && <p className="text-xs text-emerald-600 dark:text-emerald-400">{t.success}</p>}
        {status === 'error' && <p className="text-xs text-red-500">Something went wrong. Try again.</p>}
      </form>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">{t.noComments}</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c._id} className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">{c.name}</span>
                <span className="text-[11px] text-gray-400 dark:text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-slate-300">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
