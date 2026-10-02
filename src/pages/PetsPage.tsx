import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import DeepyMark from '../components/DeepyMark'
import PixelSprite from '../components/PixelSprite'
import Icon from '../components/Icon'
import { LangProvider, useLang, useT, type Lang } from '../i18n'
import { toggleTheme } from '../lib/theme'
import { useReducedMotion } from '../lib/useReducedMotion'
import {
  PETS,
  PET_ANIM_COUNT,
  PET_DEMO,
  PET_EVENTS,
  PETS_COPY as C,
  animFor,
  stateLabel,
  type Pet,
  type PetEvent,
  type PetId,
} from '../content/pets'

/* 页面在 /pets/ 与 /en/pets/ 两处，链接一律写相对路径（与指南页一致），
   SITE_URL 指向子路径部署时也不会断。 */
function paths(lang: Lang) {
  return {
    home: '../',
    guides: '../getting-started/',
    plugins: '../plugins/',
    other: lang === 'en' ? '../../pets/' : '../en/pets/',
    /** 精灵表与完整拆解页都在中文路径 /pets/<id>/ 下 */
    pets: lang === 'en' ? '../../pets/' : './',
  }
}

/* ---------------------------------------------------------------- header */

function PetsHeader() {
  const lang = useLang()
  const t = useT()
  const p = paths(lang)
  const links = [
    { href: p.home, label: { zh: '首页', en: 'Home' } },
    { href: p.guides, label: { zh: '指南', en: 'Guides' } },
    { href: p.plugins, label: { zh: '插件市场', en: 'Plugins' } },
  ]
  return (
    <header
      className="sticky top-0 z-40 border-b border-line"
      style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(12px)', paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-page md:h-[61px]">
        <a href={p.home} className="flex shrink-0 items-center gap-2.5" aria-label={lang === 'en' ? 'dsh-TUI home' : 'dsh-TUI 首页'}>
          <DeepyMark className="h-6 w-[37px]" />
          <span className="font-mono2 whitespace-nowrap text-[15px] font-bold tracking-tight text-head">
            <span className="text-mist">dsh</span>-TUI
          </span>
        </a>
        <nav aria-label={lang === 'en' ? 'Site' : '站点导航'} className="ms-auto hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[13.5px] text-dim transition-colors hover:text-head">
              {t(l.label)}
            </a>
          ))}
          <span aria-current="page" className="text-[13.5px] font-medium text-head">
            {t({ zh: '桌宠', en: 'Desk pets' })}
          </span>
        </nav>
        <div className="ms-auto flex items-center gap-2 md:ms-8">
          <a
            href={p.other}
            lang={lang === 'en' ? 'zh-CN' : 'en'}
            hrefLang={lang === 'en' ? 'zh-CN' : 'en'}
            className="btn-press font-mono2 whitespace-nowrap rounded border border-line px-2.5 py-1.5 text-[11.5px] text-dim transition-colors hover:border-[var(--mist)] hover:text-mist3"
          >
            {lang === 'en' ? '中文' : 'EN'}
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-press flex h-[30px] w-[30px] items-center justify-center rounded border border-line text-dim transition-colors hover:border-[var(--mist)] hover:text-mist3"
            aria-label={lang === 'en' ? 'Toggle dark / light mode' : '切换深浅色模式'}
            title={lang === 'en' ? 'Toggle dark / light mode' : '切换深浅色模式'}
          >
            <Icon name="sun" size={16} className="theme-icon-sun" />
            <Icon name="moon" size={16} className="theme-icon-moon" />
          </button>
        </div>
      </div>
    </header>
  )
}

/* ---------------------------------------------------------------- live desk */

interface Slot {
  key: string
  /** performance.now()：这个动画从哪一刻开始播 */
  since: number
  /** 临时状态的结束时刻；0 = 常驻 */
  until: number
  /** 临时状态结束后回到哪里 */
  base: string
}
type Slots = Record<PetId, Slot>

interface LogLine {
  time: string
  code: string
  state: string
}

const INITIAL: Slots = Object.fromEntries(
  PETS.map((p) => [p.id, { key: 'idle', since: 0, until: 0, base: 'idle' }]),
) as Slots

const EVENT_BY_CODE = Object.fromEntries(PET_EVENTS.map((e) => [e.code, e])) as Record<string, PetEvent>

function clock() {
  const d = new Date()
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':')
}

/** 进入临时状态：记住被打断的常驻状态，结束后回去；睡着时被打断就醒来回到待机 */
function interrupt(cur: Slot, key: string, holdMs: number, now: number, forceIdle = false): Slot {
  let base = cur.until ? cur.base : cur.key
  if (forceIdle || base === 'sleeping') base = 'idle'
  return { key, since: now, until: now + holdMs, base }
}

function LiveDesk({ reduced }: { reduced: boolean }) {
  const lang = useLang()
  const t = useT()
  const base = paths(lang).pets
  const [slots, setSlots] = useState<Slots>(INITIAL)
  const [active, setActive] = useState<string | null>(null)
  const [log, setLog] = useState<LogLine | null>(null)
  const [autoChoice, setAutoChoice] = useState<boolean | null>(null)
  const [touched, setTouched] = useState(false)
  const clicks = useRef<Record<string, number[]>>({})

  // 默认自动演示；系统要求减少动态时默认关掉，等访客自己点
  const auto = autoChoice ?? !reduced
  const playing = !reduced || touched || auto

  const fire = useCallback((ev: PetEvent, demo: boolean) => {
    const now = performance.now()
    setSlots((prev) => {
      const next = { ...prev }
      for (const pet of PETS) {
        const a = animFor(pet, ev)
        next[pet.id] =
          ev.loops && !demo
            ? interrupt(prev[pet.id], a.key, Math.max(ev.loops * a.total, 1200), now, ev.key === 'waking')
            : { key: a.key, since: now, until: 0, base: a.key }
      }
      return next
    })
    setActive(ev.code)
    setLog({ time: clock(), code: ev.code, state: animFor(PETS[0], ev).state })
  }, [])

  // 临时状态到点回退
  useEffect(() => {
    const pending = Object.values(slots).filter((s) => s.until)
    if (!pending.length) return
    const due = Math.min(...pending.map((s) => s.until))
    const id = window.setTimeout(() => {
      const now = performance.now()
      setSlots((prev) => {
        const next = { ...prev }
        for (const pet of PETS) {
          const s = prev[pet.id]
          if (s.until && s.until <= now + 4) next[pet.id] = { key: s.base, since: now, until: 0, base: s.base }
        }
        return next
      })
    }, Math.max(0, due - performance.now()))
    return () => window.clearTimeout(id)
  }, [slots])

  // 自动演示：一次典型的 agent 会话循环播放
  useEffect(() => {
    if (!auto) return
    let i = 0
    let id = 0
    const step = () => {
      const [code, ms] = PET_DEMO[i % PET_DEMO.length]
      fire(EVENT_BY_CODE[code], true)
      i += 1
      id = window.setTimeout(step, ms)
    }
    id = window.setTimeout(step, 0)
    return () => window.clearTimeout(id)
  }, [auto, fire])

  const onEvent = (ev: PetEvent) => {
    setAutoChoice(false)
    setTouched(true)
    fire(ev, false)
  }

  const poke = (pet: Pet, e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const side = e.clientX && e.clientX - r.left > r.width / 2 ? 'right' : 'left'
    const now = e.timeStamp // 与 performance.now() 同一时间轴
    const recent = (clicks.current[pet.id] ?? []).filter((x) => now - x < 1500)
    recent.push(now)
    clicks.current[pet.id] = recent
    const key = recent.length >= 4 ? 'tickle' : side === 'left' ? 'poke-left' : 'poke-right'
    const a = pet.byKey[key]
    setAutoChoice(false)
    setTouched(true)
    setSlots((prev) => ({ ...prev, [pet.id]: interrupt(prev[pet.id], key, Math.max(a.total, 1200), now) }))
    setActive(null)
    setLog({ time: clock(), code: recent.length >= 4 ? `click ×${recent.length}` : `click · ${side}`, state: `${a.state} · ${t(pet.short)}` })
  }

  return (
    <div className="overflow-clip rounded-lg border border-line shadow-[var(--term-shadow)]" style={{ background: 'var(--panel)' }}>
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2" style={{ background: 'var(--panel-2)' }}>
        <span className="h-2 w-2 rounded-full bg-[#f0685f]/70" />
        <span className="h-2 w-2 rounded-full bg-[#f5c542]/70" />
        <span className="h-2 w-2 rounded-full bg-[#3ddc84]/70" />
        <span className="font-mono2 ms-2 truncate text-[11px] text-faint">{t(C.listener)}</span>
        <button
          type="button"
          aria-pressed={auto}
          onClick={() => {
            setTouched(true)
            setAutoChoice(!auto)
          }}
          className="btn-press font-mono2 ms-auto flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-dim transition-colors hover:border-[var(--mist)] hover:text-head aria-pressed:text-head"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors ${auto ? 'bg-[var(--ok)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--ok)_22%,transparent)]' : 'bg-[var(--text-faint)]'}`}
            aria-hidden="true"
          />
          {t(C.auto)}
        </button>
      </div>

      <div className="p-3 sm:p-4">
        {/* 窄屏下舞台吸顶：往下翻事件按钮时还能看见三只的反应 */}
        <div
          className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10 -mx-3 -mt-3 grid grid-cols-3 gap-2 px-3 pb-3 pt-3 sm:static sm:mx-0 sm:mt-0 sm:gap-3 sm:p-0"
          style={{ background: 'var(--panel)' }}
        >
          {PETS.map((pet) => {
            const slot = slots[pet.id]
            const anim = pet.byKey[slot.key]
            return (
              <figure key={pet.id} className="flex min-w-0 flex-col overflow-hidden rounded-md border border-line">
                <button
                  type="button"
                  onClick={(e) => poke(pet, e)}
                  aria-label={`${t(C.poke)} · ${t(pet.name)}`}
                  title={t(C.pokeHint)}
                  className={`pet-surface pet-surface-${pet.surface} relative block aspect-square w-full cursor-pointer sm:aspect-[5/4]`}
                >
                  <PixelSprite
                    sprite={pet}
                    anim={anim}
                    since={slot.since}
                    base={base}
                    playing={playing}
                    label={`${t(pet.name)} · ${t(anim.title)}`}
                    className={`absolute ${pet.surface === 'term' ? 'term-sprite inset-x-[6%] inset-y-[16%] sm:inset-x-[10%] sm:inset-y-[18%]' : 'inset-[2%] sm:inset-[7%]'}`}
                  />
                  {pet.surface === 'term' && (
                    <span className="font-mono2 absolute bottom-1.5 left-2 text-[10px] text-[var(--term-faint)] sm:bottom-2 sm:left-3 sm:text-[11px]" aria-hidden="true">
                      <span className="text-[var(--ok)]">❯</span> deepy
                    </span>
                  )}
                </button>
                <figcaption className="border-t border-line px-2 py-2 sm:px-3 sm:py-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12px] font-semibold text-head sm:text-[13px]">{t(pet.short)}</span>
                    <a href={`${base}${pet.id}/`} className="font-mono2 hidden shrink-0 text-[11px] text-faint transition-colors hover:text-mist3 sm:inline">
                      {t(C.open)} ↗
                    </a>
                  </div>
                  <div className="mt-1 flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                    <span className="font-mono2 truncate text-[10.5px] text-mist3 sm:text-[11px]">{stateLabel(anim.state, lang)}</span>
                    <span className="truncate text-[11.5px] text-dim sm:text-[12px]">{t(anim.title)}</span>
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 sm:mt-5">
          <h2 id="live-events" className="text-[15px] font-bold text-head">{t(C.events)}</h2>
          <span className="text-[12px] text-faint">{t(C.pokeHint)}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:grid-cols-8" role="group" aria-labelledby="live-events">
          {PET_EVENTS.map((ev) => (
            <button
              key={ev.code}
              type="button"
              aria-pressed={active === ev.code}
              onClick={() => onEvent(ev)}
              className="btn-press flex min-w-0 flex-col items-start rounded border border-line px-2.5 py-2 text-start transition-colors hover:border-[var(--mist)] aria-pressed:border-[var(--mist)] aria-pressed:bg-[var(--mist-wash)] lg:px-2"
            >
              <span className="w-full truncate text-[12.5px] font-medium text-head">{t(ev.name)}</span>
              {/* PostToolUseFailure 是最长的一个：8 列时缩到 10px 才放得下，不截断 hook 名 */}
              <span className="font-mono2 mt-0.5 w-full truncate text-[10.5px] tracking-[-0.01em] text-faint lg:text-[10px]">{ev.code}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="font-mono2 flex min-h-[38px] items-center gap-3 border-t border-line px-3.5 py-2 text-[11.5px]" style={{ background: 'var(--panel-2)' }}>
        {log ? (
          <>
            <span className="tnum text-faint">{log.time}</span>
            <span className="truncate">
              <span className="text-mist3">{log.code}</span>
              <span className="text-faint"> → </span>
              <span className="font-semibold text-head">{stateLabel(log.state, lang)}</span>
            </span>
          </>
        ) : (
          <span className="text-faint">{t(C.waiting)}</span>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- gallery */

function AnimCard({ pet, animKey, reduced, base }: { pet: Pet; animKey: string; reduced: boolean; base: string }) {
  const lang = useLang()
  const t = useT()
  const [hover, setHover] = useState(false)
  const anim = pet.byKey[animKey]
  return (
    <li
      className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-line transition-colors hover:border-[var(--mist)]"
      style={{ background: 'var(--panel)' }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className={`pet-surface pet-surface-${pet.surface} relative aspect-[5/4]`}>
        <PixelSprite
          sprite={pet}
          anim={anim}
          base={base}
          playing={!reduced || hover}
          label={`${t(pet.name)} · ${t(anim.title)}`}
          className={`absolute ${pet.surface === 'term' ? 'term-sprite inset-x-[9%] inset-y-[16%]' : 'inset-[6%]'}`}
        />
      </div>
      <div className="flex flex-1 flex-col border-t border-line px-3 py-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="min-w-0 text-[13.5px] font-semibold leading-snug text-head">{t(anim.title)}</h3>
          <span className="font-mono2 tnum shrink-0 text-[10.5px] text-faint">
            {anim.durs.length} {t(C.frames)} · {(anim.total / 1000).toFixed(1)}s
          </span>
        </div>
        <span className="font-mono2 mt-1 truncate text-[11px] text-mist3">{stateLabel(anim.state, lang)}</span>
        <p className="mt-1.5 text-[12px] leading-[1.65] text-dim">{t(anim.trigger)}</p>
      </div>
    </li>
  )
}

function Gallery({ reduced }: { reduced: boolean }) {
  const lang = useLang()
  const t = useT()
  const base = paths(lang).pets
  const [tab, setTab] = useState<PetId>(PETS[0].id)
  const tabRefs = useRef(new Map<PetId, HTMLButtonElement>())

  // 方向键在标签之间移动（WAI-ARIA tabs 模式）
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    // 以当前获得焦点的标签为起点（焦点可能不在已选中的那个上）
    const focused = PETS.findIndex((p) => tabRefs.current.get(p.id) === e.target)
    const i = focused >= 0 ? focused : PETS.findIndex((p) => p.id === tab)
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? PETS.length - 1 : step ? (i + step + PETS.length) % PETS.length : -1
    if (to < 0) return
    e.preventDefault()
    setTab(PETS[to].id)
    tabRefs.current.get(PETS[to].id)?.focus()
  }

  return (
    <>
      <div role="tablist" aria-label={t(C.setsLabel)} onKeyDown={onKey} className="flex flex-wrap gap-2">
        {PETS.map((pet) => {
          const on = tab === pet.id
          return (
            <button
              key={pet.id}
              ref={(el) => {
                if (el) tabRefs.current.set(pet.id, el)
                else tabRefs.current.delete(pet.id)
              }}
              type="button"
              role="tab"
              id={`pets-tab-${pet.id}`}
              aria-selected={on}
              aria-controls={`pets-panel-${pet.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setTab(pet.id)}
              className={`btn-press flex shrink-0 items-center gap-2 whitespace-nowrap rounded border px-3 py-2 text-[13px] transition-colors ${
                on
                  ? 'border-[var(--mist)] bg-[var(--mist-wash)] font-medium text-head'
                  : 'border-line text-dim hover:border-[var(--mist)] hover:text-head'
              }`}
            >
              {t(pet.name)}
              <span className="font-mono2 tnum text-[11px] text-faint">{pet.anims.length}</span>
            </button>
          )
        })}
      </div>

      {PETS.map((pet) => (
        <div
          key={pet.id}
          role="tabpanel"
          id={`pets-panel-${pet.id}`}
          aria-labelledby={`pets-tab-${pet.id}`}
          hidden={tab !== pet.id}
          tabIndex={0}
          className="mt-6 focus-visible:outline-none"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="font-mono2 text-[11px] tracking-[0.14em] text-mist2">{t(pet.kind)}</p>
              <p className="mt-2 max-w-3xl text-[14px] leading-[1.9] text-dim">{t(pet.desc)}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {pet.facts.map((f) => (
                  <li key={f.zh} className="font-mono2 rounded border border-line px-2 py-1 text-[11px] text-dim" style={{ background: 'var(--panel)' }}>
                    {t(f)}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={`${base}${pet.id}/`}
              className="btn-press inline-flex items-center justify-center gap-1.5 self-start rounded bg-[var(--mist-solid)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--mist-solid-hover)] lg:self-end"
            >
              {t(pet.more)}
              {t(C.zhOnly)}
              <Icon name="arrow-up-right" size={14} />
            </a>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
            {pet.anims.map((a) => (
              <AnimCard key={a.key} pet={pet} animKey={a.key} reduced={reduced} base={base} />
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

/* ---------------------------------------------------------------- page */

function PetsView() {
  const lang = useLang()
  const t = useT()
  const reduced = useReducedMotion()
  const p = paths(lang)
  return (
    <div className="grid-bg min-h-screen" style={{ background: 'var(--bg)' }}>
      <a className="skip-link" href="#main-content">{lang === 'en' ? 'Skip to main content' : '跳到主要内容'}</a>
      <PetsHeader />
      <main id="main-content" className="mx-auto max-w-6xl px-page pb-20 pt-8 md:pt-12">
        <nav aria-label={lang === 'en' ? 'Breadcrumb' : '面包屑导航'} className="flex items-center gap-2 text-[12px] text-faint">
          <a href={p.home} className="hover:text-mist3">{lang === 'en' ? 'Home' : '首页'}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-dim">{t(C.breadcrumb)}</span>
        </nav>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-12">
          <div>
            <p className="font-mono2 text-[11.5px] tracking-[0.2em] text-mist2">
              {t(C.kicker)} · {PET_ANIM_COUNT} LOOPS
            </p>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.15] tracking-[-0.015em] text-head sm:text-[46px]">{t(C.title)}</h1>
          </div>
          <p className="max-w-2xl text-[14.5px] leading-[1.9] text-dim">{t(C.intro)}</p>
        </div>

        <section aria-labelledby="live-events" className="mt-8 sm:mt-10">
          <LiveDesk reduced={reduced} />
        </section>

        <section aria-labelledby="pets-gallery" className="mt-16 sm:mt-24">
          <h2 id="pets-gallery" className="text-[clamp(26px,22px+1.2vw,40px)] font-bold leading-tight tracking-[-0.015em] text-head">
            {t(C.galleryTitle)}
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.9] text-dim">{t(C.galleryDesc)}</p>
          <div className="mt-8">
            <Gallery reduced={reduced} />
          </div>
        </section>
      </main>
      <footer
        className="border-t border-line px-page py-8 text-center text-[12px] text-faint"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {t(C.footer)}
      </footer>
    </div>
  )
}

export default function PetsPage({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'
  }, [lang])
  return (
    <LangProvider lang={lang}>
      <PetsView />
    </LangProvider>
  )
}
