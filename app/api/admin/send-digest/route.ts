import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { sendEmail, weeklyDigestHtml } from '@/lib/brevo'

export const runtime = 'nodejs'

export async function POST() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  // Get last 5 published posts and recipes
  const [posts, recipes, subscribers] = await Promise.all([
    Post.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5).select('title slug excerpt').lean(),
    Recipe.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5).select('title slug').lean(),
    Subscriber.find({ isActive: true }).select('email').lean(),
  ])

  if (!subscribers.length) {
    return NextResponse.json({ message: 'No active subscribers', sent: 0 })
  }

  let sent = 0
  let failed = 0

  for (const sub of subscribers) {
    try {
      const html = weeklyDigestHtml(
        posts.map(p => ({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? '' })),
        recipes.map(r => ({ title: r.title, slug: r.slug })),
      ).replace('{{email}}', encodeURIComponent(sub.email))

      await sendEmail({
        to: sub.email,
        subject: '🌿 This Week on NutriLifeMithra',
        htmlContent: html,
      })
      sent++
      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 100))
    } catch {
      failed++
    }
  }

  return NextResponse.json({ success: true, sent, failed, total: subscribers.length })
}
