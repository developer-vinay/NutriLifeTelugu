import { connectDB } from '@/lib/mongodb'
import { Video } from '@/models/Video'
import VideoForm from '@/components/admin/videos/VideoForm'
import { notFound } from 'next/navigation'

export const runtime = 'nodejs'

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()
  const video = await Video.findById(id).lean()
  if (!video) notFound()

  const plain = JSON.parse(JSON.stringify(video))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Edit Video</h2>
      <VideoForm mode="edit" initialData={plain} />
    </div>
  )
}
