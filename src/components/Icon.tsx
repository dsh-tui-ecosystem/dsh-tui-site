import type { SVGProps } from 'react'

/**
 * 界面图标。几何取自 Lucide（ISC License, Copyright (c) 2026 Lucide Icons
 * and Contributors，见 THIRD-PARTY-NOTICES.md），内联以免为几个图标引一个依赖。
 *
 * 描边只有这一处定义：better-ui 要求图标的视觉重量跟随相邻文字，
 * 常规字重旁 1.5px、半粗字重旁 2px。Lucide 的 path 画在 24 的画布上，
 * 缩到 size 后描边会等比变细，所以这里按 size 反算，让**渲染出来**的
 * 粗细就是 weight 指定的值，而不是名义值。
 */
const PATHS = {
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'arrow-right': (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>
  ),
  download: (
    <>
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </>
  ),
  moon: (
    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
  ),
} as const

export type IconName = keyof typeof PATHS

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name' | 'width' | 'height'> {
  name: IconName
  /** 渲染尺寸（px） */
  size?: number
  /** 期望**渲染后**的描边粗细（px）：常规字重旁 1.5，半粗字重旁 2 */
  weight?: number
}

export default function Icon({ name, size = 16, weight = 1.5, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={(weight * 24) / size}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}
