import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3005,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://ai-dashmind-backend.vercel.app'
          : 'http://localhost:5005',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
}); 