import generated from '../settings.generated.json'
import { type GuidePageData, type GuideSection, type GuideTopic, type SettingEntry, note, p, ul } from './types'

/** The manifest written by scripts/sync-settings.mjs (validated there against schema v1). */
interface SettingsManifest {
  source: 'npm' | 'file' | 'fixture'
  document: {
    schemaVersion: 1
    package: string
    packageVersion: string
    namespace: string
    settings: SettingEntry[]
  }
}

const manifest = generated as unknown as SettingsManifest
const { document, source } = manifest

/**
 * Headings for the /settings subpage ids. The manifest carries per-setting text only, so group
 * titles mirror the ones dsh-TUI registers for its /settings subpages; an unknown id is shown as-is.
 */
const GROUPS: { id: string; zh: string; en: string }[] = [
  { id: 'general', zh: '通用', en: 'General' },
  { id: 'status-bar', zh: '底栏设置', en: 'Status bar' },
  { id: 'shortcuts', zh: '快捷键', en: 'Shortcuts' },
  { id: 'session', zh: '会话', en: 'Session' },
]

function groupedSections(lang: 'zh' | 'en'): GuideSection[] {
  const byGroup = new Map<string, SettingEntry[]>()
  for (const setting of document.settings) {
    const list = byGroup.get(setting.group) ?? []
    list.push(setting)
    byGroup.set(setting.group, list)
  }
  const known = GROUPS.map((group) => group.id)
  const order = [...known.filter((id) => byGroup.has(id)), ...[...byGroup.keys()].filter((id) => !known.includes(id)).sort()]
  return order.map((id): GuideSection => {
    const group = GROUPS.find((item) => item.id === id)
    const items = [...(byGroup.get(id) ?? [])].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
    return {
      heading: group ? group[lang] : id,
      id: `group-${id}`,
      blocks: [{ type: 'settings', items }],
    }
  })
}

const pkgRef = `${document.package}@${document.packageVersion}`
const npmUrl = `https://www.npmjs.com/package/${document.package}/v/${document.packageVersion}`

const zh: GuidePageData = {
  slug: 'settings',
  locale: 'zh-CN',
  navTitle: '设置项参考',
  title: 'dsh-TUI 设置项参考',
  description: 'dsh-TUI 全部 /settings 设置项：每个键的类型、默认值、可选值、是否需要重启与弃用状态，直接取自对应版本 npm 包附带的设置清单。',
  intro: `dsh-TUI 在 \`/settings\` 里能改的每一项。本页在构建时从 \`${pkgRef}\` 的 npm 包读取 \`lib/settings.json\` 生成，说明文字与 TUI 里 /settings 的提示一致。`,
  sections: [
    {
      heading: '关于本页',
      id: 'about',
      blocks: [
        ...(source === 'fixture'
          ? [note('预览数据：当前还没有附带设置清单的 dsh-TUI 正式版本，本页展示的是站点仓库里的示例清单，只含少量设置项，版本号也不是真实发布版本。')]
          : source === 'file'
            ? [note('本地预览：本页数据来自一份本地 settings.json，而非已发布的 npm 包。')]
            : []),
        ul(
          source === 'npm'
            ? `数据版本：[\`${pkgRef}\`](${npmUrl})`
            : `数据版本：\`${pkgRef}\``,
          `设置键都位于 \`${document.namespace}\` 命名空间下，例如 \`${document.namespace}.statusBar.model\`。`,
          '推荐在 TUI 里用 `/settings` 编辑：改动自动保存，多数立即生效；标注「需重启」的项用 `/restart` 生效。',
          '默认值写作「运行时决定」的项没有固定默认：例如界面语言跟随环境与已保存的偏好，快捷键的默认组合随平台不同。',
        ),
        p('编辑器的操作方式与不在 /settings 里的启动级配置，见[界面与状态栏](../interface/#settings-editor)。'),
      ],
    },
    ...groupedSections('zh'),
  ],
}

const en: GuidePageData = {
  slug: 'settings',
  locale: 'en',
  navTitle: 'Settings',
  title: 'dsh-TUI Settings Reference',
  description: 'Every dsh-TUI /settings key with its type, default, options, restart requirement, and deprecation status, generated from the settings manifest in the matching npm release.',
  intro: `Everything you can change in dsh-TUI's \`/settings\`. This page is generated at build time from \`lib/settings.json\` in the \`${pkgRef}\` npm package; the descriptions match the hints shown in /settings.`,
  sections: [
    {
      heading: 'About this page',
      id: 'about',
      blocks: [
        ...(source === 'fixture'
          ? [note('Preview data: no dsh-TUI release ships the settings manifest yet, so this page shows a sample manifest from the site repository. It lists only a few settings, and its version is not a real release.')]
          : source === 'file'
            ? [note('Local preview: this page was built from a local settings.json, not a published npm package.')]
            : []),
        ul(
          source === 'npm'
            ? `Data version: [\`${pkgRef}\`](${npmUrl})`
            : `Data version: \`${pkgRef}\``,
          `Keys live under the \`${document.namespace}\` namespace, e.g. \`${document.namespace}.statusBar.model\`.`,
          'Edit them in the TUI with `/settings`: changes save automatically and most apply immediately; keys marked "restart required" apply after `/restart`.',
          'A default shown as "computed at runtime" has no fixed value: the UI language follows the environment and saved preference, and default shortcut combos differ by platform.',
        ),
        p('For how the editor works and which startup options live outside /settings, see [the /settings editor](../interface/#settings-editor).'),
      ],
    },
    ...groupedSections('en'),
  ],
}

const topic: GuideTopic = { zh, en }

export default topic
