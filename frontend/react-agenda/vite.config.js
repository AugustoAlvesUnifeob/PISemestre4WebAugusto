import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    outDir:'../assets/js/agenda-build',
    rollupOptions:{
      output:{
        entryFileNames: 'agenda.js',
        assetFileNames:'agenda.[ext]'
      }
    }
  }
})
