import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/context'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { localize, projects, type Project } from '../data/content'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import './Projects.css'

export function Projects() {
  const { dictionary } = useI18n()
  const { projects: copy } = dictionary

  return (
    <section id="proyectos" className="projects section section--tinted" aria-labelledby="projects-heading">
      <div className="container">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          id="projects-heading"
        />

        <div className="projects__grid">
          {projects.map((project, index) => (
            <Reveal key={project.id} className="card project" delay={index * 90} threshold={0.05}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const { dictionary, locale } = useI18n()
  const { projects: copy, a11y } = dictionary

  return (
    <>
      <ProjectMedia project={project} />

      <div className="project__body">
        {project.isLatest && (
          <span className="project__badge">
            {locale === 'es' ? 'Lo más reciente' : 'Latest'}
          </span>
        )}

        <h3 className="project__title">{localize(project.title, locale)}</h3>
        <p className="project__summary">{localize(project.summary, locale)}</p>

        <h4 className="visually-hidden">{copy.highlightsTitle}</h4>
        <ul className="project__highlights">
          {project.highlights.map((highlight) => (
            <li key={highlight.en} className="project__highlight">
              <Icon name="check" size={15} />
              {localize(highlight, locale)}
            </li>
          ))}
        </ul>

        <h4 className="visually-hidden">{copy.techStack}</h4>
        <ul className="project__stack">
          {project.stack.map((tech) => (
            <li key={tech} className="tag">
              {tech}
            </li>
          ))}
        </ul>

        <ul className="project__links" aria-label={a11y.projectLinks}>
          {project.links.map((link) => (
            <li key={link.href} className="project__link">
              <a
                className="btn btn--outline"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  name={link.kind === 'live' ? 'globe' : 'github'}
                  size={17}
                  className="btn__icon"
                />
                {localize(link.label, locale)}
                <Icon name="external-link" size={14} className="btn__icon" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

/**
 * The demo video is only attached once the card is on screen and only starts
 * downloading on demand (`preload="none"`). Replaces a 6 MB file that used to
 * be fetched on every page load and, because it lacked `muted`, never even
 * managed to autoplay.
 */
function ProjectMedia({ project }: { project: Project }) {
  const { dictionary, locale } = useI18n()
  const { projects: copy } = dictionary

  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [nearViewport, setNearViewport] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [pausedByUser, setPausedByUser] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const node = containerRef.current
    if (node === null || typeof IntersectionObserver === 'undefined') {
      setNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const play = useCallback(() => {
    const video = videoRef.current
    if (video === null) return
    // Autoplay is only ever muted, which is what browsers allow.
    void video.play().catch(() => setPlaying(false))
  }, [])

  const pause = useCallback(() => {
    videoRef.current?.pause()
  }, [])

  // Hover-to-preview only makes sense on devices that actually have a pointer.
  useEffect(() => {
    if (!canHover || pausedByUser) return

    const onEnter = () => {
      setPlaying(true)
      play()
    }
    const onLeave = () => {
      setPlaying(false)
      pause()
    }

    const node = containerRef.current
    node?.addEventListener('mouseenter', onEnter)
    node?.addEventListener('mouseleave', onLeave)
    return () => {
      node?.removeEventListener('mouseenter', onEnter)
      node?.removeEventListener('mouseleave', onLeave)
    }
  }, [canHover, pausedByUser, play, pause])

  const toggle = () => {
    if (playing) {
      setPausedByUser(true)
      setPlaying(false)
      pause()
    } else {
      setPausedByUser(false)
      setPlaying(true)
      play()
    }
  }

  return (
    <div className="project__media" ref={containerRef} data-playing={playing}>
      {nearViewport ? (
        <video
          className="project__video"
          ref={videoRef}
          poster={project.media.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${copy.demoLabel}: ${localize(project.title, locale)}`}
        >
          <source src={project.media.webm} type="video/webm" />
          <source src={project.media.mp4} type="video/mp4" />
        </video>
      ) : (
        <img
          className="project__poster"
          src={project.media.poster}
          alt={`${copy.demoLabel}: ${localize(project.title, locale)}`}
          width={1280}
          height={800}
          loading="lazy"
          decoding="async"
        />
      )}

      <span className="project__scrim" aria-hidden="true" />

      <button
        type="button"
        className="project__play"
        onClick={toggle}
        aria-label={playing ? copy.pauseVideo : copy.playVideo}
      >
        <Icon name={playing ? 'pause' : 'play'} size={20} />
      </button>
    </div>
  )
}