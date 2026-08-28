import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import fs from "node:fs"
import { inspectAttr } from 'kimi-plugin-inspect-react'

/**
 * 生产环境（nginx 的 try_files $uri $uri/、Cloudflare Pages）会把 /plugins/
 * 解析到 public/plugins/index.html，但 Vite dev 不做目录索引，请求会落进
 * SPA 回退拿到 index.html，最后被前端路由判成 404。这里只在 dev 补上，
 * 让本地行为和线上一致。
 */
function publicDirIndex(): Plugin {
  return {
    name: 'public-dir-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next: () => void) => {
        if (req.url) {
          const [pathname, query = ''] = req.url.split('?')
          const q = query ? `?${query}` : ''
          if (pathname === '/en/plugins' || pathname === '/en/plugins/') {
            req.url = '/plugins/index.html' + q
          } else if (pathname.endsWith('/')) {
            const file = path.resolve(__dirname, 'public', '.' + pathname, 'index.html')
            if (fs.existsSync(file)) req.url = pathname + 'index.html' + q
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  plugins: [command === 'serve' && inspectAttr(), command === 'serve' && publicDirIndex(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
