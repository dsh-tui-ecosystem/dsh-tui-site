import { useEffect, useState } from 'react'
import SectionHead from '../components/SectionHead'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import { FEATURE_CELLS, strings, useLang, useT } from '../i18n'

/** 活的迷你仪表：这格讲的是「可观察的 Agent 状态」，它自己就应该是活的。
 *  tps 火花线每 1.1s 轮转一帧，ctx 百分比缓慢漂移、进度格数联动。
 *  reduced-motion 不启动定时器，停在第 0 帧静态画面。 */
const TPS_FRAMES = [
  { bars: '▂▃▅▆▇█▇▅', v: 58 },
  { bars: '▃▅▆▇█▇▅▂', v: 61 },
  { bars: '▅▆▇█▇▅▂▃', v: 64 },
  { bars: '▆▇█▇▅▂▃▅', v: 57 },
  { bars: '▇█▇▅▂▃▅▆', v: 52 },
  { bars: '█▇▅▂▃▅▆▇', v: 49 },
  { bars: '▇▅▂▃▅▆▇█', v: 55 },
  { bars: '▅▂▃▅▆▇█▇', v: 62 },
] as const
const CTX_SEQ = [51.2, 51.9, 52.6, 52.1, 51.5, 50.8, 50.2, 50.9] as const

function MiniMeter() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setTick((n) => n + 1), 1100)
    return () => clearInterval(id)
  }, [])
  const tps = TPS_FRAMES[tick % TPS_FRAMES.length]
  const pct = CTX_SEQ[tick % CTX_SEQ.length]
  const fill = Math.round(pct / 10)
  return (
    <div className="font-mono2 mt-4 space-y-2 overflow-x-auto rounded border border-soft p-3 text-[11px]" style={{ background: 'var(--bg-2)' }}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-dim">
        <span>
          ctx{' '}
          <span className="text-mist2">
            {'▓'.repeat(fill)}{'░'.repeat(10 - fill)}
          </span>
        </span>
        <span className="tnum text-mist3">{(pct * 10).toFixed(1)}k/1.0M · {pct.toFixed(1)}%</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-dim">
        <span>
          tps <span style={{ color: 'var(--ok-text)' }}>{tps.bars}</span>{' '}
          <span style={{ color: 'var(--ok-text)' }} className="tnum font-semibold">{tps.v}</span>
        </span>
        <span className="text-faint">cache 99.7%</span>
      </div>
    </div>
  )
}

/** 五个格子各配一个图标章，顺序与 FEATURE_CELLS 一一对应。 */
const CELL_ICONS = ['terminal', 'activity', 'history', 'puzzle', 'timer'] as const

const CELLS = FEATURE_CELLS

export default function Features() {
  const lang = useLang()
  const t = useT()

  /* bento 指针光斑：事件委托挂在网格容器上，按最近的 .spot-cell 换算出
     格内局部坐标写进 CSS 变量，光斑本身由 .spot-cell::before 绘制。 */
  const onSpot = (e: React.PointerEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('.spot-cell')
    if (!cell) return
    const r = cell.getBoundingClientRect()
    cell.style.setProperty('--mx', `${e.clientX - r.left}px`)
    cell.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          title={t(strings['features.title'])}
          desc={t(strings['features.desc'])}
        />
        <div
          className="grid gap-px overflow-hidden rounded-lg border border-line bg-[var(--line)] md:grid-cols-6"
          onPointerMove={onSpot}
        >
          {CELLS.map((c, i) => (
            <Reveal
              key={c.title.zh}
              delay={i * 70}
              variant="pop"
              className={`group ${c.span}`}
            >
              <div
                className="spot-cell h-full p-6 transition-colors duration-200 group-hover:bg-[var(--panel-2)]"
                style={{ background: 'var(--panel)' }}
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md border border-line text-mist2 transition-colors group-hover:border-[var(--mist)] group-hover:text-mist3" style={{ background: 'var(--panel-2)' }}>
                  <Icon name={CELL_ICONS[i]} size={16} />
                </div>
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
