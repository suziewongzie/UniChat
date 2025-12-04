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
      // Prevents "process is not defined" error in the browser
      'process.env': {},
      // Explicitly inject the API key
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})