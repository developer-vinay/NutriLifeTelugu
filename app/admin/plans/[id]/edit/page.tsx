import { connectDB } from '@/lib/mongodb'
import { PremiumPlan } from '@/models/PremiumPlan'
import PlanForm from '../../PlanForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const plan = await PremiumPlan.findById(id).lean() as any
  if (!plan) notFound()

  return (
    <div className="p-6">
      <PlanForm initial={{
        _id: plan._id.toString(),
        title: plan.title,
        description: plan.description,
        price: plan.price,
        originalPrice: plan.originalPrice ?? undefined,
        discountLabel: plan.discountLabel ?? '',
        currency: plan.currency,
        durationWeeks: plan.durationWeeks,
        features: plan.features?.length ? plan.features : [''],
        isActive: plan.isActive,
        isFeatured: plan.isFeatured ?? false,
        language: plan.language,
        fileUrl: plan.fileUrl,
      }} />
    </div>
  )
}
