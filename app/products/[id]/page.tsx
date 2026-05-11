import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Product as ProductModel } from '@/models/Product'
import ProductDetailClient from '@/components/products/ProductDetailClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://nutrilifemitra.com'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  await connectDB()
  const product = await ProductModel.findById(id).lean()
  if (!product || !product.isActive) return {}

  const title = `${product.name} | NutriLifeMitra Shop`
  const description = product.description.slice(0, 160)
  const url = `${SITE_URL}/products/${id}`
  const image = product.imageUrl ?? `${SITE_URL}/api/og`

  const keywords = [
    product.name,
    product.category,
    'NutriLifeMitra',
    'Indian nutrition products',
    'healthy diet plans',
    'nutrition supplements',
    'health products India',
    product.nameHi,
    product.nameTe,
  ].filter(Boolean) as string[]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'NutriLifeMitra',
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@nutrilifemitra',
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await connectDB()

  const product = await ProductModel.findById(id).lean()
  if (!product || !product.isActive) return notFound()

  const plain = JSON.parse(JSON.stringify(product))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: plain.name,
            description: plain.description,
            image: plain.imageUrl ? [plain.imageUrl] : [`${SITE_URL}/api/og`],
            brand: {
              '@type': 'Brand',
              name: 'NutriLifeMitra',
            },
            offers: {
              '@type': 'Offer',
              url: `${SITE_URL}/products/${plain._id}`,
              priceCurrency: plain.currency === '₹' ? 'INR' : plain.currency === '$' ? 'USD' : 'EUR',
              price: plain.finalPrice ?? plain.price,
              priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: 'NutriLifeMitra',
              },
            },
            category: plain.category,
            url: `${SITE_URL}/products/${plain._id}`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE_URL}/shop` },
              { '@type': 'ListItem', position: 3, name: plain.name, item: `${SITE_URL}/products/${plain._id}` },
            ],
          }),
        }}
      />
      <ProductDetailClient product={plain} />
    </>
  )
}
