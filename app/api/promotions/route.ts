import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Promotion } from '@/models/Promotion'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const placement = searchParams.get('placement')
    const lang = searchParams.get('lang') ?? 'en'

    const now = new Date()

    const query: any = {
      isActive: true,
      $and: [
        // schedule: started or no start date
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        // schedule: not expired or no end date
        { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
        // language: matches current lang or 'all'
        { $or: [{ language: lang }, { language: 'all' }] },
      ],
    }

    if (placement) query.placement = placement

    const promos = await Promotion.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json(promos)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
