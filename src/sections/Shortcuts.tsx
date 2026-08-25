import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import { SHORTCUT_KEYS, SHORTCUT_MOUSE, strings, useLang, useT } from '../i18n'

const KEYS = SHORTCUT_KEYS
const MOUSE = SHORTCUT_MOUSE

export default function Shortcuts() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="shortcuts" className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          title={t(strings['shortcuts.title'])}
          desc={t(strings['shortcuts.desc'])}
        />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <ul className="divide-y divide-[var(--line-soft)] overflow-hidden rounded-lg border border-line" style={{ background: 'var(--panel)' }}>
              {KEYS.map((k, i) => (
                <li
                  key={i}
                  className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition-colors hover:bg-[var(--panel-2)] ${
                    k.hi ? 'bg-[var(--mist-wash)]' : ''
                  }`}
                >
                  <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                    {k.keys.map((key) => (
                      <kbd key={key} className="kbd">{key}</kbd>
                    ))}
                    {k.times && k.times > 1 && (
                      <span className="text-[11px] text-faint">×{k.times}</span>
                    )}
                  </span>
                  <span className={`min-w-0 text-[13px] leading-relaxed ${k.hi ? 'text-mist3' : 'text-dim'}`}>
                    {k.hi && <span className="font-mono2 me-2 text-[10.5px] text-mist">★</span>}
                    {k.desc[lang]}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-lg border border-line p-6" style={{ background: 'var(--panel)' }}>
              <ul className="space-y-4">
                {MOUSE.map((m) => (
                  <li key={m.k.zh}>
                    <div className="font-mono2 text-[12.5px] font-semibold text-head">{m.k[lang]}</div>
                    <div className="mt-1 text-[12.5px] leading-relaxed text-dim">{m.v[lang]}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                <div className="rounded border border-soft p-3 text-[12px] leading-relaxed text-faint" style={{ background: 'var(--bg-2)' }}>
                  {t(strings['shortcuts.note'])}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
