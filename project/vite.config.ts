import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'tensorflow': ['@tensorflow/tfjs'],
          'use': ['@tensorflow-models/universal-sentence-encoder'],
          'vendor': ['react', 'react-dom', 'react-hot-toast', 'lucide-react']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api/news/trending': {
        target: 'https://newsapi.org/v2/top-headlines',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news\/trending/, ''),
        headers: {
          'X-Api-Key': process.env.VITE_NEWS_API_KEY || '',
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-Api-Key', process.env.VITE_NEWS_API_KEY || '');
          });
        },
      },
    },
  },
});