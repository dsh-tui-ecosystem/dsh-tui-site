import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
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

const DEFAULT_SITE_URL = 'https://dshtui.com/'
const configuredSiteUrl = process.env.SITE_URL?.trim() || DEFAULT_SITE_URL
const siteUrl = new URL(configuredSiteUrl)
siteUrl.hash = ''
siteUrl.search = ''
if (!['http:', 'https:'].includes(siteUrl.protocol)) {
  throw new Error('SITE_URL must use http or https')
}
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/'

const REPOSITORY_URL = 'https://github.com/ccch1mneyyy/dsh-TUI'
const ECOSYSTEM_URL = 'https://github.com/dsh-tui-ecosystem'
const NPM_URL = 'https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui'
const BRAND_ALIASES = ['DSHTUI', 'dsh-tui', 'DSH TUI', 'DeepSeek Harness Terminal Interface']
const BRAND_KEYWORDS = ['dsh-TUI', 'DSHTUI', 'dsh-tui', 'DSH TUI', 'DSH', 'DeepSeek Harness', 'DeepSeek Harness TUI']

function routeUrl(routePath) {
  return new URL(routePath.replace(/^\//, ''), siteUrl).toString()
}

function entityUrl(fragment) {
  return new URL(fragment, siteUrl).toString()
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeXml(value) {
  return escapeHtml(value).replaceAll("'", '&apos;')
}

function replaceMeta(html, selector, value) {
  const escaped = escapeHtml(value)
  const pattern = new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*("\\s*\\/?>)`, 'i')
  return html.replace(pattern, `$1${escaped}$2`)
}

function assetPrefix(routePath) {
  const depth = routePath.split('/').filter(Boolean).length
  return depth === 0 ? './' : '../'.repeat(depth)
}

function verificationMarkup() {
  const providers = [
    ['GOOGLE_SITE_VERIFICATION', 'google-site-verification'],
    ['BING_SITE_VERIFICATION', 'msvalidate.01'],
    ['BAIDU_SITE_VERIFICATION', 'baidu-site-verification'],
  ]

  return providers
    .map(([environmentName, metaName]) => {
      const token = process.env[environmentName]?.trim()
      return token ? `<meta name="${metaName}" content="${escapeHtml(token)}" />` : ''
    })
    .filter(Boolean)
    .join('\n    ')
}

function projectNode() {
  return {
    '@type': 'Organization',
    '@id': entityUrl('#project'),
    name: 'dsh-TUI Community',
    alternateName: ['DSHTUI Community', 'dsh-tui-ecosystem'],
    url: siteUrl.toString(),
    logo: {
      '@type': 'ImageObject',
      url: routeUrl('/whale-girl.png'),
      width: 200,
      height: 200,
    },
    sameAs: [REPOSITORY_URL, ECOSYSTEM_URL],
  }
}

function websiteNode(description) {
  return {
    '@type': 'WebSite',
    '@id': entityUrl('#website'),
    url: siteUrl.toString(),
    name: 'dsh-TUI',
    alternateName: [...BRAND_ALIASES, siteUrl.hostname.toLowerCase()],
    description,
    inLanguage: ['zh-CN', 'en'],
    publisher: { '@id': entityUrl('#project') },
  }
}

function softwareNode(route) {
  return {
    '@type': 'SoftwareApplication',
    '@id': entityUrl('#software'),
    name: 'dsh-TUI',
    alternateName: BRAND_ALIASES,
    url: siteUrl.toString(),
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Terminal User Interface',
    applicationSuite: 'DeepSeek Harness (DSH)',
    operatingSystem: 'Windows, macOS, Linux',
    inLanguage: route.locale,
    description: route.description,
    softwareRequirements: 'Node.js ^22.19 or >=24; pnpm 10+; DeepSeek Harness',
    license: `${REPOSITORY_URL}/blob/main/LICENSE`,
    downloadUrl: NPM_URL,
    installUrl: NPM_URL,
    codeRepository: REPOSITORY_URL,
    image: routeUrl('/shots/splash.png'),
    keywords: BRAND_KEYWORDS,
    isAccessibleForFree: true,
    publisher: { '@id': entityUrl('#project') },
    sameAs: [REPOSITORY_URL, NPM_URL],
    featureList: [
      'Streamed Markdown',
      'Observable agent status',
      'Session rewind and resume',
      'Context usage and TPS metrics',
      'Terminal-native interaction',
    ],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}

function sourceCodeNode() {
  return {
    '@type': 'SoftwareSourceCode',
    '@id': entityUrl('#source-code'),
    name: 'dsh-TUI source code',
    alternateName: ['DSHTUI source', 'dsh-tui source'],
    url: REPOSITORY_URL,
    codeRepository: REPOSITORY_URL,
    programmingLanguage: ['TypeScript', 'JavaScript'],
    runtimePlatform: 'Node.js',
    license: `${REPOSITORY_URL}/blob/main/LICENSE`,
    author: { '@id': entityUrl('#project') },
    targetProduct: { '@id': entityUrl('#software') },
  }
}

function faqNode(route, items) {
  return {
    '@type': 'FAQPage',
    '@id': `${routeUrl(route.path)}#faq`,
    url: routeUrl(route.path),
    inLanguage: route.locale,
    isPartOf: { '@id': entityUrl('#website') },
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

function breadcrumbNode(route, currentName) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${routeUrl(route.path)}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: route.locale === 'en' ? 'Home' : '首页',
        item: route.locale === 'en' ? routeUrl('/en/') : siteUrl.toString(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: currentName,
        item: routeUrl(route.path),
      },
    ],
  }
}

function webPageNode(route, pageType = 'WebPage') {
  return {
    '@type': pageType,
    '@id': `${routeUrl(route.path)}#webpage`,
    url: routeUrl(route.path),
    name: route.title,
    description: route.description,
    inLanguage: route.locale,
    isPartOf: { '@id': entityUrl('#website') },
  }
}

function structuredData(route) {
  const graph = []

  if (route.path === '/') {
    graph.push(projectNode(), websiteNode(route.description))
  } else if (route.kind === 'home') {
    graph.push(projectNode(), webPageNode(route))
  }

  if (route.kind === 'home') {
    // FAQPage rich results were removed by Google in May 2026.
    // Keep visible FAQ on the homepage; emit FAQPage only on /faq/.
    graph.push(softwareNode(route), sourceCodeNode())
    return { '@context': 'https://schema.org', '@graph': graph }
  }

  const guide = GUIDE_PAGES.find((page) => {
    const guideRoute = page.locale === 'en' ? `/en/${page.slug}/` : `/${page.slug}/`
    return guideRoute === route.path
  })

  graph.push(
    webPageNode(route),
    {
      '@type': 'TechArticle',
      '@id': `${routeUrl(route.path)}#article`,
      headline: guide?.title ?? route.title,
      description: route.description,
      inLanguage: route.locale,
      mainEntityOfPage: { '@id': `${routeUrl(route.path)}#webpage` },
      isPartOf: { '@id': entityUrl('#website') },
      author: { '@id': entityUrl('#project') },
      publisher: { '@id': entityUrl('#project') },
    },
    breadcrumbNode(route, guide?.navTitle ?? route.title),
  )

  if (guide?.slug === 'faq') {
    graph.push(faqNode(route, guide.sections.map((section) => ({
      question: section.heading,
      answer: section.paragraphs?.join(' ') ?? '',
    }))))
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
  const zhPath = route.locale === 'zh-CN' ? route.path : route.alternatePath
  const enPath = route.locale === 'en' ? route.path : route.alternatePath
  const alternates = [
    `<link rel="alternate" hreflang="zh-CN" href="${routeUrl(zhPath)}" />`,
    `<link rel="alternate" hreflang="en" href="${routeUrl(enPath)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${routeUrl(zhPath)}" />`,
  ].join('\n    ')

  let html = template
    .replace(/<html lang="[^"]+" data-route="[^"]+">/, `<html lang="${route.locale}" data-route="${route.path}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`)
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${JSON.stringify(structuredData(route)).replaceAll('<', '\\u003c')}</script>`,
    )
    .replace('<!-- canonical -->', `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace('<!-- alternates -->', alternates)
    .replace('<!-- og:url -->', `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace('<!-- site-verification -->', route.path === '/' ? verificationMarkup() : '')

  html = replaceMeta(html, 'name="description"', route.description)
  html = replaceMeta(html, 'name="keywords"', route.keywords.join(', '))
  html = replaceMeta(html, 'property="og:type"', route.kind === 'guide' ? 'article' : 'website')
  html = replaceMeta(html, 'property="og:locale"', route.locale === 'en' ? 'en_US' : 'zh_CN')
  html = replaceMeta(html, 'property="og:locale:alternate"', route.locale === 'en' ? 'zh_CN' : 'en_US')
  html = replaceMeta(html, 'property="og:title"', route.title)
  html = replaceMeta(html, 'property="og:description"', route.description)
  html = replaceMeta(html, 'property="og:image:alt"', route.locale === 'en'
    ? 'dsh-TUI pixel whale and DeepSeek Harness terminal interface preview'
    : 'dsh-TUI 像素鲸鱼与 DeepSeek Harness 终端界面预览')
  html = replaceMeta(html, 'name="twitter:title"', route.title)
  html = replaceMeta(html, 'name="twitter:description"', route.description)
  html = replaceMeta(html, 'name="twitter:image:alt"', route.locale === 'en'
    ? 'dsh-TUI pixel whale and DeepSeek Harness terminal interface preview'
    : 'dsh-TUI 像素鲸鱼与 DeepSeek Harness 终端界面预览')

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
  .replace('<!-- canonical -->', '')
  .replace('<!-- alternates -->', '')
  .replace('<!-- og:url -->', '')
  .replace('<!-- site-verification -->', '')
  .replace('<div id="root"></div>', `<div id="root">${render('/404.html')}</div>`)
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')
await writeFile(path.join(distDir, '404.html'), notFoundHtml)

function normalizeNpmReference(value) {
  if (!value) return undefined
  const npmValue = String(value)
  if (/^https?:\/\//i.test(npmValue)) {
    return {
      name: npmValue.replace(/^https?:\/\/www\.npmjs\.com\/package\//i, ''),
      url: npmValue,
    }
  }
  return {
    name: npmValue,
    url: `https://www.npmjs.com/package/${npmValue.split('/').map(encodeURIComponent).join('/')}`,
  }
}

function pluginKindLabel(kind) {
  if (kind === 'core') return '核心'
  if (kind === 'template') return '模板'
  return '插件'
}

function pluginCard(plugin) {
  const kind = plugin.kind === 'template' || plugin.kind === 'core' ? plugin.kind : 'plugin'
  const tags = (plugin.tags ?? []).map((tag) => `<span class="mk-tag">${escapeHtml(tag)}</span>`).join('')
  const npmReference = normalizeNpmReference(plugin.npm)
  const npmLink = npmReference
    ? `<a href="${escapeHtml(npmReference.url)}" target="_blank" rel="noopener">npm 包</a>`
    : ''
  const title = plugin.displayName || plugin.name
  const install = plugin.name
    ? `<div class="mk-install"><code>dsh plugin add ${escapeHtml(plugin.name)}</code></div>`
    : ''
  const badge = plugin.featured
    ? '<span class="mk-pick">编辑推荐</span>'
    : `<span class="mk-kind ${escapeHtml(kind)}">${escapeHtml(pluginKindLabel(kind))}</span>`

  return `<article class="mk-card${plugin.featured ? ' featured' : ''}" data-prerendered="true">
    <div class="mk-card-body">
      <div class="mk-card-head">
        <img src="https://github.com/${encodeURIComponent(plugin.author)}.png?size=84" alt="" width="40" height="40" loading="lazy"/>
        <div class="who"><h3>${escapeHtml(title)}</h3>
        <a class="a" href="https://github.com/${encodeURIComponent(plugin.author)}" target="_blank" rel="noopener">@${escapeHtml(plugin.author)}</a></div>
        ${badge}
      </div>
      <p class="mk-desc">${escapeHtml(plugin.description)}</p>
      ${tags ? `<div class="mk-tags">${tags}</div>` : ''}
      <div class="mk-actions"><a class="primary" href="${escapeHtml(plugin.repo)}" target="_blank" rel="noopener">GitHub 仓库</a>${npmLink}</div>
      ${install}
    </div>
  </article>`
}

async function enhancePluginMarketplace() {
  const pluginHtmlPath = path.join(distDir, 'plugins', 'index.html')
  const pluginDataPath = path.join(distDir, 'plugins', 'plugins.json')
  const [sourceHtml, pluginDataSource] = await Promise.all([
    readFile(pluginHtmlPath, 'utf8'),
    readFile(pluginDataPath, 'utf8'),
  ])
  const pluginData = JSON.parse(pluginDataSource)
  const plugins = Array.isArray(pluginData.plugins) ? pluginData.plugins : []
  const pluginUrl = routeUrl('/plugins/')
  const cssAsset = template.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^" ]+\.css)"/)?.[1]
  if (!cssAsset) throw new Error('Unable to find the generated CSS asset for the plugin marketplace')

  const itemList = {
    '@type': 'ItemList',
    '@id': `${pluginUrl}#plugins`,
    name: 'dsh-TUI plugins',
    numberOfItems: plugins.length,
    itemListElement: plugins.map((plugin, index) => {
      const npmReference = normalizeNpmReference(plugin.npm)
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': plugin.kind === 'template' ? 'SoftwareSourceCode' : 'SoftwareApplication',
          name: plugin.displayName || plugin.name,
          alternateName: plugin.name,
          description: plugin.description,
          url: plugin.repo,
          codeRepository: plugin.repo,
          ...(npmReference ? { sameAs: npmReference.url } : {}),
        },
      }
    }),
  }
  const pluginStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      projectNode(),
      websiteNode('dsh-TUI 社区插件、主题、技能和 TUI 扩展收录。'),
      {
        '@type': 'CollectionPage',
        '@id': `${pluginUrl}#webpage`,
        name: 'dsh-TUI 插件市场',
        alternateName: ['DSHTUI Plugin Marketplace', 'dsh-tui plugins', 'DSH plugins'],
        url: pluginUrl,
        description: 'dsh-TUI 社区插件、主题、技能和 TUI 扩展收录。',
        inLanguage: ['zh-CN', 'en'],
        isPartOf: { '@id': entityUrl('#website') },
        mainEntity: { '@id': `${pluginUrl}#plugins` },
        ...(pluginData.updatedAt ? { dateModified: pluginData.updatedAt } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pluginUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: siteUrl.toString() },
          { '@type': 'ListItem', position: 2, name: '插件市场', item: pluginUrl },
        ],
      },
      itemList,
    ],
  }

  let html = sourceHtml
    .replace(/<link rel="stylesheet"[^>]*data-app-styles[^>]*>/, `<link rel="stylesheet" href="../${cssAsset}" data-app-styles/>`)
    .replace(/<link rel="canonical" href="[^"]+"\/>/, `<link rel="canonical" href="${pluginUrl}"/>`)
    .replace(/<div class="mk-grid" id="grid"[^>]*><\/div>/, `<div class="mk-grid" id="grid">${plugins.map(pluginCard).join('')}</div>`)
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${JSON.stringify(pluginStructuredData).replaceAll('<', '\\u003c')}</script>`,
    )
    .replace('<!-- site-verification -->', verificationMarkup())

  html = replaceMeta(html, 'name="description"', 'dsh-TUI 插件市场：社区插件、主题、技能和 TUI 扩展收录。')
  html = replaceMeta(html, 'property="og:url"', pluginUrl)
  html = replaceMeta(html, 'property="og:title"', 'dsh-TUI 插件市场 — 社区扩展')
  html = replaceMeta(html, 'property="og:description"', '浏览 dsh-TUI 的社区插件、主题、技能和 TUI 扩展。')

  await writeFile(pluginHtmlPath, html)
  return { updatedAt: pluginData.updatedAt, count: plugins.length }
}

const pluginInfo = await enhancePluginMarketplace()

function sitemapEntry(route) {
  const lines = ['  <url>', `    <loc>${escapeXml(routeUrl(route.path))}</loc>`]
  if (route.alternatePath) {
    const zhPath = route.locale === 'zh-CN' ? route.path : route.alternatePath
    const enPath = route.locale === 'en' ? route.path : route.alternatePath
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${escapeXml(routeUrl(zhPath))}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(routeUrl(enPath))}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(routeUrl(zhPath))}" />`,
    )
  }
  if (route.lastmod) lines.push(`    <lastmod>${escapeXml(route.lastmod)}</lastmod>`)
  lines.push('  </url>')
  return lines.join('\n')
}

const sitemapRoutes = [
  ...SEO_ROUTES,
  { path: '/plugins/', lastmod: pluginInfo.updatedAt },
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapRoutes.map(sitemapEntry).join('\n')}
</urlset>
`
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap)

const robotsPath = path.join(distDir, 'robots.txt')
const robots = await readFile(robotsPath, 'utf8')
const robotsWithoutSitemap = robots
  .split(/\r?\n/)
  .filter((line) => !/^\s*Sitemap:/i.test(line))
  .join('\n')
  .trim()
await writeFile(robotsPath, `${robotsWithoutSitemap}\n\nSitemap: ${routeUrl('/sitemap.xml')}\n`)

for (const requiredAsset of ['favicon.svg', 'site.webmanifest', 'llms.txt']) {
  await access(path.join(distDir, requiredAsset))
}

await rm(ssrDir, { recursive: true, force: true })
