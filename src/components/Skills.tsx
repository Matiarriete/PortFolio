import { useI18n } from '../i18n/context'
import { localize, skillGroups, spokenLanguages } from '../data/content'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import './Skills.css'

export function Skills() {
  const { dictionary, locale } = useI18n()
  const { skills, languagesSection } = dictionary

  return (
    <section id="habilidades" className="skills section" aria-labelledby="skills-heading">
      <div className="container">
        <SectionHeading
          eyebrow={skills.eyebrow}
          title={skills.title}
          description={skills.description}
          id="skills-heading"
        />

        <div className="skills__grid">
          {skillGroups.map((group, groupIndex) => (
            <Reveal
              key={group.id}
              className="card skills__card"
              delay={groupIndex * 70}
              threshold={0.05}
            >
              <h3 className="skills__card-title">{localize(group.label, locale)}</h3>
              <ul className="tags">
                {group.skills.map((skill) => (
                  <li key={skill} className="tag">
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="languages" delay={80} threshold={0.05}>
          <div className="section__head">
            <span className="eyebrow">{languagesSection.eyebrow}</span>
            <h3 id="languages-heading">{languagesSection.title}</h3>
          </div>

          <ul className="languages__list" aria-labelledby="languages-heading">
            {spokenLanguages.map((language) => (
              <li key={language.id} className="card language">
                <span className="language__icon" aria-hidden="true">
                  <Icon name="globe" size={18} />
                </span>
                <span className="language__text">
                  <span className="language__name">{localize(language.label, locale)}</span>
                  <span className="language__band">{language.band}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
