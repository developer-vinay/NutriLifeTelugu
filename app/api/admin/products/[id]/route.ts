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

// GET single product
export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  await connectDB()
  const product = await Product.findById(params.id).lean()
  
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  
  return NextResponse.json(product)
}

// PUT update product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  const body = await req.json()
  
  await connectDB()
  const product = await Product.findByIdAndUpdate(params.id, body, { new: true })
  
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  
  return NextResponse.json(product)
}

// DELETE product
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  await connectDB()
  const product = await Product.findByIdAndDelete(params.id)
  
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  
  return NextResponse.json({ message: 'Product deleted' })
}
