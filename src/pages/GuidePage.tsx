import DeepyMark from '../components/DeepyMark'
import Icon from '../components/Icon'
import { GUIDE_PAGES, type GuidePageData } from '../content/guides'

function routeLinks(page: GuidePageData) {
  return GUIDE_PAGES.filter((item) => item.locale === page.locale).map((item) => ({
    slug: item.slug,
    label: item.navTitle,
    href: `../${item.slug}/`,
    current: item.slug === page.slug,
  }))
}

function GuideDocNav({
  links,
  label,
}: {
  links: ReturnType<typeof routeLinks>
  label: string
}) {
  const current = links.find((link) => link.current)
  return (
    <details className="faq-item group border-t border-soft md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-page py-2 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 truncate text-[13px] font-medium text-head">{current?.label}</span>
        <Icon
          name="chevron-down"
          size={16}
          weight={2}
          className="shrink-0 text-mist transition-transform duration-200 ease-out group-open:-rotate-180"
        />
      </summary>
      <nav aria-label={label} className="grid grid-cols-2 gap-1.5 px-page pb-2.5">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={link.current ? 'page' : undefined}
            className={`rounded border px-2.5 py-1.5 text-center text-[12.5px] ${
              link.current
                ? 'border-[var(--mist)] bg-[var(--mist-wash)] font-medium text-mist3'
                : 'border-line text-dim'
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </details>
  )
}

function TocList({
  page,
  className = '',
}: {
  page: GuidePageData
  className?: string
}) {
  return (
    <ol className={`space-y-2.5 ${className}`}>
      {page.sections.map((section, index) => (
        <li key={section.heading}>
          <a href={`#section-${index + 1}`} className="text-[12.5px] leading-relaxed text-dim hover:text-mist3">
            {section.heading}
          </a>
        </li>
      ))}
    </ol>
  )
}

export default function GuidePage({ page }: { page: GuidePageData }) {
  const isEnglish = page.locale === 'en'
  const links = routeLinks(page)
  const homeHref = isEnglish ? '../../en/' : '../'
  const languageHref = isEnglish ? `../../${page.slug}/` : `../en/${page.slug}/`
  const navLabel = isEnglish ? 'Documentation' : '文档导航'
  const tocLabel = isEnglish ? 'On this page' : '本页内容'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <a className="skip-link" href="#article">{isEnglish ? 'Skip to content' : '跳到主要内容'}</a>
      <header
        className="sticky top-0 z-40 overflow-x-clip border-b border-line"
        style={{ background: 'var(--panel)', paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto flex min-h-[56px] max-w-5xl items-center gap-3 px-page py-3 md:min-h-[64px]">
          <a href={homeHref} className="flex shrink-0 items-center gap-2.5" aria-label={isEnglish ? 'dsh-TUI home' : 'dsh-TUI 首页'}>
            <DeepyMark className="h-6 w-[37px]" />
            <span className="font-mono2 font-bold text-head"><span className="text-mist">dsh</span>-TUI</span>
          </a>
          <nav aria-label={navLabel} className="ms-auto hidden flex-wrap justify-end gap-x-4 gap-y-2 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className={`text-[12.5px] ${link.current ? 'font-medium text-head' : 'text-dim hover:text-mist3'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href={languageHref}
            className="font-mono2 ms-auto shrink-0 rounded border border-line px-2.5 py-1.5 text-[11.5px] text-dim hover:text-mist3 md:ms-0"
          >
            {isEnglish ? '中文' : 'EN'}
          </a>
        </div>
        <GuideDocNav links={links} label={navLabel} />
      </header>

      <main id="article" className="mx-auto grid max-w-5xl gap-10 px-page py-10 md:grid-cols-[minmax(0,1fr)_200px] md:gap-12 md:py-16 lg:py-20">
        <article className="min-w-0">
          <nav aria-label={isEnglish ? 'Breadcrumb' : '面包屑导航'} className="mb-6 flex items-center gap-2 text-[12px] text-faint">
            <a href={homeHref} className="hover:text-mist3">{isEnglish ? 'Home' : '首页'}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-dim">{page.navTitle}</span>
          </nav>
          <h1 className="max-w-3xl text-[26px] font-bold leading-[1.25] text-head sm:text-[46px] sm:leading-tight">{page.title}</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.9] text-dim sm:mt-5 sm:text-[16px]">{page.intro}</p>

          <details className="faq-item group mt-8 rounded-lg border border-line md:hidden" style={{ background: 'var(--panel)' }}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="text-[13px] font-medium text-head">{tocLabel}</span>
              <Icon
                name="chevron-down"
                size={16}
                weight={2}
                className="shrink-0 text-mist transition-transform duration-200 ease-out group-open:-rotate-180"
              />
            </summary>
            <TocList page={page} className="faq-answer px-4 pb-4" />
          </details>

          <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-12">
            {page.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`} className="scroll-mt-28 md:scroll-mt-24">
                <h2 className="text-[22px] font-bold text-head sm:text-[24px]">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 text-[14.5px] leading-[2] text-dim">{paragraph}</p>)}
                {section.bullets && (
                  <ul className="mt-4 space-y-2.5 ps-5 text-[14px] leading-[1.8] text-dim">
                    {section.bullets.map((bullet) => <li key={bullet} className="list-disc marker:text-mist">{bullet}</li>)}
                  </ul>
                )}
                {section.code && (
                  <pre className="font-mono2 mt-5 overflow-x-auto rounded-lg border border-line p-4 text-[12.5px] leading-[1.8] text-mist3 sm:p-5" style={{ background: 'var(--panel)' }}>
                    <code>{section.code}</code>
                  </pre>
                )}
              </section>
            ))}
          </div>
        </article>

        <aside className="hidden md:block">
          <div className="sticky top-20 rounded-lg border border-line p-4" style={{ background: 'var(--panel)' }}>
            <p className="font-mono2 text-[10.5px] tracking-[0.16em] text-faint">{isEnglish ? 'ON THIS PAGE' : '本页内容'}</p>
            <TocList page={page} className="mt-3" />
          </div>
        </aside>
      </main>

      <footer
        className="border-t border-line px-page py-8 text-center text-[12px] text-faint"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {isEnglish ? 'dsh-TUI · DeepSeek Harness terminal interface' : 'dsh-TUI · DeepSeek Harness 终端界面'}
      </footer>
    </div>
  )
}
