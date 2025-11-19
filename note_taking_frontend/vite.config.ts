import { defineConfig } from 'vite'

/**
 * Dev server configuration:
 * - Bind to 0.0.0.0 so the preview system can access it.
 * - Respect VITE_PORT if provided; default to 3001 to avoid common conflicts on 3000.
 * - Do not force a strict port; allow Vite to pick the next free port if the chosen one is occupied.
 * - Do not auto-open the browser (Slidev can inherit this from Vite when running via CLI).
 */
const envPort = Number(process.env.VITE_PORT)
const PORT = Number.isFinite(envPort) && envPort > 0 ? envPort : 3001

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: PORT,
    strictPort: false, // if PORT is taken, choose the next available
    open: false,
    allowedHosts: ['.kavia.ai'],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watch: {
      usePolling: true,
    },
  },
})
