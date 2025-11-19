import { defineConfig } from 'slidev'

// PUBLIC_INTERFACE
export default defineConfig({
  /**
   * Prevent auto-opening a browser which fails in headless/container environments
   * (avoids: Error: spawn xdg-open ENOENT).
   */
  open: false,

  /**
   * Keep server defaults; vite.config.ts already binds to 0.0.0.0:3000.
   * Slidev will merge with Vite's dev server settings.
   */
})
