import CopyButton from './CopyButton'

/**
 * 可复制的命令行。Hero / 页脚 / 安装步骤原本各写了一份几乎相同的标记。
 *
 * `word-break: keep-all` 是这里的关键：连字符在 CSS 里是天然断点，而断行是
 * 贪心的，所以默认会先在 `@deepseek-harness-tui/dsh-` 后面断开，把一个孤零零的
 * `tui` 甩到下一行。keep-all 禁止词内断行，换行只落在空格上，读起来才是一条
 * 完整命令。
 *
 * 试过给每个 token 加 white-space: nowrap，不行：nowrap 会取消该元素上所有
 * 软换行点，之后 overflow-wrap 和 word-break 都救不回来，窄屏下超长包名直接
 * 被裁掉 3px（实测 320px：容器 207px，包名 210px）。keep-all 没有这个副作用。
 *
 * 也不放 $ 提示符：等宽字体加上复制按钮已经说明这是一条命令，而那个字形连同
 * 间距要吃掉 14px —— 正是首屏命令挤不进一行的差额。
 */
export default function CommandLine({
  command,
  tone = 'panel',
  className = '',
}: {
  command: string
  tone?: 'panel' | 'inset'
  className?: string
}) {
  return (
    <div
      className={`font-mono2 flex items-start gap-1.5 border ${
        tone === 'panel' ? 'rounded-md border-line px-3.5 py-2.5' : 'rounded border-soft px-3 py-2'
      } ${className}`}
      style={{ background: tone === 'panel' ? 'var(--panel)' : 'var(--bg-2)' }}
    >
      <code className="min-w-0 flex-1 pt-px text-[12px] leading-[1.7] text-mist3 [word-break:keep-all]">
        {command}
      </code>
      <CopyButton text={command} />
    </div>
  )
}
