import PostForm from '@/components/admin/posts/PostForm'

export const runtime = 'nodejs'

export default function NewPostPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">New Post</h2>
      <PostForm mode="create" />
    </div>
  )
}

