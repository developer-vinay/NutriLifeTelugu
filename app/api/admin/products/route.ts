import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Product } from '@/models/Product'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') return null
  return session
}

// GET all products
export async function GET() {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  await connectDB()
  const products = await Product.find().sort({ sortOrder: 1, createdAt: -1 }).lean()
  
  return NextResponse.json(products)
}

// POST create new product
export async function POST(req: Request) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  const body = await req.json()
  
  await connectDB()
  const product = await Product.create(body)
  
  return NextResponse.json(product, { status: 201 })
}
