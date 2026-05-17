import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') return null
  return session
}

export async function POST(req: Request) {
  // Ensure only admins can upload
  if (!await ensureAdmin()) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'uploads'
    const resourceType = (formData.get('resource_type') as string) || 'auto'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `nutrilifemitra/${folder}`,
          resource_type: resourceType as any,
          transformation: resourceType === 'image' ? [
            { quality: 'auto', fetch_format: 'auto' }
          ] : undefined
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    return NextResponse.json({ 
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
