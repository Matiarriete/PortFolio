import { useI18n } from '../i18n/context'
import { education } from '../data/content'
import { Timeline } from './Timeline'

export function Education() {
  const { dictionary } = useI18n()
  const { education: copy } = dictionary

  return (
    <Timeline
      id="formacion"
      headingId="education-heading"
      className="education"
      entries={education}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
    />
  )
}
