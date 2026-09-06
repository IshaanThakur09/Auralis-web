import { resolve } from 'path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const mpaPlugin: () => Plugin = () => ({
  name: 'mpa-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0];
      if (url === '/privacy' || url === '/privacy/') {
        req.url = '/privacy/index.html';
      } else if (url === '/terms' || url === '/terms/') {
        req.url = '/terms/index.html';
      } else if (url?.endsWith('.apk')) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.setHeader('Content-Disposition', 'attachment; filename="Auralis-v1.0.0-universal.apk"');
      }
      next();
    });
  },
});

export default defineConfig({
  appType: 'mpa',
  plugins: [react(), tailwindcss(), mpaPlugin()],
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
    },
  },
  server: {
    watch: {
      ignored: ['**/temp_unzip/**'],
    },
  },
  build: {
    target: 'es2022',
    cssTarget: 'chrome90',
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        privacy: resolve(process.cwd(), 'privacy/index.html'),
        terms: resolve(process.cwd(), 'terms/index.html'),
      },
    },
  },
});
