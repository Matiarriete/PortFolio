import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/context'
import { useTheme } from '../theme/context'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { navSections, profile } from '../data/content'
import { Icon } from './Icon'
import './Navbar.css'

const SECTION_IDS = navSections.map((section) => section.id)

export function Navbar() {
  const { dictionary } = useI18n()
  const activeId = useScrollSpy(SECTION_IDS)

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame !== 0) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        setScrolled(window.scrollY > 24)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Lock the page behind the mobile menu and close it on Escape.
  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <header className="navbar" data-scrolled={scrolled} data-open={menuOpen}>
      <div className="navbar__inner">
        <a href="#inicio" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar__mark" aria-hidden="true">
            MA
          </span>
          {profile.name}
        </a>

        <nav id="navbar-menu" className="navbar__nav" aria-label={dictionary.nav.home}>
          <ul className="navbar__list">
            {navSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="navbar__link"
                  aria-current={activeId === section.id ? 'true' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {dictionary.nav[section.labelKey]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <span className="navbar__divider" aria-hidden="true" />
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            type="button"
            className="icon-button navbar__toggle"
            aria-expanded={menuOpen}
            aria-controls="navbar-menu"
            aria-label={menuOpen ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name="chevron-down" size={20} style={{ transform: menuOpen ? 'rotate(180deg)' : 'none' }} />
          </button>
        </div>
      </div>
    </header>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { dictionary } = useI18n()

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggleTheme}
      aria-label={dictionary.nav.themeToggle}
      title={dictionary.nav.themeToggle}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  )
}

function LanguageSwitcher() {
  const { dictionary, locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const choose = (next: 'es' | 'en') => {
    setLocale(next)
    setOpen(false)
  }

  return (
    <div className="lang" ref={containerRef}>
      <button
        type="button"
        className="icon-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={dictionary.nav.languageSwitcher}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" className="lang__code">
          {locale.toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="lang__menu" role="menu" aria-label={dictionary.nav.languageSwitcher}>
          <button
            type="button"
            role="menuitemradio"
            className="lang__option"
            aria-checked={locale === 'es'}
            onClick={() => choose('es')}
          >
            Español
            {locale === 'es' && <Icon name="check" size={16} />}
          </button>
          <button
            type="button"
            role="menuitemradio"
            className="lang__option"
            aria-checked={locale === 'en'}
            onClick={() => choose('en')}
          >
            English
            {locale === 'en' && <Icon name="check" size={16} />}
          </button>
        </div>
      )}
    </div>
  )
}