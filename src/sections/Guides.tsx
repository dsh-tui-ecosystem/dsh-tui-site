import { GUIDE_CARDS, strings, useLang, useT } from '../i18n'

const GUIDES = GUIDE_CARDS

export default function Guides() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="guides" className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="mx-auto max-w-6xl px-5">
        <p className="font-mono2 text-[12px] tracking-[0.2em] text-mist2">// 07 · GUIDES</p>
        <h2 className="mt-3 text-[30px] font-bold text-head sm:text-[38px]">{t(strings['guides.title'])}</h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-[1.9] text-dim">{t(strings['guides.desc'])}</p>
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => (
            <a key={guide.href} href={guide.href} className="group rounded-lg border border-line p-5 transition-colors hover:border-[var(--mist)]" style={{ background: 'var(--panel)' }}>
              <h3 className="font-semibold text-head group-hover:text-mist3">{guide.title[lang]}</h3>
              <p className="mt-2 text-[12.5px] leading-[1.8] text-dim">{guide.desc[lang]}</p>
              <span className="font-mono2 mt-4 inline-block text-[11px] text-mist2">{t(strings['guides.more'])}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
