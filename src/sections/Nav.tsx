import { useEffect, useRef, useState } from 'react'
import DeepyMark from '../components/DeepyMark'
import Icon from '../components/Icon'
import BrandIcon from '../components/BrandIcon'
import { formatStars, useStars } from '../lib/useStars'
import { toggleTheme } from '../lib/theme'
import { NAV_LINKS, NAV_SECONDARY, strings, useLang, type Lang } from '../i18n'

function rememberLang(target: Lang) {
  try {
    localStorage.setItem('dsh-tui-lang', target)
  } catch {
    /* ignore */
  }
}

export default function Nav() {
  const lang = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const starCount = useStars()
  const spyRef = useRef<HTMLSpanElement | null>(null)
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>())
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      // 滚动进度条：直接写 CSS 变量，不经过 React 渲染
      const max = document.documentElement.scrollHeight - window.innerHeight
      headerRef.current?.style.setProperty('--sp', String(max > 0 ? Math.min(1, y / max) : 0))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* scrollspy：视口上中部一条窄带（38%–45%）扫到哪个锚点区块，哪个链接点亮；
     回到首屏 hero 时熄灭。无链接的中段区块经过时保持上一次的状态。 */
  useEffect(() => {
    const targets = NAV_LINKS
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null)
    const hero = document.getElementById('top')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          setActive(e.target.id === 'top' ? null : `#${e.target.id}`)
        })
      },
      { rootMargin: '-38% 0px -55% 0px', threshold: 0 }
    )
    targets.forEach((s) => io.observe(s))
    if (hero) io.observe(hero)
    return () => io.disconnect()
  }, [])

  /* 墨条是一条共享的 ink：位置/宽度写成 CSS 变量，滑动本身交给 transition。 */
  useEffect(() => {
    const box = spyRef.current
    if (!box) return
    const link = active ? linkRefs.current.get(active) : undefined
    if (!link) {
      box.style.setProperty('--spy-on', '0')
      return
    }
    box.style.setProperty('--spy-x', `${link.offsetLeft}px`)
    box.style.setProperty('--spy-w', `${link.offsetWidth}px`)
    box.style.setProperty('--spy-on', '1')
  }, [active])

  const starDisplay = formatStars(starCount)

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 ${scrolled || open ? 'nav-scrolled' : ''}`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <span className="scroll-progress" aria-hidden="true" />
      <div className="mx-auto flex h-[61px] max-w-6xl items-center gap-3 px-page">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <DeepyMark className="h-6 w-[37px]" />
          <span className="font-mono2 whitespace-nowrap text-[15px] font-bold tracking-tight text-head">
            <span className="text-mist">dsh</span>-TUI
          </span>
        </a>
        <span className="font-pixel hidden whitespace-nowrap rounded border border-line px-1.5 py-0.5 text-[8px] text-dim md:inline-block">
          public beta
        </span>

        {/* 页内锚点与站外目的地分成两组：组内 28px，组间 64px（2.3×），靠留白分组而不是分隔线 */}
        <nav aria-label={strings['nav.aria.main'][lang]} className="ms-auto hidden items-center lg:flex">
          <span ref={spyRef} className="nav-spy flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                ref={(el) => {
                  if (el) linkRefs.current.set(l.href, el)
                  else linkRefs.current.delete(l.href)
                }}
                data-active={active === l.href}
                aria-current={active === l.href ? 'true' : undefined}
                className="nav-link whitespace-nowrap text-[13.5px] font-medium tracking-[-0.006em] text-dim transition-colors hover:text-head"
              >
                {l.label[lang]}
              </a>
            ))}
          </span>
          <span className="ms-16 flex items-center gap-7">
            {NAV_SECONDARY.map((l) => (
              <a
                key={l.label.zh}
                href={typeof l.href === 'string' ? l.href : l.href[lang]}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={`group ${l.wideOnly?.includes(lang) ? 'hidden xl:flex' : 'flex'} items-center gap-1 whitespace-nowrap text-[13.5px] tracking-[-0.006em] text-faint transition-colors hover:text-head`}
              >
                {l.label[lang]}
                {l.external && (
                  <Icon name="arrow-up-right" size={11} />
                )}
              </a>
            ))}
          </span>
        </nav>

        <div className="ms-auto flex items-center gap-2 lg:ms-16">
          <a
            href={lang === 'en' ? '../' : './en/'}
            onClick={() => rememberLang(lang === 'en' ? 'zh' : 'en')}
            className="btn-press font-mono2 whitespace-nowrap rounded border border-line px-2.5 py-1.5 text-[11.5px] text-dim transition-colors hover:border-[var(--mist)] hover:text-mist3"
            lang={lang === 'en' ? 'zh-CN' : 'en'}
            hrefLang={lang === 'en' ? 'zh-CN' : 'en'}
          >
            {lang === 'en' ? '中文' : 'EN'}
          </a>
          <button
            onClick={toggleTheme}
            className="btn-press flex h-[30px] w-[30px] items-center justify-center rounded border border-line text-dim transition-colors hover:border-[var(--mist)] hover:text-mist3"
            aria-label={strings['nav.toggleTheme'][lang]}
            title={strings['nav.toggleTheme'][lang]}
          >
            <Icon name="sun" size={16} className="theme-icon-sun" />
            <Icon name="moon" size={16} className="theme-icon-moon" />
          </button>
          <a
            href="https://github.com/ccch1mneyyy/dsh-TUI"
            target="_blank"
            rel="noreferrer"
            className="btn-press hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded bg-[var(--mist-solid)] px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[var(--mist-solid-hover)] min-[420px]:flex"
          >
            <BrandIcon name="github" size={14} />
            <span className="tnum">GitHub{starDisplay ? <span className="hidden sm:inline">{` ★ ${starDisplay}`}</span> : null}</span>
          </a>
          <button
            className="btn-press rounded border border-line p-1.5 text-dim lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={strings['nav.menu'][lang]}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <Icon name="menu" size={16} />
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={strings['nav.aria.mobile'][lang]}
          className="border-t border-soft px-page py-3 lg:hidden"
          style={{
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(12px)',
            paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded border border-soft px-3 py-2 text-center text-[13px] font-medium text-dim"
              >
                {l.label[lang]}
              </a>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {NAV_SECONDARY.map((l) => (
              <a
                key={l.label.zh}
                href={typeof l.href === 'string' ? l.href : l.href[lang]}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={() => setOpen(false)}
                className="rounded border border-soft px-3 py-2 text-center text-[13px] text-faint"
              >
                {l.label[lang]}
                {l.external && ' ↗'}
              </a>
            ))}
          </div>
          <a
            href="https://github.com/ccch1mneyyy/dsh-TUI"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="btn-press mt-4 flex items-center justify-center gap-1.5 rounded bg-[var(--mist-solid)] px-3 py-2.5 text-[13px] font-semibold text-white min-[420px]:hidden"
          >
            <BrandIcon name="github" size={14} />
            <span className="tnum">GitHub {starDisplay && `★ ${starDisplay}`}</span>
          </a>
        </nav>
      )}
    </header>
  )
}
