import { useEffect, useRef } from 'react'
import type { Pet, PetAnim } from '../content/pets'

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

function frameAt(anim: PetAnim, elapsed: number) {
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
  anim: PetAnim
  since: number
  playing: boolean
}

/**
 * 一个画布的全部可变状态。放在 React 渲染之外：
 * 每帧都在变的东西走 rAF，不经过 setState。
 */
class SpriteController {
  private shown: { anim: PetAnim; img: HTMLImageElement; since: number } | null = null
  private want: Want | null = null
  private visible = false
  private drawn = { anim: null as PetAnim | null, frame: -1, w: 0 }
  private unsubscribe: (() => void) | undefined
  private ro: ResizeObserver
  private io: IntersectionObserver
  private box: HTMLElement
  private canvas: HTMLCanvasElement
  private pet: Pet
  private base: string

  constructor(box: HTMLElement, canvas: HTMLCanvasElement, pet: Pet, base: string) {
    this.box = box
    this.canvas = canvas
    this.pet = pet
    this.base = base
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

  /** 画布内部分辨率 = 逻辑像素 × 整数设备像素：关掉平滑后每个像素都是等大的方块 */
  private fit = () => {
    const [gw, gh] = this.pet.grid
    const dpr = window.devicePixelRatio || 1
    const k = Math.max(1, Math.floor(Math.min(this.box.clientWidth / gw, this.box.clientHeight / gh) * dpr))
    if (this.canvas.width !== gw * k) {
      this.canvas.width = gw * k
      this.canvas.height = gh * k
    }
    this.canvas.style.width = `${(gw * k) / dpr}px`
    this.canvas.style.height = `${(gh * k) / dpr}px`
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
    const [fw, fh] = this.pet.frame
    const cols = this.pet.cols || cur.anim.durs.length
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
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
  pet: Pet
  anim: PetAnim
  /** 精灵表所在目录（相对当前页面），例如 "./" 或 "../../pets/" */
  base: string
  /** performance.now() 时间戳：从这一刻起算第 0 帧；0 = 不关心相位 */
  since?: number
  /** false = 停在第 0 帧（reduced-motion 下的默认） */
  playing?: boolean
  label: string
  className?: string
}

/** 像素精灵播放器：读精灵表逐帧画到 canvas，帧时长取自原始导出数据。 */
export default function PixelSprite({ pet, anim, base, since = 0, playing = true, label, className = '' }: Props) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctl = useRef<SpriteController | null>(null)

  useEffect(() => {
    const c = new SpriteController(boxRef.current!, canvasRef.current!, pet, base)
    ctl.current = c
    return () => {
      c.destroy()
      ctl.current = null
    }
  }, [pet, base])

  useEffect(() => {
    ctl.current?.update({ anim, since, playing })
  }, [pet, base, anim, since, playing])

  const [gw, gh] = pet.grid
  return (
    <div ref={boxRef} className={`grid place-items-center overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={gw}
        height={gh}
        role="img"
        aria-label={label}
        className="pixel-canvas block max-h-full max-w-full"
        style={{ aspectRatio: `${gw} / ${gh}` }}
      />
    </div>
  )
}
