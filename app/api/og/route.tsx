import { NextResponse } from 'next/server'

// Simple SVG-based OG image — no external dependencies needed
// Returns a 1200x630 SVG as PNG-compatible image
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'NutriLifeMitra'
  const sub = searchParams.get('sub') ?? 'స్మార్ట్ న్యూట్రిషన్. బెటర్ లైఫ్.'

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1A5C38"/>
      <stop offset="100%" style="stop-color:#059669"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Decorative circles -->
  <circle cx="1050" cy="100" r="200" fill="white" fill-opacity="0.05"/>
  <circle cx="150" cy="530" r="150" fill="white" fill-opacity="0.05"/>
  <!-- Logo leaf icon -->
  <text x="100" y="200" font-size="80" fill="white">🌿</text>
  <!-- Brand name -->
  <text x="100" y="310" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white">${title.slice(0, 30)}</text>
  <!-- Subtitle -->
  <text x="100" y="390" font-family="Arial, sans-serif" font-size="36" fill="rgba(255,255,255,0.85)">${sub.slice(0, 60)}</text>
  <!-- Bottom bar -->
  <rect x="0" y="570" width="1200" height="60" fill="rgba(0,0,0,0.2)"/>
  <text x="100" y="608" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.7)">nutrilifemitra.vercel.app</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
