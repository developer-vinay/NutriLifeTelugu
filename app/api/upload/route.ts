import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { uploadImage } from '@/lib/cloudinary'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const session = await auth()

  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const folderParam = (formData.get('folder') as string | null) ?? 'general'

  if (!file || !(file instanceof Blob)) {
    return new NextResponse('No file uploaded', { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    const { url, publicId } = await uploadImage(
      buffer,
      `nutrilifetelugu/${folderParam}`,
    )

    return NextResponse.json({ url, publicId })
  } catch (error) {
    console.error('Upload error:', error)
    return new NextResponse('Upload failed', { status: 500 })
  }
}

