import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { SiteSettings } from '@/models/SiteSettings'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') return null
  return session
}

// GET all settings
export async function GET() {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  await connectDB()
  const settings = await SiteSettings.find().sort({ key: 1 }).lean()
  
  return NextResponse.json(settings)
}

// POST/PUT update settings
export async function POST(req: Request) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  const body = await req.json()
  const { key, value } = body
  
  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Key and value required' }, { status: 400 })
  }
  
  await connectDB()
  
  const updated = await SiteSettings.findOneAndUpdate(
    { key },
    { value, updatedAt: new Date() },
    { new: true, upsert: false }
  )
  
  if (!updated) {
    return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
  }
  
  return NextResponse.json(updated)
}
