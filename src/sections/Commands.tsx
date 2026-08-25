import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import { COMMAND_GROUPS, strings, useLang, useT } from '../i18n'

const GROUPS = COMMAND_GROUPS

export default function Commands() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="commands" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
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
                    <span key={c} className="cmd-chip">{c}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
