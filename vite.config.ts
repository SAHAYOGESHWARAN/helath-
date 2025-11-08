import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
      },
      watch: {
        ignored: ['vite.config.ts', 'tsconfig.json'],
      },
    },
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
      'import.meta.env.VITE_EMR_API_URL': JSON.stringify(env.VITE_EMR_API_URL || ''),
      'import.meta.env.VITE_EMR_API_KEY': JSON.stringify(env.VITE_EMR_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
      },
    },
  };
});
