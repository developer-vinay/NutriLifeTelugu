'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Slide = {
  _id?: string
  imageUrl: string
  alt: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
}

// Fallback static slides used until DB slides load
const FALLBACK_SLIDES: Slide[] = [
  { imageUrl: '/banner.png', alt: 'NutriLife — Smart Nutrition' },
  { imageUrl: '/image2.jpg', alt: 'Healthy Recipes' },
  { imageUrl: '/image3.jpg', alt: 'Diet Plans & Health Tips' },
  { imageUrl: '/image4.jpg', alt: 'Diet Plans & Health Tips' },
  { imageUrl: '/image5.jpg', alt: 'Diet Plans & Health Tips' },
  { imageUrl: '/image6.jpg', alt: 'Diet Plans & Health Tips' },
  { imageUrl: '/image7.jpg', alt: 'Diet Plans & Health Tips' },
]

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES)
  const [index, setIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch dynamic slides from DB
  useEffect(() => {
    fetch('/api/hero-slides')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data)
          setIndex(0)
        }
      })
      .catch(() => {}) // silently keep fallback
  }, [])

  const N = slides.length

  const goTo = useCallback(
    (next: number) => {
      if (transitioning) return
      setTransitioning(true)
      setIndex(((next % N) + N) % N)
      setTimeout(() => setTransitioning(false), 500)
    },
    [transitioning, N],
  )

  const prev = () => goTo(index - 1)
  const next = () => goTo(index + 1)

  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(index + 1), 5000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [index, goTo])

  const isExternal = (url: string) => url.startsWith('http')

  return (
    <section className="bg-white dark:bg-slate-950">
      <div className="relative mx-4 overflow-hidden rounded-2xl sm:mx-6 lg:mx-10">

        {/* Slides — crossfade */}
        <div className="relative h-[45vh] min-h-[280px] w-full md:h-[55vh]">
          {slides.map((slide, i) => (
            <div
              key={slide._id ?? slide.imageUrl}
              className={`absolute inset-0 transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Image */}
              {isExternal(slide.imageUrl) ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.alt || 'Hero slide'}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <Image
                  src={slide.imageUrl}
                  alt={slide.alt || 'Hero slide'}
                  fill
                  priority={i === 0}
                  className="object-cover object-center"
                />
              )}

              {/* Text overlay — only if title/subtitle set */}
              {(slide.title || slide.subtitle || slide.buttonText) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 px-6 text-center text-white">
                  {slide.title && (
                    <h2 className="font-nunito text-2xl font-bold drop-shadow-lg md:text-4xl">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="mt-2 max-w-xl text-sm text-white/90 drop-shadow md:text-base">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.buttonText && slide.buttonLink && (
                    isExternal(slide.buttonLink) ? (
                      <a
                        href={slide.buttonLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center rounded-full bg-[#1A5C38] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
                      >
                        {slide.buttonText} →
                      </a>
                    ) : (
                      <Link
                        href={slide.buttonLink}
                        className="mt-4 inline-flex items-center rounded-full bg-[#1A5C38] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
                      >
                        {slide.buttonText} →
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Left arrow */}
        <button type="button" onClick={prev} aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40 active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Right arrow */}
        <button type="button" onClick={next} aria-label="Next slide"
          className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40 active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
