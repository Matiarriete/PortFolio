import { useI18n } from '../i18n/context'
import { localize, type TimelineEntry } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import './Timeline.css'

interface TimelineProps {
  id: string
  headingId: string
  eyebrow: string
  title: string
  description?: string
  entries: readonly TimelineEntry[]
  className: string
}

export function Timeline({
  id,
  headingId,
  eyebrow,
  title,
  description,
  entries,
  className,
}: TimelineProps) {
  const { dictionary, locale } = useI18n()

  return (
    <section id={id} className={`${className} section`} aria-labelledby={headingId}>
      <div className="container">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          id={headingId}
        />

        <ol className="timeline">
          {entries.map((entry, index) => (
            <Reveal
              key={entry.id}
              as="li"
              className="timeline__item"
              delay={Math.min(index, 4) * 60}
              threshold={0.05}
            >
              <article className="card timeline__card">
                <div className="timeline__meta">
                  <span className="timeline__period">{localize(entry.period, locale)}</span>
                  {entry.isOngoing === true && (
                    <span className="timeline__badge">{dictionary.timeline.ongoing}</span>
                  )}
                </div>

                <h3 className="timeline__title">{localize(entry.title, locale)}</h3>
                <p className="timeline__org">{localize(entry.organisation, locale)}</p>
                <p className="timeline__summary">{localize(entry.summary, locale)}</p>

                {entry.stack !== undefined && entry.stack.length > 0 && (
                  <ul className="tags timeline__tags" aria-label={dictionary.timeline.stackLabel}>
                    {entry.stack.map((item) => (
                      <li key={item} className="tag">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
