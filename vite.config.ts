import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // Define 'process' globally to fix "process is not defined" errors
      'process': {
        env: {
          API_KEY: JSON.stringify(env.API_KEY),
          NODE_ENV: JSON.stringify(mode)
        },
        version: JSON.stringify(''),
        platform: JSON.stringify('browser')
      },
      // Also define process.env specifically for libs that access it directly
      'process.env': {
         API_KEY: JSON.stringify(env.API_KEY),
         NODE_ENV: JSON.stringify(mode)
      }
    }
  }
})