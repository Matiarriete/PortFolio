import {
  createElement,
  useEffect,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

interface RevealProps {
  as?: ElementType
  children: ReactNode
  className?: string
  /** Stagger, in milliseconds, for grids of items. */
  delay?: number
  threshold?: number
}

/**
 * Fades + lifts its children into view once, the first time they intersect the
 * viewport. Purely decorative: with prefers-reduced-motion the stylesheet keeps
 * the element visible and skips the transform entirely.
 */
export function Reveal({
  as = 'div',
  children,
  className,
  delay = 0,
  threshold = 0.15,
}: RevealProps) {
  // A callback ref rather than useRef: the observed node is state, so observing
  // it is a render concern and never touches `ref.current` during render.
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (node === null) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [node, threshold])

  return createElement(
    as,
    {
      ref: setNode,
      className: cx('reveal', className),
      'data-visible': visible ? 'true' : 'false',
      style: delay > 0 ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined,
    },
    children,
  )
}