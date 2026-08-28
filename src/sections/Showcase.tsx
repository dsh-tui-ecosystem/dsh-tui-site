import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import { SHOWCASE_SHOTS, strings, useLang, useT } from '../i18n'

const SHOTS = SHOWCASE_SHOTS

export default function Showcase() {
  const lang = useLang()
  const t = useT()
  // /en/ 页面下相对资源需要回退一级
  const fix = (p: string) => (lang === 'en' ? p.replaceAll('./', '../') : p)
  return (
    <section id="showcase" className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          title={t(strings['showcase.title'])}
          desc={t(strings['showcase.desc'])}
        />

        <div className="space-y-8">
          {SHOTS.map((s, i) => (
            <Reveal key={s.file} delay={i * 90}>
              <figure className="group overflow-hidden rounded-lg border border-line" style={{ background: 'var(--panel)' }}>
                <div className="flex items-center gap-2 border-b border-line px-3.5 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#f0685f]/70" />
                  <span className="h-2 w-2 rounded-full bg-[#f5c542]/70" />
                  <span className="h-2 w-2 rounded-full bg-[#3ddc84]/70" />
                  <span className="font-mono2 ms-2 text-[11px] text-faint">{s.file}</span>
                </div>
                <div className="overflow-hidden">
                  <picture>
                    <source type="image/avif" srcSet={fix(s.avif)} sizes="(max-width: 768px) 100vw, 1152px" />
                    <source type="image/webp" srcSet={fix(s.webp)} sizes="(max-width: 768px) 100vw, 1152px" />
                    <img
                      src={fix(s.src)}
                      alt={s.cap[lang]}
                      loading="lazy"
                      decoding="async"
                      width={i === 0 ? 2559 : 1600}
                      height={i === 0 ? 1400 : 846}
                      className="img-outline w-full transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                    />
                  </picture>
                </div>
                <figcaption className="font-mono2 border-t border-line px-3.5 py-2.5 text-[11.5px] text-dim">
                  {s.cap[lang]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* 官方收录 */}
        <Reveal delay={120} className="mt-10">
          <div className="relative grid gap-6 overflow-visible rounded-lg border border-line p-6 md:grid-cols-[1fr_240px] md:items-center" style={{ background: 'var(--panel)' }}>
            <div>
              <h3 className="text-[19px] font-bold leading-snug text-head">{t(strings['showcase.featured.title'])}</h3>
              <p className="mt-2 max-w-xl text-[13.5px] leading-[1.9] text-dim">
                {t(strings['showcase.featured.desc'])}
              </p>
            </div>
            <a
              href="https://github.com/ccch1mneyyy/dsh-TUI#-官方收录"
              target="_blank"
              rel="noreferrer"
              className="wechat-preview btn-press rounded-md"
            >
              <picture>
                <source type="image/avif" srcSet={fix('./shots/wechat-official-480.avif')} />
                <source type="image/webp" srcSet={fix('./shots/wechat-official-480.webp')} />
                <img
                  src={fix('./shots/wechat-official.png')}
                  alt={t(strings['showcase.featured.alt'])}
                  loading="lazy"
                  decoding="async"
                  width="1870"
                  height="1438"
                  className="img-outline w-full rounded-md"
                />
              </picture>
              <span className="wechat-pop" aria-hidden="true">
                <img
                  src={fix('./shots/wechat-official.png')}
                  alt=""
                  width="1870"
                  height="1438"
                  className="img-outline"
                />
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
