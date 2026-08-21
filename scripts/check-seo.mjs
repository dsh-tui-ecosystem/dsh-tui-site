import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const expectedRoutes = [
  '/', '/en/',
  '/getting-started/', '/features/', '/commands/', '/shortcuts/', '/architecture/', '/faq/',
  '/en/getting-started/', '/en/features/', '/en/commands/', '/en/shortcuts/', '/en/architecture/', '/en/faq/',
]

const failures = []
const titles = new Map()

function routeFile(route) {
  return route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route.slice(1), 'index.html')
}

function record(condition, message) {
  if (!condition) failures.push(message)
}

for (const route of expectedRoutes) {
  const file = routeFile(route)
  let html
  try {
    html = await readFile(file, 'utf8')
  } catch {
    failures.push(`${route}: missing prerendered HTML`)
    continue
  }

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1]
  const h1Count = (html.match(/<h1\b/g) ?? []).length
  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]

  record(Boolean(title && title.length >= 15 && title.length <= 75), `${route}: invalid title`)
  const minimumDescriptionLength = route.startsWith('/en/') ? 50 : 25
  record(Boolean(description && description.length >= minimumDescriptionLength && description.length <= 180), `${route}: invalid description`)
  record(h1Count === 1, `${route}: expected exactly one h1, found ${h1Count}`)
  record(html.includes(`<html lang="${route.startsWith('/en/') ? 'en' : 'zh-CN'}" data-route="${route}">`), `${route}: lang or route marker mismatch`)
  record(/<div id="root"><.+<\/div>/.test(html), `${route}: root was not prerendered`)
  record(!html.includes('fonts.googleapis.com'), `${route}: third-party font stylesheet remains`)
  record(Boolean(jsonLd), `${route}: JSON-LD missing`)

  if (jsonLd) {
    try { JSON.parse(jsonLd) } catch { failures.push(`${route}: JSON-LD is invalid JSON`) }
  }

  if (title) {
    const previous = titles.get(title)
    record(!previous, `${route}: duplicate title also used by ${previous}`)
    titles.set(title, route)
  }

  if (process.env.SITE_URL) {
    record(/<link rel="canonical" href="https?:\/\//.test(html), `${route}: absolute canonical missing`)
    record((html.match(/rel="alternate" hreflang=/g) ?? []).length === 3, `${route}: hreflang set incomplete`)
    record(/<meta property="og:url" content="https?:\/\//.test(html), `${route}: og:url missing`)
  }
}

const rootHtml = await readFile(routeFile('/'), 'utf8')
const localAssetRefs = [...rootHtml.matchAll(/(?:src|href)="(\.\/(?:fonts|shots)\/[^" ]+)/g)].map((match) => match[1])
for (const reference of localAssetRefs) {
  try { await access(path.resolve(distDir, reference)) } catch { failures.push(`missing asset: ${reference}`) }
}

const pictureCount = (rootHtml.match(/<picture>/g) ?? []).length
record(pictureCount >= 3, `expected responsive pictures, found ${pictureCount}`)
record(rootHtml.includes('image/avif') && rootHtml.includes('image/webp'), 'modern image sources missing')

const files = await readdir(distDir)
record(files.includes('404.html'), '404.html missing')
const notFound = await readFile(path.join(distDir, '404.html'), 'utf8')
record(notFound.includes('noindex, nofollow'), '404 page must be noindex')

if (process.env.SITE_URL) {
  record(files.includes('sitemap.xml'), 'sitemap.xml missing for SITE_URL build')
}

if (failures.length) {
  console.error(`SEO checks failed (${failures.length}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`SEO checks passed: ${expectedRoutes.length} routes, ${titles.size} unique titles, ${pictureCount} responsive pictures.`)
