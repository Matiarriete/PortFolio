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
const text = (selector, scope = window.document) => scope.querySelector(selector)?.textContent?.trim() ?? ''

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
for (const id of ['inicio', 'sobre-mi', 'experiencia', 'formacion', 'cursos', 'habilidades', 'proyectos', 'contacto']) {
  check(`section #${id}`, $(`#${id}`) !== null)
}

console.log('\n▸ Content (Spanish default)')
check('h1 is the name', text('h1') === 'Matias Arriete', text('h1'))
check('hero role is QA/automation', text('.hero__role').includes('QA Tester'), text('.hero__role'))
check('location is Sevilla', text('.hero__meta').includes('Sevilla'), text('.hero__meta'))
check('CV link points to Drive', $('a[href*="drive.google.com"]') !== null)
check('bio has 3 paragraphs', $$('#sobre-mi .about__body > p').length === 3)
check('profile photo has alt text', ($('.about__photo')?.getAttribute('alt') ?? '').length > 0)
check('32 skills rendered as tags', $$('.skills__card .tag').length === 32, `got ${$$('.skills__card .tag').length}`)
check('languages rendered', $$('.language').length === 2)
const bands = $$('.language').map((card) => text('.language__band', card)).join('|')
check('English is listed as B1', bands.includes('B1'), bands)

console.log('\n▸ Timeline (from the CV)')
check('2 work entries', $$('#experiencia .timeline__item').length === 2, `got ${$$('#experiencia .timeline__item').length}`)
check('4 education entries', $$('#formacion .timeline__item').length === 4, `got ${$$('#formacion .timeline__item').length}`)
check('Solera listed', text('#experiencia').includes('Solera'))
check('Stellantis listed', text('#experiencia').includes('Stellantis'))
check('UOC listed', text('#formacion').includes('Universitat Oberta'))
check('ongoing roles are badged', $$('.timeline__badge').length === 2, `got ${$$('.timeline__badge').length}`)
check('stacks rendered as tags', $$('#experiencia .timeline__tags .tag').length === 8, `got ${$$('#experiencia .timeline__tags .tag').length}`)

console.log('\n▸ Courses')
check('15 course cards', $$('#cursos .course-card').length === 15, `got ${$$('#cursos .course-card').length}`)
check('10 certificate links', $$('#cursos a.course-card__link').length === 10, `got ${$$('#cursos a.course-card__link').length}`)
check('5 CV courses are no longer in Formación', ['Nextu', 'Cisco Virtual Academy', 'WhiteSuit', 'CoderHouse', 'Bootcamp'].every((s) => !text('#formacion').includes(s)))
check('5 CV courses are in Courses', ['Soporte y Mantenimiento Técnico', 'Ciberseguridad', 'Ghost', 'Desarrollo Web', 'Bootcamp'].every((s) => text('#cursos').includes(s)))
check('every course card has a heading', $$('#cursos .course-card').every((c) => c.querySelector('h3') !== null))
const expectedCertificates = {
  'Advanced Selenium Testing Framework with Java': '1r5JaX1ntTeGR2Y6xeYARDZS3RPbEEgvN',
  'Gherkin Language — The Master Guide': '1J-HJAyfEvjJRS0e2IsyZ9_SKWrlb1Vzy',
  'Git Essentials: Learn Git with Bitbucket and Sourcetree': '1xuINVn2fZ3meEtvNzFtzjHJ_ex6Qigq1',
  'Jenkins, From Zero To Hero: Become a DevOps Jenkins Master': '15p3R4DWYGXgAVE1y9t1WCWP7ZJc1f8jm',
  'Master XPath and CSS Selectors for Selenium WebDriver': '1dBqjjWuxD_eSvPINNPxD7Khf7jqXSgbf',
  'PostgreSQL Bootcamp': '1tAUJnr00183gkZXHfGVqEjdyH_SM_R2D',
  'REST API Testing with Karate Framework': '1lbKvYObBOp2Uko9OliYhtwRiqbmpyob1',
  'SDET Training': '1bvPz6GhSn2IgXPqRCxQVg3FBEvdAq47Q',
  'Selenium WebDriver & Java — Using Real Examples (2023)': '1s58T6Xdy2eltTdDQoaiG1FHKMwFDLr47',
  'SOLID Principles — Introducing Software Architecture & Design': '1vYHCU2SRSZ3Aa9ZEEmM6YnTUiDfiSxnt',
}
check('every certificate link points to its Drive file', $$('#cursos a.course-card__link').every((a) => {
  const title = a.closest('.course-card')?.querySelector('h3')?.textContent ?? ''
  const id = Object.entries(expectedCertificates).find(([prefix]) => title.startsWith(prefix))?.[1]
  return id !== undefined && a.getAttribute('href') === `https://drive.google.com/file/d/${id}/view?usp=sharing`
}), $$('#cursos a.course-card__link').map((a) => a.getAttribute('href')).join(' | '))
check('no local certificate PDFs', $$('#cursos a.course-card__link').every((a) => !a.getAttribute('href')?.includes('/certificados/')))
check('certificate links open safely', $$('#cursos a.course-card__link').every((a) =>
  a.getAttribute('target') === '_blank' &&
  ['noopener', 'noreferrer'].every((token) => (a.getAttribute('rel') ?? '').split(/\s+/).includes(token))
))
check('every certificate link is labelled with its course', $$('#cursos a.course-card__link').every((a) => {
  const title = a.closest('.course-card')?.querySelector('h3')?.textContent ?? ''
  return (a.getAttribute('aria-label') ?? '').includes(title)
}))
const cvCards = $$('#cursos .course-card').filter((c) => !/Udemy/.test(c.textContent ?? ''))
check('5 CV course cards found', cvCards.length === 5, `got ${cvCards.length}`)
check('CV courses have no PDF link', cvCards.every((c) => c.querySelector('a.course-card__link') === null))

console.log('\n▸ Skills')
const skillCards = $$('#habilidades .skills__card')
check('6 skill groups', skillCards.length === 6, `got ${skillCards.length}`)
const skillsByGroup = Object.fromEntries(skillCards.map((card) => [
  text('h3', card),
  [...card.querySelectorAll('.tag')].map((tag) => tag.textContent.trim()),
]))
check('certificate skills are distributed',
  skillsByGroup['Back-End y datos']?.includes('PostgreSQL') &&
  ['Gherkin/BDD', 'Karate', 'API testing', 'Selenium WebDriver', 'XPath', 'selectores CSS', 'SDET']
    .every((s) => skillsByGroup['Testing y QA']?.includes(s)) &&
  ['SOLID', 'arquitectura y diseño de software'].every((s) => skillsByGroup['Diseño y procesos']?.includes(s)) &&
  ['Git', 'Bitbucket', 'Sourcetree', 'Jenkins', 'DevOps'].every((s) => skillsByGroup['Herramientas y CI/CD']?.includes(s)),
  JSON.stringify(skillsByGroup))
check('no duplicated skill inside a group',
  Object.values(skillsByGroup).every((skills) => new Set(skills).size === skills.length))

console.log('\n▸ Accessibility')
check('html lang is es', document.documentElement.getAttribute('lang') === 'es')
check('data-theme applied', ['light', 'dark'].includes(document.documentElement.getAttribute('data-theme')))
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
check('each timeline card has a heading', $$('.timeline__card').every((c) => c.querySelector('h3') !== null))

console.log('\n▸ Responsive header')
const navbarCss = readFileSync(join(root, 'src/components/Navbar.css'), 'utf8')
const mobileBlock = navbarCss.split('@media (max-width: ').slice(1).find((part) => part.includes('.navbar__toggle'))
const mobileBreakpointEm = Number(mobileBlock?.match(/^([\d.]+)em\)/)?.[1] ?? 0)
check('mobile nav starts wide enough for 8 links', mobileBreakpointEm >= 64, `${mobileBreakpointEm}em`)
// Compute the real cascade on the desktop rules only: the toggle carries both
// .navbar__toggle and .icon-button, so source order decides between them.
const probeStyle = document.createElement('style')
probeStyle.textContent = navbarCss.split('@media ')[0]
document.head.appendChild(probeStyle)
const probeToggle = document.createElement('div')
probeToggle.className = 'icon-button navbar__toggle'
document.body.appendChild(probeToggle)
const desktopToggleDisplay = window.getComputedStyle(probeToggle).display
probeToggle.remove()
probeStyle.remove()
check('hamburger is hidden on desktop', desktopToggleDisplay === 'none', desktopToggleDisplay)
check('hamburger is shown at mobile widths', /\.navbar__toggle\s*\{[^}]*display:\s*grid/.test(mobileBlock))
check('open header drops backdrop-filter so the drawer fills the viewport',
  /\.navbar\[data-open='true'\][\s\S]{0,160}backdrop-filter:\s*none/.test(navbarCss))
const headerTransition = navbarCss.match(/\.navbar\s*\{([\s\S]*?)\}/)?.[1]?.match(/transition:\s*([^;]+);/)?.[1] ?? ''
check('header does not interpolate backdrop-filter while the drawer opens',
  !/backdrop-filter/.test(headerTransition), headerTransition)
const drawerTransition = mobileBlock.match(/\.navbar__nav\s*\{([\s\S]*?)\}/)?.[1]?.match(/transition:\s*([^;]+);/)?.[1] ?? ''
check('drawer close does not animate visibility', !/visibility/.test(drawerTransition), drawerTransition)
check('drawer focus rings use the on-brand colour',
  /\.navbar\[data-open='true'\]\s+:focus-visible\s*\{[^}]*outline-color:\s*var\(--on-brand\)/.test(navbarCss))
check('language dropdown keeps a contrasting focus ring while the drawer is open',
  /\.navbar\[data-open='true'\]\s+\.lang__menu\s+:focus-visible\s*\{[^}]*outline-color:\s*var\(--brand\)/.test(navbarCss))
check('drawer stays scrollable on short screens',
  /justify-content:\s*safe center/.test(mobileBlock) &&
    /@media\s*\(max-width:\s*67\.99em\)\s+and\s*\(max-height:\s*40rem\)/.test(navbarCss))

console.log('\n▸ Mobile menu toggle')
const toggle = $('.navbar__toggle')
check('hamburger button exists', toggle !== null)
check('toggle controls the nav panel', toggle?.getAttribute('aria-controls') === 'navbar-menu')
check('toggle starts collapsed', toggle?.getAttribute('aria-expanded') === 'false')
check('closed toggle shows the menu icon', [...$$('.navbar__toggle svg path')].some((p) => p.getAttribute('d') === 'M4 7h16'))
check('header starts closed', $('.navbar')?.getAttribute('data-open') === 'false')
toggle?.click()
await new Promise((r) => setTimeout(r, 10))
check('clicking opens the menu', toggle?.getAttribute('aria-expanded') === 'true')
check('open toggle shows the close icon', [...$$('.navbar__toggle svg path')].some((p) => p.getAttribute('d') === 'M6 6l12 12'))
check('header reflects open state', $('.navbar')?.getAttribute('data-open') === 'true')
check('page scroll is locked', document.body.style.overflow === 'hidden')
check('opening the drawer focuses its first link', document.activeElement === $('#navbar-menu')?.querySelector('a'))
check('background content is inert while the drawer is open',
  $('#main')?.hasAttribute('inert') === true && $('footer')?.hasAttribute('inert') === true)
toggle?.click()
await new Promise((r) => setTimeout(r, 10))
check('clicking again closes it', toggle?.getAttribute('aria-expanded') === 'false')
check('scroll lock released', document.body.style.overflow !== 'hidden')
check('closing the drawer restores focus to the toggle', document.activeElement === toggle)
check('background inert is removed on close',
  $('#main')?.hasAttribute('inert') === false && $('footer')?.hasAttribute('inert') === false)

const navbarMenu = $('#navbar-menu')
check('panel is full screen', /inset:\s*0/.test(mobileBlock))
check('panel links are centered', /\.navbar__nav[\s\S]*justify-content:\s*center/.test(mobileBlock))
check('panel links have no separators', !/\.navbar__link[\s\S]*border-bottom/.test(mobileBlock))
toggle?.click()
await new Promise((r) => setTimeout(r, 10))
navbarMenu?.querySelector('a')?.click()
await new Promise((r) => setTimeout(r, 10))
check('clicking a nav link closes the menu', toggle?.getAttribute('aria-expanded') === 'false')
toggle?.click()
await new Promise((r) => setTimeout(r, 10))
document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }))
await new Promise((r) => setTimeout(r, 10))
check('Escape closes the menu', toggle?.getAttribute('aria-expanded') === 'false')
toggle?.click()
await new Promise((r) => setTimeout(r, 10))
const originalWidth = window.innerWidth
Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true })
window.dispatchEvent(new window.Event('resize'))
await new Promise((r) => setTimeout(r, 10))
check('resizing to desktop closes the menu', toggle?.getAttribute('aria-expanded') === 'false')
check('resize releases the scroll lock', document.body.style.overflow !== 'hidden')
Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true })
window.dispatchEvent(new window.Event('resize'))

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
  check('title is in English', document.title.includes('QA Tester'), document.title)
  check('URL carries ?lang=en', window.location.search.includes('lang=en'))
  check('role switched to English', text('.hero__role').includes('QA Tester'), text('.hero__role'))
  check(
    'nav is in English',
    $$('.navbar__link').map((a) => a.textContent).join('|') ===
      'Home|About|Experience|Education|Courses|Skills|Projects|Contact',
    $$('.navbar__link').map((a) => a.textContent).join('|'),
  )
  check('courses section is in English', text('#cursos').includes('Courses & certificates'))
  check('courses keep their cards and links in English', $$('#cursos .course-card').length === 15 && $$('#cursos a.course-card__link').length === 10)
  check('certificate label is in English', text('#cursos').includes('View certificate'))
  check('skill groups keep their labels in English',
    $$('#habilidades .skills__card h3').length === 6 &&
    text('#habilidades').includes('Tools & CI/CD'))
  check('og:locale updated to en_US', $('meta[property="og:locale"]')?.content === 'en_US')
  check('canonical updated', ($('link[rel="canonical"]')?.href ?? '').includes('lang=en'))
  check(
    'experience is in English',
    text('#experiencia').includes('Fullstack Developer') && text('#experiencia').includes('Test automation'),
    text('#experiencia').slice(0, 120),
  )
  check(
    'education is in English',
    text('#formacion').includes('Computer Science') && !text('#formacion').includes('Formación'),
  )
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
check('4 contact cards', $$('.contact-card').length === 4, `got ${$$('.contact-card').length}`)
check('no personal website card', $('a[href="https://matiasarriete.com"]') === null)
check('contact channels are GitHub, LinkedIn, WhatsApp and email',
  $$('.contact-card').map((a) => a.getAttribute('href')).every((href) =>
    ['https://github.com/', 'https://www.linkedin.com/', 'https://wa.me/', 'mailto:'].some((p) => href?.startsWith(p))))
check('mailto has no target=_blank', $('a[href^="mailto:"]')?.getAttribute('target') === null)

/* --- Report ---------------------------------------------------------------- */

console.log(
  failures.length === 0
    ? `\nAll checks passed.\n`
    : `\n${failures.length} check(s) failed:\n${failures.map((f) => `  - ${f}`).join('\n')}\n`,
)

window.close()
process.exit(failures.length === 0 ? 0 : 1)