'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export function useCountUp(end: number, duration = 2000) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const started = useRef(false)
  const target = useMemo(() => Math.max(0, end), [end])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - (1 - t) ** 3
          setValue(Math.floor(eased * target))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [duration, target])

  return { ref, value }
}
