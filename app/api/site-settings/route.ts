import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { SiteSettings } from '@/models/SiteSettings'

export const runtime = 'nodejs'
export const revalidate = 300 // Cache for 5 minutes

// GET public settings (no auth required)
export async function GET() {
  await connectDB()
  
  const settings = await SiteSettings.find().select('key value').lean()
  
  // Convert to key-value object for easy access
  const settingsObj = settings.reduce((acc: any, setting: any) => {
    acc[setting.key] = setting.value
    return acc
  }, {})
  
  return NextResponse.json(settingsObj)
}
