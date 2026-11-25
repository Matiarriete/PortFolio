/**
 * Translation dictionary.
 *
 * `en` is typed as `Dictionary`, so the compiler rejects it if a key is missing
 * or has the wrong shape — a new string can never silently ship untranslated.
 */

const es = {
  meta: {
    title: 'Matias Arriete — QA Tester · Automatización',
    description:
      'Soy Matias Arriete, QA Tester en Sevilla. Automatización de pruebas con Java y Selenium, y desarrollo full-stack con React y Java.',
  },

  nav: {
    skipToContent: 'Saltar al contenido principal',
    mainNavigation: 'Navegación principal',
    home: 'Inicio',
    about: 'Sobre mí',
    experience: 'Experiencia',
    education: 'Formación',
    skills: 'Habilidades',
    projects: 'Proyectos',
    contact: 'Contacto',
    openMenu: 'Abrir menú de navegación',
    closeMenu: 'Cerrar menú de navegación',
    languageSwitcher: 'Cambiar de idioma',
    themeToggle: 'Cambiar entre tema claro y oscuro',
  },

  hero: {
    greeting: 'Hola, mi nombre es',
    role: 'QA Tester · Automatización',
    tagline:
      'Automatizo pruebas de API y front-end con Java y Selenium. Me pasa: cuando algo falla, no me conformo con el síntoma, busco la causa.',
    ctaCv: 'Ver mi CV',
    ctaAbout: 'Conoceme más',
    scrollHint: 'Desplazate para explorar',
    available: 'Disponible para proyectos',
  },

  about: {
    eyebrow: 'Sobre mí',
    title: 'Pruebas, código y muchas ganas de aprender',
    paragraphs: [
      'Soy profesional altamente motivado, con una sólida capacidad de adaptación a entornos dinámicos y a la resolución de problemas. Enfocado en la excelencia y la mejora continua, aportando proactividad y una fuerte orientación al trabajo colaborativo.',
      'Mi camino ha pasado por el diseño web, el desarrollo full-stack y ahora la automatización de pruebas. Ese recorrido me ha dado algo que no se aprende en un curso: saber comunicar con un equipo y entender por qué un fallo ocurre de verdad, no solo dónde.',
      'Actualmente estudio Ingeniería Informática en la Universitat Oberta de Catalunya, y en Solera me dedico a automatizar pruebas de API y front-end con Java y Selenium.',
    ],
    photoAlt: 'Retrato de Matias Arriete',
  },

  timeline: {
    ongoing: 'Actualidad',
    stackLabel: 'Tecnologías',
  },

  experience: {
    eyebrow: 'Experiencia',
    title: 'Dónde he trabajado',
    description:
      'Automatización de pruebas y desarrollo full-stack. Esto es lo que he hecho en cada empresa.',
  },

  education: {
    eyebrow: 'Formación',
    title: 'Qué he estudiado',
    description:
      'Ingeniería, ciclos formativos, bootcamps y certificaciones. La mayoría siguen siendo esto: aprender de forma continua.',
  },

  skills: {
    eyebrow: 'Habilidades',
    title: 'Con qué trabajo',
    description:
      'Estas son las áreas en las que trabajo. No invento porcentajes: prefiero que me juzgues por lo que he construido.',
  },

  languagesSection: {
    eyebrow: 'Idiomas',
    title: 'Con quién me entiendo',
  },

  projects: {
    eyebrow: 'Proyectos',
    title: 'Lo que he construido',
    description:
      'Trabajos reales que muestran cómo pienso, cómo diseño y cómo llevo una idea hasta el código.',
    viewLive: 'Ver sitio',
    viewRepo: 'Ver código',
    demoLabel: 'Demo del proyecto',
    playVideo: 'Reproducir demo',
    pauseVideo: 'Pausar demo',
    techStack: 'Tecnologías',
    highlightsTitle: 'Qué hice',
  },

  contact: {
    eyebrow: 'Contacto',
    title: 'Hablemos',
    description:
      '¿Tienes un proyecto en mente, una consulta o simplemente querés saludar? Escribime por el canal que te quede más cómodo.',
    or: 'o',
    otherChannels: 'Otros canales',
    action: 'Abrir',
    emailNote: 'Te respondo en menos de 24 horas.',
  },

  footer: {
    rights: 'Todos los derechos reservados.',
    backToTop: 'Volver arriba',
    builtWith: 'Diseñado y construido por mí con React y TypeScript.',
  },

  a11y: {
    currentPage: 'Página actual',
    projectLinks: 'Enlaces del proyecto',
    socialLinks: 'Enlaces de contacto',
  },
} as const

/**
 * `es` is declared `as const` so its keys are exact, but that also freezes every
 * value into a string literal — which would force `en` to repeat the Spanish
 * copy verbatim. `Widen` keeps the required key structure while relaxing the
 * leaf values back to `string`, so `en` must still supply every key but can
 * supply its own text.
 */
type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> }

export type Dictionary = Widen<typeof es>

const en: Dictionary = {
  meta: {
    title: 'Matias Arriete — QA Tester · Automation',
    description:
      "I'm Matias Arriete, a QA Tester in Sevilla, Spain. Test automation with Java and Selenium, plus full-stack development with React and Java.",
  },

  nav: {
    skipToContent: 'Skip to main content',
    mainNavigation: 'Main navigation',
    home: 'Home',
    about: 'About',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    languageSwitcher: 'Change language',
    themeToggle: 'Switch between light and dark theme',
  },

  hero: {
    greeting: "Hi, my name is",
    role: 'QA Tester · Automation',
    tagline:
      'I automate API and front-end tests with Java and Selenium. When something breaks I do not settle for the symptom — I go after the cause.',
    ctaCv: 'View my CV',
    ctaAbout: 'Get to know me',
    scrollHint: 'Scroll to explore',
    available: 'Available for projects',
  },

  about: {
    eyebrow: 'About',
    title: 'Testing, code and a lot of appetite for learning',
    paragraphs: [
      'I am a highly motivated professional with a solid ability to adapt to dynamic environments and to problem-solving. Focused on excellence and continuous improvement, bringing proactivity and a strong focus on collaborative work.',
      'My path has run through web design, full-stack development and now test automation. That journey has given me something no course teaches: how to work with a team, and how to understand why a failure actually happens, not just where.',
      'I currently study Computer Science at the Open University of Catalonia, and at Solera I automate API and front-end tests with Java and Selenium.',
    ],
    photoAlt: 'Portrait of Matias Arriete',
  },

timeline: {
    ongoing: 'Present',
    stackLabel: 'Technologies',
  },

  experience: {
    eyebrow: 'Experience',
    title: 'Where I have worked',
    description:
      'Test automation and full-stack development. This is what I actually did at each company.',
  },

  education: {
    eyebrow: 'Education',
    title: 'What I have studied',
    description:
      'Engineering degrees, vocational courses, bootcamps and certifications. Most of it still ongoing: I learn continuously.',
  },

  skills: {
    eyebrow: 'Skills',
    title: 'What I work with',
    description:
      'These are the areas I work in. I do not invent percentages: judge me by what I have built.',
  },

  languagesSection: {
    eyebrow: 'Languages',
    title: 'Who I can talk to',
  },

  projects: {
    eyebrow: 'Projects',
    title: 'What I have built',
    description: 'Real work that shows how I think, how I design and how I carry an idea through to code.',
    viewLive: 'Live site',
    viewRepo: 'Source code',
    demoLabel: 'Project demo',
    playVideo: 'Play demo',
    pauseVideo: 'Pause demo',
    techStack: 'Technologies',
    highlightsTitle: 'What I did',
  },

  contact: {
    eyebrow: 'Contact',
    title: "Let's talk",
    description:
      'Have a project in mind, a question, or just want to say hi? Reach out through whichever channel suits you best.',
    or: 'or',
    otherChannels: 'Other channels',
    action: 'Open',
    emailNote: 'I reply within 24 hours.',
  },

  footer: {
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
    builtWith: 'Designed and built by me with React and TypeScript.',
  },

  a11y: {
    currentPage: 'Current page',
    projectLinks: 'Project links',
    socialLinks: 'Contact links',
  },
}

export const dictionaries = { es, en } as const

export type Locale = keyof typeof dictionaries