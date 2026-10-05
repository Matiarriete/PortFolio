import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site is served from https://matiarriete.github.io/PortFolio/
// so every emitted asset URL must be prefixed with the subpath.
export default defineConfig({
  base: '/PortFolio/',
  plugins: [react()],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    reportCompressedSize: true,
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})