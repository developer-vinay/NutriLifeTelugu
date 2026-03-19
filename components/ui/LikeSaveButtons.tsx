'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Props = {
  contentId: string
  contentType: 'post' | 'recipe' | 'video'
  initialLikes?: number
  isLiked?: boolean
  isSaved?: boolean
}

export default function LikeSaveButtons({ contentId, contentType, initialLikes = 0, isLiked = false, isSaved = false }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [liked, setLiked] = useState(isLiked)
  const [saved, setSaved] = useState(isSaved)
  const [likes, setLikes] = useState(initialLikes)
  const [likeLoading, setLikeLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  async function handleLike() {
    if (!session) { router.push('/login'); return }
    setLikeLoading(true)
    const action = liked ? 'unlike' : 'like'
    setLiked(!liked)
    setLikes((n) => n + (liked ? -1 : 1))
    await fetch('/api/user/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: contentType, id: contentId, action }),
    })
    setLikeLoading(false)
  }

  async function handleSave() {
    if (!session) { router.push('/login'); return }
    setSaveLoading(true)
    const action = saved ? 'unsave' : 'save'
    setSaved(!saved)
    await fetch('/api/user/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: contentType, id: contentId, action }),
    })
    setSaveLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleLike}
        disabled={likeLoading}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
          liked
            ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400'
            : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-700 dark:hover:text-red-400'
        }`}
      >
        <span>{liked ? '❤️' : '🤍'}</span>
        <span>{likes}</span>
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={saveLoading}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
          saved
            ? 'border-[#1A5C38] bg-emerald-50 text-[#1A5C38] dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
            : 'border-gray-200 bg-white text-gray-600 hover:border-[#1A5C38] hover:text-[#1A5C38] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-700 dark:hover:text-emerald-400'
        }`}
      >
        <span>{saved ? '🔖' : '📌'}</span>
        <span>{saved ? 'Saved' : 'Save'}</span>
      </button>
    </div>
  )
}
