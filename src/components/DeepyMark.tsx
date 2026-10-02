import { useLang } from '../i18n'

/**
 * 静态的 Deepy 小鲸鱼（终端版待机第 0 帧，32×21 像素），用作顶栏品牌标。
 * 像素取自 public/pets/deepy-terminal/ 的帧数据；动起来的版本见 PixelSprite。
 */
export default function DeepyMark({ className = '' }: { className?: string }) {
  const lang = useLang()
  return (
    <svg
      viewBox="0 0 32 21"
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label={lang === 'en' ? 'Deepy, the dsh-TUI pixel whale' : 'dsh-TUI 像素小鲸鱼 Deepy'}
    >
      <path fill="#142660" d="M21 0h1v1h-1zM20 1h1v1h-1zM22 1h1v1h-1zM30 1h1v1h-1zM20 2h1v1h-1zM23 2h1v1h-1zM29 2h1v1h-1zM31 2h1v1h-1zM20 3h1v1h-1zM24 3h1v1h-1zM27 3h2v1h-2zM31 3h1v1h-1zM20 4h1v1h-1zM25 4h2v1h-2zM31 4h1v1h-1zM4 5h9v1h-9zM21 5h1v1h-1zM30 5h1v1h-1zM3 6h1v1h-1zM13 6h2v1h-2zM22 6h1v1h-1zM30 6h1v1h-1zM2 7h1v1h-1zM15 7h2v1h-2zM22 7h1v1h-1zM28 7h2v1h-2zM1 8h1v1h-1zM17 8h2v1h-2zM23 8h1v1h-1zM27 8h1v1h-1zM0 9h2v1h-2zM19 9h1v1h-1zM22 9h1v1h-1zM27 9h1v1h-1zM0 10h1v1h-1zM20 10h2v1h-2zM27 10h1v1h-1zM0 11h1v1h-1zM4 11h1v1h-1zM11 11h1v1h-1zM27 11h1v1h-1zM0 12h1v1h-1zM4 12h1v1h-1zM11 12h1v1h-1zM26 12h1v1h-1zM0 13h1v1h-1zM26 13h1v1h-1zM0 14h1v1h-1zM20 14h1v1h-1zM25 14h1v1h-1zM0 15h2v1h-2zM21 15h1v1h-1zM25 15h1v1h-1zM1 16h1v1h-1zM16 16h1v1h-1zM21 16h2v1h-2zM24 16h1v1h-1zM2 17h1v1h-1zM16 17h1v1h-1zM22 17h2v1h-2zM3 18h2v1h-2zM17 18h1v1h-1zM23 18h2v1h-2zM5 19h1v1h-1zM17 19h2v1h-2zM25 19h1v1h-1zM6 20h11v1h-11zM19 20h7v1h-7z" />
      <path fill="#4E6FFF" d="M21 1h1v1h-1zM21 2h2v1h-2zM30 2h1v1h-1zM21 3h3v1h-3zM29 3h2v1h-2zM21 4h4v1h-4zM27 4h4v1h-4zM22 5h8v1h-8zM4 6h9v1h-9zM23 6h7v1h-7zM3 7h12v1h-12zM23 7h5v1h-5zM2 8h15v1h-15zM24 8h3v1h-3zM2 9h17v1h-17zM23 9h4v1h-4zM1 10h19v1h-19zM22 10h5v1h-5zM1 11h3v1h-3zM5 11h6v1h-6zM12 11h15v1h-15zM1 12h3v1h-3zM5 12h6v1h-6zM12 12h14v1h-14zM1 13h25v1h-25zM1 14h4v1h-4zM12 14h8v1h-8zM21 14h4v1h-4zM2 15h1v1h-1zM15 15h6v1h-6zM22 15h3v1h-3zM17 16h4v1h-4zM23 16h1v1h-1zM17 17h5v1h-5zM18 18h5v1h-5zM19 19h6v1h-6z" />
      <path fill="#BEE1FF" d="M2 16h2v1h-2zM3 17h3v1h-3zM5 18h3v1h-3zM14 18h3v1h-3zM6 19h11v1h-11z" />
      <path fill="#FFFFFF" d="M5 14h7v1h-7zM3 15h12v1h-12zM4 16h12v1h-12zM6 17h10v1h-10zM8 18h6v1h-6z" />
    </svg>
  )
}
