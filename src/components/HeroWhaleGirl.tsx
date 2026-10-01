import { useEffect, useRef, useState, type MouseEvent } from 'react'
import PixelSprite from './PixelSprite'
import { WHALE_GIRL } from '../content/sprites/whale-girl-emoji'
import { strings, useLang, useT } from '../i18n'
import { useReducedMotion } from '../lib/useReducedMotion'

/** 待机时偶尔穿插的小动作，以及各自播几遍 */
const VARIANTS: [key: string, loops: number][] = [
  ['idle-look', 1],
  ['idle-spout', 1],
  ['smile-hearts', 2],
  ['thumbs-up', 2],
]

const pokeHint = { zh: '点一下戳她', en: 'Click to poke her' }

/**
 * 首屏的像素鲸娘（素材见 /pets/whale-girl-emoji/）。
 * 待机眨眼，每隔一阵在一轮待机播完时穿插一个小动作；点左右脸会被戳，连点会被挠痒痒。
 *
 * 版面上占的仍是原来那张 168×168（窄屏 96×96）的位置：画布按 69×66 网格的整数倍
 * （3× / 2×）放大，向外溢出，让她的身子正好落在原图的位置，呆毛和道具溢到框外。
 */
export default function HeroWhaleGirl() {
  const lang = useLang()
  const t = useT()
  const reduced = useReducedMotion()
  const [cur, setCur] = useState({ key: 'idle', since: 0, loops: 1 })
  const [touched, setTouched] = useState(false)
  const clicks = useRef<number[]>([])
  const playing = !reduced || touched

  useEffect(() => {
    if (!playing) return
    const anim = WHALE_GIRL.anims[cur.key]
    const now = performance.now()
    let delay: number
    let next: () => typeof cur
    if (cur.key === 'idle') {
      // 在一轮待机播完的那一刻切换，不在眨眼中途打断
      const rounds = 1 + Math.floor(Math.random() * 2)
      delay = rounds * anim.total - ((now - cur.since) % anim.total)
      next = () => {
        const [key, loops] = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
        return { key, since: performance.now(), loops }
      }
    } else {
      delay = cur.loops * anim.total - (now - cur.since)
      next = () => ({ key: 'idle', since: performance.now(), loops: 1 })
    }
    const id = window.setTimeout(() => setCur(next()), Math.max(0, delay))
    return () => window.clearTimeout(id)
  }, [cur, playing])

  const poke = (e: MouseEvent<HTMLButtonElement>) => {
    const now = e.timeStamp
    const recent = clicks.current.filter((x) => now - x < 1500)
    recent.push(now)
    clicks.current = recent
    const r = e.currentTarget.getBoundingClientRect()
    const right = e.clientX > 0 && e.clientX - r.left > r.width / 2
    const key = recent.length >= 4 ? 'tickle' : right ? 'poke-right' : 'poke-left'
    setTouched(true)
    setCur({ key, since: now, loops: 1 })
  }

  const base = lang === 'en' ? '../pets/' : './pets/'
  return (
    <button
      type="button"
      onClick={poke}
      title={t(pokeHint)}
      aria-label={`${t(strings['hero.whaleAlt'])} · ${t(pokeHint)}`}
      className="whale-float relative block h-[96px] w-[96px] cursor-pointer sm:h-[168px] sm:w-[168px]"
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
  )
}
