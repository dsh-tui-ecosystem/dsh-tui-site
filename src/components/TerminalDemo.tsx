import { useEffect, useRef, useState } from 'react'
import PixelSprite from './PixelSprite'
import { DEEPY_TERMINAL } from '../content/sprites/deepy-terminal'
import { useReducedMotion } from '../lib/useReducedMotion'
import { strings, useLang, useT } from '../i18n'

type Stage = 'boot' | 'userbar' | 'thinking' | 'answering' | 'done'

/* ---------------- typed text ---------------- */

function Typed({ text, speed = 120, className = '' }: { text: string; speed?: number; className?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= text.length) return
    const t = setTimeout(() => setN((v) => v + 1), speed)
    return () => clearTimeout(t)
  }, [n, text, speed])
  return (
    <span className={className}>
      {text.slice(0, n)}
      {n < text.length && <span className="cursor-blink">▌</span>}
    </span>
  )
}

/* ---------------- 顶栏：像素鲸鱼 + 双流光大字 ---------------- */

function Wordmark() {
  return (
    <div
      className="select-none leading-[1.6]"
      style={{ fontFamily: "'Press Start 2P', 'JetBrains Mono', monospace" }}
    >
      <div className="tw-line1 text-[clamp(17px,3.4vw,34px)]">DEEPSEEK&apos;</div>
      <div className="tw-line2 text-[clamp(17px,3.4vw,34px)]">HARNESS</div>
    </div>
  )
}

/** 顶栏里的 Deepy 终端版（素材见 /pets/deepy-terminal/），动作跟着演示走 */
interface DeepyState {
  key: string
  since: number
}

function BootHeader({ deepy }: { deepy: DeepyState }) {
  const lang = useLang()
  const t = useT()
  const reduced = useReducedMotion()
  return (
    <div className="chunk-in px-4 pt-4 sm:px-5 sm:pt-5">
      <div className="flex items-start gap-4 sm:gap-7">
        {/* 42×30 网格按 2× / 3× 整数倍放大，像素边缘才干净；与右侧文字块垂直居中 */}
        <PixelSprite
          sprite={DEEPY_TERMINAL}
          anim={DEEPY_TERMINAL.anims[deepy.key]}
          since={deepy.since}
          base={lang === 'en' ? '../pets/' : './pets/'}
          playing={!reduced}
          fill
          poster
          label={lang === 'en' ? 'Deepy, the dsh-TUI pixel whale' : 'dsh-TUI 像素小鲸鱼 Deepy'}
          className="term-sprite h-[60px] w-[84px] shrink-0 self-center sm:h-[90px] sm:w-[126px]"
        />
        <div className="min-w-0">
          <Wordmark />
          <div className="font-mono2 mt-3 space-y-0.5 text-[11px] leading-[1.7] sm:text-[12px]">
            <div style={{ color: 'var(--term-text)' }}>
              deepseek-v4-flash <span style={{ color: 'var(--term-faint)' }}>· Max effort</span>
            </div>
            <div style={{ color: 'var(--term-dim)' }}>D:\code\projects</div>
            <div style={{ color: 'var(--term-dim)' }}>
              {lang === 'zh' ? (
                <>
                  Tip: <span style={{ color: 'var(--term-accent)' }}>/model</span> 切换模型 ·{' '}
                  <span style={{ color: 'var(--term-accent)' }}>/help</span> 查看命令 · Tab 自动补全
                </>
              ) : (
                <>
                  Tip: <span style={{ color: 'var(--term-accent)' }}>/model</span> to switch models ·{' '}
                  <span style={{ color: 'var(--term-accent)' }}>/help</span> for commands · Tab for completion
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-3 text-[13px] font-bold tracking-[0.3em] sm:text-[14px]"
        style={{ color: 'var(--term-accent)' }}
      >
        {t(strings['terminal.tagline'])}
      </div>
    </div>
  )
}

/* ---------------- 底部三行状态栏 ---------------- */

function StatusBar({ stage, thinkS }: { stage: Stage; thinkS: number }) {
  const t = useT()
  const busy = stage === 'thinking' || stage === 'answering'
  const ctx = Math.min(8.9 + (busy ? thinkS * 0.7 : 0), 12.4)
  const pct = ((ctx / 1000) * 100).toFixed(1)
  const rest = Math.round(1000 - ctx)

  return (
    <div
      className="font-mono2 border-t px-3 py-1.5 text-[10.5px] leading-[1.75] sm:px-4 sm:text-[11.5px] select-none"
      style={{ borderColor: 'var(--term-line)', background: 'var(--term-status)', color: 'var(--term-dim)' }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="rounded-sm px-1.5 py-px font-semibold text-white"
          style={{ background: 'var(--term-chip)' }}
        >
          spat
        </span>
        <span className="hidden sm:inline" style={{ color: 'var(--term-faint)' }}>free</span>
        <span style={{ color: 'var(--term-text)' }} className="tnum whitespace-nowrap">
          ctx {ctx.toFixed(1)}k/1.0M <span style={{ color: 'var(--term-accent)' }}>{pct}%</span> {rest}k
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="tnum truncate" style={{ color: 'var(--term-text)' }}>
          deepseek-v4-flash <span style={{ color: 'var(--term-faint)' }}>· max ·</span> {ctx.toFixed(1)}k→190
        </span>
        <span className="whitespace-nowrap" style={{ color: 'var(--term-faint)' }}>
          <span style={{ color: 'var(--term-accent)' }}>master</span> · projects · hi
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="tnum" style={{ color: 'var(--term-accent)' }}>
          {busy
            ? t(strings['terminal.busy']).replace('{s}', String(thinkS))
            : t(strings['terminal.idle']).replace('{s}', '5')}
        </span>
        <span className="whitespace-nowrap" style={{ color: 'var(--term-faint)' }}>? for shortcuts</span>
      </div>
    </div>
  )
}

/* ---------------- 主组件 ---------------- */

export default function TerminalDemo() {
  const t = useT()
  const [stage, setStage] = useState<Stage>('boot')
  const [thinkS, setThinkS] = useState(0)
  const [lines, setLines] = useState(0)
  const [run, setRun] = useState(0)
  const [deepy, setDeepy] = useState<DeepyState>({ key: 'idle', since: 0 })
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))
    // 小鲸鱼跟着演示换动作：看你打字 → 思考 → 敲代码回答 → 完成庆祝一下 → 待机
    const pose = (key: string) => setDeepy({ key, since: performance.now() })
    const happyMs = DEEPY_TERMINAL.anims.happy.total

    at(0, () => {
      setStage('boot')
      setThinkS(0)
      setLines(0)
      pose('idle')
    })

    at(500, () => {
      setStage('userbar')
      pose('idle-look')
    })
    at(2000, () => {
      setStage('thinking')
      pose('thinking')
    })
    at(4700, () => {
      setStage('answering')
      setLines(1)
      pose('typing')
    })
    at(5400, () => setLines(2))
    at(5900, () => setLines(3))
    at(6400, () => setLines(4))
    at(7000, () => setLines(5))
    at(7700, () => {
      setStage('done')
      pose('happy')
    })
    at(7700 + happyMs, () => pose('idle'))
    at(14000, () => setRun((r) => r + 1))

    return () => timers.forEach(clearTimeout)
  }, [run])

  // Thinking 秒数跳动
  useEffect(() => {
    if (stage !== 'thinking' && stage !== 'answering') return
    const t = setInterval(() => setThinkS((v) => Math.min(v + 1, 5)), 650)
    return () => clearInterval(t)
  }, [stage])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [stage, lines])

  const thinking = stage === 'thinking' || stage === 'answering' || stage === 'done'

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-line"
      style={{ background: 'var(--term-bg)', boxShadow: 'var(--term-shadow)' }}
    >
      {/* window chrome */}
      <div
        className="flex items-center gap-2 border-b px-3.5 py-2.5"
        style={{ background: 'var(--term-chrome)', borderColor: 'var(--term-line)' }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#f0685f]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f5c542]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3ddc84]/80" />
        <span className="font-mono2 ml-2 text-[11px]" style={{ color: 'var(--term-faint)' }}>
          dsh-tui — fullscreen · 120×36
        </span>
        <span className="font-mono2 ml-auto hidden text-[11px] sm:block" style={{ color: 'var(--term-faint)' }}>
          dsh-TUI v0.1
        </span>
      </div>

      <BootHeader deepy={deepy} />

      {/* transcript */}
      <div
        ref={scrollRef}
        className="font-mono2 h-[270px] space-y-1.5 overflow-hidden px-4 py-3 text-[12px] leading-[1.85] sm:h-[300px] sm:px-5 sm:text-[13px]"
        style={{ color: 'var(--term-text)', scrollBehavior: 'smooth' }}
      >
        {stage !== 'boot' && (
          <div className="chunk-in -mx-4 px-4 py-0.5 sm:-mx-5 sm:px-5" style={{ background: 'var(--term-userbar)' }}>
            <span style={{ color: 'var(--term-dim)' }}>❯ </span>
            <Typed text="hi" speed={150} />
          </div>
        )}

        {thinking && (
          <div className="chunk-in tnum italic" style={{ color: 'var(--term-faint)' }}>
            ∴ Thinking · {thinkS}s (ctrl+o to expand)
          </div>
        )}

        {lines >= 1 && (
          <div className="chunk-in">
            <span style={{ color: 'var(--term-accent)' }}>● </span>
            {t(strings['terminal.line1'])}
          </div>
        )}
        {lines >= 2 && <div className="chunk-in pl-4">{t(strings['terminal.line2'])}</div>}
        {lines >= 3 && <div className="chunk-in pl-4">{t(strings['terminal.line3'])}</div>}
        {lines >= 4 && <div className="chunk-in pl-4">{t(strings['terminal.line4'])}</div>}
        {lines >= 5 && <div className="chunk-in pt-1">{t(strings['terminal.line5'])}</div>}

        {stage === 'done' && (
          <div className="chunk-in pt-1.5">
            <div className="my-1.5 border-t" style={{ borderColor: 'var(--term-line)' }} />
            <span style={{ color: 'var(--term-dim)' }}>❯ </span>
            <span className="cursor-blink" style={{ color: 'var(--term-text)' }}>█</span>
          </div>
        )}
      </div>

      <StatusBar stage={stage} thinkS={thinkS} />
    </div>
  )
}
