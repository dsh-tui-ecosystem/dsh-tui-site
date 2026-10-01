import { GUIDE_PAGES, guidePath, type SiteLocale } from '../content/guides'

export interface SeoRoute {
  path: string
  locale: SiteLocale
  title: string
  description: string
  keywords: string[]
  alternatePath: string
  kind: 'home' | 'guide' | 'pets'
}

const brandKeywords: Record<SiteLocale, string[]> = {
  'zh-CN': ['dsh-TUI', 'DSHTUI', 'dsh-tui', 'DSH TUI', 'DSH', 'DeepSeek Harness', 'DeepSeek Harness TUI', '终端界面', 'AI 编码助手'],
  en: ['dsh-TUI', 'DSHTUI', 'dsh-tui', 'DSH TUI', 'DSH', 'DeepSeek Harness', 'DeepSeek Harness TUI', 'terminal UI', 'coding agent'],
}

const homeRoutes: SeoRoute[] = [
  {
    path: '/',
    locale: 'zh-CN',
    title: 'dsh-TUI：DeepSeek Harness 的 Claude Code 风格终端界面',
    description: 'dsh-TUI 是 DeepSeek Harness 的 Claude Code 风格全屏终端界面插件，支持流式 Markdown、实时 Agent 状态、会话回溯、上下文进度与 TPS 仪表。',
    keywords: brandKeywords['zh-CN'],
    alternatePath: '/en/',
    kind: 'home',
  },
  {
    path: '/en/',
    locale: 'en',
    title: 'dsh-TUI — Claude Code-style TUI for DeepSeek Harness',
    description: 'A fullscreen terminal interface for DeepSeek Harness with streamed Markdown, observable agent status, session rewind, context usage, and TPS metrics.',
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

const petKeywords: Record<SiteLocale, string[]> = {
  'zh-CN': ['桌宠', '像素桌宠', 'Deepy', '小鲸鱼', '鲸娘', 'Clawd on Desk', '像素动画'],
  en: ['desk pet', 'desktop pet', 'pixel art', 'Deepy', 'Whale Girl', 'Clawd on Desk', 'sprite animation'],
}

const petRoutes: SeoRoute[] = [
  {
    path: '/pets/',
    locale: 'zh-CN',
    title: '桌宠动态预览：Deepy 小鲸鱼、终端版与鲸娘 | dsh-TUI',
    description: '在线预览三套像素桌宠：Deepy 小鲸鱼、Deepy 终端版与鲸娘表情集。点击模拟 agent hook 事件，看它们思考、敲代码、报错和庆祝，并逐个查看全部 62 个动作。',
    keywords: [...brandKeywords['zh-CN'], ...petKeywords['zh-CN']],
    alternatePath: '/en/pets/',
    kind: 'pets',
  },
  {
    path: '/en/pets/',
    locale: 'en',
    title: 'Desk pets live: Deepy the whale and Whale Girl | dsh-TUI',
    description: 'Preview three pixel desk pets — Deepy the whale, its terminal edition and the Whale Girl stickers — reacting live to simulated agent hook events, plus all 62 animations.',
    keywords: [...brandKeywords.en, ...petKeywords.en],
    alternatePath: '/pets/',
    kind: 'pets',
  },
]

export const SEO_ROUTES = [...homeRoutes, ...guideRoutes, ...petRoutes]

export function getSeoRoute(path: string) {
  return SEO_ROUTES.find((route) => route.path === path) ?? homeRoutes[0]
}
