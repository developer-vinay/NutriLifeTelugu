import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { Recipe } from '@/models/Recipe'
import { ChatUsage } from '@/models/ChatUsage'
import { User } from '@/models/User'

export const runtime = 'nodejs'

const LIMITS = { guest: 3, free: 10, premium: 50, admin: 9999 }

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function getClientIP(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  return (fwd ? fwd.split(',')[0] : 'unknown').trim()
}

const stripHtml = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export async function POST(req: Request) {
  const body = await req.json()
  const { message, history = [], lang = 'en' } = body as {
    message: string
    history: { role: 'user' | 'assistant'; content: string }[]
    lang?: string
  }

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 })
  }

  await connectDB()

  // ── Identify user & tier ──────────────────────────────────────────────────
  const session = await auth()
  const userId = (session?.user as any)?.id as string | undefined
  const role   = (session?.user as any)?.role as string | undefined

  let tier: 'guest' | 'free' | 'premium' | 'admin' = 'guest'
  let identifier = getClientIP(req)

  if (userId) {
    identifier = userId
    if (role === 'admin') {
      tier = 'admin'
    } else {
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

  // ── Fetch relevant context (keep it short to save tokens) ────────────────
  const q = message.trim()
  const keywords = q.split(/\s+/).slice(0, 3).join('|')

  const [posts, recipes] = await Promise.all([
    Post.find({
      isPublished: true,
      $or: [
        { title: { $regex: keywords, $options: 'i' } },
        { tag:   { $regex: keywords, $options: 'i' } },
      ],
    })
      .select('title excerpt tag')
      .limit(2)
      .lean(),

    Recipe.find({
      isPublished: true,
      $or: [
        { title: { $regex: keywords, $options: 'i' } },
        { tag:   { $regex: keywords, $options: 'i' } },
      ],
    })
      .select('title description tag ingredients prepTimeMinutes cookTimeMinutes servings')
      .limit(2)
      .lean(),
  ])

  const ctxLines: string[] = []
  posts.forEach((p) =>
    ctxLines.push(`Article: "${p.title}" [${p.tag}] — ${(p.excerpt ?? '').slice(0, 120)}`),
  )
  recipes.forEach((r) =>
    ctxLines.push(
      `Recipe: "${r.title}" [${r.tag}] — Ingredients: ${r.ingredients?.slice(0, 6).join(', ')}. Prep ${r.prepTimeMinutes}min, serves ${r.servings}.`,
    ),
  )

  const contextBlock = ctxLines.length
    ? `\nSite context:\n${ctxLines.join('\n')}`
    : ''

  // ── System instruction (short = fewer tokens) ────────────────────────────
  const langInstruction = lang === 'te'
    ? 'IMPORTANT: Always reply in Telugu (తెలుగు) script only, regardless of how the user writes.'
    : lang === 'hi'
    ? 'IMPORTANT: Always reply in Hindi (हिंदी) script only, regardless of how the user writes.'
    : 'IMPORTANT: Always reply in English only.'

  const systemText =
    `You are NutriBot for NutriLifeMithra, a health & nutrition site for Indian families. ` +
    `Answer only nutrition, diet, recipe, and wellness questions. ` +
    `Be concise and friendly. Never diagnose medical conditions. ` +
    langInstruction +
    contextBlock

  const recentHistory = history.slice(-4)
  const contents: { role: string; parts: { text: string }[] }[] = [
    { role: 'user',  parts: [{ text: `System instructions:\n${systemText}` }] },
    { role: 'model', parts: [{ text: lang === 'te' ? 'అర్థమైంది. నేను NutriBot, సహాయం చేయడానికి సిద్ధంగా ఉన్నాను.' : lang === 'hi' ? 'समझ गया। मैं NutriBot हूँ, मदद के लिए तैयार हूँ।' : 'Understood. I am NutriBot, ready to help.' }] },
  ]

  for (const msg of recentHistory) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })
  }
  contents.push({ role: 'user', parts: [{ text: q }] })

  // ── Try models in order until one works ──────────────────────────────────
  const MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite-001', 'gemini-2.5-flash-lite']

  let reply = ''
  let lastErr = ''

  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 400, temperature: 0.4 },
      }),
    })

    if (geminiRes.status === 429) { lastErr = `quota (${model})`; continue }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error(`Gemini ${model} error:`, errText)
      lastErr = errText
      continue
    }

    const data = await geminiRes.json()
    reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    if (reply) break
  }

  if (!reply) {
    console.error('All Gemini models failed:', lastErr)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable. Please try again in a moment.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ reply, used: usage.count, limit, tier })
}
