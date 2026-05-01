import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/brevo'
import { rateLimit, RateLimits, getClientIp, createRateLimitResponse } from '@/lib/ratelimit'

export const runtime = 'nodejs'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'vinaybuttala@gmail.com'

export async function POST(req: Request) {
  // Rate limiting: 10 contact form submissions per hour per IP
  // Prevents spam while allowing legitimate follow-ups
  const ip = getClientIp(req)
  const rateLimitResult = rateLimit(ip, RateLimits.MODERATE)
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult)
  }
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  try {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `NutriLifeMitra Contact: ${name}`,
      htmlContent: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
          <h2 style="color:#1A5C38">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background:#f9fafb;border-left:4px solid #1A5C38;padding:16px;border-radius:4px;white-space:pre-wrap">${message}</div>
        </div>
      `,
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
