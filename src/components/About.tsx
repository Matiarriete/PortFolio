import { useI18n } from '../i18n/context'
import { localize, profile } from '../data/content'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import './About.css'

export function About() {
  const { dictionary, locale } = useI18n()
  const { about } = dictionary

  return (
    <section
      id="sobre-mi"
      className="about section section--alt"
      aria-labelledby="about-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={about.eyebrow}
          title={about.title}
          id="about-heading"
          as="h2"
        />

        <div className="about__grid">
          <Reveal className="about__body">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}

            <ul className="about__facts">
              <li className="tag">
                <Icon name="map-pin" size={14} className="tag__icon" />
                {localize(profile.location, locale)}
              </li>
              <li className="tag">
                <Icon name="code" size={14} className="tag__icon" />
                Front-End
              </li>
              <li className="tag">
                <Icon name="palette" size={14} className="tag__icon" />
                UX Design
              </li>
            </ul>
          </Reveal>

          <Reveal className="about__portrait" delay={140} threshold={0.1}>
            <div className="about__frame">
              <img
                className="about__photo"
                src={profile.avatar.desktop}
                srcSet={`${profile.avatar.mobile} 480w, ${profile.avatar.desktop} 960w`}
                sizes="(max-width: 991px) 17rem, 22rem"
                alt={about.photoAlt}
                width={600}
                height={600}
                decoding="async"
              />
            </div>
            <p className="about__badge">
              <span className="about__badge-dot" aria-hidden="true" />
              {dictionary.hero.available}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}