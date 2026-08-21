import { useEffect, useSyncExternalStore } from 'react'

/**
 * Shared GitHub star count for ccch1mneyyy/dsh-TUI.
 * SSR/prerender-safe, sessionStorage-cached with a TTL:
 * show the cached value immediately, then refresh in the background once
 * the cache is older than STAR_TTL so the badge does not freeze for the
 * whole tab session.
 *
 * 用 useSyncExternalStore 承载缓存快照：服务端渲染返回 null（避免 hydration
 * 不一致），客户端首次渲染即读到缓存值，后台刷新后经 emit() 通知所有订阅方
 * （Nav / Hero 共享一份缓存与一次拉取）。
 */
const STAR_KEY = 'dsh-tui-star'
const STAR_TTL = 10 * 60 * 1000 // 10 分钟

interface StarCache {
  count: number
  ts: number
}

function readCache(): StarCache | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STAR_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StarCache>
      if (typeof parsed.count === 'number') return { count: parsed.count, ts: Number(parsed.ts) || 0 }
    }
  } catch {
    // sessionStorage unavailable (private mode) — treat as no cache
  }
  return null
}

let cached: StarCache | null = null
const listeners = new Set<() => void>()
function emit() {
  listeners.forEach((l) => l())
}

export function useStars(): number | null {
  const count = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange)
      return () => listeners.delete(onStoreChange)
    },
    () => (cached ??= readCache())?.count ?? null,
    () => null, // SSR / 预渲染快照
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    let alive = true
    const c = readCache()
    if (c && Date.now() - c.ts < STAR_TTL) return // 新鲜缓存，本次不重新拉

    fetch('https://api.github.com/repos/ccch1mneyyy/dsh-TUI', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number' && alive) {
          const next = { count: data.stargazers_count, ts: Date.now() }
          cached = next
          try {
            sessionStorage.setItem(STAR_KEY, JSON.stringify(next))
          } catch {
            // ignore quota/private-mode errors
          }
          emit()
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
