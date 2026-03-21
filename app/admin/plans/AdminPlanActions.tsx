'use client'

import { useRouter } from 'next/navigation'

export default function AdminPlanActions({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this plan?')) return
    await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button type="button" onClick={handleDelete} className="text-red-500 hover:underline">
      Delete
    </button>
  )
}
