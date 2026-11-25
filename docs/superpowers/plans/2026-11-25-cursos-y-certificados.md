# Cursos y certificados Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una sección `#cursos` con 10 certificados de Udemy verificables y 5 cursos del CV, y dejar Formación solo con los 4 elementos académicos.

**Architecture:** Un array tipado `courses` en `src/data/content.ts` alimenta un componente `Courses` con rejilla de tarjetas. Los PDF viven en `public/certificados/` y las URLs se construyen con `import.meta.env.BASE_URL` para respetar el subpath de GitHub Pages. Los cursos sin PDF no renderizan enlace.

**Tech Stack:** React 19 + TypeScript + Vite 7, CSS propio, jsdom smoke test.

**Spec:** `docs/superpowers/specs/2026-11-25-cursos-y-certificados-design.md`

## Global Constraints

- `base: '/PortFolio/'`: toda URL a un asset estático empieza por `/PortFolio/`.
- Los PDF suman ~2 MB; se copian a `public/certificados/`, nunca se importan en el bundle JS.
- No inventar fechas ni números de credencial para los 9 PDF sin texto extraíble.
- Reutilizar `.card`, `.tag`, `Reveal` y `SectionHeading`; no añadir dependencias.
- Todo texto nuevo existe en ES y EN; navegación y smoke tests se actualizan en ambos idiomas.

## Review Focus

1. **Subpath de GitHub Pages:** un PDF referenciado como `/certificados/x.pdf` 404aría en Pages → el smoke test exige `href` con prefijo `/PortFolio/` y archivo existente en `dist`.
2. **Tarjetas sin PDF:** los 5 cursos del CV no tienen archivo y no deben mostrar un enlace roto → el smoke test exige 15 tarjetas pero solo 10 enlaces, y comprueba que las 5 tarjetas del CV no contienen `a.course-card__link`.
3. **Duplicados:** los 5 cursos trasladados pueden quedar también en Formación → el smoke test exige 4 `.timeline__item` en `#formacion` y ausencia de Nextu/Cisco/WhiteSuit/CoderHouse/Bootcamp ahí.
4. **Idioma:** la nueva sección puede faltar en el navegador EN → el smoke test compara la cadena exacta de `.navbar__link` en inglés con `Courses` incluido.
5. **Accesibilidad de los enlaces nuevos:** un `target="_blank"` sin `rel` o sin contexto para lector de pantalla → el smoke test verifica `rel="noopener"` global y `aria-label` con el título del curso en los 10 enlaces.

---

### Task 1: Sección Cursos y certificados

**Files:**
- Create: `src/components/Courses.tsx`, `src/components/Courses.css`
- Create: `public/certificados/*.pdf` (10 archivos)
- Modify: `src/data/content.ts`, `src/i18n/dictionaries.ts`, `src/App.tsx`, `scripts/smoke.mjs`
- Test: `scripts/smoke.mjs`

**Interfaces:**
- Consumes: `LocalizedText`, `localize` from `src/data/content.ts`; `useI18n`, `SectionHeading`, `Reveal`, `Icon` (`external-link`); `dictionary.nav.courses`, `dictionary.courses`.
- Produces: `export interface CourseEntry`, `export const courses: readonly CourseEntry[]`, `export function Courses()`.

- [ ] **Step 1: Write the failing smoke assertions**

En `scripts/smoke.mjs`, añade `cursos` a la lista del bloque `▸ Sections`, cambia la comprobación de `9 education entries` a `4 education entries`, actualiza la cadena exacta de nav en inglés a `Home|About|Experience|Education|Courses|Skills|Projects|Contact`, y añade un bloque `▸ Courses` con estas aserciones:

```js
check('15 course cards', $$('#cursos .course-card').length === 15, `got ${$$('#cursos .course-card').length}`)
check('10 certificate links', $$('#cursos a.course-card__link').length === 10, `got ${$$('#cursos a.course-card__link').length}`)
check('4 education entries after the move', $$('#formacion .timeline__item').length === 4)
check('5 CV courses are no longer in Formación', ['Nextu', 'Cisco Virtual Academy', 'WhiteSuit', 'CoderHouse', 'Bootcamp'].every((s) => !text('#formacion').includes(s)))
check('5 CV courses are in Courses', ['Soporte y Mantenimiento Técnico', 'Ciberseguridad', 'Ghost', 'Desarrollo Web', 'Bootcamp'].every((s) => text('#cursos').includes(s)))
check('every course card has a heading', $$('#cursos .course-card').every((c) => c.querySelector('h3') !== null))
check('every certificate link uses the /PortFolio/ base', $$('#cursos a.course-card__link').every((a) => (a.getAttribute('href') ?? '').startsWith('/PortFolio/certificados/')))
check('every certificate link is labelled with its course', $$('#cursos a.course-card__link').every((a) => (a.getAttribute('aria-label') ?? '').length > 'Ver certificado'.length))
for (const a of $$('#cursos a.course-card__link')) {
  const href = a.getAttribute('href') ?? ''
  check(`${href} exists in dist`, existsSync(join(distDir, href.replace('/PortFolio/', ''))))
}
```

En el bloque de idioma, añade:

```js
check('courses section is in English', text('#cursos').includes('Courses & certificates'))
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run build && npm run smoke`
Expected: FAIL con `section #cursos`, `15 course cards`, `10 certificate links` y `4 education entries after the move`.

- [ ] **Step 3: Copy the 10 PDFs into `public/certificados/`**

Run desde la raíz del repo, usando los UUID de `/tmp/opencode/uploads/` como origen:

```bash
mkdir -p public/certificados
cp "/tmp/opencode/uploads/be321a74-55ea-4d30-88b1-b27e6a4dea45/Gherkin Language - The Master Guide.pdf" public/certificados/gherkin-language-the-master-guide.pdf
cp "/tmp/opencode/uploads/146ed3ee-e2e7-4958-8d0f-9580332419ae/REST API Testing with Karate Framework.pdf" public/certificados/rest-api-testing-with-karate-framework.pdf
cp "/tmp/opencode/uploads/bc11a5d2-9db4-40fa-ad33-0ee6d2ab2061/Advanced Selenium testing framework with Java.pdf" public/certificados/advanced-selenium-testing-framework-with-java.pdf
cp "/tmp/opencode/uploads/05bab01d-fc71-4d0d-8cc5-c9f1ec3d1af7/Git Essentials  Learn Git with Bitbucket and Sourcetree.pdf" public/certificados/git-essentials-learn-git-with-bitbucket-and-sourcetree.pdf
cp "/tmp/opencode/uploads/f2a17c06-32c3-4e74-9e61-b7f5505c47a9/Master XPath and CSS Selectors for Selenium WebDriver.pdf" public/certificados/master-xpath-and-css-selectors-for-selenium-webdriver.pdf
cp "/tmp/opencode/uploads/6c5e66d8-d853-4097-9ed1-d3c97ca95759/PostgreSQL Bootcamp   Go From Beginner to Advanced, 60+hours.pdf" public/certificados/postgresql-bootcamp-go-from-beginner-to-advanced.pdf
cp "/tmp/opencode/uploads/454e7937-8dd9-4fe2-9ae3-e1d54fd4d74c/SDET Training  Selenium WebDriver, Java Project & Code Tests.pdf" public/certificados/sdet-training-selenium-webdriver-java-project-and-code-tests.pdf
cp "/tmp/opencode/uploads/58ce4452-babe-429d-93b3-5f42769f64bd/Jenkins, From Zero To Hero  Become a DevOps Jenkins Master.pdf" public/certificados/jenkins-from-zero-to-hero-become-a-devops-jenkins-master.pdf
cp "/tmp/opencode/uploads/4e528b93-adf0-42ef-a139-b637aaba074b/SOLID Principies - Introducing Software Architecture & Design.pdf" public/certificados/solid-principles-introducing-software-architecture-and-design.pdf
cp "/tmp/opencode/uploads/ab5268e9-20c5-4222-99fd-5b3304e46c08/Selenium Webdriver & Java - Using Real Examples - 2023.pdf" public/certificados/selenium-webdriver-and-java-using-real-examples-2023.pdf
```

- [ ] **Step 4: Add the data model and the 15 entries in `src/data/content.ts`**

Declare junto a `TimelineEntry`:

```ts
export interface CourseEntry {
  id: string
  title: LocalizedText
  provider: LocalizedText
  period?: LocalizedText
  /** Relative to public/, e.g. "certificados/x.pdf". Absent for CV courses. */
  certificate?: string
}
```

Añade `courses: readonly CourseEntry[]` con estas 15 entradas, en este orden. Los 10 primeros tienen `provider` `{ es: 'Udemy', en: 'Udemy' }`, sin `period`, y `certificate` igual al slug de la tabla:

| Título mostrado (ES = EN) | `certificate` |
| --- | --- |
| Gherkin Language — The Master Guide | `certificados/gherkin-language-the-master-guide.pdf` |
| REST API Testing with Karate Framework | `certificados/rest-api-testing-with-karate-framework.pdf` |
| Advanced Selenium Testing Framework with Java | `certificados/advanced-selenium-testing-framework-with-java.pdf` |
| Git Essentials: Learn Git with Bitbucket and Sourcetree | `certificados/git-essentials-learn-git-with-bitbucket-and-sourcetree.pdf` |
| Master XPath and CSS Selectors for Selenium WebDriver | `certificados/master-xpath-and-css-selectors-for-selenium-webdriver.pdf` |
| PostgreSQL Bootcamp: Go From Beginner to Advanced | `certificados/postgresql-bootcamp-go-from-beginner-to-advanced.pdf` |
| SDET Training: Selenium WebDriver, Java Project & Code Tests | `certificados/sdet-training-selenium-webdriver-java-project-and-code-tests.pdf` |
| Jenkins, From Zero To Hero: Become a DevOps Jenkins Master | `certificados/jenkins-from-zero-to-hero-become-a-devops-jenkins-master.pdf` |
| SOLID Principles — Introducing Software Architecture & Design | `certificados/solid-principles-introducing-software-architecture-and-design.pdf` |
| Selenium WebDriver & Java — Using Real Examples (2023) | `certificados/selenium-webdriver-and-java-using-real-examples-2023.pdf` |

Los 5 restantes reutilizan `id`, `title`, `provider` (antes `organisation`) y `period` de sus entradas actuales en `education`, y **no** llevan `certificate`:

- `solera-bootcamp` — Bootcamp Front-End, Back-End y Testing / Solera / 2022
- `coderhouse-web` — Desarrollo Web / CoderHouse / 2022
- `whitesuit-ghost` — Curso Ghost — Grey Hat Offensive Security Technician / WhiteSuit Hacking / 2020
- `cisco-cybersec` — Introducción a la Ciberseguridad / Cisco Virtual Academy / 2020
- `nextu-soporte` — Soporte y Mantenimiento Técnico / Nextu / 2018

Recorta `education` a las 4 entradas que quedan: `uoc-ingenieria`, `jobii-fp-web`, `iua-ingenieria-parcial`, `nuevo-siglo-bachiller`. Añade `{ id: 'cursos', labelKey: 'courses' }` a `navSections` entre `formacion` y `habilidades`.

- [ ] **Step 5: Add ES/EN copy and the nav label in `src/i18n/dictionaries.ts`**

En `nav` de ambos diccionarios añade `courses: 'Cursos'` y `courses: 'Courses'` respectivamente, entre `education` y `skills`. Añade un objeto `courses` con exactamente estas claves:

```ts
// es
courses: {
  eyebrow: 'Cursos y certificados',
  title: 'Sigo aprendiendo',
  description: 'Cursos cortos, bootcamps y certificaciones. Aquí puedes abrir el certificado original de cada uno.',
  viewCertificate: 'Ver certificado',
},
// en
courses: {
  eyebrow: 'Courses & certificates',
  title: 'Still learning',
  description: 'Short courses, bootcamps and certifications. Open the original certificate for each one.',
  viewCertificate: 'View certificate',
},
```

- [ ] **Step 6: Create `src/components/Courses.tsx` and `src/components/Courses.css`**

Firma: `export function Courses()`, sin props. Usa `useI18n()` y `localize`. Estructura de markup exigida por los tests:

```tsx
<section id="cursos" className="courses section" aria-labelledby="courses-heading">
  {/* SectionHeading con eyebrow/title/description/id="courses-heading" */}
  <ul className="courses__grid">
    {/* por cada course: <Reveal as="li" className="course-card"> con h3.course-card__title,
        p.course-card__provider, p.course-card__period (si period existe) y,
        si certificate existe, a.course-card__link */}
  </ul>
</section>
```

El `href` del enlace se construye como `` `${import.meta.env.BASE_URL}${course.certificate}` ``. El enlace lleva `target="_blank"`, `rel="noopener noreferrer"`, `aria-label={`${copy.viewCertificate}: ${localize(course.title, locale)}`}` y el icono `external-link` con `aria-hidden="true"`. Importa `./Courses.css`.

El CSS define `.courses__grid` como rejilla `repeat(auto-fit, minmax(17rem, 1fr))` con `gap: var(--space-md)`, y `.course-card` con `display: flex; flex-direction: column; gap: var(--space-2xs)` usando `.card` para el aspecto. El enlace `.course-card__link` usa `margin-top: auto` para alinearlo abajo y el color `var(--brand)`. Sin nuevos tokens ni media queries si la rejilla ya se adapta.

- [ ] **Step 7: Wire the section in `src/App.tsx`**

Importa `Courses` desde `./components/Courses` y renderiza `<Courses />` entre `<Education />` y `<Skills />` dentro de `<main id="main">`.

- [ ] **Step 8: Run the full verification**

Run: `npm run verify`
Expected: typecheck, lint, build y los checks del smoke en verde, incluidos los nuevos de `▸ Courses` y los 10 archivos PDF existentes en `dist/certificados/`.

- [ ] **Step 9: Commit**

```bash
git add public/certificados src/components/Courses.tsx src/components/Courses.css src/data/content.ts src/i18n/dictionaries.ts src/App.tsx scripts/smoke.mjs
git commit -m "feat: añade sección de cursos y certificados verificables"
```

---

### Task 2: Documentación y revisión en el sitio levantado

**Files:**
- Modify: `README.md`
- Test: revisión manual en `http://localhost:5173/PortFolio/`

**Interfaces:**
- Consumes: `courses` y `education` de `src/data/content.ts`; sección `#cursos`.
- Produces: documentación para añadir certificados nuevos.

- [ ] **Step 1: Document the new section in `README.md`**

Añade un apartado `## Cursos y certificados` que diga: los certificados de Udemy se guardan en `public/certificados/`; cada entrada se añade a `courses` en `src/data/content.ts` con `id`, `title`, `provider` y `certificate` (slug relativo); los cursos del CV sin PDF omiten `certificate`; las URLs se prefijan con `import.meta.env.BASE_URL` para GitHub Pages; Formación queda reservada a formación académica larga. Actualiza la tabla `CV data` existente para reflejar que 5 cursos salieron de `education` a `courses`.

- [ ] **Step 2: Verify and review visually**

Run: `npm run verify`
Expected: todo en verde. Abre `http://localhost:5173/PortFolio/` y comprueba: rejilla de 15 tarjetas, 10 enlaces «Ver certificado» que abren el PDF, 5 cursos del CV sin enlace, 4 entradas en Formación, nav con «Cursos», y que el interruptor EN muestra «Courses & certificates».

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: describe cómo añadir certificados al portfolio"
```
