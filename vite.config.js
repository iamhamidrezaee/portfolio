import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import nosyHandler from './api/nosy.js'
import nosyEmailHandler from './api/nosy-email.js'

const localApiPlugin = () => ({
  name: 'local-api',
  configureServer(server) {
    server.middlewares.use('/api/nosy', (req, res) => {
      nosyHandler(req, res);
    });
    server.middlewares.use('/api/nosy-email', (req, res) => {
      nosyEmailHandler(req, res);
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
