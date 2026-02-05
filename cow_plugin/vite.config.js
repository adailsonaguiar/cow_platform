import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Substitui referências a `process.env` em tempo de build
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({ NODE_ENV: 'production' })
  },
  plugins: [react()],
  build: {
    outDir: '../',
    emptyOutDir: false,
    lib: {
      entry: '/src/plugin-entry.jsx',
      name: 'DexxPlugin',
      formats: ['iife'],
      fileName: () => 'plugin.js'
    },
    // não externalizar dependências para produzir um único arquivo standalone
    rollupOptions: {
    }
  }
})