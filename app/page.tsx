import Hero from '@/components/home/Hero'
import HomeMainLayout from '@/components/home/HomeMainLayout'
import { connectDB } from '@/lib/mongodb'
import { Video } from '@/models/Video'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function Home() {
  await connectDB()
  const latestVideo = await Video.findOne({ isPublished: true }).sort({ createdAt: -1 }).lean()

  return (
    <div>
      <Hero />
      <HomeMainLayout latestVideo={latestVideo ? JSON.parse(JSON.stringify(latestVideo)) : null} />
    </div>
  )
}
