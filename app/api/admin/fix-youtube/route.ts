import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  await connectDB()
  const db = mongoose.connection.db!

  // Fix all case variants
  const variants = [
    ['nutrilifemithra', 'nutrilifemitra'],
    ['NutriLifeMithra', 'NutriLifeMitra'],
    ['NUTRILIFEMITHRA', 'NUTRILIFEMITRA'],
  ]

  let totalModified = 0
  for (const [find, replace] of variants) {
    const r = await db.collection('videos').updateMany(
      { youtubeUrl: { $regex: find, $options: 'i' } },
      [{ $set: { youtubeUrl: { $replaceAll: { input: '$youtubeUrl', find, replacement: replace } } } }]
    )
    totalModified += r.modifiedCount
  }

  // Also do a direct string replace on all docs regardless
  const all = await db.collection('videos').find({}).toArray()
  for (const v of all) {
    if (v.youtubeUrl && v.youtubeUrl.toLowerCase().includes('nutrilifemithra')) {
      const fixed = v.youtubeUrl.replace(/nutrilifemithra/gi, 'nutrilifemitra')
      await db.collection('videos').updateOne({ _id: v._id }, { $set: { youtubeUrl: fixed } })
      totalModified++
    }
  }

  const videos = await db.collection('videos')
    .find({}, { projection: { title: 1, youtubeUrl: 1 } })
    .toArray()

  return NextResponse.json({ totalModified, videos })
}
