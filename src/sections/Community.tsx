import { useState } from 'react'
import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import { strings, useT } from '../i18n'

/** 二维码框。图片加载失败前不渲染占位文案，
 *  否则读屏会先念 alt 再念"二维码更新中"，两句互相矛盾。 */
function QrFrame({ src, alt, pending }: { src: string; alt: string; pending: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="img-outline relative mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-md bg-white">
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
  const cards = [
    {
      kicker: t(strings['footer.community.qq']),
      desc: t(strings['footer.community.qqDesc']),
      src: '/contact/qq-qr.png',
      alt: t(strings['footer.community.qqAlt']),
    },
    {
      kicker: t(strings['footer.community.wechat']),
      desc: t(strings['footer.community.wechatDesc']),
      src: '/contact/wechat-qr.png',
      alt: t(strings['footer.community.wechatAlt']),
    },
  ]
  return (
    <section id="contact" className="scroll-mt-20 py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead title={t(strings['community.title'])} desc={t(strings['community.desc'])} />
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.src} delay={i * 80}>
              <div
                className="flex h-full flex-col items-center rounded-lg border border-line p-6 text-center"
                style={{ background: 'var(--panel)' }}
              >
                <div className="font-mono2 text-[11px] tracking-[0.18em] text-mist2">{c.kicker}</div>
                <div className="mt-1 text-[15px] font-semibold text-head">
                  {t(strings['footer.community.name'])}
                </div>
                <div className="mt-4">
                  <QrFrame src={c.src} alt={c.alt} pending={t(strings['footer.community.qrPending'])} />
                </div>
                <p className="mt-4 text-[12.5px] leading-relaxed text-dim">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
