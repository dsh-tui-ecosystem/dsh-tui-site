import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const rootDir = process.cwd()
const distDir = path.join(rootDir, 'dist')
const ssrDir = path.join(rootDir, '.ssr')
const indexPath = path.join(distDir, 'index.html')
const entryUrl = pathToFileURL(path.join(ssrDir, 'entry-server.js')).href

const [{ render, SEO_ROUTES, GUIDE_PAGES }, template] = await Promise.all([
  import(entryUrl),
  readFile(indexPath, 'utf8'),
])

const configuredSiteUrl = process.env.SITE_URL?.trim()
let siteUrl
if (configuredSiteUrl) {
  siteUrl = new URL(configuredSiteUrl)
  siteUrl.hash = ''
  siteUrl.search = ''
  if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/'
}

function routeUrl(routePath) {
  if (!siteUrl) return undefined
  return new URL(routePath.replace(/^\//, ''), siteUrl).toString()
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function replaceMeta(html, selector, value) {
  const escaped = escapeHtml(value)
  const pattern = new RegExp(`(<meta ${selector} content=")[^"]*(" \\/>)`)
  return html.replace(pattern, `$1${escaped}$2`)
}

function assetPrefix(routePath) {
  const depth = routePath.split('/').filter(Boolean).length
  return depth === 0 ? './' : '../'.repeat(depth)
}

function structuredData(route) {
  const url = routeUrl(route.path)
  const website = {
    '@type': 'WebSite',
    name: 'dsh-TUI',
    inLanguage: route.locale,
    description: route.description,
    ...(siteUrl ? { url: siteUrl.toString() } : {}),
  }

  if (route.kind === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        website,
        {
          '@type': 'SoftwareApplication',
          name: 'dsh-TUI',
          alternateName: 'DeepSeek Harness Terminal Interface',
          applicationCategory: 'DeveloperApplication',
          applicationSubCategory: 'Terminal User Interface',
          operatingSystem: 'Windows, macOS, Linux',
          inLanguage: route.locale,
          description: route.description,
          softwareRequirements: 'Node.js ^22.19 or >=24; pnpm 10+; DeepSeek Harness',
          license: 'https://github.com/ccch1mneyyy/dsh-TUI/blob/main/LICENSE',
          downloadUrl: 'https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui',
          codeRepository: 'https://github.com/ccch1mneyyy/dsh-TUI',
          image: 'https://raw.githubusercontent.com/ccch1mneyyy/dsh-TUI/main/screenshots/social-preview.png',
          ...(url ? { url } : {}),
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      ],
    }
  }

  const guide = GUIDE_PAGES.find((page) => {
    const guideRoute = page.locale === 'en' ? `/en/${page.slug}/` : `/${page.slug}/`
    return guideRoute === route.path
  })
  const page = {
    '@type': 'TechArticle',
    headline: guide?.title ?? route.title,
    description: route.description,
    inLanguage: route.locale,
    isPartOf: { '@type': 'WebSite', name: 'dsh-TUI' },
    ...(url ? { url, mainEntityOfPage: url } : {}),
  }

  const graph = [website, page]
  if (guide?.slug === 'faq') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: guide.sections.map((section) => ({
        '@type': 'Question',
        name: section.heading,
        acceptedAnswer: {
          '@type': 'Answer',
          text: section.paragraphs?.join(' ') ?? '',
        },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

function outputPath(routePath) {
  if (routePath === '/') return indexPath
  return path.join(distDir, routePath.replace(/^\//, ''), 'index.html')
}

for (const route of SEO_ROUTES) {
  const prefix = assetPrefix(route.path)
  const canonicalUrl = routeUrl(route.path)
  const alternateUrl = routeUrl(route.alternatePath)
  const zhPath = route.locale === 'zh-CN' ? route.path : route.alternatePath
  const enPath = route.locale === 'en' ? route.path : route.alternatePath

  let html = template
    .replace(/<html lang="[^"]+" data-route="[^"]+">/, `<html lang="${route.locale}" data-route="${route.path}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`)
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${JSON.stringify(structuredData(route)).replaceAll('<', '\\u003c')}</script>`,
    )

  html = replaceMeta(html, 'name="description"', route.description)
  html = replaceMeta(html, 'property="og:locale"', route.locale === 'en' ? 'en_US' : 'zh_CN')
  html = replaceMeta(html, 'property="og:title"', route.title)
  html = replaceMeta(html, 'property="og:description"', route.description)
  html = replaceMeta(html, 'name="twitter:title"', route.title)
  html = replaceMeta(html, 'name="twitter:description"', route.description)

  if (canonicalUrl && alternateUrl) {
    const alternates = [
      `<link rel="alternate" hreflang="zh-CN" href="${routeUrl(zhPath)}" />`,
      `<link rel="alternate" hreflang="en" href="${routeUrl(enPath)}" />`,
      `<link rel="alternate" hreflang="x-default" href="${routeUrl(zhPath)}" />`,
    ].join('\n    ')
    html = html
      .replace('<!-- canonical -->', `<link rel="canonical" href="${canonicalUrl}" />`)
      .replace('<!-- alternates -->', alternates)
      .replace('<!-- og:url -->', `<meta property="og:url" content="${canonicalUrl}" />`)
  }

  if (prefix !== './') {
    html = html.replace(/(href|src)="\.\/(assets\/|fonts\/|favicon\.svg|site\.webmanifest)/g, `$1="${prefix}$2`)
  }

  const destination = outputPath(route.path)
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, html)
}

// 404.html 与其它路由不同：静态托管会把它当兜底页在**任意深度**的地址上返回
// （nginx try_files … /404.html、Cloudflare Pages 同理），而 URL 不变。
// 其它路由按自身深度改写成 ../ 前缀即可，兜底页不行 —— 它没有固定深度，
// 相对路径在 /en/bad-path/ 上会解析成 /en/bad-path/assets/…，样式和脚本
// 全部 404，只剩一张没有样式、也跑不了语言判断的裸 HTML。
// 所以这一份用根绝对路径。站点本就按根目录部署（/plugins/、/downloads/、
// /contact/*.png 都是绝对路径）。
const notFoundHtml = template
  .replace(/(href|src)="\.\/(assets\/|fonts\/|favicon\.svg|site\.webmanifest)/g, '$1="/$2')
  .replace('<html lang="zh-CN" data-route="/">', '<html lang="zh-CN" data-route="/404.html">')
  .replace(/<title>[^<]*<\/title>/, '<title>页面没有找到 | dsh-TUI</title>')
  .replace('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />', '<meta name="robots" content="noindex, nofollow" />')
  .replace('<div id="root"></div>', `<div id="root">${render('/404.html')}</div>`)
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')
await writeFile(path.join(distDir, '404.html'), notFoundHtml)

if (siteUrl) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${SEO_ROUTES.map((route) => `  <url>
    <loc>${routeUrl(route.path)}</loc>
    <xhtml:link rel="alternate" hreflang="${route.locale === 'en' ? 'en' : 'zh-CN'}" href="${routeUrl(route.path)}" />
    <xhtml:link rel="alternate" hreflang="${route.locale === 'en' ? 'zh-CN' : 'en'}" href="${routeUrl(route.alternatePath)}" />
  </url>`).join('\n')}
</urlset>
`
  await writeFile(path.join(distDir, 'sitemap.xml'), sitemap)

  const robotsPath = path.join(distDir, 'robots.txt')
  const robots = await readFile(robotsPath, 'utf8')
  await writeFile(robotsPath, `${robots.trim()}\n\nSitemap: ${new URL('sitemap.xml', siteUrl)}\n`)
}

await rm(ssrDir, { recursive: true, force: true })
