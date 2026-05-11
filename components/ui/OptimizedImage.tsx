'use client'

import React, { useState } from 'react'
import Image from 'next/image'

type OptimizedImageProps = {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  fill?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

/**
 * Optimized image component with lazy loading and blur placeholder
 * Automatically shows skeleton while loading
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  fill = false,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Fallback image
  const fallbackSrc = '/placeholder-image.jpg'

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-slate-800 ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-slate-800" />
      )}
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectFit }}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{ objectFit }}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          priority={priority}
        />
      )}
    </div>
  )
}
