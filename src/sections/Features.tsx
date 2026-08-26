import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import { FEATURE_CELLS, strings, useLang, useT } from '../i18n'

/** 可观察状态格里的小仪表：上下文进度条 + TPS */
function MiniMeter() {
  return (
    <div className="font-mono2 mt-4 space-y-2 overflow-x-auto rounded border border-soft p-3 text-[11px]" style={{ background: 'var(--bg-2)' }}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-dim">
        <span>ctx <span className="text-mist2">▓▓▓▓▓▓░░░░</span></span>
        <span className="text-mist3">512.4k/1.0M · 51.2%</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-dim">
        <span>
          tps <span style={{ color: 'var(--ok-text)' }}>▂▃▅▆▇█▇▅</span>{' '}
          <span style={{ color: 'var(--ok-text)' }} className="font-semibold">58</span>
        </span>
        <span className="text-faint">cache 99.7%</span>
      </div>
    </div>
  )
}

const CELLS = FEATURE_CELLS

export default function Features() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          title={t(strings['features.title'])}
          desc={t(strings['features.desc'])}
        />
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-[var(--line)] md:grid-cols-6">
          {CELLS.map((c, i) => (
            <Reveal
              key={c.title.zh}
              delay={i * 70}
              className={`group ${c.span}`}
            >
              <div
                className="h-full p-6 transition-colors duration-200 group-hover:bg-[var(--panel-2)]"
                style={{ background: 'var(--panel)' }}
              >
                <h3 className="text-[17px] font-bold text-head transition-colors group-hover:text-mist3">
                  {c.title[lang]}
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.9] text-dim">{c.desc[lang]}</p>
                {c.meter ? <MiniMeter /> : undefined}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.tags.map((tag) => (
                    <span
                      key={tag.zh}
                      className="font-mono2 rounded border border-soft px-2 py-0.5 text-[10.5px] text-faint"
                    >
                      {tag[lang]}
                    </span>
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
