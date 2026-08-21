import { renderToString } from 'react-dom/server'
import App from './App'
export { SEO_ROUTES } from './seo/routes'
export { GUIDE_PAGES } from './content/guides'

export function render(path = '/') {
  return renderToString(<App path={path} />)
}
