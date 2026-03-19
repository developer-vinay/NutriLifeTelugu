import VideoForm from '@/components/admin/videos/VideoForm'

export const runtime = 'nodejs'

export default function NewVideoPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">New Video</h2>
      <VideoForm mode="create" />
    </div>
  )
}
