import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // With a custom domain on GitHub Pages we can serve from the root path
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
