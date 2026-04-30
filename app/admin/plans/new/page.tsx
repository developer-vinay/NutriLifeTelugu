'use client'

import { useRouter } from 'next/navigation'
import DietPlanForm from '@/components/admin/plans/DietPlanForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPlanPage() {
  const router = useRouter()

  async function handleSave(data: any) {
    // Determine which API to use based on plan type
    const endpoint = data.planType === 'premium' ? '/api/admin/plans' : '/api/admin/free-plans'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to create plan')
    }

    router.push('/admin/plans')
    router.refresh()
  }

  function handleCancel() {
    router.push('/admin/plans')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/plans"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create New Diet Plan</h1>
          <p className="text-sm text-gray-500">Choose between free or premium plan and fill in the details</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <DietPlanForm onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  )
}
