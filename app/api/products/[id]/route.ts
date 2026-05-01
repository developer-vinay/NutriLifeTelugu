import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Product } from '@/models/Product'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET single product by ID (public)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    
    const product = await Product.findById(id).lean()
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Only return active products to public
    if (!product.isActive) {
      return NextResponse.json({ error: 'Product not available' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
