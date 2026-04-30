import { v2 as cloudinary } from 'cloudinary'

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables are not fully configured')
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: Buffer, folder: string, resourceType: 'image' | 'raw' = 'image') {
  const result = await new Promise<{
    secure_url: string
    public_id: string
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error('Cloudinary upload failed'))
            return
          }

          resolve({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          })
        },
      )
      .end(file)
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

export async function deleteImage(publicId: string) {
  if (!publicId) return

  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
  })
}

export async function deleteFile(publicId: string, resourceType: 'image' | 'raw' = 'image') {
  if (!publicId) return

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  })
}

