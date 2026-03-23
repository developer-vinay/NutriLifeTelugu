import { connectDB } from '@/lib/mongodb'
import { PremiumPlan } from '@/models/PremiumPlan'
import DietPlansClient from './DietPlansClient'

export const dynamic = 'force-dynamic'

export default async function DietPlansPage() {
  await connectDB()
  const plans = await PremiumPlan.find({ isActive: true }).sort({ createdAt: -1 }).lean()
  const serialized = plans.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    description: p.description ?? '',
    price: p.price,
    currency: p.currency,
    durationWeeks: p.durationWeeks,
    features: p.features ?? [],
  }))

  return <DietPlansClient plans={serialized} />
}
