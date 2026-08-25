import { useState } from 'react'
import Icon from './Icon'
import { strings, useLang } from '../i18n'

/**
 * 复制按钮。图标式定宽：文字版在「复制 → ✓ 已复制」之间宽度会从 45px 跳到 71px，
 * 把命令区右边界推走 25px，每点一次布局抖一下。
 *
 * 图标切换按 better-ui 的处方：两个图标都留在 DOM 里、一个绝对定位，
 * 用 opacity + scale(0.25→1) + blur(4px→0) 交叉淡入，不做 visibility 切换。
 * 图标按钮没有可见文字，所以可访问名靠 aria-label；状态变化另开 role="status"
 * 播报，两者内容不重复。
 */
export default function CopyButton({
  text,
  label,
  className = '',
}: {
  text: string
  /** 图标按钮没有可见文字，可访问名全靠这里。复制的不是命令时必须传，
   *  否则读屏会念"复制命令"去复制一个群号。 */
  label?: string
  className?: string
}) {
  const lang = useLang()
  const name = label ?? strings['copy.aria'][lang]
  const [ok, setOk] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setOk(true)
    setTimeout(() => setOk(false), 1600)
  }

  return (
    <button
      onClick={copy}
      aria-label={name}
      title={name}
      className={`btn-press icon-swap relative grid h-7 w-7 shrink-0 place-items-center rounded border border-line transition-colors ${
        ok ? 'text-[var(--ok-text)]' : 'text-faint hover:border-[var(--mist)] hover:text-mist3'
      } ${className}`}
    >
      <Icon name="copy" size={14} className="icon-swap-out" data-on={!ok} />
      <Icon name="check" size={14} weight={2} className="icon-swap-in" data-on={ok} />
      <span role="status" className="sr-only">
        {ok ? strings['copy.done'][lang] : ''}
      </span>
    </button>
  )
}
