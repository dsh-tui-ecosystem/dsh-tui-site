import { useEffect } from 'react'
import PixelWhale from '../components/PixelWhale'
import { LangProvider, strings, type Lang } from '../i18n'

/**
 * 404。语言由 App 按路径前缀传入：/en/ 下的错误地址必须给英文页。
 * 此前这里是硬编码中文，且返回链写死 "/"，英文访客会拿到一张读不懂的
 * 错误页，再被送回中文首页 —— 错误页的两件职责（说清发生了什么、
 * 怎么回去）对他全部失效。
 */
export default function NotFound({ lang = 'zh' }: { lang?: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'
    // 单一兜底文件的 <title> 只能烘一种语言（中文），英文访客要在客户端换掉
    document.title = `${strings['notfound.title'][lang]} | dsh-TUI`
  }, [lang])

  return (
    <LangProvider lang={lang}>
      <main
        className="grid-bg flex min-h-screen items-center justify-center px-page"
        style={{ background: 'var(--bg)' }}
      >
        <div className="max-w-lg text-start sm:text-center">
          <PixelWhale className="mx-auto h-auto w-40" />
          <p className="font-mono2 mt-7 text-[12px] tracking-[0.2em] text-mist2">
            {strings['notfound.kicker'][lang]}
          </p>
          <h1 className="mt-4 text-[34px] font-bold text-head">{strings['notfound.title'][lang]}</h1>
          <p className="mt-4 text-[14px] leading-[1.9] text-dim">{strings['notfound.desc'][lang]}</p>
          {/* 绝对路径：在 /xxx/ 这类带尾斜杠的地址上，"./" 会解析回 /xxx/
              —— 也就是这张 404 页自己，点了原地打转。 */}
          <a
            href={lang === 'en' ? '/en/' : '/'}
            className="btn-press mt-7 inline-block rounded bg-[var(--mist-solid)] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--mist-solid-hover)]"
          >
            {strings['notfound.back'][lang]}
          </a>
        </div>
      </main>
    </LangProvider>
  )
}
