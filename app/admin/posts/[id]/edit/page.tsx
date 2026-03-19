import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import PostForm from '@/components/admin/posts/PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()
  const post = await Post.findById(id).lean()

  if (!post) {
    notFound()
  }

  const plain = JSON.parse(JSON.stringify(post))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Edit Post</h2>
      <PostForm mode="edit" initialData={plain} />
    </div>
  )
}

