import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'
import { sendEmail, welcomeEmailHtml } from '@/lib/brevo'
import { rateLimit, RateLimits, getClientIp, createRateLimitResponse } from '@/lib/ratelimit'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  // Rate limiting: 10 subscriptions per hour per IP
  // Prevents spam and abuse while allowing legitimate re-subscriptions
  const ip = getClientIp(request)
  const rateLimitResult = rateLimit(ip, RateLimits.MODERATE)
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult)
  }
  let email: string | undefined
  let language: 'en' | 'te' | 'hi' = 'en'

  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await request.json()
    email = body.email
    language = body.language || 'en'
  } else {
    const formData = await request.formData()
    email = formData.get('email') as string | undefined
    language = (formData.get('language') as 'en' | 'te' | 'hi') || 'en'
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  await connectDB()

  const normalized = email.toLowerCase().trim()
  const existing = await Subscriber.findOne({ email: normalized })

  await Subscriber.findOneAndUpdate(
    { email: normalized },
    { email: normalized, isActive: true, language }, // Save language preference
    { upsert: true, new: true },
  )

  // Send welcome email only for new subscribers
  if (!existing) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 Attempting to send welcome email to ${normalized}`)
        console.log(`📧 BREVO_API_KEY exists: ${!!process.env.BREVO_API_KEY}`)
        console.log(`📧 BREVO_FROM_EMAIL: ${process.env.BREVO_FROM_EMAIL}`)
      }
      
      await sendEmail({
        to: normalized,
        subject: 'Welcome to NutriLifeMitra! 🌿',
        htmlContent: welcomeEmailHtml(normalized),
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Welcome email sent successfully to ${normalized}`)
      }
    } catch (emailError: any) {
      // Log detailed error but don't fail the subscription
      console.error('❌ Failed to send welcome email:')
      console.error('Error message:', emailError.message)
      if (process.env.NODE_ENV === 'development') {
        console.error('Error stack:', emailError.stack)
        console.error('Full error:', emailError)
      }
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`ℹ️ Subscriber ${normalized} already exists, skipping welcome email`)
  }

  return NextResponse.json({ success: true })
}
