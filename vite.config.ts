import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Forward cookies properly for same-origin cookie handling
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Allow Set-Cookie headers to be forwarded through the proxy
            const setCookie = proxyRes.headers['set-cookie']
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map((c: string) =>
                c.replace(/; Secure/gi, '').replace(/; SameSite=None/gi, '; SameSite=Lax')
              )
            }
          })
        }
      }
    }
  }
})