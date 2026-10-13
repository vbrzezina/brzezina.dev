import { useEffect, useRef, useState } from 'react'

export function useReveal<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        /* Fire as soon as the top edge is a few percent into the viewport. A ratio threshold
           scaled with element height, so tall stacked blocks on phones revealed far too late. */
        threshold: 0,
        rootMargin: '0px 0px -5% 0px',
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [])

  return [ref, isVisible]
}
