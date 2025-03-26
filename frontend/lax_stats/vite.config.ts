import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()], // React plugin should be used here
  server: {
    fs: {
      allow: [
        // Allow access to workspace root
        process.cwd(),
        // Allow access to bootstrap icons
        '/Users/jasonoh/lax_stats/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2',
      ],
    },
  },
  define: {
    global: 'window',
  },
});
