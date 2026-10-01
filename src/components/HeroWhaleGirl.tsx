import { useEffect, useRef, useState, type MouseEvent } from 'react'
import PixelSprite from './PixelSprite'
import { WHALE_GIRL } from '../content/sprites/whale-girl-emoji'
import { strings, useLang, useT } from '../i18n'
import { useReducedMotion } from '../lib/useReducedMotion'

const REPO = 'https://github.com/ccch1mneyyy/dsh-TUI'

/** 待机时按顺序穿插的小动作：[动画, 播几遍, 是否冒「求 Star」气泡] */
const VARIANTS: [key: string, loops: number, ask: boolean][] = [
  ['thumbs-up', 2, true],
  ['idle-look', 1, false],
  ['smile-hearts', 2, false],
  ['idle-spout', 1, false],
]

/** 首屏打开后多久先比个赞、冒第一次气泡 */
const FIRST_ASK_MS = 1600
/** 气泡停留多久 */
const BUBBLE_MS = 6000

const copy = {
  poke: { zh: '点一下戳她', en: 'Click to poke her' },
  star: { zh: '求个 Star', en: 'Star us' },
  starLabel: { zh: '在 GitHub 上给 dsh-TUI 点个 Star', en: 'Star dsh-TUI on GitHub' },
}

interface Pose {
  key: string
  since: number
  loops: number
}

/**
 * 首屏的像素鲸娘（素材见 /pets/whale-girl-emoji/）。
 * 待机眨眼，每隔一阵在一轮待机播完时穿插一个小动作；比赞时头顶冒出「求个 Star」气泡，
 * 点气泡去 GitHub，她会冒爱心。点左右脸会被戳，连点会被挠痒痒。
 *
 * 版面上占的仍是原来那张 168×168（窄屏 96×96）的位置：画布按 69×66 网格的整数倍
 * （3× / 2×）放大，向外溢出，让她的身子正好落在原图的位置，呆毛和道具溢到框外。
 */
export default function HeroWhaleGirl() {
  const lang = useLang()
  const t = useT()
  const reduced = useReducedMotion()
  const [cur, setCur] = useState<Pose>({ key: 'idle', since: 0, loops: 1 })
  const [bubble, setBubble] = useState(false)
  const [touched, setTouched] = useState(false)
  const clicks = useRef<number[]>([])
  const nextVariant = useRef(0)
  const started = useRef(false)
  const playing = !reduced || touched

  // 动作编排：待机 ⇄ 小动作
  useEffect(() => {
    if (!playing) return
    const anim = WHALE_GIRL.anims[cur.key]
    const now = performance.now()
    let delay: number
    let next: () => Pose
    if (cur.key === 'idle') {
      if (!started.current) {
        delay = FIRST_ASK_MS
      } else {
        // 在一轮待机播完的那一刻切换，不在眨眼中途打断
        const rounds = 1 + Math.floor(Math.random() * 2)
        delay = rounds * anim.total - ((now - cur.since) % anim.total)
      }
      next = () => {
        started.current = true
        const [key, loops, ask] = VARIANTS[nextVariant.current % VARIANTS.length]
        nextVariant.current += 1
        if (ask) setBubble(true)
        return { key, since: performance.now(), loops }
      }
    } else {
      delay = cur.loops * anim.total - (now - cur.since)
      next = () => ({ key: 'idle', since: performance.now(), loops: 1 })
    }
    const id = window.setTimeout(() => setCur(next()), Math.max(0, delay))
    return () => window.clearTimeout(id)
  }, [cur, playing])

  // 气泡停一会儿就收起
  useEffect(() => {
    if (!bubble) return
    const id = window.setTimeout(() => setBubble(false), BUBBLE_MS)
    return () => window.clearTimeout(id)
  }, [bubble])

  const poke = (e: MouseEvent<HTMLButtonElement>) => {
    const now = e.timeStamp
    const recent = clicks.current.filter((x) => now - x < 1500)
    recent.push(now)
    clicks.current = recent
    const r = e.currentTarget.getBoundingClientRect()
    const right = e.clientX > 0 && e.clientX - r.left > r.width / 2
    const key = recent.length >= 4 ? 'tickle' : right ? 'poke-right' : 'poke-left'
    started.current = true
    setTouched(true)
    setCur({ key, since: now, loops: 1 })
  }

  // 有人点了 Star 气泡：收起气泡，冒爱心道谢
  const thank = (e: MouseEvent<HTMLAnchorElement>) => {
    started.current = true
    setTouched(true)
    setBubble(false)
    setCur({ key: 'smile-hearts', since: e.timeStamp, loops: 2 })
  }

  // 减少动态时不做定时编排，气泡就一直挂着（没有弹出动画）
  const showBubble = reduced || bubble
  const base = lang === 'en' ? '../pets/' : './pets/'
  return (
    <div className="whale-float relative h-[96px] w-[96px] sm:h-[168px] sm:w-[168px]">
      <button
        type="button"
        onClick={poke}
        title={t(copy.poke)}
        aria-label={`${t(strings['hero.whaleAlt'])} · ${t(copy.poke)}`}
        className="absolute inset-0 block cursor-pointer"
      >
        <PixelSprite
          sprite={WHALE_GIRL}
          anim={WHALE_GIRL.anims[cur.key]}
          since={cur.since}
          base={base}
          playing={playing}
          fill
          poster
          label={t(strings['hero.whaleAlt'])}
          className="pointer-events-none absolute -bottom-[12px] -left-[27px] h-[132px] w-[138px] sm:-bottom-[18px] sm:-left-[28px] sm:h-[198px] sm:w-[207px]"
        />
      </button>
      <a
        href={REPO}
        target="_blank"
        rel="noreferrer"
        onClick={thank}
        aria-label={t(copy.starLabel)}
        aria-hidden={!showBubble}
        tabIndex={showBubble ? 0 : -1}
        data-on={showBubble}
        className="star-bubble font-mono2"
      >
        {t(copy.star)} <span className="star-bubble-star" aria-hidden="true">★</span>
      </a>
    </div>
  )
}
