import Home from './pages/Home'
import EnglishHome from './pages/EnglishHome'
import GuidePage from './pages/GuidePage'
import { getGuidePage } from './content/guides'
import NotFound from './pages/NotFound'

export default function App({ path = '/' }: { path?: string }) {
  if (path === '/en/') return <EnglishHome />
  if (path === '/404.html') return <NotFound />

  const guide = getGuidePage(path)
  if (guide) return <GuidePage page={guide} />

  return path === '/' ? <Home /> : <NotFound />
}
