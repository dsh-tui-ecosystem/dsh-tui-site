interface Props {
  className?: string
  float?: boolean
}

import { useLang } from '../i18n'

/** 品牌像素鲸鱼 —— 取自仓库 logo.svg 的精确像素路径 */
export default function PixelWhale({ className = '', float = true }: Props) {
  const lang = useLang()
  return (
    <svg
      viewBox="0 0 200 150"
      className={`${float ? 'whale-float ' : ''}${className}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={lang === 'en' ? 'dsh-TUI pixel whale' : 'dsh-TUI 像素鲸鱼'}
    >
      <g transform="translate(8 9)">
        <path
          fill="#172554"
          d="M16 70h8V54h16V46h64v8h24v8h16V46h8V30h16v16h8V30h16v48h-8v16h-16v24h-16v16h-32v-8h-16v16H56v-8H40v-8H24v-16h-8z"
        />
        <path
          fill="#4b6fff"
          d="M24 70h8V62h16v-8h48v8h24v8h24v-8h8V46h8v16h16V46h8v32h-8v16h-16v24h-16v8h-16v-8h-16v-16H96v24H56v-8H40v-8H24z"
        />
        <path fill="#b9dcff" d="M32 102h16v8h16v8h40v8H56v-8H40v-8h-8z" />
        <path fill="#ffffff" d="M48 102h56v16H64v-8H48z" />
        <path fill="#172554" d="M48 78h8v16h-8zm48 0h8v16h-8zm24 16h8v8h-8z" />
        <path
          fill="#7da1de"
          style={{ animation: 'twinkle 2.4s ease-in-out infinite' }}
          d="M8 38h8v8H8z"
        />
        <path
          fill="#7da1de"
          style={{ animation: 'twinkle 2.4s ease-in-out 0.6s infinite' }}
          d="M16 22h8v8h-8z"
        />
        <path
          fill="#7da1de"
          style={{ animation: 'twinkle 2.4s ease-in-out 1.2s infinite' }}
          d="M32 30h8v8h-8z"
        />
      </g>
    </svg>
  )
}
