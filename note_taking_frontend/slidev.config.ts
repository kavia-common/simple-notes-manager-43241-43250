import { defineConfig } from 'slidev'

// PUBLIC_INTERFACE
export default defineConfig({
  /**
   * Prevent auto-opening a browser which fails in headless/container environments
   * (avoids: Error: spawn xdg-open ENOENT).
   */
  open: false,

  /**
   * Use environment-provided port (VITE_PORT) or default to 3001.
   * Slidev merges this with Vite's dev server settings from vite.config.ts.
   */
  server: {
    // reading env here covers cases where Slidev doesn't fully merge vite.config before parsing
    port: Number.isFinite(Number(process.env.VITE_PORT)) ? Number(process.env.VITE_PORT) : 3001,
    host: '0.0.0.0',
    strictPort: false, // allow fallback to next free port
  },
})
