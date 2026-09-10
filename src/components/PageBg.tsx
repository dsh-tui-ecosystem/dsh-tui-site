import { useEffect, useRef } from 'react'

/** 全站统一背景层：网格 + 热网格（指针光圈）+ 双漂移光斑 + 噪点。
 *  指针做两件事：整个背景 ±10px 视差（k=5），热点网格跟随（k=9）。
 *  两条 exp(-k·dt) 滤波帧率无关，沉淀后 rAF 自动休眠，指针再动唤醒。
 *  reduced-motion / 触屏不启动：--px 保持 0、热点保持屏外。 */
export default function PageBg() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (matchMedia('(hover: none)').matches) return
    let raf = 0
    let tx = 0, ty = 0, cx = 0, cy = 0
    let hx = -500, hy = -500, chx = -500, chy = -500
    let last = 0
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      cx += (tx - cx) * (1 - Math.exp(-5 * dt))
      cy += (ty - cy) * (1 - Math.exp(-5 * dt))
      chx += (hx - chx) * (1 - Math.exp(-9 * dt))
      chy += (hy - chy) * (1 - Math.exp(-9 * dt))
      el.style.setProperty('--px', cx.toFixed(4))
      el.style.setProperty('--py', cy.toFixed(4))
      el.style.setProperty('--bx', `${chx.toFixed(1)}px`)
      el.style.setProperty('--by', `${chy.toFixed(1)}px`)
      const settled =
        Math.abs(tx - cx) + Math.abs(ty - cy) < 0.002 &&
        Math.abs(hx - chx) + Math.abs(hy - chy) < 0.6
      raf = settled ? 0 : requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      hx = e.clientX
      hy = e.clientY
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="page-bg" aria-hidden="true">
      <span className="page-bg-hot" />
      <span className="page-bg-glow page-bg-glow-a" />
      <span className="page-bg-glow page-bg-glow-b" />
    </div>
  )
}
