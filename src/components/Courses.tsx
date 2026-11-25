import { useI18n } from '../i18n/context'
import { courses, localize } from '../data/content'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import './Courses.css'

export function Courses() {
  const { dictionary, locale } = useI18n()
  const { courses: copy } = dictionary

  return (
    <section id="cursos" className="courses section" aria-labelledby="courses-heading">
      <div className="container">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          id="courses-heading"
        />

        <ul className="courses__grid">
          {courses.map((course, index) => (
            <Reveal
              key={course.id}
              as="li"
              className="card course-card"
              delay={index * 50}
              threshold={0.05}
            >
              <h3 className="course-card__title">{localize(course.title, locale)}</h3>
              <p className="course-card__provider">{localize(course.provider, locale)}</p>
              {course.period !== undefined && (
                <p className="course-card__period">{localize(course.period, locale)}</p>
              )}
              {course.certificate !== undefined && (
                <a
                  className="course-card__link"
                  href={course.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${copy.viewCertificate}: ${localize(course.title, locale)}`}
                >
                  {copy.viewCertificate}
                  <Icon name="external-link" size={15} aria-hidden="true" />
                </a>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
