import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',               // rutas relativas: funciona en subdirectorio de GitHub Pages
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist', assetsDir: 'assets/app' },
})
