import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return new Response('<p>Invalid unsubscribe link.</p>', { headers: { 'Content-Type': 'text/html' } })
  }

  await connectDB()
  await Subscriber.findOneAndUpdate({ email: email.toLowerCase() }, { isActive: false })

  return new Response(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px 20px">
      <h2 style="color:#1A5C38">✅ Unsubscribed</h2>
      <p style="color:#6b7280">You've been removed from NutriLifeMithra emails.</p>
      <a href="https://nutrilifemithra.vercel.app" style="color:#1A5C38">← Back to site</a>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } },
  )
}
