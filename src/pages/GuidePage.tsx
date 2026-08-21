import PixelWhale from '../components/PixelWhale'
import { GUIDE_PAGES, type GuidePageData } from '../content/guides'

function routeLinks(page: GuidePageData) {
  return GUIDE_PAGES.filter((item) => item.locale === page.locale).map((item) => ({
    label: item.navTitle,
    href: `../${item.slug}/`,
  }))
}

export default function GuidePage({ page }: { page: GuidePageData }) {
  const isEnglish = page.locale === 'en'
  const links = routeLinks(page)
  const homeHref = isEnglish ? '../../en/' : '../'
  const languageHref = isEnglish ? `../../${page.slug}/` : `../en/${page.slug}/`

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <a className="skip-link" href="#article">{isEnglish ? 'Skip to content' : '跳到主要内容'}</a>
      <header className="border-b border-line" style={{ background: 'var(--panel)' }}>
        <div className="mx-auto flex min-h-[64px] max-w-5xl items-center gap-4 px-5 py-3">
          <a href={homeHref} className="flex items-center gap-2.5" aria-label={isEnglish ? 'dsh-TUI home' : 'dsh-TUI 首页'}>
            <PixelWhale float={false} className="h-7 w-9" />
            <span className="font-mono2 font-bold text-head"><span className="text-mist">dsh</span>-TUI</span>
          </a>
          <nav aria-label={isEnglish ? 'Documentation' : '文档导航'} className="ml-auto hidden flex-wrap justify-end gap-x-4 gap-y-2 md:flex">
            {links.map((link) => <a key={link.href} href={link.href} className="text-[12.5px] text-dim hover:text-mist3">{link.label}</a>)}
          </nav>
          <a href={languageHref} className="font-mono2 rounded border border-line px-2.5 py-1.5 text-[11.5px] text-dim hover:text-mist3">
            {isEnglish ? '中文' : 'EN'}
          </a>
        </div>
      </header>

      <main id="article" className="mx-auto grid max-w-5xl gap-12 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_220px] lg:py-20">
        <article>
          <p className="font-mono2 text-[11px] tracking-[0.2em] text-mist2">{page.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-[34px] font-bold leading-tight text-head sm:text-[46px]">{page.title}</h1>
          <p className="mt-5 max-w-3xl text-[16px] leading-[1.9] text-dim">{page.intro}</p>

          <div className="mt-12 space-y-12">
            {page.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`}>
                <h2 className="text-[24px] font-bold text-head">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 text-[14.5px] leading-[2] text-dim">{paragraph}</p>)}
                {section.bullets && (
                  <ul className="mt-4 space-y-2.5 pl-5 text-[14px] leading-[1.8] text-dim">
                    {section.bullets.map((bullet) => <li key={bullet} className="list-disc marker:text-mist">{bullet}</li>)}
                  </ul>
                )}
                {section.code && <pre className="font-mono2 mt-5 overflow-x-auto rounded-lg border border-line p-5 text-[12.5px] leading-[1.8] text-mist3" style={{ background: 'var(--panel)' }}><code>{section.code}</code></pre>}
              </section>
            ))}
          </div>
        </article>

        <aside className="order-first lg:order-last">
          <div className="rounded-lg border border-line p-4 lg:sticky lg:top-5" style={{ background: 'var(--panel)' }}>
            <p className="font-mono2 text-[10.5px] tracking-[0.16em] text-faint">{isEnglish ? 'ON THIS PAGE' : '本页内容'}</p>
            <ol className="mt-3 space-y-2.5">
              {page.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`} className="text-[12.5px] leading-relaxed text-dim hover:text-mist3">{section.heading}</a></li>)}
            </ol>
          </div>
        </aside>
      </main>

      <footer className="border-t border-line px-5 py-8 text-center text-[12px] text-faint">
        {isEnglish ? 'dsh-TUI · DeepSeek Harness terminal interface' : 'dsh-TUI · DeepSeek Harness 终端界面'}
      </footer>
    </div>
  )
}
