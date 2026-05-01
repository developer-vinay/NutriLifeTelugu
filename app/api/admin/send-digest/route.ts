import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/models/Subscriber'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { sendEmail, weeklyDigestHtml } from '@/lib/brevo'
import { rateLimit, RateLimits, createRateLimitResponse } from '@/lib/ratelimit'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limiting: 3 digest sends per hour per admin
  // Prevents accidental multiple sends and abuse
  const adminEmail = session?.user?.email || 'unknown'
  const rateLimitResult = rateLimit(`digest:${adminEmail}`, RateLimits.ADMIN)
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult)
  }

  await connectDB()

  // Get active subscribers grouped by language
  const subscribers = await Subscriber.find({ isActive: true }).select('email language').lean()

  if (!subscribers.length) {
    return NextResponse.json({ message: 'No active subscribers', sent: 0 })
  }

  // Group subscribers by language
  const subscribersByLang: Record<string, string[]> = {
    en: [],
    te: [],
    hi: [],
  }

  subscribers.forEach((sub) => {
    const lang = sub.language || 'en'
    subscribersByLang[lang].push(sub.email)
  })

  let sent = 0
  let failed = 0

  // Send language-specific content to each group
  for (const [lang, emails] of Object.entries(subscribersByLang)) {
    if (emails.length === 0) continue

    // Fetch content for this language
    const [posts, recipes] = await Promise.all([
      Post.find({ isPublished: true, language: lang }).sort({ createdAt: -1 }).limit(5).select('title slug excerpt').lean(),
      Recipe.find({ isPublished: true, language: lang }).sort({ createdAt: -1 }).limit(5).select('title slug').lean(),
    ])

    // Skip if no content for this language
    if (posts.length === 0 && recipes.length === 0) {
      console.log(`No content found for language: ${lang}`)
      continue
    }

    // Send to all subscribers of this language
    for (const email of emails) {
      try {
        const html = weeklyDigestHtml(
          posts.map(p => ({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? '' })),
          recipes.map(r => ({ title: r.title, slug: r.slug })),
        ).replace('{{email}}', encodeURIComponent(email))

        await sendEmail({
          to: email,
          subject: lang === 'te' 
            ? '🌿 ఈ వారం NutriLifeMitra నుండి'
            : lang === 'hi'
            ? '🌿 इस सप्ताह NutriLifeMitra से'
            : '🌿 This Week on NutriLifeMitra',
          htmlContent: html,
        })
        sent++
        // Small delay to respect rate limits
        await new Promise(r => setTimeout(r, 100))
      } catch {
        failed++
      }
    }
  }

  return NextResponse.json({ 
    success: true, 
    sent, 
    failed, 
    total: subscribers.length,
    breakdown: {
      english: subscribersByLang.en.length,
      telugu: subscribersByLang.te.length,
      hindi: subscribersByLang.hi.length,
    }
  })
}
