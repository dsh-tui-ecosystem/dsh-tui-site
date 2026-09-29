import architecture from './guides/architecture'
import commands from './guides/commands'
import customization from './guides/customization'
import faq from './guides/faq'
import features from './guides/features'
import gettingStarted from './guides/getting-started'
import interfaceGuide from './guides/interface'
import sessions from './guides/sessions'
import settings from './guides/settings'
import shortcuts from './guides/shortcuts'
import tips from './guides/tips'
import type { GuidePageData, GuideTopic } from './guides/types'

export type { GuideBlock, GuidePageData, GuideSection, SettingEntry, SiteLocale } from './guides/types'

/** Doc order: drives the guide navigation, the prerendered routes, and the sitemap. */
const TOPICS: GuideTopic[] = [
  gettingStarted,
  features,
  shortcuts,
  commands,
  sessions,
  interfaceGuide,
  settings,
  customization,
  tips,
  architecture,
  faq,
]

export const GUIDE_PAGES: GuidePageData[] = [...TOPICS.map((topic) => topic.zh), ...TOPICS.map((topic) => topic.en)]

export function guidePath(page: GuidePageData) {
  return page.locale === 'en' ? `/en/${page.slug}/` : `/${page.slug}/`
}

export function getGuidePage(path: string) {
  return GUIDE_PAGES.find((page) => guidePath(page) === path)
}
