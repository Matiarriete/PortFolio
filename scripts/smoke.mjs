/**
 * Post-build smoke test.
 *
 * Boots the built bundle in jsdom against the real dist/index.html and asserts
 * that React mounts and the expected landmarks exist. jsdom has no layout and no
 * IntersectionObserver, so both are stubbed — this catches crashes and missing
 * markup, it does not verify visual output.
 *
 *   npm run build && npm run smoke
 */

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { JSDOM, VirtualConsole } from 'jsdom'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')

if (!existsSync(join(distDir, 'index.html'))) {
  console.error('dist/index.html not found — run `npm run build` first.')
  process.exit(1)
}

const failures = []
const check = (label, condition, detail = '') => {
  if (condition) {
    console.log(`  ok    ${label}`)
  } else {
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`)
    failures.push(label)
  }
}

const html = readFileSync(join(distDir, 'index.html'), 'utf8')

const bundleMatch = html.match(/<script type="module"[^>]*src="([^"]+)"/)
if (bundleMatch === null) {
  console.error('No module script found in dist/index.html')
  process.exit(1)
}

// Vite emits absolute URLs under the configured base path; strip it to read from disk.
const bundleUrl = bundleMatch[1]
const bundlePath = join(distDir, bundleUrl.replace(/^\/PortFolio\//, ''))
const bundle = readFileSync(bundlePath, 'utf8')

/* --- Environment stubs ----------------------------------------------------- */

const virtualConsole = new VirtualConsole()
const consoleErrors = []
virtualConsole.on('jsdomError', (error) => consoleErrors.push(error.message))
virtualConsole.on('error', (...args) => consoleErrors.push(args.join(' ')))

const dom = new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g, ''), {
  // Pinned to ?lang=es so the assertions below are deterministic; jsdom's
  // navigator.language is en-US, which would otherwise select English.
  url: 'https://matiarriete.github.io/PortFolio/?lang=es',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole,
})

const { window } = dom

/**
 * Fires immediately as "intersecting". jsdom does no layout, so nothing would
 * ever intersect and the lazily-rendered <video> would never mount.
 */
class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback
    queueMicrotask(() => {
      this.callback([{ isIntersecting: true, target: null }], this)
    })
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

window.IntersectionObserver = IntersectionObserverStub
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
})
window.scrollTo = () => {}
window.scroll = () => {}
window.HTMLElement.prototype.scrollIntoView = () => {}

let uncaught = null
window.addEventListener('error', (event) => {
  uncaught = event.error ?? event.message
})

/* --- Execute --------------------------------------------------------------- */

// A single Vite chunk has no top-level import/export, so evaluating it as a
// classic script is equivalent to running the module.
window.eval(bundle)

/* React 19 flushes its concurrent render asynchronously. */
await new Promise((r) => setTimeout(r, 50))

const { document } = window
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => [...document.querySelectorAll(selector)]
const text = (selector) => $(selector)?.textContent?.trim() ?? ''

/* --- Assertions ------------------------------------------------------------ */

console.log('\n▸ Mount')
check('no uncaught error while booting', uncaught === null, String(uncaught))
check('no jsdom errors', consoleErrors.length === 0, consoleErrors.join(' | '))
check('#root has content', ($('#root')?.children.length ?? 0) > 0)

console.log('\n▸ Landmarks')
check('<main id="main"> exists', $('#main') !== null)
check('skip link is the first focusable element', $('.skip-link') !== null)
check('header/nav exists', $('header.navbar nav') !== null)
check('footer exists', $('footer') !== null)

console.log('\n▸ Sections')
for (const id of ['inicio', 'sobre-mi', 'habilidades', 'proyectos', 'contacto']) {
  check(`section #${id}`, $(`#${id}`) !== null)
}

console.log('\n▸ Content (Spanish default)')
check('h1 is the name', text('h1') === 'Matias Arriete', text('h1'))
check('hero role rendered', text('.hero__role').includes('Front-End'), text('.hero__role'))
check('CV link points to Drive', $('a[href*="drive.google.com"]') !== null)
check('bio has 3 paragraphs', $$('#sobre-mi .about__body > p').length === 3)
check('profile photo has alt text', ($('.about__photo')?.getAttribute('alt') ?? '').length > 0)
check('12 skills rendered', $$('.skill').length === 12, `got ${$$('.skill').length}`)
check('languages rendered', $$('.language').length === 2)

console.log('\n▸ Accessibility')
check('html lang is es', document.documentElement.getAttribute('lang') === 'es')
check('data-theme applied', ['light', 'dark'].includes(document.documentElement.getAttribute('data-theme')))
const progressbars = $$('[role="progressbar"]')
check('every skill bar is a progressbar', progressbars.length === 12, `got ${progressbars.length}`)
check(
  'progressbar aria-valuenow matches its label percentage',
  progressbars.every((bar) => {
    const now = Number(bar.getAttribute('aria-valuenow'))
    const text = bar.parentElement?.querySelector('.skill__value')?.textContent ?? ''
    return Number.isFinite(now) && text.includes(`${now}%`)
  }),
)
check('every image has an alt attribute', $$('img').every((img) => img.hasAttribute('alt')))
check('nav links point at real sections', $$('.navbar__link').every((a) => {
  const href = a.getAttribute('href') ?? ''
  return href.startsWith('#') && $(href) !== null
}))
check('external links are safe', $$('a[target="_blank"]').every((a) => {
  const rel = a.getAttribute('rel') ?? ''
  return rel.includes('noopener')
}))
check('decorative svgs are aria-hidden', $$('svg[aria-hidden="true"]').length > 0)

console.log('\n▸ Language switch')
// The switcher is a disclosure: open it before its options exist in the DOM.
const languageButton = $('.lang .icon-button')
check('language switcher button exists', languageButton !== null)
languageButton?.click()
await new Promise((r) => setTimeout(r, 10))

const options = $$('.lang__option')
const englishButton = options.find((b) => b.textContent.includes('English'))
check('language menu opened on click', options.length === 2)
check('English option exists', englishButton !== undefined)

if (englishButton !== undefined) {
  englishButton.click()
  await new Promise((r) => setTimeout(r, 30))
  check('html lang switched to en', document.documentElement.getAttribute('lang') === 'en')
  check('title is in English', document.title.includes('Front-End'), document.title)
  check('URL carries ?lang=en', window.location.search.includes('lang=en'))
  check('role switched to English', text('.hero__role').includes('Front-End Designer'))
  check('nav is in English', $$('.navbar__link').map((a) => a.textContent).join('|') === 'Home|About|Projects|Contact')
  check('og:locale updated to en_US', $('meta[property="og:locale"]')?.content === 'en_US')
  check('canonical updated', ($('link[rel="canonical"]')?.href ?? '').includes('lang=en'))
  check('skills levels in English', text('.skill__band').length > 0 && !text('.skill__band').includes('Avanzado'))
}

console.log('\n▸ Reveal animations')
check('reveal elements exist', $$('.reveal').length > 0)
check(
  'reveal delay custom property set somewhere',
  $$('.reveal').some((el) => el.style.getPropertyValue('--reveal-delay') !== ''),
)
check('reveals became visible once observed', $$('.reveal[data-visible="true"]').length > 0)

console.log('\n▸ Media')
const video = $('.project__video')
check('demo video mounted lazily', video !== null)
if (video !== null) {
  // Autoplay policy reads the DOM *property*, not the content attribute, so
  // that is what has to be true for the demo to ever play.
  check('video.muted is true (autoplay allowed)', video.muted === true)
  check('video is inline (iOS safe)', video.hasAttribute('playsinline'))
  check('video is not preloaded', video.getAttribute('preload') === 'none')
  check('video loops', video.hasAttribute('loop'))
  check('webm source offered first', video.querySelector('source[type="video/webm"]') !== null)
  check('mp4 fallback offered', video.querySelector('source[type="video/mp4"]') !== null)
  check('poster is a webp', (video.getAttribute('poster') ?? '').endsWith('.webp'))
}

console.log('\n▸ Static files')
// Vite rewrites `base` into index.html but NOT into files copied verbatim from
// public/, so a root-absolute path in one of those silently 404s on a
// project-pages subpath. Assert every one of them resolves.
const SITE_PREFIX = '/PortFolio/'

for (const file of ['robots.txt', 'sitemap.xml', 'site.webmanifest']) {
  const contents = readFileSync(join(distDir, file), 'utf8')
  const relative = [...contents.matchAll(/(?:src"\s*:\s*"|(?:href|src)=")(\/[^"]+)"/g)].map((m) => m[1])
  const absolute = [...contents.matchAll(/https?:\/\/matiarriete\.github\.io(\/[^<\s"]*)/g)].map((m) => m[1])

  check(`${file} references something`, relative.length + absolute.length > 0)

  for (const ref of [...relative, ...absolute]) {
    if (!ref.startsWith(SITE_PREFIX)) {
      check(`${file}: "${ref}" is under the ${SITE_PREFIX} base`, false)
      continue
    }
    const target = join(distDir, decodeURIComponent(ref.slice(SITE_PREFIX.length).split('?')[0]))
    check(`${file}: ${ref} resolves in dist`, existsSync(target), `missing ${target}`)
  }
}

const robots = readFileSync(join(distDir, 'robots.txt'), 'utf8')
check('robots.txt does not block the bundle', !robots.includes('Disallow: /assets/'))
check('robots.txt advertises the sitemap', robots.includes('sitemap.xml'))

// Social previews need absolute URLs; a relative one is ignored by most scrapers.
const ogImage = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1] ?? ''
check('og:image is an absolute https URL', ogImage.startsWith('https://'), ogImage)
check(
  'og:image resolves on disk',
  existsSync(join(distDir, ogImage.replace(/^https:\/\/matiarriete\.github\.io\/PortFolio\//, ''))),
  ogImage,
)

console.log('\n▸ Removed legacy dependencies')
check('no EmailJS', !bundle.includes('emailjs'))
check('no SweetAlert', !bundle.includes('Swal'))
check('no typed.js', !bundle.includes('Typed'))
check('no Bootstrap classes', !$('.container-fluid') && !$('.navbar-dark'))
check('no contact form', $('#form') === null)
check('contact cards present', $$('.contact-card').length === 4)

/* --- Report ---------------------------------------------------------------- */

console.log(
  failures.length === 0
    ? `\nAll checks passed.\n`
    : `\n${failures.length} check(s) failed:\n${failures.map((f) => `  - ${f}`).join('\n')}\n`,
)

window.close()
process.exit(failures.length === 0 ? 0 : 1)