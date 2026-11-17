import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['gbandjo-logo-user.svg'],
      manifest: {
        name: 'Gbandjo',
        short_name: 'Gbandjo',
        description: 'Sauvez les invendus près de chez vous',
        theme_color: '#00843D',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'fr',
        icons: [
          {
            src: '/gbandjo-logo-user.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})