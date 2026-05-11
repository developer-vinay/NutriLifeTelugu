'use client'

import React, { useEffect, useRef, useState } from 'react'

type InfiniteScrollProps<T> = {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  loadMore: () => Promise<T[]>
  hasMore: boolean
  loader?: React.ReactNode
  endMessage?: React.ReactNode
  threshold?: number
  className?: string
}

export default function InfiniteScroll<T>({
  items: initialItems,
  renderItem,
  loadMore,
  hasMore: initialHasMore,
  loader,
  endMessage,
  threshold = 200,
  className = '',
}: InfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !isLoading) {
          handleLoadMore()
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    )

    const currentRef = observerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasMore, isLoading])

  async function handleLoadMore() {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const newItems = await loadMore()
      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setItems((prev) => [...prev, ...newItems])
      }
    } catch (error) {
      console.error('Failed to load more items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      {items.map((item, index) => renderItem(item, index))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="py-8 text-center">
          {loader || (
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1A5C38] dark:border-slate-700 dark:border-t-emerald-400" />
          )}
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && !isLoading && <div ref={observerRef} className="h-10" />}

      {/* End message */}
      {!hasMore && (
        <div className="py-8 text-center text-sm text-gray-500 dark:text-slate-400">
          {endMessage || 'No more items to load'}
        </div>
      )}
    </div>
  )
}
