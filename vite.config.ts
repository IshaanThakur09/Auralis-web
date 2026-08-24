import { resolve } from 'path';
import { defineConfig, Plugin } from 'vite';

const mpaDevPlugin: () => Plugin = () => ({
  name: 'mpa-dev-router',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url?.split('?')[0];
      if (url === '/privacy' || url === '/privacy/') {
        req.url = '/privacy/index.html';
      } else if (url === '/terms' || url === '/terms/') {
        req.url = '/terms/index.html';
      }
      next();
    });
  },
});

export default defineConfig({
  appType: 'mpa',
  plugins: [mpaDevPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
      },
    },
  },
});

