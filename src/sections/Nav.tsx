import { useEffect, useState } from 'react'
import PixelWhale from '../components/PixelWhale'
import Icon from '../components/Icon'
import BrandIcon from '../components/BrandIcon'
import { formatStars, useStars } from '../lib/useStars'
import { NAV_LINKS, NAV_SECONDARY, strings, useLang, type Lang } from '../i18n'

function rememberLang(target: Lang) {
  try {
    localStorage.setItem('dsh-tui-lang', target)
  } catch {
    /* ignore */
  }
}

/** 主题翻转会同时改动全站近千个元素的 color / background / border，
 *  这些过渡一起触发就会糊成一片，所以切换期间整体压掉过渡，让它瞬切。
 *
 *  移除必须同步做完：过渡是否启动在样式重算那一刻就定下来了，
 *  下面的强制回流已经让新值在 transition:none 生效期间完成重算。
 *  用 requestAnimationFrame 延后移除会在后台标签页里永远不触发
 *  （rAF 在不渲染的标签页中不排程），全站过渡会就此永久失效。 */
function withoutTransitions(swap: () => void) {
  const style = document.createElement('style')
  style.append(document.createTextNode('*,*::before,*::after{transition:none !important}'))
  document.head.appendChild(style)
  swap()
  void document.body.offsetHeight // 强制重算，新值在无过渡状态下落定
  style.remove()
}

export default function Nav() {
  const lang = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const starCount = useStars()

  const toggleTheme = () => {
    withoutTransitions(() => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('dsh-tui-theme', next)
      } catch {
        /* ignore */
      }
    })
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const starDisplay = formatStars(starCount)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${scrolled || open ? 'nav-scrolled' : ''}`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-[61px] max-w-6xl items-center gap-3 px-page">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <PixelWhale float={false} className="h-7 w-9" />
          <span className="font-mono2 whitespace-nowrap text-[15px] font-bold tracking-tight text-head">
            <span className="text-mist">dsh</span>-TUI
          </span>
        </a>
        <span className="font-mono2 hidden whitespace-nowrap rounded border border-line px-1.5 py-0.5 text-[10.5px] text-dim md:inline-block">
          public beta
        </span>

        {/* 页内锚点与站外目的地分成两组：组内 28px，组间 64px（2.3×），靠留白分组而不是分隔线 */}
        <nav aria-label={strings['nav.aria.main'][lang]} className="ms-auto hidden items-center lg:flex">
          <span className="flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="whitespace-nowrap text-[13.5px] font-medium tracking-[-0.006em] text-dim transition-colors hover:text-head"
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
                className="group flex items-center gap-1 whitespace-nowrap text-[13.5px] tracking-[-0.006em] text-faint transition-colors hover:text-head"
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
