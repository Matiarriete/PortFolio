# PortFolio

Personal portfolio — React + TypeScript + Vite.

Live: **https://matiarriete.github.io/PortFolio/**

## Stack

- React 19, TypeScript, Vite
- Plain CSS with custom-property design tokens (no UI framework)
- Self-hosted variable fonts via `@fontsource-variable` (Inter, Space Grotesk)
- `jsdom` smoke test that runs the real production bundle

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck and emit the production bundle to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run typecheck` | `tsc -b`, no emit |
| `npm run lint` | ESLint |
| `npm run smoke` | Boot the built bundle in jsdom and assert ~60 behaviours |
| `npm run verify` | typecheck → lint → build → smoke |

`npm run smoke` needs `dist/` to exist, so run `npm run build` first. It exits
non-zero on failure, which is what makes it safe to use as a CI gate.

## Architecture

```
src/
  components/   one component per file, colocated CSS
  data/         content.ts — all copy, links and skill levels live here
  hooks/        useScrollSpy, useMediaQuery
  i18n/         typed ES/EN dictionaries + LanguageProvider
  styles/       tokens.css (design tokens, both themes) + global.css
  theme/        ThemeProvider (light/dark, persisted)
  assets/media/ optimised images and video (generated, committed)
```

### Adding or changing content

Edit `src/data/content.ts`. Nothing else needs touching — sections, the contact
cards, the language levels and the footer all read from it. Strings that appear
in both languages live in `src/i18n/dictionaries.ts`.

## Internationalisation

One React app, two locales. The language is chosen from, in order:

1. the `?lang=es` / `?lang=en` query parameter,
2. `localStorage["portfolio-locale"]`,
3. `navigator.language`,
4. Spanish.

Switching languages updates the URL, `<html lang>`, `<title>`, description,
`og:*`/`twitter:*` tags, canonical and `hreflang` so both variants stay
indexable. See `src/i18n/LanguageProvider.tsx`.

## Theming

`src/theme/ThemeProvider.tsx` sets `data-theme` on `<html>`. A small inline
script in `index.html` applies the stored theme before first paint, so there is
no flash of the wrong theme. Both themes define the same token names in
`src/styles/tokens.css`; components never reference a raw colour.

Every text/background pair in both themes was verified to clear WCAG 2.1 AA,
including 3:1 for interactive borders (WCAG 1.4.11).

Animations are opt-out: `prefers-reduced-motion: reduce` disables the scroll
reveals and transitions.

## Media pipeline

The original photo and video were 6.35 MB and 96% of the repository. They are
optimised into `src/assets/media/` and the originals are **not** committed.

```bash
# Restore the originals, then regenerate the derivatives
git checkout 6b6d50e -- images/
npm run media:optimize
git rm -r --cached images
```

`scripts/optimize-media.mjs` skips anything whose source is missing, so it is
safe to run on a fresh clone. It produces 300/600px WebP avatars, an MP4/WebM
pair (540p, audio dropped — the clip only ever plays muted and looped) and a
WebP poster.

`npm run assets:generate` renders the favicons and the Open Graph image with
`sharp`.

## Deployment

`.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages on every push
to `main`. It runs typecheck, lint, build and the smoke test before deploying,
and uses `concurrency` so two rapid pushes queue instead of racing.

**One-time repo setting:** GitHub Pages must be configured to deploy from the
*GitHub Actions* source, not from a `gh-pages` branch —
*Settings → Pages → Build and deployment → Source → GitHub Actions*.

`vite.config.ts` sets `base: '/PortFolio/'` to match the repo URL. If the
project moves to a custom domain, that value and the absolute URLs in
`index.html`, `public/robots.txt`, `public/sitemap.xml` and
`public/site.webmanifest` all need updating.

## Accessibility

Skip link, single `<h1>`, landmark regions, labelled sections, visible focus
rings, `aria-current` on the active nav item, real `<progressbar>` semantics on
skill meters, `aria-expanded`/`aria-controls` on the language disclosure, and
`rel="noopener noreferrer"` on external links. The smoke test asserts all of it.

## Licence

Code and assets © Matias Arriete.
