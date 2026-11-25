# Cursos y certificados — diseño

Fecha: 2026-11-25

## Intento

El usuario quiere que un visitante del portfolio pueda **ver y comprobar** los
conocimientos que ha adquirido fuera de la formación reglada. Para eso aporta 10
PDF de certificados de Udemy y pide además que 5 cursos que hoy están en
Formación pasen a la nueva sección.

## Objetivos

- Mostrar los 10 certificados de Udemy con su título real y un enlace al PDF
  original, para que la afirmación «tengo estos conocimientos» sea verificable.
- Traslada a la nueva sección, sin duplicarlos, estos 5 cursos del CV:
  Soporte y Mantenimiento Técnico (Nextu, 2018), Introducción a la
  Ciberseguridad (Cisco, 2020), Curso Ghost (WhiteSuit, 2020), Desarrollo Web
  (CoderHouse, 2022) y Bootcamp Front-End, Back-End y Testing (Solera, 2022).
- Dejar Formación solo con los 4 elementos académicos largos: UOC, FP Jobii,
  IUA (parcial) y Bachillerato.
- Mantener ES/EN, tema claro/oscuro, accesibilidad y el flujo de verificación
  existente (`npm run verify`).

## No objetivos / anti-objetivos

- No inventar fechas, números de credencial ni URLs de verificación de los 9
  PDF que son imagen y no tienen texto extraíble.
- No convertir la sección en una lista interminable mezclada con el CV.
- No modificar Habilidades, Experiencia, Proyectos ni Contacto.

## Restricciones

- `vite.config.ts` usa `base: '/PortFolio/'`: cualquier URL a un asset estático
  debe construirse con `import.meta.env.BASE_URL`.
- Los PDF suman ~2 MB; van en `public/certificados/` y no se importan en el
  bundle JS.
- El sitio ya tiene `Timeline` para Experiencia/Formación y una rejilla de
  tarjetas en Skills/Projects; la nueva sección debe reutilizar `.card`,
  `.tag` y `Reveal`.

## Enfoques considerados

| Enfoque | Trade-off | Resultado |
| --- | --- | --- |
| A. Sección propia «Cursos y certificados» con rejilla de tarjetas | Separa formación reglada de cursos; el PDF queda a un clic; 15 tarjetas | **Elegido por el usuario** |
| B. Añadir los 10 como entradas del `Timeline` de Formación | Un solo componente, pero 19 entradas mezcladas y difícil de escanear | Descartado |
| C. Franja de tags con visor de imágenes | Ocupa poco, pero esconde la prueba y empeora lectura/accesibilidad | Descartado |

## Decisiones

**Del usuario:** enfoque A; los 5 cursos citados salen de Formación y entran en
la nueva sección.

**Mías (corregibles):**

1. La sección se llama «Cursos y certificados» / «Courses & certificates» y su
   ancla es `#cursos`. El nav añade la entrada `courses` entre Formación y
   Habilidades.
2. Los 5 cursos del CV se muestran en la misma rejilla con organización y
   periodo del CV, pero **sin** enlace a PDF porque no tienen archivo. Los 10 de
   Udemy llevan «Ver certificado ↗».
3. Los 10 certificados van primero (son los que aportan prueba material), y los
   5 cursos del CV después, conservando el orden del CV.
4. Los archivos se renombran a slugs kebab-case en `public/certificados/`. El
   título mostrado corrige el typo del archivo «SOLID Principies» a
   «SOLID Principles».
5. Solo el certificado de Karate tiene datos legibles (nº `UC-a686d2f4-…`,
   9 nov 2026, 9 h). No se mostrará esa fecha de forma destacada para no dar un
   trato distinto a los otros 9 sin motivo; los datos quedan en el PDF.
6. No se instala OCR: los 9 PDF imagen se publican tal cual, sin metadatos
   inventados.

## Lo que queda al implementador

- Nuevo tipo `CourseEntry` en `src/data/content.ts` con `id`, `title`,
  `provider`, `period?`, `certificate?` (ruta relativa en `public/`).
- Array `courses` con 15 entradas (10 Udemy + 5 del CV) y recorte de
  `education` a 4 entradas.
- `src/components/Courses.tsx` + `Courses.css`: rejilla de tarjetas con
  `SectionHeading`, `Reveal`, icono `external-link`, enlace seguro
  (`target="_blank"`, `rel="noopener noreferrer"`) y `aria-label` con el nombre
  del curso. Las tarjetas sin PDF no renderizan enlace.
- Registro en `App.tsx`, `navSections` y claves ES/EN en `dictionaries.ts`.
- Copia de los 10 PDF a `public/certificados/` con los slugs elegidos.
- Extensión de `scripts/smoke.mjs`: 15 tarjetas, 10 enlaces PDF, 4 entradas de
  Formación, navegación EN y que las rutas PDF empiecen por `/PortFolio/`.
- README: cómo añadir un certificado nuevo y procedencia de los datos.
- Verificar con `npm run verify` y revisar el sitio levantado en
  `http://localhost:5173/PortFolio/`.
