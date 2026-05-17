import { useEffect, useRef, useState, useCallback } from 'react'

type FetchResult<T> = {
  data: T[]
  hasMore: boolean
}

type UseInfiniteScrollOptions = {
  threshold?: number
  rootMargin?: string
}

/**
 * Custom hook for infinite scroll functionality using Intersection Observer API
 * 
 * @param fetchFn - Function that fetches data for a given page number
 * @param deps - Dependencies array that triggers data reset when changed
 * @param options - Intersection Observer options
 * 
 * @example
 * ```tsx
 * const fetchPosts = async (page: number) => {
 *   const res = await fetch(`/api/posts?page=${page}&limit=12`)
 *   return res.json()
 * }
 * 
 * const { items, loading, hasMore, loadMoreRef } = useInfiniteScroll(
 *   fetchPosts,
 *   [language]
 * )
 * ```
 */
export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<FetchResult<T>>,
  deps: any[] = [],
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 0.1, rootMargin = '200px' } = options

  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  // Load data function
  const loadData = useCallback(async (pageNum: number, isInitial = false) => {
    if (isLoadingRef.current) return
    
    isLoadingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const result = await fetchFn(pageNum)
      
      setItems(prev => pageNum === 1 ? result.data : [...prev, ...result.data])
      setHasMore(result.hasMore)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError(err instanceof Error ? err : new Error('Failed to load data'))
    } finally {
      setLoading(false)
      if (isInitial) setInitialLoading(false)
      isLoadingRef.current = false
    }
  }, [fetchFn])

  // Reset and load initial data when dependencies change
  useEffect(() => {
    setItems([])
    setPage(1)
    setHasMore(true)
    setError(null)
    setInitialLoading(true)
    loadData(1, true)
  }, deps)

  // Setup Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          setPage(prev => prev + 1)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(loadMoreRef.current)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, threshold, rootMargin])

  // Load next page when page number changes
  useEffect(() => {
    if (page > 1) {
      loadData(page)
    }
  }, [page, loadData])

  // Retry function for error recovery
  const retry = useCallback(() => {
    if (error) {
      loadData(page)
    }
  }, [error, page, loadData])

  return {
    items,
    loading,
    initialLoading,
    hasMore,
    error,
    loadMoreRef,
    retry,
  }
}
