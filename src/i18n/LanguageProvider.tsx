import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dictionaries, type Locale } from './dictionaries'
import { I18nContext } from './context'

const STORAGE_KEY = 'portfolio-locale'
const SUPPORTED_LOCALES = Object.keys(dictionaries) as Locale[]

function isLocale(value: string | null): value is Locale {
  return value !== null && (SUPPORTED_LOCALES as string[]).includes(value)
}

/**
 * Resolution order: `?lang=` query param (so a language can be linked directly)
 * -> previously chosen language -> browser preference -> the site's default (es).
 */
function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'es'

  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(fromQuery)) return fromQuery

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // localStorage can throw in private browsing modes; fall through.
  }

  return window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es'
}

function setMetaContent(selector: string, content: string): void {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

function setMetaProperty(property: string, content: string): void {
  document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)?.setAttribute(
    'content',
    content,
  )
}

function setLinkHref(hreflang: string, href: string): void {
  document
    .querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`)
    ?.setAttribute('href', href)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Persisting the choice is best-effort.
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => {
      const next: Locale = current === 'es' ? 'en' : 'es'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Persisting the choice is best-effort.
      }
      return next
    })
  }, [])

  const dictionary = dictionaries[locale]

  // Keep the URL shareable: /?lang=en survives reloads and can be copied.
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', locale)
    window.history.replaceState({}, '', url)
  }, [locale])

  // Keep document metadata in sync with the active language.
  useEffect(() => {
    const { title, description } = dictionary.meta
    const url = `${window.location.origin}${window.location.pathname}?lang=${locale}`
    const path = window.location.pathname
    const canonical = `${window.location.origin}${path}`
    const localizedUrl = locale === 'es' ? canonical : `${canonical}?lang=${locale}`

    document.documentElement.lang = locale
    document.title = title
    setMetaContent('meta[name="description"]', description)
    setMetaProperty('og:title', title)
    setMetaProperty('og:description', description)
    setMetaProperty('og:url', url)
    setMetaProperty('og:locale', locale === 'es' ? 'es_ES' : 'en_US')
    setMetaContent('meta[name="twitter:title"]', title)
    setMetaContent('meta[name="twitter:description"]', description)
    setLinkHref('es', canonical)
    setLinkHref('x-default', canonical)
    setLinkHref('en', `${canonical}?lang=en`)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute(
      'href',
      localizedUrl,
    )
  }, [dictionary, locale])

  const value = useMemo(
    () => ({ locale, dictionary, setLocale, toggleLocale }),
    [locale, dictionary, setLocale, toggleLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}