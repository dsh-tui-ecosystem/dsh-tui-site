import SectionHead from '../components/SectionHead'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import { ARCH_PIPE, ARCH_POINTS, strings, useLang, useT } from '../i18n'

const PIPE = ARCH_PIPE
const POINTS = ARCH_POINTS

export default function Arch() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="arch" className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          title={t(strings['arch.title'])}
          desc={t(strings['arch.desc'])}
        />

        {/* 链路图：一条有序的链，所以用 <ol>，读屏能报出"9 项、第 3 项"。
            不再横向滚动 —— 看不全的图传达不了任何东西。改成自动换行，
            箭头放在节点**前面**：换行后新一行以 → 开头，读作"接上一行"，
            而不是让箭头吊在行尾指向空白。
            文字保持为真文字（可选中、可翻译、跟随用户字号），这是 SVG 或
            mermaid 做不到的，也省下一个几百 KB 的依赖。 */}
        <Reveal>
          <div className="rounded-lg border border-line p-5" style={{ background: 'var(--panel)' }}>
            <ol className="font-mono2 flex flex-wrap items-center gap-y-2 text-[12px]">
              {PIPE.map((p, i) => (
                <li key={p.zh} className="flex items-center">
                  {i > 0 && (
                    <Icon name="arrow-right" size={13} className="mx-2 shrink-0 text-faint" />
                  )}
                  <span
                    className={`rounded border px-3 py-2 ${
                      i === 2
                        ? 'border-[var(--mist)] bg-[var(--mist-wash)] text-mist3'
                        : i === PIPE.length - 1
                          ? 'border-[var(--mist-solid)] bg-[var(--mist-solid)] font-semibold text-white'
                          : 'border-line text-dim'
                    }`}
                  >
                    {p[lang]}
                  </span>
                </li>
              ))}
            </ol>
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
                  <span aria-hidden="true" className="text-mist font-mono2 me-2 text-[12px]">▸</span>
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
