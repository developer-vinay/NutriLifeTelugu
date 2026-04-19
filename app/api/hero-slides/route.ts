import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HeroSlide } from '@/models/HeroSlide'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean()
    return NextResponse.json(slides)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
