import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // The third argument '' means load all env vars regardless of prefix (e.g. VITE_)
  // This captures Vercel's system env vars as well.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // Explicitly polyfill ONLY the API_KEY to avoid leaking other server-side env vars
      // and to prevent 'process is not defined' errors in the browser.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})