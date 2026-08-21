import { GUIDE_PAGES, guidePath, type SiteLocale } from '../content/guides'

export interface SeoRoute {
  path: string
  locale: SiteLocale
  title: string
  description: string
  alternatePath: string
  kind: 'home' | 'guide'
}

const homeRoutes: SeoRoute[] = [
  {
    path: '/',
    locale: 'zh-CN',
    title: 'dsh-TUI：DeepSeek Harness 的 Claude Code 风格终端界面',
    description: 'dsh-TUI 是 DeepSeek Harness 的 Claude Code 风格全屏终端界面插件，支持流式 Markdown、实时 Agent 状态、会话回溯、上下文进度与 TPS 仪表。',
    alternatePath: '/en/',
    kind: 'home',
  },
  {
    path: '/en/',
    locale: 'en',
    title: 'dsh-TUI — Claude Code-style TUI for DeepSeek Harness',
    description: 'A fullscreen terminal interface for DeepSeek Harness with streamed Markdown, observable agent status, session rewind, context usage, and TPS metrics.',
    alternatePath: '/',
    kind: 'home',
  },
]

const guideRoutes: SeoRoute[] = GUIDE_PAGES.map((page) => ({
  path: guidePath(page),
  locale: page.locale,
  title: `${page.title} | dsh-TUI`,
  description: page.description,
  alternatePath: page.locale === 'en' ? `/${page.slug}/` : `/en/${page.slug}/`,
  kind: 'guide',
}))

export const SEO_ROUTES = [...homeRoutes, ...guideRoutes]

export function getSeoRoute(path: string) {
  return SEO_ROUTES.find((route) => route.path === path) ?? homeRoutes[0]
}
