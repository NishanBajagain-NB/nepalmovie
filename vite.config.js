import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://172.237.44.29:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          swiper: ['swiper']
        }
      }
    }
  },
  define: {
    // Define environment variables for build time
    __BACKEND_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || 'http://172.237.44.29:5000/api')
  }
})
