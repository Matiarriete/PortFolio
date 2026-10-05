/**
 * Translation dictionary.
 *
 * `en` is typed as `Dictionary`, so the compiler rejects it if a key is missing
 * or has the wrong shape — a new string can never silently ship untranslated.
 */

const es = {
  meta: {
    title: 'Matias Arriete — Diseñador y Desarrollador Front-End',
    description:
      'Soy Matias Arriete, diseñador y desarrollador front-end en España. HTML, CSS, JavaScript, React y diseño de experiencia de usuario.',
  },

  nav: {
    skipToContent: 'Saltar al contenido principal',
    home: 'Inicio',
    about: 'Sobre mí',
    projects: 'Proyectos',
    contact: 'Contacto',
    openMenu: 'Abrir menú de navegación',
    closeMenu: 'Cerrar menú de navegación',
    languageSwitcher: 'Cambiar de idioma',
    themeToggle: 'Cambiar entre tema claro y oscuro',
  },

  hero: {
    greeting: 'Hola, mi nombre es',
    role: 'Diseñador y desarrollador Front-End',
    tagline:
      'Diseño interfaces y las llevo al código. Me gusta que las cosas se vean bien y, todavía mejor, que funcionen bien.',
    ctaCv: 'Ver mi CV',
    ctaAbout: 'Conoceme más',
    scrollHint: 'Desplazate para explorar',
    available: 'Disponible para proyectos',
  },

  about: {
    eyebrow: 'Sobre mí',
    title: 'Diseño primero, código después',
    paragraphs: [
      'Soy diseñador y desarrollador front-end y vivo en España. Mi interés por el diseño web empezó en la universidad, cuando un profesor me introdujo en este mundo y me enseñó que el buen diseño no es solo estética: es la forma en que una persona recorre una interfaz.',
      'Después de un tiempo trabajando del lado visual, decidí llevarlo un paso más allá y meterme en la programación. Hoy combino las dos disciplinas —diseño y código— poniendo siempre la experiencia de usuario en el centro del producto.',
      'Trabajo con metodologías ágiles, soy obsesivo con el detalle de los estados vacíos y los mensajes de error, y me importa tanto que el sitio cargue rápido como que se entienda a la primera.',
    ],
    photoAlt: 'Retrato de Matias Arriete',
  },

  skills: {
    eyebrow: 'Habilidades',
    title: 'Lo que manejo',
    description:
      'Este es el nivel real con el que me manejo hoy en cada herramienta. No es una lista inflada: es lo que he usado de verdad.',
    levelLabels: {
      high: 'Avanzado',
      mid: 'Intermedio',
      low: 'Iniciando',
    },
    levelAriaSuffix: 'de 100',
    showLevel: 'Ver nivel',
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
    title: 'Matias Arriete — Front-End Designer & Developer',
    description:
      "I'm Matias Arriete, a front-end designer and developer based in Spain. HTML, CSS, JavaScript, React and UX design.",
  },

  nav: {
    skipToContent: 'Skip to main content',
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    contact: 'Contact',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    languageSwitcher: 'Change language',
    themeToggle: 'Switch between light and dark theme',
  },

  hero: {
    greeting: "Hi, my name is",
    role: 'Front-End Designer & Developer',
    tagline:
      'I design interfaces and I take them all the way to the code. I like things to look good and — even better — to work well.',
    ctaCv: 'View my CV',
    ctaAbout: 'Get to know me',
    scrollHint: 'Scroll to explore',
    available: 'Available for projects',
  },

  about: {
    eyebrow: 'About',
    title: 'Design first, code after',
    paragraphs: [
      "I'm a front-end designer and developer based in Spain. My interest in web design started at university, when a professor introduced me to this world and taught me that good design isn't only aesthetics: it's the way a person moves through an interface.",
      "After spending some time working on the visual side, I decided to take it one step further and get into programming. Today I combine both disciplines — design and code — always putting user experience at the centre of the product.",
      'I work with agile methodologies, I obsess over empty states and error messages, and I care as much about a site loading fast as about it making sense at first glance.',
    ],
    photoAlt: 'Portrait of Matias Arriete',
  },

  skills: {
    eyebrow: 'Skills',
    title: 'What I work with',
    description:
      "This is the actual level I'm at with each tool today. Not an inflated list: it's what I've really used.",
    levelLabels: {
      high: 'Advanced',
      mid: 'Intermediate',
      low: 'Getting started',
    },
    levelAriaSuffix: 'out of 100',
    showLevel: 'Show level',
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