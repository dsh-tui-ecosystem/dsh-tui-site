import Home from './pages/Home'
import EnglishHome from './pages/EnglishHome'
import GuidePage from './pages/GuidePage'
import { getGuidePage } from './content/guides'
import NotFound from './pages/NotFound'
import type { ComponentType } from 'react'
import type { Lang } from './i18n'
import { petsRouteLang } from './lib/petsRoute'

interface Props {
  path?: string
  /**
   * 桌宠页带着三套精灵数据，单独拆成一个 chunk，不进首页的主包：
   * 客户端在 main.tsx 里按路由按需 import 后传进来，服务端渲染时静态传入。
   */
  PetsPage?: ComponentType<{ lang: Lang }>
}

export default function App({ path = '/', PetsPage }: Props) {
  if (path === '/en/') return <EnglishHome />

  const petsLang = petsRouteLang(path)
  if (petsLang && PetsPage) return <PetsPage lang={petsLang} />

  const guide = getGuidePage(path)
  if (guide) return <GuidePage page={guide} />

  if (path === '/') return <Home />

  // 其余一律 404。语言按路径前缀判断：/en/ 下的错误地址要给英文页，
  // 否则英文访客拿到的是读不懂的中文错误页，返回链还把他送去中文首页。
  const isEnglish = path === '/en' || path.startsWith('/en/')
  return <NotFound lang={isEnglish ? 'en' : 'zh'} />
}
