'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { MessageCircle, Reply, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

export type CommentNode = {
  _id: string
  parentId: string | null
  name: string
  body: string
  createdAt: string
  replies: CommentNode[]
}

type Props = {
  contentType: 'post' | 'recipe'
  contentId: string
  lang?: 'te' | 'en'
}

const UI = {
  te: {
    title: 'వ్యాఖ్యలు',
    namePh: 'మీ పేరు',
    emailPh: 'మీ ఇమెయిల్ (చూపించబడదు)',
    commentPh: 'మీ వ్యాఖ్య రాయండి...',
    replyPh: 'మీ జవాబు రాయండి...',
    submit: 'పంపించు',
    submitting: 'పంపిస్తున్నాం...',
    success: 'మీ వ్యాఖ్య జోడించబడింది!',
    noComments: 'ఇంకా వ్యాఖ్యలు లేవు. మొదటిగా రాయండి!',
    showMore: (n: number) => `మరిన్ని ${n} వ్యాఖ్యలు చూపించు`,
    showLess: 'తక్కువ చూపించు',
    reply: 'జవాబు',
    cancel: 'రద్దు',
    showReplies: (n: number) => `${n} జవాబులు చూపించు`,
    hideReplies: 'జవాబులు దాచు',
  },
  en: {
    title: 'Comments',
    namePh: 'Your name',
    emailPh: 'Your email (not shown)',
    commentPh: 'Write your comment...',
    replyPh: 'Write your reply...',
    submit: 'Post comment',
    submitting: 'Posting...',
    success: 'Comment posted!',
    noComments: 'No comments yet. Be the first!',
    showMore: (n: number) => `Show ${n} more comments`,
    showLess: 'Show less',
    reply: 'Reply',
    cancel: 'Cancel',
    showReplies: (n: number) => `Show ${n} ${n === 1 ? 'reply' : 'replies'}`,
    hideReplies: 'Hide replies',
  },
}

const inputCls =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500'

const INITIAL_SHOW = 3

// Build tree from flat list
function buildTree(flat: Omit<CommentNode, 'replies'>[]): CommentNode[] {
  const map = new Map<string, CommentNode>()
  const roots: CommentNode[] = []
  flat.forEach((c) => map.set(c._id, { ...c, replies: [] }))
  flat.forEach((c) => {
    const node = map.get(c._id)!
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Single comment card ──────────────────────────────────────────────────────
function CommentCard({
  comment,
  t,
  isAdmin,
  onReplyPosted,
  onDeleted,
  depth = 0,
}: {
  comment: CommentNode
  t: typeof UI['en']
  isAdmin: boolean
  onReplyPosted: (reply: CommentNode, parentId: string) => void
  onDeleted: (id: string) => void
  depth?: number
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [deleting, setDeleting] = useState(false)

  const replyCount = comment.replies.length

  async function submitReply(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !body.trim()) return
    setStatus('submitting')
    try {
      // We need contentType/contentId — passed via closure from parent
      // They're not on the node, so we use a data attribute trick via a custom event
      const event = new CustomEvent('nlm-reply', {
        bubbles: true,
        detail: { parentId: comment._id, name, email, comment: body },
      })
      document.dispatchEvent(event)
      // Wait for response via promise stored on window
      const res = await (window as any).__nlmReplyPromise
      if (!res.ok) throw new Error()
      const newReply: CommentNode = { ...(await res.json()), replies: [] }
      onReplyPosted(newReply, comment._id)
      setName(''); setEmail(''); setBody('')
      setStatus('success')
      setShowReplyForm(false)
      setShowReplies(true)
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this comment?')) return
    setDeleting(true)
    await fetch(`/api/admin/comments/${comment._id}`, { method: 'DELETE' })
    onDeleted(comment._id)
    setDeleting(false)
  }

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-emerald-100 pl-4 dark:border-emerald-900/40' : ''}`}>
      <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#1A5C38] dark:bg-emerald-900/40 dark:text-emerald-400">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">{comment.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 dark:text-slate-500">{timeAgo(comment.createdAt)}</span>
            {isAdmin && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={11} /> {deleting ? '...' : 'Delete'}
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-700 dark:text-slate-300">{comment.body}</p>

        {/* Reply button */}
        {depth < 2 && (
          <button
            type="button"
            onClick={() => setShowReplyForm((v) => !v)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-[#1A5C38] hover:underline dark:text-emerald-400"
          >
            <Reply size={12} />
            {showReplyForm ? t.cancel : t.reply}
          </button>
        )}

        {/* Inline reply form */}
        {showReplyForm && (
          <form onSubmit={submitReply} className="mt-3 space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-slate-600 dark:bg-slate-900">
            <div className="grid gap-2 sm:grid-cols-2">
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder={t.namePh} maxLength={80} className={inputCls} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPh} className={inputCls} />
            </div>
            <textarea required value={body} onChange={(e) => setBody(e.target.value)}
              placeholder={t.replyPh} rows={2} maxLength={1000} className={inputCls} />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{body.length}/1000</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowReplyForm(false)}
                  className="rounded-full border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300">
                  {t.cancel}
                </button>
                <button type="submit" disabled={status === 'submitting'}
                  className="rounded-full bg-[#1A5C38] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
                  {status === 'submitting' ? t.submitting : t.submit}
                </button>
              </div>
            </div>
            {status === 'success' && <p className="text-xs text-emerald-600">{t.success}</p>}
            {status === 'error' && <p className="text-xs text-red-500">Something went wrong.</p>}
          </form>
        )}
      </div>

      {/* Replies toggle */}
      {replyCount > 0 && (
        <div className="ml-4 mt-1">
          <button
            type="button"
            onClick={() => setShowReplies((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-[#1A5C38] hover:underline dark:text-emerald-400"
          >
            {showReplies ? (
              <><ChevronUp size={13} /> {t.hideReplies}</>
            ) : (
              <><ChevronDown size={13} /> {t.showReplies(replyCount)}</>
            )}
          </button>

          {showReplies && (
            <div className="mt-2 space-y-2">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply._id}
                  comment={reply}
                  t={t}
                  isAdmin={isAdmin}
                  onReplyPosted={onReplyPosted}
                  onDeleted={onDeleted}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function CommentsSection({ contentType, contentId, lang = 'en' }: Props) {
  const t = UI[lang]
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'admin'

  const [roots, setRoots] = useState<CommentNode[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [shown, setShown] = useState(INITIAL_SHOW)

  // Top-level form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const loadComments = useCallback(() => {
    fetch(`/api/comments?contentType=${contentType}&contentId=${contentId}`)
      .then((r) => r.json())
      .then((flat) => {
        if (!Array.isArray(flat)) return
        const tree = buildTree(flat)
        setRoots(tree)
        setTotalCount(flat.length)
      })
      .catch(() => {})
  }, [contentType, contentId])

  useEffect(() => { loadComments() }, [loadComments])

  // Listen for reply events dispatched by child CommentCards
  useEffect(() => {
    const handler = (e: Event) => {
      const { parentId, name: rName, email: rEmail, comment: rBody } = (e as CustomEvent).detail;
      (window as any).__nlmReplyPromise = fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId, name: rName, email: rEmail, comment: rBody, parentId }),
      })
    }
    document.addEventListener('nlm-reply', handler)
    return () => document.removeEventListener('nlm-reply', handler)
  }, [contentType, contentId])

  // Insert a new reply into the tree
  const handleReplyPosted = useCallback((reply: CommentNode, parentId: string) => {
    setTotalCount((n) => n + 1)
    setRoots((prev) => {
      function insert(nodes: CommentNode[]): CommentNode[] {
        return nodes.map((n) => {
          if (n._id === parentId) return { ...n, replies: [...n.replies, reply] }
          return { ...n, replies: insert(n.replies) }
        })
      }
      return insert(prev)
    })
  }, [])

  // Remove a comment (and its subtree) from the tree
  const handleDeleted = useCallback((id: string) => {
    setTotalCount((n) => Math.max(0, n - 1))
    setRoots((prev) => {
      function remove(nodes: CommentNode[]): CommentNode[] {
        return nodes.filter((n) => n._id !== id).map((n) => ({ ...n, replies: remove(n.replies) }))
      }
      return remove(prev)
    })
  }, [])

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
      const newComment: CommentNode = { ...(await res.json()), replies: [] }
      setRoots((prev) => [newComment, ...prev])
      setTotalCount((n) => n + 1)
      setName(''); setEmail(''); setComment('')
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const visibleRoots = roots.slice(0, shown)
  const remaining = roots.length - shown

  return (
    <section className="mt-8">
      <h2 className="mb-4 flex items-center gap-2 font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">
        <MessageCircle size={20} className="text-[#1A5C38] dark:text-emerald-400" />
        {t.title} ({totalCount})
      </h2>

      {/* Top-level comment form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t.namePh} maxLength={80} className={inputCls} />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPh} className={inputCls} />
        </div>
        <textarea required value={comment} onChange={(e) => setComment(e.target.value)}
          placeholder={t.commentPh} rows={3} maxLength={1000} className={inputCls} />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{comment.length}/1000</span>
          <button type="submit" disabled={status === 'submitting'}
            className="rounded-full bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
            {status === 'submitting' ? t.submitting : t.submit}
          </button>
        </div>
        {status === 'success' && <p className="text-xs text-emerald-600 dark:text-emerald-400">{t.success}</p>}
        {status === 'error' && <p className="text-xs text-red-500">Something went wrong. Try again.</p>}
      </form>

      {/* Comment list */}
      {roots.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">{t.noComments}</p>
      ) : (
        <div className="space-y-3">
          {visibleRoots.map((c) => (
            <CommentCard
              key={c._id}
              comment={c}
              t={t}
              isAdmin={isAdmin}
              onReplyPosted={handleReplyPosted}
              onDeleted={handleDeleted}
            />
          ))}

          {/* Show more / show less */}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setShown((s) => s + 5)}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-gray-200 py-2.5 text-sm font-medium text-[#1A5C38] hover:bg-gray-50 dark:border-slate-700 dark:text-emerald-400 dark:hover:bg-slate-800"
            >
              <ChevronDown size={16} />
              {t.showMore(remaining)}
            </button>
          )}
          {shown > INITIAL_SHOW && roots.length > INITIAL_SHOW && (
            <button
              type="button"
              onClick={() => setShown(INITIAL_SHOW)}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronUp size={16} />
              {t.showLess}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
