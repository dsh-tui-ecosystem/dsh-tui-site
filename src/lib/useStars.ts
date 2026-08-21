import { useEffect, useState } from 'react'

/**
 * Shared GitHub star count for ccch1mneyyy/dsh-TUI.
 * Browser-only (SSR/prerender safe), sessionStorage-cached with a TTL:
 * show the cached value immediately, then refresh in the background once
 * the cache is older than STAR_TTL so the badge does not freeze for the
 * whole tab session.
 */
const STAR_KEY = 'dsh-tui-star'
const STAR_TTL = 10 * 60 * 1000 // 10 分钟

interface StarCache {
  count: number
  ts: number
}

export function useStars(): number | null {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    let alive = true

    let cached: StarCache | null = null
    try {
      const raw = sessionStorage.getItem(STAR_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StarCache>
        if (typeof parsed.count === 'number') cached = { count: parsed.count, ts: Number(parsed.ts) || 0 }
      }
    } catch {
      // sessionStorage unavailable (private mode) — just fetch
    }

    if (cached) {
      setCount(cached.count)
      if (Date.now() - cached.ts < STAR_TTL) return // 新鲜缓存，本次不重新拉
    }

    fetch('https://api.github.com/repos/ccch1mneyyy/dsh-TUI', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number' && alive) {
          setCount(data.stargazers_count)
          try {
            sessionStorage.setItem(STAR_KEY, JSON.stringify({ count: data.stargazers_count, ts: Date.now() }))
          } catch {
            // ignore quota/private-mode errors
          }
        }
      })
      .catch(() => {
        // 拉取失败：保留已展示的缓存值（哪怕是旧值），不闪没
      })

    return () => {
      alive = false
    }
  }, [])
  return count
}

export function formatStars(count: number | null): string | null {
  if (count == null) return null
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count)
}
