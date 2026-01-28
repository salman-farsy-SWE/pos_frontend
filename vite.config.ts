import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api/v1': {
        target: 'https://posbackend-production-0f4a.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
