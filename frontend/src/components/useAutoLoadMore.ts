import { useEffect, useEffectEvent, type RefObject } from 'react'

// Loads the next page once the marker gets near the screen: a long feed just keeps going while you
// scroll. A new observer after each page reports right away, so a screen tall enough to already
// show the marker keeps loading until it isn't.
export const useAutoLoadMore = (
  markerRef: RefObject<HTMLElement | null>,
  {
    isEnabled,
    isLoading,
    onLoadMore,
  }: { isEnabled: boolean; isLoading: boolean; onLoadMore: () => void },
) => {
  const loadMore = useEffectEvent(onLoadMore)

  useEffect(() => {
    const marker = markerRef.current
    if (!marker || !isEnabled || isLoading) {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(marker)
    return () => observer.disconnect()
  }, [markerRef, isEnabled, isLoading])
}
