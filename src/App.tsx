import Home from './pages/Home'
import EnglishHome from './pages/EnglishHome'
import GuidePage from './pages/GuidePage'
import { getGuidePage } from './content/guides'
import NotFound from './pages/NotFound'

export default function App({ path = '/' }: { path?: string }) {
  if (path === '/en/') return <EnglishHome />

  const guide = getGuidePage(path)
  if (guide) return <GuidePage page={guide} />

  if (path === '/') return <Home />

  // 其余一律 404。语言按路径前缀判断：/en/ 下的错误地址要给英文页，
  // 否则英文访客拿到的是读不懂的中文错误页，返回链还把他送去中文首页。
  const isEnglish = path === '/en' || path.startsWith('/en/')
  return <NotFound lang={isEnglish ? 'en' : 'zh'} />
}
