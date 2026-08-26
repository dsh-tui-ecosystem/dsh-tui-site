import TerminalDemo from '../components/TerminalDemo'
import CommandLine from '../components/CommandLine'
import Icon from '../components/Icon'
import BrandIcon from '../components/BrandIcon'
import { HERO_BADGES, strings, useLang, useT } from '../i18n'

const INSTALL = 'npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui'

const BADGES = HERO_BADGES

/** 支持的平台。标识来自 Bootstrap Icons，仅用于说明兼容性。 */
const PLATFORMS = [
  { icon: 'windows', label: 'Windows' },
  { icon: 'apple', label: 'macOS' },
  { icon: 'tux', label: 'Linux' },
] as const

export default function Hero() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="top" className="grid-bg relative overflow-hidden pt-[61px]">
      {/* 星点 */}
      {[
        { l: '8%', t: '22%', d: '0s' }, { l: '16%', t: '58%', d: '0.8s' },
        { l: '46%', t: '14%', d: '1.6s' }, { l: '88%', t: '20%', d: '0.4s' },
        { l: '78%', t: '66%', d: '2s' }, { l: '60%', t: '8%', d: '1.1s' },
      ].map((s, i) => (
        <span
          key={i}
          className="pointer-events-none absolute h-1 w-1"
          style={{
            left: s.l, top: s.t, background: 'var(--mist-2)',
            animation: `twinkle 3s ease-in-out ${s.d} infinite`,
          }}
        />
      ))}

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-page pb-20 pt-14 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-10 lg:pt-20">
        {/* left */}
        <div>
          <div className="mb-7 flex flex-wrap gap-2">
            {BADGES.map((b) => (
              <span
                key={b.k.zh}
                className="font-mono2 rounded border border-line px-2 py-1 text-[11px] text-dim"
                style={{ background: 'var(--badge-bg)' }}
              >
                <span className="text-mist2">{b.k[lang]}</span>
                <span className="mx-1.5 text-faint">·</span>
                {b.v[lang]}
              </span>
            ))}
          </div>

          <div className="flex items-end gap-4 sm:gap-7">
            <div className="relative shrink-0">
              <img
                src={lang === 'en' ? '../whale-girl.png' : '/whale-girl.png'}
                alt={t(strings['hero.whaleAlt'])}
                className="whale-float h-[96px] w-[96px] sm:h-[168px] sm:w-[168px]"
                style={{ imageRendering: 'pixelated' }}
              />
              <span
                className="pointer-events-none absolute h-1.5 w-1.5"
                style={{ left: '-8%', top: '8%', background: 'var(--mist-2)', animation: 'twinkle 2.4s ease-in-out infinite' }}
              />
              <span
                className="pointer-events-none absolute h-1 w-1"
                style={{ right: '-6%', top: '22%', background: 'var(--mist-2)', animation: 'twinkle 2.4s ease-in-out 0.8s infinite' }}
              />
              <span
                className="pointer-events-none absolute h-1 w-1"
                style={{ left: '4%', bottom: '-4%', background: 'var(--mist-2)', animation: 'twinkle 2.4s ease-in-out 1.5s infinite' }}
              />
            </div>
            {/* 品牌字不能断行（连字符在 CSS 里是断点，会被断成 dsh- / TUI），
                但 nowrap 之后字号就必须是流体的：lg 断点在 1024px 生效，
                而左栏此时只有 ~281px 可用，固定 84px 会直接顶出去被右侧面板盖住。
                clamp 让它随视口连续缩放，两头都不失控。 */}
            <h1 className="font-mono2 min-w-0 whitespace-nowrap text-[38px] font-extrabold leading-[0.95] tracking-tight sm:text-[76px] lg:text-[clamp(56px,6.1vw,84px)]">
              <span className="wordmark-accent">dsh</span>
              <span className="wordmark-ink">-TUI</span>
            </h1>
          </div>

          <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-head sm:text-lg">
            {lang === 'zh' ? (
              <>
                Claude Code 风格的全屏终端交互，
                <br />
                为 <span className="text-mist3 font-semibold">DeepSeek Harness</span>
                <br className="sm:hidden" />
                {' '}补上没有 TUI 的那一块拼图。
              </>
            ) : (
              <>
                Claude Code-style fullscreen terminal interaction,
                <br />
                the missing TUI piece for
                <br className="sm:hidden" />
                {' '}<span className="text-mist3 font-semibold">DeepSeek Harness</span>.
              </>
            )}
          </p>
          <p className="mt-4 max-w-xl text-[14px] leading-[1.9] text-dim">
            {lang === 'zh' ? (
              <>
                像素鲸鱼顶栏、实时工作状态行、思考流式展开、
                <span className="whitespace-nowrap">双击 Esc</span>
                {' '}时间回溯、蓝白上下文进度条 + TPS 仪表。零核心改动，纯插件挂载 ——
                <span className="whitespace-nowrap">装上即用，卸了不留补丁。</span>
              </>
            ) : (
              t(strings['hero.desc'])
            )}
          </p>
          <p className="mt-3 max-w-xl text-[12.5px] leading-[1.8] text-faint">
            {t(strings['hero.aliases'])}
          </p>

          <CommandLine command={INSTALL} className="mt-8" />

          <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
            <a
              href="/downloads/dsh-tui-setup.zip"
              className="btn-press flex w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-[var(--mist-solid)] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--mist-solid-hover)] min-[420px]:w-auto"
            >
              <Icon name="download" size={15} weight={2} />
              {t(strings['hero.cta.bundle'])}
            </a>
            <a
              href="#install"
              className="btn-press group flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded border border-line px-5 py-2.5 text-[14px] text-dim transition-colors hover:border-[var(--mist)] hover:text-mist3 min-[420px]:w-auto"
            >
              {t(strings['hero.cta.start'])}
              <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#showcase"
              className="btn-press flex w-full items-center justify-center whitespace-nowrap rounded border border-line px-5 py-2.5 text-[14px] text-dim transition-colors hover:border-[var(--mist)] hover:text-mist3 min-[420px]:w-auto"
            >
              {t(strings['hero.cta.showcase'])}
            </a>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            {PLATFORMS.map((p) => (
              <span key={p.label} className="font-mono2 flex items-center gap-1.5 text-[12px] text-dim">
                <BrandIcon name={p.icon} size={13} />
                {p.label}
              </span>
            ))}
          </div>
          <div className="font-mono2 mt-2.5 text-[11.5px] text-faint">Node ^22.19 / ≥24 · pnpm 10+</div>
        </div>

        {/* right: live terminal */}
        <div className="relative">
          <TerminalDemo />
          <p className="font-mono2 mt-3 text-start text-[11px] text-faint sm:text-center">
            {t(strings['hero.demoNote'])}
          </p>
        </div>
      </div>
    </section>
  )
}