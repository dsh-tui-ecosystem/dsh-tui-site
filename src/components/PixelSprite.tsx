import { useEffect, useRef, useState } from 'react'
import type { SpriteAnim, SpriteGeometry } from '../content/sprites/types'

/* ---------- 一条共享的 rAF：只有可见且在播的精灵订阅，全部停下后自动休眠 ---------- */

type Tick = (now: number) => void
const subscribers = new Set<Tick>()
let raf = 0

function loop(now: number) {
  subscribers.forEach((fn) => fn(now))
  raf = subscribers.size ? requestAnimationFrame(loop) : 0
}

function subscribe(fn: Tick) {
  subscribers.add(fn)
  if (!raf) raf = requestAnimationFrame(loop)
  return () => {
    subscribers.delete(fn)
  }
}

/* ---------- 精灵表缓存：同一张表全页只下载、解码一次 ---------- */

const sheets = new Map<string, Promise<HTMLImageElement>>()

function loadSheet(url: string) {
  let p = sheets.get(url)
  if (!p) {
    p = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
    sheets.set(url, p)
    p.catch(() => sheets.delete(url))
  }
  return p
}

function frameAt(anim: SpriteAnim, elapsed: number) {
  const t = ((elapsed % anim.total) + anim.total) % anim.total
  const { starts } = anim
  let lo = 0
  let hi = starts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (starts[mid] <= t) lo = mid
    else hi = mid - 1
  }
  return lo
}

interface Want {
  anim: SpriteAnim
  since: number
  playing: boolean
}

/**
 * 一个画布的全部可变状态。放在 React 渲染之外：
 * 每帧都在变的东西走 rAF，不经过 setState。
 */
class SpriteController {
  private shown: { anim: SpriteAnim; img: HTMLImageElement; since: number } | null = null
  private want: Want | null = null
  private visible = false
  private drawn = { anim: null as SpriteAnim | null, frame: -1, w: 0 }
  private unsubscribe: (() => void) | undefined
  private ro: ResizeObserver
  private io: IntersectionObserver
  private box: HTMLElement
  private canvas: HTMLCanvasElement
  private sprite: SpriteGeometry
  private base: string
  private fill: boolean

  constructor(box: HTMLElement, canvas: HTMLCanvasElement, sprite: SpriteGeometry, base: string, fill: boolean) {
    this.box = box
    this.canvas = canvas
    this.sprite = sprite
    this.base = base
    this.fill = fill
    this.ro = new ResizeObserver(this.fit)
    this.ro.observe(box)
    this.io = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting
        if (this.visible) void this.ensure()
        this.sync()
      },
      { rootMargin: '240px 0px' },
    )
    this.io.observe(box)
    this.fit()
  }

  /** 画布内部分辨率 = 逻辑像素 × 整数设备像素：关掉平滑后每个像素都是等大的方块。
   *  fill 模式下外框尺寸由调用方定死（本身就是网格的整数倍），画布铺满它即可。 */
  private fit = () => {
    const [gw, gh] = this.sprite.grid
    const dpr = window.devicePixelRatio || 1
    const fitK = Math.min(this.box.clientWidth / gw, this.box.clientHeight / gh) * dpr
    const k = Math.max(1, this.fill ? Math.round(fitK) : Math.floor(fitK))
    if (this.canvas.width !== gw * k) {
      this.canvas.width = gw * k
      this.canvas.height = gh * k
    }
    if (!this.fill) {
      this.canvas.style.width = `${(gw * k) / dpr}px`
      this.canvas.style.height = `${(gh * k) / dpr}px`
    }
    this.drawn.w = 0
    this.draw(performance.now())
  }

  private draw = (now: number) => {
    const cur = this.shown
    if (!cur) return
    const frame = this.want?.playing ? frameAt(cur.anim, now - cur.since) : 0
    const { canvas, drawn } = this
    if (drawn.anim === cur.anim && drawn.frame === frame && drawn.w === canvas.width) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const [fw, fh] = this.sprite.frame
    const cols = this.sprite.cols || cur.anim.durs.length
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 开始自己画了，服务端渲染时垫的那张首帧背景就撤掉（透明像素会透出它）
    if (canvas.style.backgroundImage) canvas.style.backgroundImage = ''
    ctx.drawImage(cur.img, (frame % cols) * fw, Math.floor(frame / cols) * fh, fw, fh, 0, 0, canvas.width, canvas.height)
    this.drawn = { anim: cur.anim, frame, w: canvas.width }
  }

  private sync() {
    this.unsubscribe?.()
    this.unsubscribe = undefined
    if (!this.visible || !this.shown) return
    if (this.want?.playing) this.unsubscribe = subscribe(this.draw)
    else this.draw(performance.now())
  }

  /** 换动画时先继续播旧的，新精灵表解码好再切，不闪空白 */
  private async ensure() {
    const target = this.want
    if (!target || !this.visible) return
    if (this.shown?.anim === target.anim) return
    try {
      const img = await loadSheet(this.base + target.anim.sheet)
      const now = this.want
      if (!now || now.anim !== target.anim) return // 等待期间又换了
      // 下载耗时不能吃掉一次性动画的开头：晚到太多就从现在起算第 0 帧
      const t = performance.now()
      const since = now.since === 0 || t - now.since < 120 ? now.since : t
      this.shown = { anim: target.anim, img, since }
      this.sync()
    } catch {
      /* 精灵表加载失败：保持上一帧 */
    }
  }

  update(next: Want) {
    const prev = this.want
    this.want = next
    if (this.shown && this.shown.anim === next.anim && prev && prev.since !== next.since) {
      this.shown.since = next.since
    }
    void this.ensure()
    this.sync()
  }

  destroy() {
    this.unsubscribe?.()
    this.ro.disconnect()
    this.io.disconnect()
  }
}

interface Props {
  /** 精灵表几何：单帧尺寸、逻辑网格、列数（Pet 或 SpriteSet 都满足） */
  sprite: SpriteGeometry
  anim: SpriteAnim
  /** 精灵表所在目录（相对当前页面），例如 "./" 或 "../../pets/" */
  base: string
  /** performance.now() 时间戳：从这一刻起算第 0 帧；0 = 不关心相位 */
  since?: number
  /** false = 停在第 0 帧（reduced-motion 下的默认） */
  playing?: boolean
  /** 外框尺寸由调用方定死（须是网格的整数倍），画布铺满外框 */
  fill?: boolean
  /** 首屏用：服务端渲染时就用 CSS 背景垫出第 0 帧，JS 没跑起来前也有画面 */
  poster?: boolean
  label: string
  className?: string
}

/** 像素精灵播放器：读精灵表逐帧画到 canvas，帧时长取自原始导出数据。 */
export default function PixelSprite({
  sprite,
  anim,
  base,
  since = 0,
  playing = true,
  fill = false,
  poster = false,
  label,
  className = '',
}: Props) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctl = useRef<SpriteController | null>(null)
  // 垫底首帧只取挂载时的动画：之后换动画时样式值不变，React 就不会把背景重新写回去
  const [first] = useState(anim)

  useEffect(() => {
    const c = new SpriteController(boxRef.current!, canvasRef.current!, sprite, base, fill)
    ctl.current = c
    return () => {
      c.destroy()
      ctl.current = null
    }
  }, [sprite, base, fill])

  useEffect(() => {
    ctl.current?.update({ anim, since, playing })
  }, [sprite, base, fill, anim, since, playing])

  const [gw, gh] = sprite.grid
  const n = first.durs.length
  const cols = sprite.cols || n
  const rows = Math.ceil(n / cols)
  return (
    <div ref={boxRef} className={`grid place-items-center overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={gw}
        height={gh}
        role="img"
        aria-label={label}
        className={`pixel-canvas block ${fill ? 'h-full w-full' : 'max-h-full max-w-full'}`}
        style={{
          aspectRatio: `${gw} / ${gh}`,
          ...(poster && {
            backgroundImage: `url(${base}${first.sheet})`,
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundPosition: '0 0',
            backgroundRepeat: 'no-repeat',
          }),
        }}
      />
    </div>
  )
}
