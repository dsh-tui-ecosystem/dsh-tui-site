import { GUIDE_PAGES, guidePath, type SiteLocale } from '../content/guides'

export interface SeoRoute {
  path: string
  locale: SiteLocale
  title: string
  description: string
  keywords: string[]
  alternatePath: string
  kind: 'home' | 'guide'
}

const brandKeywords: Record<SiteLocale, string[]> = {
  'zh-CN': ['dsh-TUI', 'DSHTUI', 'dsh-tui', 'DSH TUI', 'DSH', 'DeepSeek Harness', 'DeepSeek Harness TUI', '终端界面', 'AI 编码助手'],
  en: ['dsh-TUI', 'DSHTUI', 'dsh-tui', 'DSH TUI', 'DSH', 'DeepSeek Harness', 'DeepSeek Harness TUI', 'terminal UI', 'coding agent'],
}

const homeRoutes: SeoRoute[] = [
  {
    path: '/',
    locale: 'zh-CN',
    title: 'dsh-TUI（DSHTUI）：DeepSeek Harness / DSH 终端界面',
    description: 'dsh-TUI（也称 DSHTUI、dsh-tui）是 DeepSeek Harness（DSH）的 Claude Code 风格全屏终端界面，支持流式 Markdown、Agent 状态、会话回溯与 TPS 仪表。',
    keywords: brandKeywords['zh-CN'],
    alternatePath: '/en/',
    kind: 'home',
  },
  {
    path: '/en/',
    locale: 'en',
    title: 'dsh-TUI (DSHTUI) — Terminal UI for DeepSeek Harness (DSH)',
    description: 'dsh-TUI (DSHTUI / dsh-tui) is a Claude Code-style terminal UI for DeepSeek Harness (DSH), with streamed Markdown, live agent status, and session rewind.',
    keywords: brandKeywords.en,
    alternatePath: '/',
    kind: 'home',
  },
]

const guideRoutes: SeoRoute[] = GUIDE_PAGES.map((page) => ({
  path: guidePath(page),
  locale: page.locale,
  title: `${page.title} | dsh-TUI`,
  description: page.description,
  keywords: [...brandKeywords[page.locale], page.navTitle, page.title],
  alternatePath: page.locale === 'en' ? `/${page.slug}/` : `/en/${page.slug}/`,
  kind: 'guide',
}))

export const SEO_ROUTES = [...homeRoutes, ...guideRoutes]

export function getSeoRoute(path: string) {
  return SEO_ROUTES.find((route) => route.path === path) ?? homeRoutes[0]
}
