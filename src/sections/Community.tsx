import { useState } from 'react'
import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import CopyButton from '../components/CopyButton'
import { strings, useT } from '../i18n'

/** 二维码框。图片加载失败前不渲染占位文案，
 *  否则读屏会先念 alt 再念"二维码更新中"，两句互相矛盾。 */
function QrFrame({ src, alt, pending }: { src: string; alt: string; pending: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="img-outline relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-md bg-white">
      {failed ? (
        <span className="font-mono2 text-[10px] text-[#616c84]">{pending}</span>
      ) : (
        <img src={src} alt={alt} className="h-full w-full object-contain" onError={() => setFailed(true)} />
      )}
    </div>
  )
}

/**
 * 社区入口。原本埋在页脚倒数第二条带里：那块高 444px、顶着页脚正文唯一的
 * 24px 标题，比它上面的链接组还高 1.8 倍 —— 层级是倒的，看着像事后补的。
 *
 * 现在拆成两处各司其职：这里是正文级的邀请，二维码给到可扫的尺寸；
 * 页脚只留一列文字链接指回来，不重复放同一张图。
 *
 * id 保持 contact：插件页是直链 dshtui.com/#contact 过来的。
 */
export default function Community() {
  const t = useT()
  return (
    <section id="contact" className="scroll-mt-20 py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          align="center"
          title={t(strings['community.title'])}
          desc={t(strings['community.desc'])}
        />
        <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
          {/* QQ：群号是这张卡最可操作的东西 —— QQ 可以直接搜号入群，
              不必扫码。所以它独占一行、用等宽字并可复制，而不是塞在句尾括号里。 */}
          <Reveal>
            <div
              className="flex h-full flex-col items-center rounded-lg border border-line p-6"
              style={{ background: 'var(--panel)' }}
            >
              <div className="text-[15px] font-semibold text-head">{t(strings['footer.community.qq'])}</div>
              <div className="mt-4">
                <QrFrame
                  src="/contact/qq-qr.png"
                  alt={t(strings['footer.community.qqAlt'])}
                  pending={t(strings['footer.community.qrPending'])}
                />
              </div>
              <div className="mt-auto flex w-full items-center justify-center gap-2 pt-4">
                <span className="text-[12px] text-dim">{t(strings['community.qqNumberLabel'])}</span>
                <span className="font-mono2 tnum text-[13px] font-semibold text-head">
                  {t(strings['community.qqNumber'])}
                </span>
                <CopyButton text={t(strings['community.qqNumber'])} label={t(strings['copy.aria.number'])} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div
              className="flex h-full flex-col items-center rounded-lg border border-line p-6"
              style={{ background: 'var(--panel)' }}
            >
              <div className="text-[15px] font-semibold text-head">{t(strings['footer.community.wechat'])}</div>
              <div className="mt-4">
                <QrFrame
                  src="/contact/wechat-qr.png?v=4"
                  alt={t(strings['footer.community.wechatAlt'])}
                  pending={t(strings['footer.community.qrPending'])}
                />
              </div>
              <div className="mt-auto pt-4 text-[12px] text-dim">{t(strings['community.wechatNote'])}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
