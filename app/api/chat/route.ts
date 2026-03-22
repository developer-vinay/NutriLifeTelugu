import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { ChatUsage } from '@/models/ChatUsage'
import { User } from '@/models/User'

export const runtime = 'nodejs'

// Daily limits per tier
const LIMITS = {
  guest: 3,
  free: 10,
  premium: 50,
  admin: 9999,
}

function todayStr() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return (forwarded ? forwarded.split(',')[0] : 'unknown').trim()
}

export async function POST(req: Request) {
  const body = await req.json()
  const { message, history = [] } = body as {
    message: string
    history: { role: 'user' | 'assistant'; content: string }[]
  }

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 })
  }

  await connectDB()

  // ── Identify user & tier ──────────────────────────────────────────────────
  const session = await auth()
  const userId = (session?.user as any)?.id as string | undefined
  const role = (session?.user as any)?.role as string | undefined

  let tier: 'guest' | 'free' | 'premium' | 'admin' = 'guest'
  let identifier = getClientIP(req)

  if (userId) {
    identifier = userId
    if (role === 'admin') {
      tier = 'admin'
    } else {
      // Check if user has any purchased plans → premium
      const user = await User.findById(userId).select('purchasedPlans').lean()
      tier = user && user.purchasedPlans?.length > 0 ? 'premium' : 'free'
    }
  }

  const limit = LIMITS[tier]

  // ── Enforce daily limit ───────────────────────────────────────────────────
  const today = todayStr()
  const usage = await ChatUsage.findOneAndUpdate(
    { identifier, date: today },
    { $inc: { count: 1 }, updatedAt: new Date() },
    { upsert: true, returnDocument: 'after' },
  )

  if (usage.count > limit) {
    const upgradeMsg =
      tier === 'guest'
        ? 'Please sign in to get more questions (10/day free).'
        : tier === 'free'
        ? 'Upgrade to a premium plan to get 50 questions/day.'
        : 'Daily limit reached. Try again tomorrow.'

    return NextResponse.json(
      { error: 'limit_reached', message: upgradeMsg, limit, used: usage.count - 1 },
      { status: 429 },
    )
  }

  // ── Fetch relevant context from DB ────────────────────────────────────────
  const q = message.trim()

  const [posts, recipes] = await Promise.all([
    Post.find({
      isPublished: true,
      $or: [
        { title: { $regex: q.split(' ').slice(0, 4).join('|'), $options: 'i' } },
        { tag: { $regex: q.split(' ').slice(0, 3).join('|'), $options: 'i' } },
        { category: { $regex: q.split(' ')[0], $options: 'i' } },
      ],
    })
      .select('title excerpt tag category content')
      .limit(3)
      .lean(),

    Recipe.find({
      isPublished: true,
      $or: [
        { title: { $regex: q.split(' ').slice(0, 4).join('|'), $options: 'i' } },
        { tag: { $regex: q.split(' ').slice(0, 3).join('|'), $options: 'i' } },
        { category: { $regex: q.split(' ')[0], $options: 'i' } },
      ],
    })
      .select('title description tag category ingredients nutritionFacts prepTimeMinutes cookTimeMinutes servings')
      .limit(3)
      .lean(),
  ])

  // Build context string (strip HTML tags from content)
  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  const contextParts: string[] = []

  posts.forEach((p) => {
    const snippet = stripHtml(p.content ?? '').slice(0, 400)
    contextParts.push(
      `[ARTICLE] "${p.title}" (${p.tag ?? p.category})\n${p.excerpt ?? snippet}`,
    )
  })

  recipes.forEach((r) => {
    const ingList = r.ingredients?.slice(0, 8).join(', ') ?? ''
    const nf = r.nutritionFacts
      ? Object.entries(r.nutritionFacts)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      : ''
    contextParts.push(
      `[RECIPE] "${r.title}" (${r.tag ?? r.category})\nIngredients: ${ingList}\n${nf ? `Nutrition: ${nf}` : ''}\nPrep: ${r.prepTimeMinutes ?? '?'} min | Cook: ${r.cookTimeMinutes ?? '?'} min | Serves: ${r.servings ?? '?'}`,
    )
  })

  const contextBlock =
    contextParts.length > 0
      ? `\n\nRelevant content from NutriLifeMithra:\n${contextParts.join('\n\n')}`
      : ''

  // ── Build messages for OpenAI ─────────────────────────────────────────────
  const systemPrompt = `You are NutriBot, the friendly nutrition assistant for NutriLifeMithra — a Telugu health and nutrition website.

Your role:
- Answer questions about nutrition, healthy eating, Telugu recipes, diet plans, weight loss, diabetes management, gut health, thyroid, kids nutrition, and millets.
- Use the provided context from NutriLifeMithra's articles and recipes when relevant.
- Keep answers concise, practical, and friendly.
- If the question is about a specific recipe or article from the context, reference it directly.
- If you don't know something specific, say so honestly and suggest they check the relevant section of the website.
- You can respond in Telugu or English based on what the user writes.
- Do NOT answer questions unrelated to health, nutrition, food, or wellness.
- Do NOT give medical diagnoses or replace professional medical advice. Always recommend consulting a doctor for medical conditions.
- Current user tier: ${tier} (${usage.count}/${limit} questions used today)${contextBlock}`

  // Keep last 6 messages for context window efficiency
  const recentHistory = history.slice(-6)

  // ── Call Google Gemini ────────────────────────────────────────────────────
  // Build contents array for Gemini (system prompt goes as first user turn)
  const geminiContents: { role: string; parts: { text: string }[] }[] = []

  // Gemini doesn't have a system role — prepend as first user/model exchange
  geminiContents.push({ role: 'user', parts: [{ text: systemPrompt }] })
  geminiContents.push({ role: 'model', parts: [{ text: 'Understood! I am NutriBot, ready to help with Telugu nutrition questions.' }] })

  // Add conversation history
  for (const msg of recentHistory) {
    geminiContents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })
  }

  // Add current user message
  geminiContents.push({ role: 'user', parts: [{ text: q }] })

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.5,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    },
  )

  if (!geminiRes.ok) {
    const err = await geminiRes.text()
    console.error('Gemini error:', err)
    return NextResponse.json({ error: 'AI service unavailable. Try again.' }, { status: 502 })
  }

  const data = await geminiRes.json()
  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    'Sorry, I could not generate a response.'

  return NextResponse.json({
    reply,
    used: usage.count,
    limit,
    tier,
  })
}
