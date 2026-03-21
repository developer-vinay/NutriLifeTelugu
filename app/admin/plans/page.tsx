import { connectDB } from '@/lib/mongodb'
import { PremiumPlan } from '@/models/PremiumPlan'
import Link from 'next/link'
import AdminPlanActions from './AdminPlanActions'

export const dynamic = 'force-dynamic'

export default async function AdminPlansPage() {
  await connectDB()
  const plans = await PremiumPlan.find().sort({ createdAt: -1 }).lean()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Premium Plans</h1>
        <Link href="/admin/plans/new" className="rounded-md bg-[#1A5C38] px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
          + New Plan
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan: any) => (
          <div key={plan._id.toString()} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{plan.title}</p>
                <p className="text-xs text-gray-500">{plan.durationWeeks}-week plan · {plan.language === 'te' ? 'Telugu' : 'English'}</p>
              </div>
              <span className="text-xl font-bold text-[#D97706]">{plan.currency}{plan.price}</span>
            </div>
            {plan.description && <p className="mb-3 text-xs text-gray-600">{plan.description}</p>}
            {plan.features?.length > 0 && (
              <ul className="mb-3 space-y-1">
                {plan.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                    <span className="text-emerald-500">✓</span>{f}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${plan.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="flex gap-2 text-xs">
                <Link href={`/admin/plans/${plan._id.toString()}/edit`} className="text-[#1A5C38] hover:underline">Edit</Link>
                <AdminPlanActions id={plan._id.toString()} />
              </div>
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <p className="col-span-3 py-10 text-center text-sm text-gray-500">No plans yet. Create your first premium plan.</p>
        )}
      </div>
    </div>
  )
}
