import PixelWhale from '../components/PixelWhale'
import DeepyMark from '../components/DeepyMark'
import CommandLine from '../components/CommandLine'
import { FOOTER_GROUPS, strings, useLang, useT } from '../i18n'

const INSTALL = 'npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui'

const LINK_GROUPS = FOOTER_GROUPS


export default function Footer() {
  const lang = useLang()
  const t = useT()
  return (
    <footer className="border-t border-line">
      {/* CTA */}
      <div className="relative overflow-hidden">
        <div className="relative mx-auto flex max-w-6xl flex-col items-stretch px-page py-16 text-start sm:items-center sm:py-20 sm:text-center">
          <PixelWhale className="h-20 w-[104px] sm:mx-auto" />
          <h2 className="mt-6 text-[24px] font-bold text-head sm:text-[32px]">
            {t(strings['footer.cta.title'])}
          </h2>
          <p className="font-mono2 mt-2 text-[12.5px] text-dim">{t(strings['footer.cta.sub'])}</p>
          <CommandLine command={INSTALL} className="mt-7 w-full max-w-xl text-start" />
        </div>
      </div>

      {/* links */}
      <div className="border-t border-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-page py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <DeepyMark className="h-5 w-[30px]" />
              <span className="font-mono2 text-[14px] font-bold text-head">
                <span className="text-mist">dsh</span>-TUI
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[12.5px] leading-[1.85] text-faint">
              {t(strings['footer.brand'])}
            </p>
          </div>
          {LINK_GROUPS.map((g) => (
            <div key={g.name.zh}>
              <div className="font-mono2 mb-3 text-[11px] tracking-[0.18em] text-faint">{g.name[lang]}</div>
              <ul className="space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.label.zh}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}
                      className="text-[13px] text-dim transition-colors hover:text-mist3"
                    >
                      {l.label[lang]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-soft">
          <div className="font-mono2 mx-auto flex max-w-6xl flex-col gap-2 px-page py-5 text-[11.5px] text-faint sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 DSH-TUI Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}