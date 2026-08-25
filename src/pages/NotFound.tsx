import PixelWhale from '../components/PixelWhale'

export default function NotFound() {
  return (
    <main className="grid-bg flex min-h-screen items-center justify-center px-5" style={{ background: 'var(--bg)' }}>
      <div className="max-w-lg text-center">
        <PixelWhale className="mx-auto h-auto w-40" />
        <p className="font-mono2 mt-7 text-[12px] tracking-[0.2em] text-mist2">404 · NOT FOUND</p>
        <h1 className="mt-4 text-[34px] font-bold text-head">页面没有找到</h1>
        <p className="mt-4 text-[14px] leading-[1.9] text-dim">这个地址不存在，或者页面已经移动。</p>
        {/* 必须是绝对根路径：在 /xxx/ 这类带尾斜杠的地址上，"./" 解析回 /xxx/
            —— 也就是这张 404 页自己，点了原地打转。
            站内 /plugins/、/downloads/ 等本就按根目录部署。 */}
        <a href="/" className="mt-7 inline-block rounded bg-[var(--mist-solid)] px-5 py-2.5 text-[14px] font-semibold text-white">返回首页</a>
      </div>
    </main>
  )
}
