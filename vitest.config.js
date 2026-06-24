import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: [],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/main.jsx',
        'src/constants.js',
        'src/config/**',
        'src/styles/**',
        'src/utils/performance.js',
        'src/utils/accessibility.js'
      ]
    }
  }
});