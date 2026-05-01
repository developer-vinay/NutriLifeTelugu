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
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  const { id } = await params
  await connectDB()
  const product = await Product.findById(id).lean()
  
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  
  return NextResponse.json(product)
}

// PUT update product
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  const body = await req.json()
  const { id } = await params
  
  await connectDB()
  const product = await Product.findByIdAndUpdate(id, body, { new: true })
  
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  
  return NextResponse.json(product)
}

// DELETE product
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await ensureAdmin()) return new NextResponse('Unauthorized', { status: 401 })
  
  const { id } = await params
  await connectDB()
  const product = await Product.findByIdAndDelete(id)
  
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  
  return NextResponse.json({ message: 'Product deleted' })
}
