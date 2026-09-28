export type SiteLocale = 'zh-CN' | 'en'

/** One entry of the settings reference, as shipped in dsh-tui's lib/settings.json (schema v1). */
export interface SettingOption {
  value: string
  label: { en: string; zh: string }
}

export interface SettingEntry {
  key: string
  kind: 'boolean' | 'select' | 'text' | 'number'
  group: string
  label: { en: string; zh: string }
  description: { en: string; zh: string }
  default: unknown
  options?: SettingOption[]
  restartRequired: boolean
  deprecated: boolean
}

/**
 * Rich content blocks. Text in `p`, `ul`, `ol`, `note` and table cells supports a small
 * inline syntax: `code`, **bold**, and [label](href).
 */
export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[]; start?: number }
  | { type: 'code'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'note'; text: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'settings'; items: SettingEntry[] }

export interface GuideSection {
  heading: string
  /** Stable anchor id; defaults to `section-<n>`. */
  id?: string
  paragraphs?: string[]
  bullets?: string[]
  code?: string
  blocks?: GuideBlock[]
}

export interface GuidePageData {
  slug: string
  locale: SiteLocale
  navTitle: string
  title: string
  description: string
  intro: string
  sections: GuideSection[]
}

/** A topic page in both languages. */
export interface GuideTopic {
  zh: GuidePageData
  en: GuidePageData
}

export const p = (text: string): GuideBlock => ({ type: 'p', text })
export const ul = (...items: string[]): GuideBlock => ({ type: 'ul', items })
export const ol = (...items: string[]): GuideBlock => ({ type: 'ol', items })
/** An ordered list that continues numbering from an earlier list. */
export const olFrom = (start: number, ...items: string[]): GuideBlock => ({ type: 'ol', items, start })
export const code = (text: string): GuideBlock => ({ type: 'code', text })
export const h3 = (text: string): GuideBlock => ({ type: 'h3', text })
export const note = (text: string): GuideBlock => ({ type: 'note', text })
export const table = (head: string[], rows: string[][]): GuideBlock => ({ type: 'table', head, rows })

/** Source repository for links that used to be repo-relative in docs/. */
export const REPO_URL = 'https://github.com/ccch1mneyyy/dsh-TUI'
export const repoDoc = (file: string) => `${REPO_URL}/blob/main/docs/${file}`
export const repoFile = (file: string) => `${REPO_URL}/blob/main/${file}`
