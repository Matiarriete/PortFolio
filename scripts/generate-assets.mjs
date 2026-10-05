/**
 * One-off asset generator.
 *
 * Renders the favicon set, the Apple touch icon and the Open Graph share image
 * from inline SVG so the brand palette lives in exactly one place. Run it after
 * changing the colours or the name:
 *
 *   npm run assets:generate
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

/* --- Brand tokens — keep in sync with src/styles/tokens.css ---------------- */

const C = {
  bg: '#faf7f4',
  surface: '#ffffff',
  bgAlt: '#f1ebe1',
  brand: '#1e4d3b',
  brandSoft: '#e3ece7',
  accent: '#c86b3c',
  accentSoft: '#f6e7dc',
  text: '#14211c',
  textMuted: '#55635b',
  border: '#e3ddd0',
}

/* Resolved through fontconfig by libvips' pango renderer at generation time. */
const FONT = "'Segoe UI', 'Inter', system-ui, sans-serif"

const SITE = {
  name: 'Matias Arriete',
  role: 'Diseñador y desarrollador Front-End',
  tagline: 'Diseño interfaces y las llevo al código.',
  stack: 'HTML  ·  CSS  ·  JavaScript  ·  React  ·  UX Design',
}

/* -------------------------------------------------------------------------- */
/* SVG builders                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The monogram is drawn as vector geometry rather than text: it must render
 * identically everywhere, including in contexts with no fonts available.
 * Authored on a 100x100 grid and scaled per use.
 */
const MONOGRAM = {
  // "M" — two uprights joined by a middle V.
  m: 'M18 73 L18 27 L34 61 L50 27 L50 73 L39.5 73 L39.5 45 L28.5 59 L28.5 73 Z',
  // "A" — two diagonals with the counter cut out by even-odd fill.
  a: 'M58 73 L75 27 L92 73 L81.5 73 L78.8 62 L71.2 62 L68.5 73 Z M73 51 L77 51 L75 41 Z',
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="22" fill="${C.brand}"/>
  <path d="${MONOGRAM.m}" fill="${C.bg}"/>
  <path d="${MONOGRAM.a}" fill="${C.bg}" fill-rule="evenodd"/>
</svg>`
}

/** Decorative background reused by the OG image. */
function aurora() {
  return `
  <defs>
    <radialGradient id="g-brand" cx="18%" cy="14%" r="62%">
      <stop offset="0%" stop-color="${C.brand}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${C.brand}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-accent" cx="88%" cy="10%" r="58%">
      <stop offset="0%" stop-color="${C.accent}" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
      <path d="M54 0 L0 0 0 54" fill="none" stroke="${C.border}" stroke-width="1"/>
    </pattern>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="45%" stop-color="${C.bg}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${C.bg}" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect width="1200" height="630" fill="url(#g-brand)"/>
  <rect width="1200" height="630" fill="url(#g-accent)"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.6"/>
  <rect y="380" width="1200" height="250" fill="url(#scrim)"/>`
}

function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${aurora()}

  <g transform="translate(80, 150)">
    <rect width="72" height="72" rx="18" fill="${C.brand}"/>
    <path d="M13 52 L13 20 L24 43 L35 20 L35 52 L28 52 L28 33 L21 43 L21 52 Z" fill="${C.bg}"/>
    <path d="M42 52 L54 20 L66 52 L59 52 L57 44 L51 44 L49 52 Z M53 37 L56 37 L54.5 30 Z" fill="${C.bg}" fill-rule="evenodd"/>
  </g>

  <text x="80" y="330" font-family="${FONT}" font-size="76" font-weight="700"
        letter-spacing="-2.4" fill="${C.text}">${SITE.name}</text>

  <text x="80" y="392" font-family="${FONT}" font-size="34" font-weight="600"
        letter-spacing="-0.4" fill="${C.accent}">${SITE.role}</text>

  <text x="80" y="452" font-family="${FONT}" font-size="26" font-weight="400"
        fill="${C.textMuted}">${SITE.tagline}</text>

  <rect x="80" y="512" width="72" height="3" rx="1.5" fill="${C.brand}"/>

  <text x="80" y="572" font-family="${FONT}" font-size="21" font-weight="500"
        letter-spacing="1.6" fill="${C.textMuted}">${SITE.stack}</text>
</svg>`
}

/* -------------------------------------------------------------------------- */
/* ICO writer                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * sharp has no ICO encoder, and an .ico is just a directory of embedded PNGs,
 * so we assemble one by hand. Embedding PNG (rather than BMP) is what every
 * modern browser expects and keeps the file small.
 */
function buildIco(pngBuffers) {
  const count = pngBuffers.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(count, 4)

  const entries = Buffer.alloc(16 * count)
  let offset = header.length + entries.length

  pngBuffers.forEach(({ size, buffer }, index) => {
    const at = index * 16
    // 0 is the documented way to encode 256x256 in the directory entry.
    entries.writeUInt8(size >= 256 ? 0 : size, at)
    entries.writeUInt8(size >= 256 ? 0 : size, at + 1)
    entries.writeUInt8(0, at + 2) // palette size
    entries.writeUInt8(0, at + 3) // reserved
    entries.writeUInt16LE(1, at + 4) // colour planes
    entries.writeUInt16LE(32, at + 6) // bits per pixel
    entries.writeUInt32LE(buffer.length, at + 8)
    entries.writeUInt32LE(offset, at + 12)
    offset += buffer.length
  })

  return Buffer.concat([header, entries, ...pngBuffers.map((entry) => entry.buffer)])
}

/* -------------------------------------------------------------------------- */
/* Build                                                                       */
/* -------------------------------------------------------------------------- */

async function render(svg, size) {
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()
}

async function main() {
  mkdirSync(publicDir, { recursive: true })

  /* favicon.svg — vector, used by every modern browser */
  const svgPath = join(publicDir, 'favicon.svg')
  writeFileSync(svgPath, faviconSvg())
  console.log(`favicon.svg            ${faviconSvg().length} B`)

  /* favicon.ico — legacy fallback for anything that requests /favicon.ico */
  const icoSizes = [16, 32, 48, 64, 128, 256]
  const icoEntries = await Promise.all(
    icoSizes.map(async (size) => ({ size, buffer: await render(faviconSvg(), size) })),
  )
  const icoPath = join(publicDir, 'favicon.ico')
  writeFileSync(icoPath, buildIco(icoEntries))
  console.log(`favicon.ico            ${icoEntries.length} sizes, ${icoEntries.reduce((n, e) => n + e.buffer.length, 0)} B`)

  /* apple-touch-icon.png — iOS does not support SVG favicons */
  const touchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${C.brand}"/>
  <path d="${MONOGRAM.m}" fill="${C.bg}"/>
  <path d="${MONOGRAM.a}" fill="${C.bg}" fill-rule="evenodd"/>
</svg>`
  const touchPath = join(publicDir, 'apple-touch-icon.png')
  writeFileSync(touchPath, await sharp(Buffer.from(touchSvg)).png().toBuffer())
  console.log('apple-touch-icon.png   180x180')

  /* og-image.png — what LinkedIn / WhatsApp / X show when the link is shared */
  const ogPath = join(publicDir, 'og-image.png')
  await sharp(Buffer.from(ogSvg())).png({ compressionLevel: 9 }).toFile(ogPath)
  console.log('og-image.png           1200x630')

  console.log(`\nWritten to ${publicDir}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})