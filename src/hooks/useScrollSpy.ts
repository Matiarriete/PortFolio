import { useEffect, useState } from 'react'

/**
 * Tracks which of the given section ids is currently the active one.
 *
 * Scroll-position based rather than IntersectionObserver based: it degrades
 * gracefully at the very bottom of the page, where several sections can be
 * simultaneously intersecting and the "last visible" section is the right answer.
 */
export function useScrollSpy(sectionIds: readonly string[], offsetPx = 120): string | null {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const scrollY = window.scrollY

      // Near the bottom of the document the last section is the natural answer.
      const atBottom = window.innerHeight + scrollY >= document.body.scrollHeight - 2

      if (atBottom) {
        setActiveId(sectionIds[sectionIds.length - 1] ?? null)
        return
      }

      let current: string | null = null
      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element === null) continue
        if (element.getBoundingClientRect().top - offsetPx <= 0) {
          current = id
        }
      }
      setActiveId(current ?? sectionIds[0] ?? null)
    }

    const onScroll = () => {
      if (frame !== 0) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sectionIds, offsetPx])

  return activeId
}