import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Product } from '@/models/Product'

export const runtime = 'nodejs'
export const revalidate = 300 // Cache for 5 minutes

// GET public products (only active)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') || '100')
  
  await connectDB()
  
  const query: any = { isActive: true }
  if (category) query.category = category
  if (featured === 'true') query.isFeatured = true
  
  const products = await Product.find(query)
    .sort({ sortOrder: 1, createdAt: -1 })
    .limit(limit)
    .lean()
  
  return NextResponse.json(products)
}
