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
  id: 'github' | 'linkedin' | 'whatsapp' | 'email'
  label: LocalizedText
  handle: string
  href: string
  /** Applied on hover/focus as an inline CSS custom property. */
  hoverColor: string
}

export interface Skill {
  name: string
  /** Self-assessed proficiency, 0-100. Rendered as width + aria-valuenow. */
  level: number
}

export interface SkillGroup {
  id: string
  label: LocalizedText
  skills: Skill[]
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

export const SITE_URL = 'https://matiarriete.github.io/PortFolio/'

export const profile = {
  name: 'Matias Arriete',
  role: {
    es: 'Diseñador y desarrollador Front-End',
    en: 'Front-End Designer & Developer',
  } satisfies LocalizedText,
  location: {
    es: 'España',
    en: 'Spain',
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
  { id: 'proyectos', labelKey: 'projects' },
  { id: 'contacto', labelKey: 'contact' },
] as const

export const socials: readonly SocialLink[] = [
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

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'frontend',
    label: { es: 'Front-End', en: 'Front-End' },
    skills: [
      { name: 'HTML', level: 70 },
      { name: 'JavaScript', level: 70 },
      { name: 'CSS', level: 60 },
      { name: 'React', level: 45 },
    ],
  },
  {
    id: 'backend',
    label: { es: 'Back-End y datos', en: 'Back-End & data' },
    skills: [
      { name: 'Java', level: 70 },
      { name: 'MySQL', level: 60 },
      { name: 'Node.js', level: 25 },
      { name: 'C++', level: 25 },
    ],
  },
  {
    id: 'design',
    label: { es: 'Diseño', en: 'Design' },
    skills: [{ name: 'UX Design', level: 70 }],
  },
  {
    id: 'testing',
    label: { es: 'Testing', en: 'Testing' },
    skills: [
      { name: 'Automation Testing', level: 70 },
      { name: 'Manual Testing', level: 70 },
    ],
  },
  {
    id: 'tools',
    label: { es: 'Herramientas', en: 'Tools' },
    skills: [{ name: 'Google Apps Script', level: 25 }],
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
    band: 'C1',
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