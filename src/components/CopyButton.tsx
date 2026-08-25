import { useState } from 'react'
import { strings, useLang } from '../i18n'

export default function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const lang = useLang()
  const [ok, setOk] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setOk(true)
    setTimeout(() => setOk(false), 1600)
  }

  return (
    <button
      onClick={copy}
      className={`btn-press font-mono2 shrink-0 rounded border border-line px-2.5 py-1.5 text-[11.5px] transition-colors ${
        ok ? 'text-[var(--ok)]' : 'text-dim hover:text-mist3 hover:border-[var(--mist)]'
      } ${className}`}
    >
      {/* 可见文字即可访问名：固定的 aria-label 会盖掉它，让"已复制"永远传不到读屏 */}
      {ok ? strings['copy.done'][lang] : strings['copy.label'][lang]}
      <span role="status" className="sr-only">
        {ok ? strings['copy.done'][lang] : ''}
      </span>
    </button>
  )
}
