import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import Icon from '../components/Icon'
import BrandIcon from '../components/BrandIcon'
import { CHANGELOG_ENTRIES, strings, useLang, useT } from '../i18n'

const ENTRIES = CHANGELOG_ENTRIES
const RELEASES = 'https://github.com/ccch1mneyyy/dsh-TUI/releases'

/** 更新动态：版本号列 + 标题/描述的双栏行，最新一条带像素 LATEST 徽章。
 *  条目事实来自仓库提交记录与 npm 发布时间（i18n 里有出处注释）。 */
export default function Changelog() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="changelog" className="py-24" style={{ background: 'var(--bg-2-glass)' }}>
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          title={t(strings['changelog.title'])}
          desc={t(strings['changelog.desc'])}
        />

        <ol className="space-y-3">
          {ENTRIES.map((e, i) => (
            <Reveal key={e.version} as="li" variant="pop" delay={i * 70}>
              <div
                className="group flex flex-col gap-2 rounded-lg border border-line p-5 transition-colors hover:border-[var(--mist)] sm:flex-row sm:items-baseline sm:gap-7"
                style={{ background: 'var(--panel)' }}
              >
                <div className="font-mono2 flex shrink-0 items-center gap-2.5 sm:w-52">
                  <span className="text-[13.5px] font-bold text-mist3">{e.version}</span>
                  <span className="tnum text-[11px] text-faint">{e.date}</span>
                  {i === 0 && (
                    <span className="font-pixel rounded border border-[var(--mist)] px-1.5 py-1 text-[7px] tracking-normal text-mist2">
                      LATEST
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-head transition-colors group-hover:text-mist3">
                    {e.title[lang]}
                  </h3>
                  <p className="mt-1 text-[12.5px] leading-[1.8] text-dim">{e.desc[lang]}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120} className="mt-6">
          <a
            href={RELEASES}
            target="_blank"
            rel="noreferrer"
            className="group font-mono2 inline-flex items-center gap-1.5 text-[12px] text-mist2 transition-colors hover:text-mist3"
          >
            <BrandIcon name="github" size={13} />
            {t(strings['changelog.more'])}
            <Icon name="arrow-up-right" size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
