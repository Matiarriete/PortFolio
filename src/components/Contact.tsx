import type { CSSProperties } from 'react'
import { useI18n } from '../i18n/context'
import { localize, socials, type SocialLink } from '../data/content'
import { Icon, type IconName } from './Icon'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import './Contact.css'

const SOCIAL_ICONS: Record<SocialLink['id'], IconName> = {
  github: 'github',
  linkedin: 'linkedin',
  whatsapp: 'whatsapp',
  email: 'mail',
}

export function Contact() {
  const { dictionary, locale } = useI18n()
  const { contact, a11y } = dictionary

  return (
    <section id="contacto" className="contact section" aria-labelledby="contact-heading">
      <div className="container container--narrow">
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          description={contact.description}
          id="contact-heading"
          align="center"
        />

        <ul className="contact__grid" aria-label={a11y.socialLinks}>
          {socials.map((social, index) => (
            <Reveal key={social.id} as="li" delay={index * 70} threshold={0.05}>
              <a
                className="card contact-card"
                href={social.href}
                target={social.id === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                style={{ '--contact-color': social.hoverColor } as CSSProperties}
              >
                <span className="contact-card__icon" aria-hidden="true">
                  <Icon name={SOCIAL_ICONS[social.id]} size={20} />
                </span>
                <span className="contact-card__text">
                  <span className="contact-card__label">
                    {localize(social.label, locale)}
                  </span>
                  <span className="contact-card__handle">{social.handle}</span>
                </span>
                <Icon name="arrow-right" size={18} className="contact-card__arrow" />
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal as="p" className="contact__note" delay={120}>
          <Icon name="check" size={16} />
          {contact.emailNote}
        </Reveal>
      </div>
    </section>
  )
}