# Contacto, menú lateral y certificados en Drive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Quitar «Web Personal» de Contacto, sustituir la flecha del menú por un panel lateral a pantalla completa con enlaces centrados y sin separadores, servir los 10 certificados desde Drive y repartir sus tecnologías en Habilidades.

**Architecture:** Los datos siguen en `src/data/content.ts` (`socials`, `skillGroups`, `courses`); `Courses.tsx` deja de anteponer `BASE_URL` porque las URLs de certificado son absolutas; `Navbar.tsx` conserva el único botón de menú y solo cambia icono y estilos del panel. Las pruebas viven en `scripts/smoke.mjs`, que inspecciona el HTML generado en `dist/` más archivos fuente CSS.

**Tech Stack:** Vite + React 19 + TypeScript; jsdom smoke test; Google Drive como almacenamiento de PDFs.

**Spec:** `docs/superpowers/specs/2026-11-25-contacto-menu-y-certificados-drive-design.md`

## Global Constraints

- `base: '/PortFolio/'`; las rutas locales siguen llevando ese prefijo, pero las URLs de Drive son absolutas y no se prefijan.
- i18n ES/EN con persistencia; comprobar ambos idiomas.
- Sin formulario de contacto, EmailJS ni dependencias nuevas.
- Enlaces externos: `target="_blank"` y `rel="noopener noreferrer"`.
- No instalar OCR ni inventar fechas, credenciales ni niveles.
- TDD en cada tarea: test en rojo → implementación → verde → commit. `npm run verify` = typecheck + lint + build + smoke.
- No hacer push.

## Review Focus

- **Certificado mal relateado:** si un ID de Drive se asigna al curso equivocado (especialmente SOLID/Jenkins), el usuario abre un PDF ajeno → la Task 3 comprueba los 10 pares título↔ID exactos.
- **Restos de Web Personal:** quitar la entrada de `socials` puede dejar el icono `website` en el mapa de `Contact.tsx` o el enlace en el README → la Task 1 comprueba 4 tarjetas, ausencia de `matiasarriete.com` y el typecheck del mapa.
- **Menú inaccesible con teclado:** el botón puede perder `aria-expanded`/`aria-controls` o no cerrarse con Escape/al pulsar un enlace → la Task 4 comprueba aria, Escape y cierre por enlace.
- **Panel que no cumple el mockup:** separadores, desalineación o breakpoint incorrecto → la Task 4 comprueba en `Navbar.css` el bloque del toggle con `inset: 0`, ausencia de `border-bottom` en `.navbar__link` y `justify-content: center`, además del breakpoint ≥ 64em.
- **Habilidades duplicadas o incompletas:** un grupo nuevo puede no renderizarse o repetir Java/CSS → la Task 2 comprueba 6 grupos, el grupo `tools` y que no hay duplicados dentro de cada grupo, en ES y EN.

---

### Task 1: Contacto sin Web Personal

**Files:**
- Modify: `src/data/content.ts:26-33` y `:132-139` (tipo y array `socials`)
- Modify: `src/components/Contact.tsx:9-15` (mapa `SOCIAL_ICONS`)
- Test: `scripts/smoke.mjs:326-328`

**Interfaces:**
- Consumes: `socials: readonly SocialLink[]`, `localize`, `IconName` (existentes).
- Produces: `SocialLink['id']` restringido a `'github' | 'linkedin' | 'whatsapp' | 'email'`; `socials` con 4 entradas.

- [x] **Step 1: Write the failing test**

En `scripts/smoke.mjs`, sustituir las dos comprobaciones de Contacto por:

```js
check('4 contact cards', $$('.contact-card').length === 4, `got ${$$('.contact-card').length}`)
check('no personal website card', $('a[href="https://matiasarriete.com"]') === null)
check('contact channels are GitHub, LinkedIn, WhatsApp and email',
  $$('.contact-card').map((a) => a.getAttribute('href')).every((href) =>
    ['https://github.com/', 'https://www.linkedin.com/', 'https://wa.me/', 'mailto:'].some((p) => href?.startsWith(p))))
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm run build && npm run smoke`
Expected: FAIL con `4 contact cards — got 5` y `no personal website card`.

- [x] **Step 3: Remove the website social**

En `src/data/content.ts`, quitar `'website'` del union de `SocialLink['id']` y borrar el objeto con `id: 'website'`. En `src/components/Contact.tsx`, borrar la entrada `website: 'globe'` de `SOCIAL_ICONS`. No tocar los otros canales.

- [x] **Step 4: Run tests to verify they pass**

Run: `npm run verify`
Expected: `All checks passed.`, exit 0.

- [x] **Step 5: Commit**

```bash
git add scripts/smoke.mjs src/data/content.ts src/components/Contact.tsx
git commit -m "fix: quita Web Personal de Contacto"
```

---

### Task 2: Habilidades desde los certificados

**Files:**
- Modify: `src/data/content.ts:170-197` (`skillGroups`)
- Test: `scripts/smoke.mjs` (nuevo bloque `▸ Skills`, antes de `▸ Accessibility`)

**Interfaces:**
- Consumes: `SkillGroup` (`{ id, label: LocalizedText, skills: string[] }`), `localize`.
- Produces: 6 grupos, con `id: 'tools'` nuevo; `Skills.tsx` sigue renderizando `group.label` y `group.skills` sin cambios.

- [x] **Step 1: Write the failing test**

Añadir antes de `console.log('\n▸ Accessibility')`:

```js
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
```

Tras el cambio de idioma, dentro del bloque `if (englishButton !== undefined)`, añadir:

```js
check('skill groups keep their labels in English',
  $$('#habilidades .skills__card h3').length === 6 &&
  text('#habilidades').includes('Tools & CI/CD'))
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm run build && npm run smoke`
Expected: FAIL con `6 skill groups — got 5` y `certificate skills are distributed`.

- [x] **Step 3: Extend `skillGroups`**

En `src/data/content.ts`, actualizar el comentario para indicar que ahora incluye tecnologías verificadas por certificados (sin niveles). Mantener los grupos existentes y sus skills actuales; añadir exactamente:

- `backend`: `PostgreSQL`.
- `testing`: `Gherkin/BDD`, `Karate`, `API testing`, `Selenium WebDriver`, `XPath`, `selectores CSS`, `SDET`.
- `design`: `SOLID`, `arquitectura y diseño de software`.
- nuevo grupo `{ id: 'tools', label: { es: 'Herramientas y CI/CD', en: 'Tools & CI/CD' }, skills: ['Git', 'Bitbucket', 'Sourcetree', 'Jenkins', 'DevOps'] }`, al final del array.

Java y CSS ya existen: no se añaden de nuevo.

- [x] **Step 4: Run tests to verify they pass**

Run: `npm run verify`
Expected: `All checks passed.`, exit 0.

- [x] **Step 5: Commit**

```bash
git add scripts/smoke.mjs src/data/content.ts
git commit -m "feat: reparte las skills de los certificados en Habilidades"
```

---

### Task 3: Certificados servidos desde Drive

**Files:**
- Modify: `src/data/content.ts:271-352` (10 campos `certificate`)
- Modify: `src/components/Courses.tsx:39`
- Delete: `public/certificados/*.pdf` (10 archivos)
- Modify: `README.md:88-106`
- Test: `scripts/smoke.mjs:160-181`

**Interfaces:**
- Consumes: `CourseEntry.certificate?: string` ( ahora URL absoluta ), `courses`.
- Produces: 10 URLs `https://drive.google.com/file/d/<ID>/view?usp=sharing`; `Courses.tsx` usa `href={course.certificate}`.

- [x] **Step 1: Write the failing test**

Sustituir en `scripts/smoke.mjs` la comprobación `every certificate link uses the /PortFolio/ base` y el bucle que verifica archivos en `dist` por:

```js
const expectedCertificates = {
  'Advanced Selenium testing framework with Java': '1r5JaX1ntTeGR2Y6xeYARDZS3RPbEEgvN',
  'Gherkin Language — The Master Guide': '1J-HJAyfEvjJRS0e2IsyZ9_SKWrlb1Vzy',
  'Git Essentials: Learn Git with Bitbucket and Sourcetree': '1xuINVn2fZ3meEtvNzFtzjHJ_ex6Qigq1',
  'Jenkins from Zero to Hero: Become a DevOps Jenkins Master': '15p3R4DWYGXgAVE1y9t1WCWP7ZJc1f8jm',
  'Master XPath and CSS Selectors for Selenium WebDriver': '1dBqjjWuxD_eSvPINNPxD7Khf7jqXSgbf',
  'PostgreSQL Bootcamp': '1tAUJnr00183gkZXHfGVqEjdyH_SM_R2D',
  'REST API Testing with Karate Framework': '1lbKvYObBOp2Uko9OliYhtwRiqbmpyob1',
  'SDET Training': '1bvPz6GhSn2IgXPqRCxQVg3FBEvdAq47Q',
  'Selenium WebDriver and Java: Using Real Examples (2023)': '1s58T6Xdy2eltTdDQoaiG1FHKMwFDLr47',
  'SOLID Principles: Introducing Software Architecture & Design': '1vYHCU2SRSZ3Aa9ZEEmM6YnTUiDfiSxnt',
}
check('every certificate link points to its Drive file', $$('#cursos a.course-card__link').every((a) => {
  const title = a.closest('.course-card')?.querySelector('h3')?.textContent ?? ''
  const id = Object.entries(expectedCertificates).find(([prefix]) => title.startsWith(prefix))?.[1]
  return id !== undefined && a.getAttribute('href') === `https://drive.google.com/file/d/${id}/view?usp=sharing`
}), $$('#cursos a.course-card__link').map((a) => a.getAttribute('href')).join(' | '))
check('no local certificate PDFs', $$('#cursos a.course-card__link').every((a) => !a.getAttribute('href')?.includes('/certificados/')))
```

Usar como claves los prefijos exactos de los títulos renderizados en ES; si algún título no empieza con el prefijo indicado, ajustar solo la clave de `expectedCertificates` al texto real del DOM (no cambiar el ID).

- [x] **Step 2: Run test to verify it fails**

Run: `npm run build && npm run smoke`
Expected: FAIL con `every certificate link points to its Drive file` y `no local certificate PDFs`.

- [x] **Step 3: Point certificates at Drive and delete local PDFs**

En `src/data/content.ts`, reemplazar los 10 valores de `certificate` por las URLs `https://drive.google.com/file/d/<ID>/view?usp=sharing` según la tabla anterior (mismo ID para el mismo `id` de curso) y actualizar el comentario del campo en `CourseEntry` para indicar que es una URL absoluta de Drive. En `src/components/Courses.tsx`, dejar `href={course.certificate}`. Borrar los 10 archivos de `public/certificados/` (el directorio queda vacío; no se commitea).

- [x] **Step 4: Update README**

Reescribir la sección `## Cursos y certificados`: los PDF ya no se sirven desde `public/`; para añadir un certificado se comparte el archivo en la carpeta de Drive, se copia su URL `file/d/<ID>/view?usp=sharing` y se usa como `certificate`. Indicar que si se revoca el uso compartido el enlace deja de funcionar, y que el smoke test valida la URL y su correspondencia con el curso, no el contenido del PDF.

- [x] **Step 5: Run tests to verify they pass**

Run: `npm run verify`
Expected: `All checks passed.`, exit 0. Comprobar además que `git status --short` no muestra PDFs nuevos.

- [x] **Step 6: Commit**

```bash
git add scripts/smoke.mjs src/data/content.ts src/components/Courses.tsx README.md
git commit -m "feat: sirve los certificados desde Google Drive"
```

---

### Task 4: Menú hamburguesa lateral a pantalla completa

**Files:**
- Modify: `src/components/Navbar.tsx:79-92`
- Modify: `src/components/Navbar.css:195-267`
- Test: `scripts/smoke.mjs:198-218`

**Interfaces:**
- Consumes: `Icon` con `IconName` `'menu' | 'close'` (ya disponibles), `dictionary.nav.openMenu/closeMenu`, `menuOpen`.
- Produces: botón con icono `menu` cerrado / `close` abierto, sin rotación; nav con `data-open` y cierre por Escape/enlace.

- [x] **Step 1: Write the failing test**

En el bloque `▸ Mobile menu toggle`, añadir después de `check('toggle starts collapsed', ...)`:

```js
check('closed toggle shows the menu icon', [...$$('.navbar__toggle svg path')].some((p) => p.getAttribute('d') === 'M4 7h16'))
```

Tras `check('clicking opens the menu', ...)`:

```js
check('open toggle shows the close icon', [...$$('.navbar__toggle svg path')].some((p) => p.getAttribute('d') === 'M6 6l12 12'))
```

`Icon` renderiza `<path d="…">` en línea (no `<use>`), por eso se comprueban los `d` de `STROKE_PATHS` en `src/components/Icon.tsx:61,65`.

Añadir al final del bloque, después de `scroll lock released`:

```js
const navbarMenu = $('#navbar-menu')
check('panel is full screen', /inset:\s*0/.test(mobileBlock))
check('panel links are centered', /\.navbar__nav[\s\S]*justify-content:\s*center/.test(mobileBlock))
check('panel links have no separators', !/\.navbar__link[\s\S]*border-bottom/.test(mobileBlock))
toggle?.click()
await new Promise((r) => setTimeout(r, 10))
navbarMenu?.querySelector('a')?.click()
await new Promise((r) => setTimeout(r, 10))
check('clicking a nav link closes the menu', toggle?.getAttribute('aria-expanded') === 'false')
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm run build && npm run smoke`
Expected: FAIL en el icono, `panel is full screen`, `panel links are centered` y `clicking a nav link closes the menu`.

- [x] **Step 3: Implement the drawer**

En `src/components/Navbar.tsx`, cambiar el `Icon` del toggle a `name={menuOpen ? 'close' : 'menu'}`, `size={20}` y sin `style` de rotación. Dejar `aria-expanded`, `aria-controls` y `aria-label` intactos; los enlaces ya cierran con `onClick={() => setMenuOpen(false)}` y Escape ya está implementado.

En `src/components/Navbar.css`, dentro del `@media (max-width: 67.99em)`, sustituir el panel actual por uno con `position: fixed; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ...; background-color: var(--brand); transform: translateX(100%)`, y en `[data-open='true'] .navbar__nav` usar `transform: translateX(0)`. El toggle existente se mantiene visible por encima del panel (`position: relative; z-index` mayor que el del nav) y su icono de cierre hace las veces de ✕; no se añade otro botón. La lista de enlaces va en una sola columna centrada, con tipografía de display, sin `border-bottom` ni `::after`, y con `overflow-y: auto` para pantallas muy bajas.

- [x] **Step 4: Run tests to verify they pass**

Run: `npm run verify`
Expected: `All checks passed.`, exit 0.

- [x] **Step 5: Commit**

```bash
git add scripts/smoke.mjs src/components/Navbar.tsx src/components/Navbar.css
git commit -m "feat: menú lateral a pantalla completa con icono de hamburguesa"
```

## Final gate

- [x] `npm run verify` en verde tras las 4 tareas.
- [x] Revisión fresca del diff completo por un revisor independiente.
- [x] Sin push; informar al usuario de los commits y de la revisión visual pendiente en `http://localhost:5173/PortFolio/`.
