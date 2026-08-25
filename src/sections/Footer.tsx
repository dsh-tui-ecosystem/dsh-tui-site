import { useState } from 'react'
import PixelWhale from '../components/PixelWhale'
import CommandLine from '../components/CommandLine'
import { FOOTER_GROUPS, strings, useLang, useT } from '../i18n'

const INSTALL = 'npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui'

const LINK_GROUPS = FOOTER_GROUPS

/** 二维码框。图片加载失败前不渲染占位文案，
 *  否则读屏会先念 alt 再念"二维码更新中"，两句互相矛盾。 */
function QrFrame({ src, alt, pending }: { src: string; alt: string; pending: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="img-outline relative mx-auto mt-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-md bg-white">
      {failed ? (
        <span className="font-mono2 text-[10px] text-[#616c84]">{pending}</span>
      ) : (
        <img src={src} alt={alt} className="h-full w-full object-contain" onError={() => setFailed(true)} />
      )}
    </div>
  )
}

export default function Footer() {
  const lang = useLang()
  const t = useT()
  return (
    <footer className="border-t border-line">
      {/* CTA */}
      <div className="grid-bg relative overflow-hidden">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center">
          <PixelWhale className="h-20 w-[104px]" />
          <h2 className="mt-6 text-[26px] font-bold text-head sm:text-[32px]">
            {t(strings['footer.cta.title'])}
          </h2>
          <p className="font-mono2 mt-2 text-[12.5px] text-dim">{t(strings['footer.cta.sub'])}</p>
          <CommandLine command={INSTALL} className="mt-7 w-full max-w-xl text-left" />
        </div>
      </div>

      {/* links */}
      <div className="border-t border-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <PixelWhale float={false} className="h-6 w-8" />
              <span className="font-mono2 text-[14px] font-bold text-head">
                <span className="text-mist">dsh</span>-TUI
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[12.5px] leading-[1.85] text-faint">
              {lang === 'zh' ? (
                <>
                  DeepSeek Harness 的 Claude Code 风格终端界面插件。
                  献给偏爱 CLI 的各位极客。
                </>
              ) : (
                t(strings['footer.brand'])
              )}
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
                      target="_blank"
                      rel="noreferrer"
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

        {/* Community / Contact */}
        <div className="scroll-mt-20 border-t border-soft py-8" id="contact">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-6 text-center">
              <h3 className="text-[24px] font-bold text-head">Contact / Community</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {([
                { kicker: t(strings['footer.community.qq']), desc: t(strings['footer.community.qqDesc']), src: '/contact/qq-qr.png', alt: t(strings['footer.community.qqAlt']) },
                { kicker: t(strings['footer.community.wechat']), desc: t(strings['footer.community.wechatDesc']), src: '/contact/wechat-qr.png', alt: t(strings['footer.community.wechatAlt']) },
              ]).map((c) => (
                <div key={c.src} className="rounded-lg border border-line p-6 text-center" style={{ background: 'var(--panel)' }}>
                  <div className="font-mono2 text-[11px] tracking-[0.18em] text-mist2">{c.kicker}</div>
                  <div className="text-[15px] font-semibold text-head mt-1">{t(strings['footer.community.name'])}</div>
                  <QrFrame src={c.src} alt={c.alt} pending={t(strings['footer.community.qrPending'])} />
                  <p className="text-[12.5px] text-dim mt-4 leading-snug">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-soft">
          <div className="font-mono2 mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-[11.5px] text-faint sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 DSH-TUI Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}