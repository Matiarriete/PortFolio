# Contacto, menú lateral y certificados en Drive — diseño

**Fecha:** 2026-11-25
**Estado:** aprobado por el usuario (mockup `nav-drawer-v3.html`)

## Contexto

Tras la sección `#cursos` (10 certificados Udemy + 5 cursos del CV), el usuario pide tres ajustes:

1. Quitar «Web Personal» de Contacto.
2. Quitar la flecha ▾ junto al selector de idioma que despliega el menú móvil, sustituyéndola por un icono de hamburguesa ☰. El menú debe entrar desde el costado, ocupar toda la pantalla, tener los enlaces **siempre centrados** y **sin líneas separadoras**.
3. Borrar los PDF del servidor (`public/certificados/`) y servir cada certificado desde la carpeta pública de Drive, relacionando cada curso con su archivo.
4. Repartir en Habilidades las tecnologías de los 10 certificados, según corresponda, añadiendo un grupo nuevo de Herramientas y CI/CD.

## Decisiones aprobadas

- **Contacto:** se elimina la entrada `website` de `socials`. Quedan GitHub, LinkedIn, WhatsApp y Email. Se retira `'website'` del unions type de `SocialLink` para no dejar un valor sin uso.
- **Header:** el botón `navbar__toggle` sigue existiendo (accesibilidad, `aria-expanded`, `aria-controls`) pero cambia `chevron-down` → `menu`, y a `close` cuando está abierto. Se mantiene el breakpoint `67.99em`.
- **Panel:** `position: fixed; inset: 0`, entra deslizándose desde la derecha (`translateX(100%)` → `0`), fondo `--brand`, 8 enlaces en una sola columna centrada horizontal y verticalmente, tipografía `var(--step-2)`/display, sin `border` entre enlaces. El propio toggle se mantiene por encima del panel y pasa a ser el ✕; cierre también con `Escape` y al pulsar cualquier enlace. Bloqueo de scroll del body mientras está abierto.
- **Certificados:** cada entrada Udemy guarda una URL absoluta de Drive en `certificate`. No se copian PDFs al repositorio y `Courses.tsx` no anteponerá `BASE_URL` a URLs externas. Los cursos del CV siguen sin enlace.

## Relación curso → certificado (Drive)

Carpeta: `https://drive.google.com/drive/folders/1JCJOu1__ccTbwjTuclUsgXi2z5fs1kNz?usp=sharing`
Formato de enlace: `https://drive.google.com/file/d/<ID>/view?usp=sharing`

| Curso (id en `content.ts`) | Archivo en Drive | ID |
|---|---|---|
| `advanced-selenium-testing-framework-with-java` | Advanced Selenium testing framework with Java.pdf | `1r5JaX1ntTeGR2Y6xeYARDZS3RPbEEgvN` |
| `gherkin-language-the-master-guide` | Gherkin Language - The Master Guide.pdf | `1J-HJAyfEvjJRS0e2IsyZ9_SKWrlb1Vzy` |
| `git-essentials-learn-git-with-bitbucket-and-sourcetree` | Git Essentials: Learn Git with Bitbucket and Sourcetree.pdf | `1xuINVn2fZ3meEtvNzFtzjHJ_ex6Qigq1` |
| `jenkins-from-zero-to-hero-become-a-devops-jenkins-master` | Jenkins, From Zero To Hero: Become a DevOps Jenkins Master.pdf | `15p3R4DWYGXgAVE1y9t1WCWP7ZJc1f8jm` |
| `master-xpath-and-css-selectors-for-selenium-webdriver` | Master XPath and CSS Selectors for Selenium WebDriver.pdf | `1dBqjjWuxD_eSvPINNPxD7Khf7jqXSgbf` |
| `postgresql-bootcamp-go-from-beginner-to-advanced` | PostgreSQL Bootcamp : Go From Beginner to Advanced, 60+hours.pdf | `1tAUJnr00183gkZXHfGVqEjdyH_SM_R2D` |
| `rest-api-testing-with-karate-framework` | REST API Testing with Karate Framework.pdf | `1lbKvYObBOp2Uko9OliYhtwRiqbmpyob1` |
| `sdet-training-selenium-webdriver-java-project-and-code-tests` | SDET Training: Selenium WebDriver, Java Project & Code Tests.pdf | `1bvPz6GhSn2IgXPqRCxQVg3FBEvdAq47Q` |
| `selenium-webdriver-and-java-using-real-examples-2023` | Selenium Webdriver & Java - Using Real Examples - 2023.pdf | `1s58T6Xdy2eltTdDQoaiG1FHKMwFDLr47` |
| `solid-principles-introducing-software-architecture-and-design` | SOLID Principies - Introducing Software Architecture & Design.pdf | `1vYHCU2SRSZ3Aa9ZEEmM6YnTUiDfiSxnt` |

Nota: el archivo de Drive conserva el typo «Principies»; el título de la tarjeta se mantiene corregido como «SOLID Principles». No se renombran archivos en Drive.

## Habilidades derivadas de los certificados

Fuente: los títulos de los 10 cursos. No se inventa contenido adicional: 9 PDFs son imagen sin texto extraíble y el único con capa de texto (Karate) solo aporta fecha y duración, que no son habilidades.

| Grupo | Estado | Altas desde certificados |
|---|---|---|
| Lenguajes | existente | Java (ya estaba) |
| Front-End | existente | CSS (ya estaba) |
| Back-End y datos | existente | PostgreSQL |
| Testing y QA | existente | Gherkin/BDD, Karate, API testing, Selenium WebDriver, XPath, selectores CSS, SDET |
| Diseño y procesos | existente | SOLID, arquitectura y diseño de software |
| Herramientas y CI/CD | **nuevo** (`tools`) | Git, Bitbucket, Sourcetree, Jenkins, DevOps |

El comentario «exactly as listed on the CV» de `skillGroups` se actualiza para reflejar que ahora también incluye tecnologías verificadas por los certificados. Se añaden las etiquetas ES/EN del grupo nuevo donde haga falta. No se asignan niveles ni fechas.

## Alcance por archivo

- `src/data/content.ts`: eliminar `website` de `socials` y del tipo; sustituir las 10 rutas locales por las URLs de Drive; ampliar `skillGroups` con el reparto anterior y el grupo `tools`.
- `src/components/Navbar.tsx`: icono `menu`/`close`, cierre al pulsar enlace, Escape y ✕; el botón deja de rotar.
- `src/components/Navbar.css`: panel full-screen lateral centrado, sin divisores, sin `rotate` del icono.
- `src/components/Courses.tsx`: `href` directo (`course.certificate`), sin `BASE_URL`.
- `scripts/smoke.mjs`: quitar aserciones de archivos en `dist`; exigir 10 URLs `drive.google.com/file/d/`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label` con título; exigir 4 tarjetas de contacto y ausencia de `matiasarriete.com`; comprobar el icono `menu` del toggle y que el CSS del panel use `inset: 0` y no tenga `border-bottom` en enlaces.
- `README.md`: documentar que los certificados se añaden compartiendo el archivo en Drive y copiando su URL de `file/d/.../view`.
- `public/certificados/`: borrar los 10 PDF (~2,1 MB).

## Fuera de alcance

- Subir o sincronizar archivos desde Drive automáticamente.
- OCR, credenciales o fechas de certificados.
- Cambiar textos de la sección `#cursos` ni el orden de las tarjetas.
- Cambiar el breakpoint del header.

## Criterios de aceptación

1. Contacto muestra 4 canales; no aparece «Web Personal» ni `matiasarriete.com` en ES ni EN.
2. En móvil/tablet no hay flecha ▾: hay ☰ que abre un panel desde la derecha, a pantalla completa, con enlaces centrados y sin separadores; se cierra con ✕, Escape o al pulsar un enlace.
3. Las 10 tarjetas Udemy enlazan con su PDF correcto en Drive; las 5 del CV no tienen enlace.
4. `npm run verify` (typecheck + lint + build + smoke) pasa en verde y no queda ningún PDF bajo `public/certificados/`.
5. Habilidades muestra los 6 grupos; las nuevas tecnologías aparecen en el grupo correcto y no se duplican dentro de un mismo grupo.

## Riesgos

- Si se revoca el uso compartido en Drive, los enlaces dejarían de funcionar; se documenta en el README.
- Drive muestra una vista previa en lugar de forzar la descarga; es el comportamiento elegido por ser el enlace público estándar.
- El smoke test no puede comprobar el contenido de los PDFs de Drive, solo la URL y su relación con el curso.
