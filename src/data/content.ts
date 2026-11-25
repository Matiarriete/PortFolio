import type { Locale } from '../i18n/dictionaries'
import avatarDesktop from '../assets/media/perfil-600.webp'
import avatarMobile from '../assets/media/perfil-300.webp'
import avatarFallback from '../assets/media/perfil.jpeg'
import demoVideoMp4 from '../assets/media/proyecto-demo-720.mp4'
import demoVideoWebm from '../assets/media/proyecto-demo-720.webm'
import demoPoster from '../assets/media/proyecto-poster.webp'

/* ============================================================================
   Content model
   ========================================================================== */

export interface LocalizedText {
  es: string
  en: string
}

export const localize = (value: LocalizedText, locale: Locale): string => value[locale]

export interface AvatarSources {
  desktop: string
  mobile: string
  fallback: string
}

export interface SocialLink {
  id: 'github' | 'linkedin' | 'whatsapp' | 'email' | 'website'
  label: LocalizedText
  handle: string
  href: string
  /** Applied on hover/focus as an inline CSS custom property. */
  hoverColor: string
}

export interface SkillGroup {
  id: string
  label: LocalizedText
  skills: string[]
}

/** One dated entry shared by the work and education timelines. */
export interface TimelineEntry {
  id: string
  /** Human period as written on the CV, e.g. "2022 — Actualidad". */
  period: LocalizedText
  title: LocalizedText
  organisation: LocalizedText
  summary: LocalizedText
  stack?: string[]
  /** Current roles/degrees are badged instead of being listed first. */
  isOngoing?: boolean
}

export interface SpokenLanguage {
  id: string
  label: LocalizedText
  /** CEFR-style band shown as a tag, which reads better than a made-up percentage. */
  band: string
  isNative: boolean
}

export interface ProjectLink {
  kind: 'live' | 'repo'
  href: string
  label: LocalizedText
}

export interface ProjectMedia {
  mp4: string
  webm: string
  poster: string
}

export interface Project {
  id: string
  title: LocalizedText
  summary: LocalizedText
  highlights: LocalizedText[]
  stack: string[]
  links: ProjectLink[]
  /** Marks the newest work so it can be badged in the grid. */
  isLatest: boolean
  media: ProjectMedia
}

/* ============================================================================
   Data
   ========================================================================== */

export const profile = {
  name: 'Matias Arriete',
  role: {
    es: 'QA Tester · Automatización',
    en: 'QA Tester · Automation',
  } satisfies LocalizedText,
  location: {
    es: 'Sevilla, España',
    en: 'Seville, Spain',
  } satisfies LocalizedText,
  email: 'arrietematias@gmail.com',
  whatsappDisplay: '+34 611 228 127',
  whatsappHref: 'https://wa.me/34611228127',
  cvUrl: 'https://drive.google.com/file/d/1PdtMvIVxJ_td-ALDQxiHkjq-GRAT55IU/view?usp=sharing',
  avatar: {
    desktop: avatarDesktop,
    mobile: avatarMobile,
    fallback: avatarFallback,
  } satisfies AvatarSources,
} as const

export const navSections = [
  { id: 'inicio', labelKey: 'home' },
  { id: 'sobre-mi', labelKey: 'about' },
  { id: 'experiencia', labelKey: 'experience' },
  { id: 'formacion', labelKey: 'education' },
  { id: 'habilidades', labelKey: 'skills' },
  { id: 'proyectos', labelKey: 'projects' },
  { id: 'contacto', labelKey: 'contact' },
] as const

export const socials: readonly SocialLink[] = [
    {
    id: 'website',
    label: { es: 'Web personal', en: 'Website' },
    handle: 'matiasarriete.com',
    href: 'https://matiasarriete.com',
    hoverColor: '#1e4d3b',
  },
    {
    id: 'github',
    label: { es: 'GitHub', en: 'GitHub' },
    handle: '@Matiarriete',
    href: 'https://github.com/Matiarriete/',
    hoverColor: '#171717',
  },
  {
    id: 'linkedin',
    label: { es: 'LinkedIn', en: 'LinkedIn' },
    handle: '/in/matias-arriete',
    href: 'https://www.linkedin.com/in/matias-arriete-82686a161/',
    hoverColor: '#0a66c2',
  },
  {
    id: 'whatsapp',
    label: { es: 'WhatsApp', en: 'WhatsApp' },
    handle: '+34 611 228 127',
    href: 'https://wa.me/34611228127',
    hoverColor: '#25d366',
  },
{
      id: 'email',
      label: { es: 'Email', en: 'Email' },
      handle: 'arrietematias@gmail.com',
      href: 'mailto:arrietematias@gmail.com',
      hoverColor: '#c86b3c',
    },
    ]

/** "Áreas de experiencia" exactly as listed on the CV — no invented levels. */
export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'languages',
    label: { es: 'Lenguajes', en: 'Languages' },
    skills: ['Java', 'TypeScript', 'JavaScript', 'Python', 'C++'],
  },
  {
    id: 'frontend',
    label: { es: 'Front-End', en: 'Front-End' },
    skills: ['React', 'HTML', 'CSS'],
  },
  {
    id: 'backend',
    label: { es: 'Back-End y datos', en: 'Back-End & data' },
    skills: ['MySQL', 'Node.js', 'Google Apps Script'],
  },
  {
    id: 'testing',
    label: { es: 'Testing y QA', en: 'Testing & QA' },
    skills: ['Selenium', 'Playwright', 'TestNG', 'TestRail'],
  },
  {
    id: 'design',
    label: { es: 'Diseño y procesos', en: 'Design & process' },
    skills: ['UX Design', 'Agile'],
  },
]

export const experience: readonly TimelineEntry[] = [
  {
    id: 'solera-qa',
    period: { es: '2022 — Actualidad', en: '2022 — Present' },
    title: { es: 'QA Tester', en: 'QA Tester' },
    organisation: { es: 'Solera', en: 'Solera' },
    summary: {
      es: 'Automatización de pruebas de API y front-end.',
      en: 'Automation of API and front-end tests.',
    },
    stack: ['Java', 'Selenium', 'Git'],
    isOngoing: true,
  },
  {
    id: 'stellantis-fullstack',
    period: { es: '2021 — 2022', en: '2021 — 2022' },
    title: { es: 'Pasante — Fullstack Developer', en: 'Intern — Fullstack Developer' },
    organisation: { es: 'Stellantis', en: 'Stellantis' },
    summary: {
      es: 'Desarrollo de un portal industrial, con soporte técnico una vez desplegado.',
      en: 'Development of an industrial portal, including support once it went live.',
    },
    stack: ['Java', 'React', 'MySQL', 'JavaScript', 'Git'],
  },
]

export const education: readonly TimelineEntry[] = [
  {
    id: 'uoc-ingenieria',
    period: { es: '2026 — Actualidad', en: '2026 — Present' },
    title: { es: 'Ingeniería Informática', en: 'Computer Science' },
    organisation: { es: 'Universitat Oberta de Catalunya', en: 'Open University of Catalonia' },
    summary: {
      es: 'Grado en curso.',
      en: 'Degree in progress.',
    },
    isOngoing: true,
  },
  {
    id: 'jobii-fp-web',
    period: { es: '2023 — 2024', en: '2023 — 2024' },
    title: { es: 'Desarrollo de Aplicaciones Web', en: 'Web Application Development' },
    organisation: { es: 'FP Jobii School', en: 'FP Jobii School' },
    summary: {
      es: 'Ciclo formativo de grado medio en desarrollo web.',
      en: 'Vocational course in web development.',
    },
  },
  {
    id: 'solera-bootcamp',
    period: { es: '2022', en: '2022' },
    title: { es: 'Bootcamp Front-End, Back-End y Testing', en: 'Front-End, Back-End & Testing Bootcamp' },
    organisation: { es: 'Solera', en: 'Solera' },
    summary: {
      es: 'Bootcamp de desarrollo y testing.',
      en: 'Development and testing bootcamp.',
    },
  },
  {
    id: 'coderhouse-web',
    period: { es: '2022', en: '2022' },
    title: { es: 'Desarrollo Web', en: 'Web Development' },
    organisation: { es: 'CoderHouse', en: 'CoderHouse' },
    summary: {
      es: 'Curso de desarrollo web.',
      en: 'Web development course.',
    },
  },
  {
    id: 'iua-ingenieria-parcial',
    period: { es: '2017 — 2021', en: '2017 — 2021' },
    title: { es: 'Ingeniería Informática (parcial)', en: 'Computer Science (partial)' },
    organisation: { es: 'Instituto Universitario Aeronáutico', en: 'University Institute of Aeronautics' },
    summary: {
      es: 'Primeros cursos de la ingeniería, no completada.',
      en: 'First years of the degree, not completed.',
    },
  },
  {
    id: 'whitesuit-ghost',
    period: { es: '2020', en: '2020' },
    title: {
      es: 'Curso Ghost — Grey Hat Offensive Security Technician',
      en: 'Ghost Course — Grey Hat Offensive Security Technician',
    },
    organisation: { es: 'WhiteSuit Hacking', en: 'WhiteSuit Hacking' },
    summary: {
      es: 'Formación en seguridad ofensiva.',
      en: 'Offensive security training.',
    },
  },
  {
    id: 'cisco-cybersec',
    period: { es: '2020', en: '2020' },
    title: {
      es: 'Introducción a la Ciberseguridad',
      en: 'Introduction to Cybersecurity',
    },
    organisation: { es: 'Cisco Virtual Academy', en: 'Cisco Virtual Academy' },
    summary: {
      es: 'Curso introductorio de ciberseguridad.',
      en: 'Introductory cybersecurity course.',
    },
  },
  {
    id: 'nextu-soporte',
    period: { es: '2018', en: '2018' },
    title: {
      es: 'Soporte y Mantenimiento Técnico',
      en: 'Technical Support and Maintenance',
    },
    organisation: { es: 'Nextu', en: 'Nextu' },
    summary: {
      es: 'Certificación en soporte y mantenimiento técnico.',
      en: 'Certification in technical support and maintenance.',
    },
  },
  {
    id: 'nuevo-siglo-bachiller',
    period: { es: '2010 — 2016', en: '2010 — 2016' },
    title: { es: 'Bachiller en Humanidades', en: 'High School — Humanities' },
    organisation: { es: 'Centro Educativo Nuevo Siglo', en: 'Nuevo Siglo School' },
    summary: {
      es: 'Bachillerato en Humanidades.',
      en: 'High school diploma in Humanities.',
    },
  },
]

export const spokenLanguages: readonly SpokenLanguage[] = [
  {
    id: 'es',
    label: { es: 'Español', en: 'Spanish' },
    band: 'Nativo',
    isNative: true,
  },
  {
    id: 'en',
    label: { es: 'Inglés', en: 'English' },
    band: 'B1',
    isNative: false,
  },
]

export const projects: readonly Project[] = [
  {
    id: 'iglesia-tiempo-nuevo',
    title: {
      es: 'Sitio web Iglesia Tiempo Nuevo',
      en: 'Tiempo Nuevo Church Website',
    },
    summary: {
      es: 'Sitio institucional creado como proyecto final del curso de desarrollo web de CoderHouse. Diseñé la experiencia completa a partir de la información aportada por la iglesia: arquitectura de contenidos, interfaz y maquetación responsive.',
      en: 'Institutional website built as the final project of CoderHouse’s web development course. I designed the whole experience from the information the church provided: content architecture, interface and responsive layout.',
    },
    highlights: [
      { es: 'Arquitectura de contenidos', en: 'Content architecture' },
      { es: 'Diseño de interfaz', en: 'Interface design' },
      { es: 'Maquetación responsive', en: 'Responsive layout' },
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5'],
    links: [
      {
        kind: 'live',
        href: 'https://matiarriete.github.io/Pagina-Iglesia---Matias-Arriete/',
        label: { es: 'Ver sitio', en: 'Live site' },
      },
      {
        kind: 'repo',
        href: 'https://github.com/Matiarriete/Pagina-Iglesia---Matias-Arriete',
        label: { es: 'Ver código', en: 'Source code' },
      },
    ],
    isLatest: true,
    media: {
      mp4: demoVideoMp4,
      webm: demoVideoWebm,
      poster: demoPoster,
    },
  },
]