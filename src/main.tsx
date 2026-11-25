import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted variable fonts: no request to Google Fonts, no FOUT from a third party.
import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'

import './styles/tokens.css'
import './styles/global.css'

import { App } from './App'
import { LanguageProvider } from './i18n/LanguageProvider'
import { ThemeProvider } from './theme/ThemeProvider'

const container = document.getElementById('root')

if (container === null) {
  throw new Error('Cannot mount: no #root element found in index.html')
}

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)