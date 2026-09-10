import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
  /** 入场体：up=上浮（默认，标题/大媒体）/ pop=回弹（卡片格子小件）/ slide-l/r=侧进（双栏对进） */
  variant?: 'up' | 'pop' | 'slide-l' | 'slide-r'
}

const VARIANT_CLS: Record<NonNullable<Props['variant']>, string> = {
  up: 'reveal',
  pop: 'reveal-pop',
  'slide-l': 'reveal-slide-l',
  'slide-r': 'reveal-slide-r',
}

/** 滚动进入视口时的显现。variant 决定抵达方式，全站不共用一种入场。 */
export default function Reveal({ children, delay = 0, className = '', as = 'div', variant = 'up' }: Props) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Tag = as as 'div'
  return (
    <Tag
      ref={ref as never}
      className={`${VARIANT_CLS[variant]} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
