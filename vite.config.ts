import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Proxy API calls to the GenAI server during development
        proxy: {
          '/api': {
            target: 'http://localhost:4000',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, '/api')
          }
        },
        watch: {
          ignored: ['vite.config.ts', 'vite.config.mts'],
        },
      },
      plugins: [react()],
      define: {
        'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
        'process.env.VITE_EMR_API_URL': JSON.stringify(env.VITE_EMR_API_URL || ''),
        'process.env.VITE_EMR_API_KEY': JSON.stringify(env.VITE_EMR_API_KEY || ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
        }
      }
    };
});