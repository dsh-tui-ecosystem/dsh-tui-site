import SectionHead from '../components/SectionHead'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import { GUIDE_CARDS, strings, useLang, useT } from '../i18n'

const GUIDES = GUIDE_CARDS

export default function Guides() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="guides" className="py-24" style={{ background: 'var(--bg-2-glass)' }}>
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          title={t(strings['guides.title'])}
          desc={t(strings['guides.desc'])}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide, i) => (
            <Reveal key={guide.href} delay={i * 60} variant="pop">
              <a
                href={guide.href}
                className="group relative flex h-full flex-col rounded-lg border border-line p-5 transition-colors hover:border-[var(--mist)]"
                style={{ background: 'var(--panel)' }}
              >
                <span
                  aria-hidden="true"
                  className="font-pixel absolute right-4 top-4 text-[9px] tracking-widest text-faint transition-colors group-hover:text-mist2"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-semibold text-head transition-colors group-hover:text-mist3">{guide.title[lang]}</h3>
                <p className="mt-2 text-[12.5px] leading-[1.8] text-dim [text-wrap:pretty]">{guide.desc[lang]}</p>
                <span className="font-mono2 mt-4 inline-flex items-center gap-1 text-[11px] text-mist2">
                  {t(strings['guides.more'])}
                  <Icon name="arrow-right" size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
