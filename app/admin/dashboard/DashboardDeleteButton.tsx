'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardDeleteButton({
  id,
  type,
}: {
  id: string
  type: 'posts' | 'recipes' | 'videos'
}) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this item? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' })
    setDeleting(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      disabled={deleting}
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 disabled:opacity-40"
    >
      {deleting ? '...' : 'Delete'}
    </button>
  )
}
