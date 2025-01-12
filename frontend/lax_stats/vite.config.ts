import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        // Include the default workspace root rule
        searchForWorkspaceRoot(process.cwd()),
        // Add your custom path
        '/Users/jasonoh/lax_stats/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2',
      ],
    },
  },
})
