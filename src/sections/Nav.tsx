import { useEffect, useState } from 'react'
import PixelWhale from '../components/PixelWhale'
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
    <header className={`fixed inset-x-0 top-0 z-50 ${scrolled || open ? 'nav-scrolled' : ''}`}>
      <div className="mx-auto flex h-[61px] max-w-6xl items-center gap-3 px-5">
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
        <nav aria-label={strings['nav.aria.main'][lang]} className="ml-auto hidden items-center lg:flex">
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
          <span className="ml-16 flex items-center gap-7">
            {NAV_SECONDARY.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="group flex items-center gap-1 whitespace-nowrap text-[13.5px] tracking-[-0.006em] text-faint transition-colors hover:text-head"
              >
                {l.label[lang]}
                {l.external && (
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 stroke-current" fill="none" strokeWidth="1.5" aria-hidden="true">
                    <path d="M4 2h6v6M10 2 3 9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>
            ))}
          </span>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-16">
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
            <svg viewBox="0 0 20 20" className="theme-icon-sun h-4 w-4 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true">
                <circle cx="10" cy="10" r="4" />
                <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.9 3.9l1.4 1.4M14.7 14.7l1.4 1.4M16.1 3.9l-1.4 1.4M5.3 14.7l-1.4 1.4" />
            </svg>
            <svg viewBox="0 0 20 20" className="theme-icon-moon h-4 w-4 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true">
                <path d="M16.5 12.5A7 7 0 0 1 7.5 3.5a7 7 0 1 0 9 9Z" />
            </svg>
          </button>
          <a
            href="https://github.com/ccch1mneyyy/dsh-TUI"
            target="_blank"
            rel="noreferrer"
            className="btn-press flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded bg-[var(--mist-solid)] px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[var(--mist-solid-hover)]"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span className="tnum">GitHub {starDisplay && `★ ${starDisplay}`}</span>
          </a>
          <button
            className="btn-press rounded border border-line p-1.5 text-dim lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={strings['nav.menu'][lang]}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.6">
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={strings['nav.aria.mobile'][lang]}
          className="border-t border-soft px-5 py-3 lg:hidden"
          style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(12px)' }}
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
                key={l.href}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={() => setOpen(false)}
                className="rounded border border-soft px-3 py-2 text-center text-[13px] text-faint"
              >
                {l.label[lang]}
                {l.external && ' ↗'}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
