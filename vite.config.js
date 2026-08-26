import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        cert001: resolve(__dirname, 'cert-001.html'),
        cert002: resolve(__dirname, 'cert-002.html'),
        cert003: resolve(__dirname, 'cert-003.html'),
        cert004: resolve(__dirname, 'cert-004.html'),
        cert006: resolve(__dirname, 'cert-006.html'),
      },
    },
  },
})
