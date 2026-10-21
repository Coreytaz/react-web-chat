import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.DEV_BACKEND_URL || 'http://localhost:5000'
  return {
    plugins: [react(), svgr()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          cookieDomainRewrite: '',
          configure(proxy) {
            proxy.on('proxyRes', (response) => {
              const cookies = response.headers['set-cookie']
              if (cookies)
                response.headers['set-cookie'] = cookies.map((cookie) =>
                  cookie.replace(/;\s*Secure/gi, '')
                )
            })
          }
        },
        '/socket.io': { target, ws: true, changeOrigin: true }
      }
    }
  }
})
