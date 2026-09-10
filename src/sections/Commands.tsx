import { useEffect, useRef, useState } from 'react'
import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import { COMMAND_GROUPS, strings, useLang, useT } from '../i18n'

const GROUPS = COMMAND_GROUPS

export default function Commands() {
  const lang = useLang()
  const t = useT()
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (c: string) => {
    try {
      await navigator.clipboard.writeText(c)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = c
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(c)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(null), 1400)
  }

  return (
    <section id="commands" className="py-24">
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          title={t(strings['commands.title'])}
          desc={t(strings['commands.desc'])}
        />

        <div className="overflow-hidden rounded-lg border border-line" style={{ background: 'var(--panel)' }}>
          {GROUPS.map((g, i) => (
            <Reveal key={g.name.zh} delay={i * 50}>
              <div
                className={`grid gap-3 px-5 py-4 sm:grid-cols-[150px_1fr] sm:items-start ${
                  i > 0 ? 'border-t border-soft' : ''
                }`}
              >
                <div className="font-mono2 flex items-baseline gap-2 pt-1">
                  <span className="text-[13px] font-semibold text-head">{g.name[lang]}</span>
                  <span className="text-[10.5px] text-faint">{g.en}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {g.cmds.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="cmd-chip"
                      data-copied={copied === c}
                      onClick={() => copy(c)}
                      title={t(strings['commands.chipHint'])}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
          <span role="status" className="sr-only">
            {copied ? `${t(strings['copy.done'])} ${copied}` : ''}
          </span>
        </div>
      </div>
    </section>
  )
}
