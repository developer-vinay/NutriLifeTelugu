import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Recipe } from '@/models/Recipe'
import { ensureAdminOrApiKey } from '@/lib/apiAuth'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  if (!await ensureAdminOrApiKey(request)) return new NextResponse('Unauthorized', { status: 401 })
  await connectDB()

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1') || 1
  const pageSize = Number(searchParams.get('pageSize') ?? '10') || 10
  const q = searchParams.get('q') ?? ''
  const query = q.trim() ? { title: { $regex: q.trim(), $options: 'i' } } : {}

  const [items, total] = await Promise.all([
    Recipe.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Recipe.countDocuments(query),
  ])

  return NextResponse.json({ items, total, page, pageSize })
}

export async function POST(request: Request) {
  if (!await ensureAdminOrApiKey(request)) return new NextResponse('Unauthorized', { status: 401 })
  try {
    await connectDB()
    const body = await request.json()
    const recipe = await Recipe.create(body)
    return NextResponse.json(recipe, { status: 201 })
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'A recipe with this slug already exists. Use a different slug.' }, { status: 409 })
    }
    console.error('Failed to create recipe', error)
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 })
  }
}
