import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(),],
  server: {
    fs: {
      allow: [
        // Include the default workspace root rule
        searchForWorkspaceRoot(process.cwd()),
        '/Users/jasonoh/lax_stats/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2',
      ],
    },
  },
  define: {
    global: 'window' // Fixes "global is not defined" issue
  }
});
