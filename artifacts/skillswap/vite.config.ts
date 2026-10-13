import { defineConfig } from 'vite';

const rawPort = process.env.PORT || '5173';
const port = Number(rawPort);
if (!Number.isFinite(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);
const basePath = process.env.BASE_PATH || '/Skill-Bridge/';

export default defineConfig({
  base: basePath,
  root: import.meta.dirname,
  build: { outDir: 'dist/public', emptyOutDir: true },
  server: { port, strictPort: true, host: '0.0.0.0', allowedHosts: true },
  preview: { port, host: '0.0.0.0', allowedHosts: true },
});
