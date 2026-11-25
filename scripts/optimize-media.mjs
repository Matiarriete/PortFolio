/**
 * One-off media pipeline.
 *
 * Reads the original assets from git history (or any local copy) and writes
 * optimised derivatives into src/assets/media/, which is what the app imports.
 *
 * The originals are deliberately NOT committed: `images/` held a 6 MB MP4 that
 * was 96% of the repository. Restore them with:
 *
 *   git checkout 6b6d50e -- images/
 *   npm run media:optimize
 *   git rm -r --cached images
 *
 * Usage:
 *   node scripts/optimize-media.mjs [--force]
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import ffmpegPath from 'ffmpeg-static'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'src', 'assets', 'media')

const SOURCE_IMAGE = join(root, 'images', 'Perfil.jpeg')
const SOURCE_VIDEO = join(root, 'images', '2022-09-16-10-11-50.mp4')

const force = process.argv.includes('--force')

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

function ensureOutDir() {
  mkdirSync(outDir, { recursive: true })
}

function bytes(path) {
  return statSync(path).size
}

function alreadyDone(path) {
  return existsSync(path) && !force
}

/* -------------------------------------------------------------------------- */
/* Profile photo                                                              */
/* -------------------------------------------------------------------------- */

async function buildAvatars() {
  console.log('\n▸ Profile photo')

  if (!existsSync(SOURCE_IMAGE)) {
    console.warn(`  skipped: ${SOURCE_IMAGE} not found`)
    return
  }

  const targets = [
    { file: 'perfil-600.webp', width: 600, quality: 80 },
    { file: 'perfil-300.webp', width: 300, quality: 78 },
  ]

  for (const { file, width, quality } of targets) {
    const dest = join(outDir, file)
    if (alreadyDone(dest)) {
      console.log(`  ${file} already exists (use --force to rebuild)`)
      continue
    }
    await sharp(SOURCE_IMAGE)
      .resize({ width, height: width, fit: 'cover', position: 'attention' })
      .webp({ quality, effort: 6 })
      .toFile(dest)
    console.log(`  ${file}  ${width}x${width}  ${kb(bytes(dest))}`)
  }

  // JPEG fallback for the <noscript> / very old browser path.
  const fallback = join(outDir, 'perfil.jpeg')
  if (alreadyDone(fallback)) {
    console.log('  perfil.jpeg already exists')
  } else {
    await sharp(SOURCE_IMAGE)
      .resize({ width: 600, height: 600, fit: 'cover', position: 'attention' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(fallback)
    console.log(`  perfil.jpeg  600x600  ${kb(bytes(fallback))} (fallback)`)
  }

  console.log(`  source: ${kb(bytes(SOURCE_IMAGE))}`)
}

/* -------------------------------------------------------------------------- */
/* Project demo video                                                          */
/* -------------------------------------------------------------------------- */

function runFfmpeg(args) {
  execFileSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    stdio: ['ignore', 'inherit', 'inherit'],
  })
}

async function buildVideo() {
  console.log('\n▸ Project demo video')

  if (!existsSync(SOURCE_VIDEO)) {
    console.warn(`  skipped: ${SOURCE_VIDEO} not found`)
    return
  }

  if (typeof ffmpegPath !== 'string') {
    console.warn('  skipped: ffmpeg-static did not provide a binary for this platform')
    return
  }

  const mp4 = join(outDir, 'proyecto-demo-720.mp4')
  const webm = join(outDir, 'proyecto-demo-720.webm')
  const poster = join(outDir, 'proyecto-poster.webp')

  // The clip is only ever played muted and looped, so the audio track is
  // dropped entirely: it costs bitrate and can never be heard.
  //
  // 540p rather than 720p because the demo renders inside a card that is at
  // most ~420 CSS px wide — 540p is still >2x that, so the extra pixels of the
  // source would never be seen. CRF 32 keeps UI text legible after H.264's
  // quantisation while landing around 1 MB instead of 6 MB.
  if (alreadyDone(mp4)) {
    console.log('  proyecto-demo-720.mp4 already exists')
  } else {
    runFfmpeg([
      '-i', SOURCE_VIDEO,
      '-an',
      '-vf', 'scale=-2:540',
      '-c:v', 'libx264',
      '-profile:v', 'high',
      '-preset', 'slow',
      '-crf', '32',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      mp4,
    ])
    console.log(`  proyecto-demo-720.mp4   ${kb(bytes(mp4))}`)
  }

  if (alreadyDone(webm)) {
    console.log('  proyecto-demo-720.webm already exists')
  } else {
    runFfmpeg([
      '-i', SOURCE_VIDEO,
      '-an',
      '-vf', 'scale=-2:540',
      '-c:v', 'libvpx-vp9',
      '-crf', '40',
      '-b:v', '0',
      '-row-mt', '1',
      '-deadline', 'good',
      '-cpu-used', '2',
      webm,
    ])
    console.log(`  proyecto-demo-720.webm  ${kb(bytes(webm))}`)
  }

  if (alreadyDone(poster)) {
    console.log('  proyecto-poster.webp already exists')
  } else {
    // 2.5s in: past any title card, still on a representative screen.
    runFfmpeg([
      '-ss', '2.5',
      '-i', SOURCE_VIDEO,
      '-frames:v', '1',
      '-vf', 'scale=1280:-2',
      poster,
    ])
    console.log(`  proyecto-poster.webp    ${kb(bytes(poster))}`)
  }

  console.log(`  source: ${kb(bytes(SOURCE_VIDEO))}`)
}

/* -------------------------------------------------------------------------- */

async function main() {
  ensureOutDir()
  await buildAvatars()
  await buildVideo()
  console.log(`\nOutput written to ${outDir}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})