import { useI18n } from './i18n/context'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Experience } from './components/Experience'
import { Education } from './components/Education'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export function App() {
  const { dictionary } = useI18n()

  return (
    <>
      <a className="skip-link" href="#main">
        {dictionary.nav.skipToContent}
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Education />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  )
}