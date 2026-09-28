import type { ReactNode } from 'react'
import type { GuideBlock } from '../content/guides'


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

const text = 'text-[14.5px] leading-[2] text-dim'

export function GuideBlockView({ block }: { block: GuideBlock }) {
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
  }
}
