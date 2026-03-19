import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let email: string | undefined

  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const body = await request.json()
    email = body.email
  } else {
    const formData = await request.formData()
    email = formData.get('email') as string | undefined
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  await connectDB()

  await Subscriber.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { email: email.toLowerCase().trim(), isActive: true },
    { upsert: true, new: true },
  )

  return NextResponse.json({ success: true })
}
