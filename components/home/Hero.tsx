'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const SLIDES = [
  { src: '/banner.png', alt: 'NutriLife — Smart Nutrition' },
  { src: '/image2.jpg', alt: 'Healthy Recipes' },
  { src: '/image3.jpg', alt: 'Diet Plans & Health Tips' },
  { src: '/image4.jpg', alt: 'Diet Plans & Health Tips' },
  { src: '/image5.jpg', alt: 'Diet Plans & Health Tips' },
  { src: '/image6.jpg', alt: 'Diet Plans & Health Tips' },
  { src: '/image7.jpg', alt: 'Diet Plans & Health Tips' },
]

const N = SLIDES.length

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback(
    (next: number) => {
      if (transitioning) return
      setTransitioning(true)
      // wrap infinitely
      setIndex(((next % N) + N) % N)
      setTimeout(() => setTransitioning(false), 500)
    },
    [transitioning],
  )

  const prev = () => goTo(index - 1)
  const next = () => goTo(index + 1)

  // Auto-advance every 5s
  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(index + 1), 5000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [index, goTo])

  return (
    <section className="bg-white dark:bg-slate-950">
      <div className="relative mx-4 overflow-hidden rounded-2xl sm:mx-6 lg:mx-10">

        {/* Slides — crossfade */}
        <div className="relative h-[45vh] min-h-[280px] w-full md:h-[55vh]">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Left arrow — transparent */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Right arrow — transparent */}
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
