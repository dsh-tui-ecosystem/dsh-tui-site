import { StrictMode, type ComponentProps } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { petsRouteLang } from './lib/petsRoute'

const container = document.getElementById('root')!
const baked = document.documentElement.dataset.route || '/'

/**
 * 404.html 是静态托管返回的兜底页（nginx 的 try_files … /404.html、
 * Cloudflare Pages 同理）：它烘进去的 data-route 永远是 /404.html，
 * 而访客真正请求的地址只存在于 URL 里。要判断他在中文还是英文树下，
 * 必须取 location，否则 /en/ 下的错误地址会得到中文错误页。
 */
const isFallback = baked === '/404.html'
const routePath = import.meta.env.DEV || isFallback ? window.location.pathname : baked

function mount(PetsPage?: ComponentProps<typeof App>['PetsPage']) {
  const app = (
    <StrictMode>
      <App path={routePath} PetsPage={PetsPage} />
    </StrictMode>
  )

  // 兜底页走整页客户端渲染：预渲染出来的那份是中文，访客在 /en/ 下要换成英文，
  // hydrate 会撞上文本不匹配。其余路由的预渲染内容与客户端一致，照常 hydrate。
  if (container.hasChildNodes() && !isFallback) {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
}

// 桌宠页单独拆包：只有访问 /pets/ 与 /en/pets/ 时才下载它的代码和精灵数据，
// 其余页面照旧同步挂载。这里不用顶层 await —— 那会让 Rollup 为了避开循环等待
// 把共享模块拆成第三个 chunk，所有页面都要多一次请求。
if (petsRouteLang(routePath)) {
  void import('./pages/PetsPage').then((m) => mount(m.default))
} else {
  mount()
}
