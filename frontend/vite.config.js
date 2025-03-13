import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['redux-thunk'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.137.1:3001',
        changeOrigin: true,
        secure: false,
        ws: false
      },
    },
  }
});