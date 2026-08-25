import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import { ARCH_PIPE, ARCH_POINTS, strings, useLang, useT } from '../i18n'

const PIPE = ARCH_PIPE
const POINTS = ARCH_POINTS

export default function Arch() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="arch" className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          title={t(strings['arch.title'])}
          desc={t(strings['arch.desc'])}
        />

        {/* 链路图 */}
        <Reveal>
          <div className="overflow-x-auto rounded-lg border border-line p-5" style={{ background: 'var(--panel)' }}>
            <div className="font-mono2 flex min-w-max items-center gap-0 text-[12px]">
              {PIPE.map((p, i) => (
                <span key={p.zh} className="flex items-center">
                  <span
                    className={`whitespace-nowrap rounded border px-3 py-2 ${
                      i === 2
                        ? 'border-[var(--mist)] text-mist3'
                        : i === PIPE.length - 1
                          ? 'border-[var(--mist-solid)] bg-[var(--mist-solid)] font-semibold text-white'
                          : 'border-line text-dim'
                    }`}
                    style={i === 2 ? { background: 'rgba(75,111,255,0.08)' } : undefined}
                  >
                    {p[lang]}
                  </span>
                  {i < PIPE.length - 1 && <span className="px-2 text-faint">→</span>}
                </span>
              ))}
            </div>
            <p className="font-mono2 mt-4 text-[11px] text-faint">
              {t(strings['arch.pipeNote'])}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.t.zh} delay={i * 60}>
              <div className="h-full p-5 transition-colors hover:bg-[var(--panel-2)]" style={{ background: 'var(--panel)' }}>
                <h3 className="text-[14.5px] font-bold text-head">
                  <span aria-hidden="true" className="text-mist font-mono2 mr-2 text-[12px]">▸</span>
                  {p.t[lang]}
                </h3>
                <p className="mt-2 text-[12.5px] leading-[1.85] text-dim">{p.d[lang]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
