import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Enable global test functions (describe, it, expect)
    globals: true,
    // Use happy-dom for DOM testing (faster than jsdom)
    environment: 'happy-dom',
    // Setup files for extended matchers
    setupFiles: ['./tests/setup.js'],
  },
})
