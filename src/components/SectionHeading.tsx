import type { ReactNode } from 'react'
import { cx } from '../utils/cx'
import './SectionHeading.css'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  id: string
  /** The heading element that owns the section's accessible name. */
  as?: 'h1' | 'h2' | 'h3'
  align?: 'start' | 'center'
  children?: ReactNode
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  as: Heading = 'h2',
  align = 'start',
  children,
}: SectionHeadingProps) {
  return (
    <div className={cx('section__head', align === 'center' && 'section__head--center')}>
      <span className="eyebrow">{eyebrow}</span>
      <Heading id={id}>{title}</Heading>
      {description !== undefined && <p className="lead">{description}</p>}
      {children}
    </div>
  )
}