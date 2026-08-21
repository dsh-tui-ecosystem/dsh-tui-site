import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!
const routePath = import.meta.env.DEV
  ? window.location.pathname
  : document.documentElement.dataset.route || '/'
const app = (
  <StrictMode>
    <App path={routePath} />
  </StrictMode>
)

if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
