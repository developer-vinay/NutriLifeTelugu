'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DietPlanForm from '@/components/admin/plans/DietPlanForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditFreePlanPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then(p => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    
    async function fetchPlan() {
      const res = await fetch(`/api/admin/free-plans/${id}`)
      if (res.ok) {
        const data = await res.json()
        // Add planType to help the form know this is a free plan
        setPlan({ ...data, planType: 'free' })
      }
      setLoading(false)
    }
    fetchPlan()
  }, [id])

  async function handleSave(data: any) {
    const res = await fetch(`/api/admin/free-plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to update plan')
    }

    router.push('/admin/plans')
    router.refresh()
  }

  function handleCancel() {
    router.push('/admin/plans')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1A5C38] mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading plan...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Plan not found</p>
        <Link href="/admin/plans" className="mt-4 inline-block text-[#1A5C38] hover:underline">
          ← Back to plans
        </Link>
      </div>
    )
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
          <h1 className="text-xl font-bold text-gray-900">Edit Free Plan</h1>
          <p className="text-sm text-gray-500">{plan.titleEn}</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <DietPlanForm initialData={plan} onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  )
}
