import { useI18n } from '../i18n/context'
import { localize, profile } from '../data/content'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import './Hero.css'

export function Hero() {
  const { dictionary, locale } = useI18n()
  const { hero } = dictionary

  return (
    <section id="inicio" className="hero section" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true" />
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />
      <div className="hero__blob hero__blob--3" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="container">
        <div className="hero__content">
          <Reveal as="p" className="hero__greeting">
            {hero.greeting}
          </Reveal>

          <Reveal delay={80}>
            <h1 id="hero-title" className="hero__name">
              {profile.name}
            </h1>
          </Reveal>

          <Reveal as="p" className="hero__role" delay={160}>
            {localize(profile.role, locale)}
          </Reveal>

          <Reveal as="p" className="hero__tagline" delay={240}>
            {hero.tagline}
          </Reveal>

          <Reveal className="hero__actions" delay={320}>
            <a
              className="btn btn--primary"
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="download" size={18} className="btn__icon" />
              {hero.ctaCv}
            </a>
            <a className="btn btn--outline" href="#sobre-mi">
              {hero.ctaAbout}
              <Icon name="arrow-right" size={18} className="btn__icon" />
            </a>
          </Reveal>

          <Reveal className="hero__meta" delay={400}>
            <span className="hero__meta-item">
              <Icon name="map-pin" size={16} />
              {localize(profile.location, locale)}
            </span>
            <span className="hero__meta-item">
              <Icon name="check" size={16} />
              {hero.available}
            </span>
          </Reveal>
        </div>
      </div>

      <a href="#sobre-mi" className="hero__scroll" aria-hidden="true" tabIndex={-1}>
        <span className="hero__mouse">
          <span className="hero__wheel" />
        </span>
        {hero.scrollHint}
      </a>
    </section>
  )
}