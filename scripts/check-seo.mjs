import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const expectedRoutes = [
  '/', '/en/',
  '/getting-started/', '/features/', '/commands/', '/shortcuts/', '/architecture/', '/faq/',
  '/en/getting-started/', '/en/features/', '/en/commands/', '/en/shortcuts/', '/en/architecture/', '/en/faq/',
]
const DEFAULT_SITE_URL = 'https://dshtui.com/'
const siteUrl = new URL(process.env.SITE_URL?.trim() || DEFAULT_SITE_URL)
siteUrl.hash = ''
siteUrl.search = ''
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/'

const failures = []
const titles = new Map()

function routeFile(route) {
  return route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route.slice(1), 'index.html')
}

function routeUrl(route) {
  return new URL(route.replace(/^\//, ''), siteUrl).toString()
}

function record(condition, message) {
  if (!condition) failures.push(message)
}

function metaValue(html, attribute, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html.match(new RegExp(`<meta\\s+${attribute}="${escapedKey}"\\s+content="([^"]*)"`, 'i'))?.[1]
}

function canonicalValue(html) {
  return html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]
}

function jsonLdValue(html) {
  const source = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
  if (!source) return undefined
  try {
    return JSON.parse(source)
  } catch {
    return null
  }
}

function graphTypes(data) {
  if (!data || !Array.isArray(data['@graph'])) return new Set()
  const types = data['@graph'].flatMap((node) => Array.isArray(node['@type']) ? node['@type'] : [node['@type']])
  return new Set(types.filter(Boolean))
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
  const description = metaValue(html, 'name', 'description')
  const keywords = metaValue(html, 'name', 'keywords')?.toLowerCase() ?? ''
  const h1Count = (html.match(/<h1\b/g) ?? []).length
  const jsonLd = jsonLdValue(html)
  const types = graphTypes(jsonLd)
  const isEnglish = route.startsWith('/en/')
  const isGuide = !['/', '/en/'].includes(route)

  record(Boolean(title && title.length >= 15 && title.length <= 75), `${route}: invalid title`)
  const minimumDescriptionLength = isEnglish ? 50 : 25
  record(Boolean(description && description.length >= minimumDescriptionLength && description.length <= 180), `${route}: invalid description`)
  record(h1Count === 1, `${route}: expected exactly one h1, found ${h1Count}`)
  record(html.includes(`<html lang="${isEnglish ? 'en' : 'zh-CN'}" data-route="${route}">`), `${route}: lang or route marker mismatch`)
  record(/<div id="root"><.+<\/div>/.test(html), `${route}: root was not prerendered`)
  record(!/(?:fonts\.googleapis\.com|fonts\.loli\.net)/.test(html), `${route}: third-party font stylesheet remains`)
  record(canonicalValue(html) === routeUrl(route), `${route}: canonical mismatch`)
  record((html.match(/rel="alternate" hreflang=/g) ?? []).length === 3, `${route}: hreflang set incomplete`)
  record(metaValue(html, 'property', 'og:url') === routeUrl(route), `${route}: og:url mismatch`)
  record(metaValue(html, 'property', 'og:type') === (isGuide ? 'article' : 'website'), `${route}: og:type mismatch`)
  record(['dshtui', 'dsh-tui', 'dsh'].every((term) => keywords.includes(term)), `${route}: brand keyword set incomplete`)
  record(Boolean(jsonLd), `${route}: JSON-LD missing or invalid`)

  if (jsonLd) {
    if (route === '/') {
      record(types.has('WebSite'), '/: WebSite structured data missing')
      const website = jsonLd['@graph'].find((node) => node['@type'] === 'WebSite')
      const aliases = Array.isArray(website?.alternateName) ? website.alternateName.map((item) => item.toLowerCase()) : []
      record(['dshtui', 'dsh-tui', 'dsh tui'].every((alias) => aliases.includes(alias)), '/: WebSite alternateName is incomplete')
    }
    if (!isGuide) {
      record(types.has('SoftwareApplication'), `${route}: SoftwareApplication structured data missing`)
      record(types.has('SoftwareSourceCode'), `${route}: SoftwareSourceCode structured data missing`)
      record(!types.has('FAQPage'), `${route}: homepage must not emit deprecated FAQPage`)
    } else {
      record(types.has('WebPage'), `${route}: WebPage structured data missing`)
      record(types.has('TechArticle'), `${route}: TechArticle structured data missing`)
      record(types.has('BreadcrumbList'), `${route}: BreadcrumbList structured data missing`)
      record(html.includes('aria-label="Breadcrumb"') || html.includes('aria-label="面包屑导航"'), `${route}: visible breadcrumb missing`)
      if (route.endsWith('/faq/')) record(types.has('FAQPage'), `${route}: FAQPage structured data missing`)
    }
  }

  if (title) {
    const previous = titles.get(title)
    record(!previous, `${route}: duplicate title also used by ${previous}`)
    titles.set(title, route)
  }
}

const rootHtml = await readFile(routeFile('/'), 'utf8')
record(rootHtml.includes('项目名写作 dsh-TUI'), '/: visible brand-name explanation missing')
record(rootHtml.includes('DSHTUI、dsh-tui、DSH TUI'), '/: alias FAQ missing')
for (const term of ['DSHTUI', 'dsh-tui', 'DeepSeek Harness', 'DSH']) {
  record(rootHtml.includes(term), `/: visible or semantic coverage missing for ${term}`)
}

const localAssetRefs = [...rootHtml.matchAll(/(?:src|href)="(\.\/(?:assets|fonts|shots)\/[^" ]+)/g)].map((match) => match[1])
for (const reference of localAssetRefs) {
  try {
    await access(path.resolve(distDir, reference))
  } catch {
    failures.push(`missing asset: ${reference}`)
  }
}

const pictureCount = (rootHtml.match(/<picture>/g) ?? []).length
record(pictureCount >= 3, `expected responsive pictures, found ${pictureCount}`)
record(rootHtml.includes('image/avif') && rootHtml.includes('image/webp'), 'modern image sources missing')

const notFound = await readFile(path.join(distDir, '404.html'), 'utf8')
record(notFound.includes('noindex, nofollow'), '404 page must be noindex')
record(!canonicalValue(notFound), '404 page must not declare a canonical URL')

const pluginFile = path.join(distDir, 'plugins', 'index.html')
const [pluginHtml, pluginDataSource] = await Promise.all([
  readFile(pluginFile, 'utf8'),
  readFile(path.join(distDir, 'plugins', 'plugins.json'), 'utf8'),
])
const pluginData = JSON.parse(pluginDataSource)
const pluginJsonLd = jsonLdValue(pluginHtml)
const pluginTypes = graphTypes(pluginJsonLd)
const pluginTitle = pluginHtml.match(/<title>([^<]+)<\/title>/)?.[1]
const pluginDescription = metaValue(pluginHtml, 'name', 'description')
const pluginKeywords = metaValue(pluginHtml, 'name', 'keywords')?.toLowerCase() ?? ''
const pluginCssHref = pluginHtml.match(/<link rel="stylesheet" href="([^"]+)"/i)?.[1]

record(Boolean(pluginTitle && pluginTitle.length >= 15 && pluginTitle.length <= 75), '/plugins/: invalid title')
record(Boolean(pluginDescription && pluginDescription.length >= 25 && pluginDescription.length <= 180), '/plugins/: invalid description')
record((pluginHtml.match(/<h1\b/g) ?? []).length === 1, '/plugins/: expected exactly one h1')
record(canonicalValue(pluginHtml) === routeUrl('/plugins/'), '/plugins/: canonical mismatch')
record(metaValue(pluginHtml, 'property', 'og:url') === routeUrl('/plugins/'), '/plugins/: og:url mismatch')
record(['dshtui', 'dsh-tui', 'dsh'].every((term) => pluginKeywords.includes(term)), '/plugins/: brand keyword set incomplete')
record(!/(?:fonts\.googleapis\.com|fonts\.loli\.net)/.test(pluginHtml), '/plugins/: third-party font stylesheet remains')
record((pluginHtml.match(/data-prerendered="true"/g) ?? []).length === pluginData.plugins.length, '/plugins/: plugin list was not fully prerendered')
record(pluginTypes.has('CollectionPage'), '/plugins/: CollectionPage structured data missing')
record(pluginTypes.has('BreadcrumbList'), '/plugins/: BreadcrumbList structured data missing')
record(pluginTypes.has('ItemList'), '/plugins/: ItemList structured data missing')
const itemList = pluginJsonLd?.['@graph']?.find((node) => node['@type'] === 'ItemList')
record(itemList?.numberOfItems === pluginData.plugins.length, '/plugins/: ItemList count mismatch')
if (pluginCssHref) {
  try {
    await access(path.resolve(path.dirname(pluginFile), pluginCssHref))
  } catch {
    failures.push(`/plugins/: missing generated stylesheet ${pluginCssHref}`)
  }
} else {
  failures.push('/plugins/: stylesheet link missing')
}

const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8')
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
for (const route of [...expectedRoutes, '/plugins/']) {
  record(sitemapLocations.includes(routeUrl(route)), `sitemap: missing ${route}`)
}
record(sitemapLocations.length === expectedRoutes.length + 1, 'sitemap: unexpected or duplicate URLs')
record((sitemap.match(/hreflang="x-default"/g) ?? []).length === expectedRoutes.length, 'sitemap: x-default annotations incomplete')
record(!sitemap.includes('join.dshtui.com'), 'sitemap: cross-domain URL should not be listed')

const robots = await readFile(path.join(distDir, 'robots.txt'), 'utf8')
const sitemapDirectives = robots.match(/^Sitemap:\s*.+$/gim) ?? []
record(sitemapDirectives.length === 1, `robots.txt: expected one Sitemap directive, found ${sitemapDirectives.length}`)
record(sitemapDirectives[0]?.trim() === `Sitemap: ${routeUrl('/sitemap.xml')}`, 'robots.txt: Sitemap URL mismatch')

const manifest = JSON.parse(await readFile(path.join(distDir, 'site.webmanifest'), 'utf8'))
record(manifest.name.includes('DSHTUI'), 'web manifest: DSHTUI alias missing')
record(manifest.start_url === '/', 'web manifest: canonical start_url missing')

const llms = await readFile(path.join(distDir, 'llms.txt'), 'utf8')
for (const term of ['dsh-TUI', 'DSHTUI', 'dsh-tui', 'DSH TUI', 'DeepSeek Harness']) {
  record(llms.includes(term), `llms.txt: missing ${term}`)
}

if (failures.length) {
  console.error(`SEO checks failed (${failures.length}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`SEO checks passed: ${expectedRoutes.length + 1} indexable routes, ${titles.size} unique content titles, ${pluginData.plugins.length} prerendered plugins, ${pictureCount} responsive pictures.`)
