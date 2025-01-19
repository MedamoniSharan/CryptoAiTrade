import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Automatically open the app in the browser on `npm run dev`
    port: 5173, // Default Vite port
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude packages if necessary
  },
  build: {
    outDir: 'dist', // Ensure output directory for production builds
  },
  resolve: {
    alias: {
      // Optional: add custom aliases for paths, e.g., "@components"
    },
  },
});
