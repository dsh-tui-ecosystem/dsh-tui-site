import TerminalDemo from '../components/TerminalDemo'
import CopyButton from '../components/CopyButton'
import { formatStars, useStars } from '../lib/useStars'
import { HERO_BADGES, strings, useLang, useT } from '../i18n'

const INSTALL = 'npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui'

const BADGES = HERO_BADGES

export default function Hero() {
  const lang = useLang()
  const t = useT()
  const stars = formatStars(useStars())
  return (
    <section id="top" className="grid-bg relative overflow-hidden pt-[61px]">
      {/* 雾蓝氛围光 */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, var(--glow), transparent)' }}
      />
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

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 pb-20 pt-14 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-10 lg:pt-20">
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
            <h1 className="font-mono2 min-w-0 text-[38px] font-extrabold leading-[0.95] tracking-tight sm:text-[76px] lg:text-[84px]">
              <span className="wordmark-shine-blue">dsh</span>
              <span className="wordmark-shine">-TUI</span>
            </h1>
          </div>

          <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-head sm:text-lg">
            {lang === 'zh' ? (
              <>
                Claude Code 风格的全屏终端交互，
                <br className="hidden sm:block" />
                为 <span className="text-mist3 font-semibold">DeepSeek Harness</span> 补上没有 TUI 的那一块拼图。
              </>
            ) : (
              <>
                Claude Code-style fullscreen terminal interaction,
                <br className="hidden sm:block" />
                the missing TUI piece for <span className="text-mist3 font-semibold">DeepSeek Harness</span>.
              </>
            )}
          </p>
          <p className="mt-4 max-w-xl text-[14px] leading-[1.9] text-dim">
            {t(strings['hero.desc'])}
          </p>

          <div
            className="font-mono2 mt-8 flex max-w-xl items-center gap-2 overflow-hidden rounded-md border border-line px-3.5 py-3"
            style={{ background: 'var(--panel)' }}
          >
            <span className="text-faint select-none">$</span>
            <code className="min-w-0 flex-1 truncate text-[12px] text-mist3 sm:text-[12.5px]">{INSTALL}</code>
            <CopyButton text={INSTALL} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#install"
              className="btn-press rounded bg-[var(--mist)] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#5d7dff]"
            >
              {t(strings['hero.cta.start'])}
            </a>
            <a
              href="#showcase"
              className="btn-press rounded border border-line px-5 py-2.5 text-[14px] text-dim transition-colors hover:border-[var(--mist)] hover:text-mist3"
            >
              {t(strings['hero.cta.showcase'])}
            </a>
            <a
              href="https://github.com/ccch1mneyyy/dsh-TUI"
              target="_blank"
              rel="noreferrer"
              className="btn-press flex items-center gap-1.5 rounded border border-line px-5 py-2.5 text-[14px] text-dim transition-colors hover:border-[var(--mist)] hover:text-mist3"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              GitHub{stars ? ` ★ ${stars}` : ''}
            </a>
            <a
              href="https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui"
              target="_blank"
              rel="noreferrer"
              className="btn-press font-mono2 rounded border border-line px-5 py-2.5 text-[14px] text-dim transition-colors hover:border-[var(--mist)] hover:text-mist3"
            >
              npm
            </a>
          </div>
          <div className="font-mono2 mt-3 text-[11.5px] text-faint">
            Node ^22.19 / ≥24 · pnpm 10+ · Windows / macOS / Linux
          </div>
        </div>

        {/* right: live terminal */}
        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-6 rounded-2xl"
            style={{ background: 'radial-gradient(closest-side, var(--glow), transparent)' }}
          />
          <TerminalDemo />
          <p className="font-mono2 mt-3 text-center text-[11px] text-faint">
            {t(strings['hero.demoNote'])}
          </p>
        </div>
      </div>
    </section>
  )
}