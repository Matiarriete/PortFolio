import { useI18n } from '../i18n/context'
import { experience } from '../data/content'
import { Timeline } from './Timeline'

export function Experience() {
  const { dictionary } = useI18n()
  const { experience: copy } = dictionary

  return (
    <Timeline
      id="experiencia"
      headingId="experience-heading"
      className="experience"
      entries={experience}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
    />
  )
}
