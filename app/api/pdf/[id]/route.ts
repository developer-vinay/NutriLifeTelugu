import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { FreeMealPlan } from '@/models/FreeMealPlan'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    await connectDB()
    const plan = await FreeMealPlan.findById(id).lean() as any
    
    if (!plan || !plan.pdfUrl) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    // Fetch the PDF from Cloudinary
    const pdfResponse = await fetch(plan.pdfUrl)
    
    if (!pdfResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 500 })
    }

    const pdfBuffer = await pdfResponse.arrayBuffer()
    
    // Create a safe filename
    const filename = `${plan.titleEn?.replace(/[^a-z0-9]/gi, '_') || 'meal-plan'}.pdf`

    // Return PDF with proper headers for mobile compatibility
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
        // Mobile-specific headers
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    })
  } catch (error) {
    console.error('PDF serve error:', error)
    return NextResponse.json({ error: 'Failed to serve PDF' }, { status: 500 })
  }
}
