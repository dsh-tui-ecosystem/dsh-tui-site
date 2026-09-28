import type { ReactNode } from 'react'
import type { GuideBlock, SettingEntry } from '../content/guides'

type Lang = 'zh' | 'en'

// A bare fence opener (```mermaid, as in settings hints) and `code` come first so brackets and
// asterisks inside code stay literal.
const INLINE = /(```[A-Za-z]+)|`([^`]+)`|\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

/** Renders the small inline syntax used in guide content: `code`, **bold**, [label](href). */
export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0
    if (index > last) parts.push(text.slice(last, index))
    const key = `${index}`
    const codeText = match[1] ?? match[2]
    if (codeText !== undefined) {
      parts.push(
        <code key={key} className="font-mono2 rounded px-1 py-px text-[0.9em] text-mist3" style={{ background: 'var(--mist-wash)' }}>
          {codeText}
        </code>,
      )
    } else if (match[3] !== undefined) {
      parts.push(<strong key={key} className="font-semibold text-head"><Inline text={match[3]} /></strong>)
    } else {
      const href = match[5]
      const external = /^https?:\/\//.test(href)
      parts.push(
        <a
          key={key}
          href={href}
          className="text-mist underline decoration-1 underline-offset-2 hover:text-mist3"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <Inline text={match[4]} />
        </a>,
      )
    }
    last = index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

const KIND_LABEL: Record<SettingEntry['kind'], Record<Lang, string>> = {
  boolean: { zh: '布尔（开关）', en: 'Boolean (on/off)' },
  select: { zh: '单选', en: 'Select' },
  text: { zh: '文本', en: 'Text' },
  number: { zh: '数字', en: 'Number' },
}

const SETTING_TEXT = {
  kind: { zh: '类型', en: 'Type' },
  default: { zh: '默认值', en: 'Default' },
  options: { zh: '可选值', en: 'Options' },
  presets: { zh: '预设', en: 'Presets' },
  runtime: { zh: '运行时决定', en: 'Computed at runtime' },
  restart: { zh: '需重启', en: 'Restart required' },
  deprecated: { zh: '已弃用', en: 'Deprecated' },
  withPresets: { zh: '，含预设值', en: ', with presets' },
} satisfies Record<string, Record<Lang, string>>

function SettingDefault({ setting, lang }: { setting: SettingEntry; lang: Lang }) {
  if (setting.default === null || setting.default === undefined) {
    return <span className="italic">{SETTING_TEXT.runtime[lang]}</span>
  }
  const raw = typeof setting.default === 'string' ? setting.default : JSON.stringify(setting.default)
  const option = setting.options?.find((item) => item.value === setting.default)
  return (
    <>
      <code className="font-mono2 text-mist3">{raw}</code>
      {option && option.label[lang] !== raw && <span>{lang === 'zh' ? `（${option.label[lang]}）` : ` (${option.label[lang]})`}</span>}
    </>
  )
}

function Badge({ tone, children }: { tone: 'warn' | 'bad'; children: ReactNode }) {
  const color = tone === 'bad' ? 'var(--bad-text)' : 'var(--warn)'
  return (
    <span
      className="rounded border px-1.5 py-px text-[11px] font-medium leading-[1.6]"
      style={{ color, borderColor: 'currentColor' }}
    >
      {children}
    </span>
  )
}

function SettingCard({ setting, lang }: { setting: SettingEntry; lang: Lang }) {
  const optionsLabel = setting.kind === 'select' ? SETTING_TEXT.options[lang] : SETTING_TEXT.presets[lang]
  return (
    <article
      id={`setting-${setting.key}`}
      className="scroll-mt-28 rounded-lg border border-line p-4 sm:p-5 md:scroll-mt-24"
      style={{ background: 'var(--panel)' }}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <h3 className={`text-[15px] font-semibold ${setting.deprecated ? 'text-dim line-through decoration-1' : 'text-head'}`}>
          {setting.label[lang]}
        </h3>
        {setting.deprecated && <Badge tone="bad">{SETTING_TEXT.deprecated[lang]}</Badge>}
        {setting.restartRequired && <Badge tone="warn">{SETTING_TEXT.restart[lang]}</Badge>}
      </div>
      <p className="font-mono2 mt-1 break-all text-[12.5px] text-mist3">{setting.key}</p>
      <p className="mt-3 text-[13.5px] leading-[1.9] text-dim"><Inline text={setting.description[lang]} /></p>
      <dl className="mt-3.5 grid gap-x-4 gap-y-1.5 border-t border-soft pt-3 text-[12.5px] leading-[1.8] text-dim sm:grid-cols-[max-content_minmax(0,1fr)]">
        <dt className="text-faint">{SETTING_TEXT.kind[lang]}</dt>
        <dd>
          {KIND_LABEL[setting.kind]?.[lang] ?? setting.kind}
          {setting.kind === 'text' && setting.options?.length ? SETTING_TEXT.withPresets[lang] : ''}
        </dd>
        <dt className="text-faint">{SETTING_TEXT.default[lang]}</dt>
        <dd><SettingDefault setting={setting} lang={lang} /></dd>
        {setting.options && setting.options.length > 0 && (
          <>
            <dt className="text-faint">{optionsLabel}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {setting.options.map((option) => (
                  <li key={option.value} className="rounded border border-line px-2 py-px">
                    <code className="font-mono2 text-mist3">{option.value}</code>
                    {option.label[lang] !== option.value && <span className="ms-1.5">{option.label[lang]}</span>}
                  </li>
                ))}
              </ul>
            </dd>
          </>
        )}
      </dl>
    </article>
  )
}

const text = 'text-[14.5px] leading-[2] text-dim'

export function GuideBlockView({ block, lang }: { block: GuideBlock; lang: Lang }) {
  switch (block.type) {
    case 'p':
      return <p className={`mt-4 ${text}`}><Inline text={block.text} /></p>
    case 'h3':
      return <h3 className="mt-8 text-[16.5px] font-semibold text-head sm:text-[17px]"><Inline text={block.text} /></h3>
    case 'ul':
      return (
        <ul className="mt-4 space-y-2.5 ps-5 text-[14px] leading-[1.85] text-dim">
          {block.items.map((item, index) => <li key={index} className="list-disc marker:text-mist"><Inline text={item} /></li>)}
        </ul>
      )
    case 'ol':
      return (
        <ol start={block.start} className="mt-4 space-y-2.5 ps-6 text-[14px] leading-[1.85] text-dim">
          {block.items.map((item, index) => <li key={index} className="list-decimal marker:text-mist"><Inline text={item} /></li>)}
        </ol>
      )
    case 'note':
      return (
        <p
          className="mt-5 rounded-lg border-s-2 px-4 py-3 text-[13.5px] leading-[1.9] text-dim"
          style={{ borderColor: 'var(--mist)', background: 'var(--mist-wash)' }}
        >
          <Inline text={block.text} />
        </p>
      )
    case 'code':
      return (
        <pre className="font-mono2 mt-5 overflow-x-auto rounded-lg border border-line p-4 text-[12.5px] leading-[1.8] text-mist3 sm:p-5" style={{ background: 'var(--panel)' }}>
          <code>{block.text}</code>
        </pre>
      )
    case 'table':
      return (
        <div className="mt-5 overflow-x-auto rounded-lg border border-line" style={{ background: 'var(--panel)' }}>
          <table className={`w-full border-collapse text-start text-[13px] leading-[1.75] ${block.head.length > 2 ? 'min-w-[600px]' : ''}`}>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="whitespace-nowrap border-b border-line px-3.5 py-2.5 text-start text-[12px] font-medium text-faint">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex > 0 ? 'border-t border-soft' : ''}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-3.5 py-2.5 align-top ${cellIndex === 0 ? 'min-w-[8.5rem] text-head' : 'text-dim'}`}
                    >
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'settings':
      return (
        <div className="mt-5 space-y-4">
          {block.items.map((setting) => <SettingCard key={setting.key} setting={setting} lang={lang} />)}
        </div>
      )
  }
}
