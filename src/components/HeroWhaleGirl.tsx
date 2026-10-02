import { useEffect, useRef, useState, type MouseEvent } from 'react'
import PixelSprite from './PixelSprite'
import { WHALE_GIRL } from '../content/sprites/whale-girl-emoji'
import { strings, useLang, useT } from '../i18n'
import { useReducedMotion } from '../lib/useReducedMotion'

const REPO = 'https://github.com/ccch1mneyyy/dsh-TUI'

/** 首屏打开后多久冒第一次「求个 Star」气泡 */
const FIRST_ASK_MS = 1600
/** 气泡停留多久 */
const BUBBLE_MS = 6000
/** 之后每隔多久再冒一次 */
const ASK_EVERY_MS = 30000

const copy = {
  poke: { zh: '点一下戳她', en: 'Click to poke her' },
  star: { zh: '求个 Star', en: 'Star us' },
  starLabel: { zh: '在 GitHub 上给 dsh-TUI 点个 Star', en: 'Star dsh-TUI on GitHub' },
}

interface Pose {
  key: string
  since: number
}

/**
 * 首屏守着页面的像素鲸娘（素材见 /pets/whale-girl-emoji/）。
 * 常驻待机眨眼；只对三种点击做反应：点左脸、点右脸、连点挠痒痒，播完一遍回到待机。
 * 头顶隔一阵冒「求个 Star」气泡，点了去 GitHub。
 *
 * 版面上占的仍是原来那张 168×168（窄屏 96×96）的位置：画布按 69×66 网格的整数倍
 * （3× / 2×）放大，向外溢出，让她的身子正好落在原图的位置，呆毛和道具溢到框外。
 */
export default function HeroWhaleGirl() {
  const lang = useLang()
  const t = useT()
  const reduced = useReducedMotion()
  const [cur, setCur] = useState<Pose>({ key: 'idle', since: 0 })
  const [bubble, setBubble] = useState(false)
  const [touched, setTouched] = useState(false)
  const clicks = useRef<number[]>([])
  const asked = useRef(false)
  const playing = !reduced || touched

  // 点击反应播完一遍回到待机
  useEffect(() => {
    if (cur.key === 'idle') return
    const anim = WHALE_GIRL.anims[cur.key]
    const id = window.setTimeout(
      () => setCur({ key: 'idle', since: performance.now() }),
      Math.max(0, anim.total - (performance.now() - cur.since)),
    )
    return () => window.clearTimeout(id)
  }, [cur])

  // 「求个 Star」气泡：开场冒一次，停一会儿收起，之后隔一阵再冒；减少动态时常驻，不用定时
  useEffect(() => {
    if (reduced) return
    const delay = bubble ? BUBBLE_MS : asked.current ? ASK_EVERY_MS : FIRST_ASK_MS
    const id = window.setTimeout(() => {
      asked.current = true
      setBubble(!bubble)
    }, delay)
    return () => window.clearTimeout(id)
  }, [bubble, reduced])

  const poke = (e: MouseEvent<HTMLButtonElement>) => {
    const now = e.timeStamp
    const recent = clicks.current.filter((x) => now - x < 1500)
    recent.push(now)
    clicks.current = recent
    const r = e.currentTarget.getBoundingClientRect()
    const right = e.clientX > 0 && e.clientX - r.left > r.width / 2
    const key = recent.length >= 4 ? 'tickle' : right ? 'poke-right' : 'poke-left'
    setTouched(true)
    setCur({ key, since: now })
  }

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
        onClick={() => setBubble(false)}
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
