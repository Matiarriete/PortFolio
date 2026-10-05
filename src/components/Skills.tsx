import type { CSSProperties } from 'react'
import { useI18n } from '../i18n/context'
import { localize, skillGroups, spokenLanguages, type Skill } from '../data/content'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import './Skills.css'

type LevelBand = 'high' | 'mid' | 'low'

function toBand(level: number): LevelBand {
  if (level >= 60) return 'high'
  if (level >= 40) return 'mid'
  return 'low'
}

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
              <ul className="skills__list">
                {group.skills.map((skill) => (
                  <SkillRow key={skill.name} skill={skill} />
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

function SkillRow({ skill }: { skill: Skill }) {
  const { dictionary } = useI18n()
  const { levelLabels, levelAriaSuffix } = dictionary.skills
  const band = toBand(skill.level)

  return (
    <li className="skill">
      <div className="skill__top">
        <span className="skill__name">{skill.name}</span>
        <span className="skill__value">
          <span className="skill__band">{levelLabels[band]}</span>
          {skill.level}%
        </span>
      </div>
      <div
        className="skill__track"
        role="progressbar"
        aria-label={skill.name}
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${skill.name}: ${skill.level}% ${levelAriaSuffix}`}
      >
        <span
          className="skill__fill"
          style={{ '--level': `${skill.level}%` } as CSSProperties}
        />
      </div>
    </li>
  )
}