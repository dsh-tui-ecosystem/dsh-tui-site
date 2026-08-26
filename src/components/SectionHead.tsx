import Reveal from './Reveal'

interface Props {
  title: string
  desc?: string
  /** 内容区块一律左对齐；邀请 / 收尾类区块居中（页脚 CTA 也是这个处理）。 */
  align?: 'start' | 'center'
}

/**
 * 区块标题。原本每个区块头上都顶着一行 `// 08 ——— FREQUENTLY ASKED QUESTIONS`：
 *
 * - 那串英文只是把中文标题再说一遍（核心能力 / CAPABILITIES），零信息量；
 * - 01–08 的序号是装饰 —— 特性、预览、安装、快捷键…之间没有先后顺序，
 *   编号是在没想清结构时假装有结构。安装步骤那种真有次序的地方才该编号。
 *
 * 层级改由字号与留白承担。
 */
export default function SectionHead({ title, desc, align = 'start' }: Props) {
  const centered = align === 'center'
  return (
    <Reveal className={`mb-10 ${centered ? 'text-start sm:text-center' : ''}`}>
      <h2 className="text-[26px] font-bold leading-tight text-head sm:text-[38px]">{title}</h2>
      {desc && (
        <p className={`mt-3 max-w-2xl text-[14px] leading-[1.9] text-dim ${centered ? 'sm:mx-auto' : ''}`}>
          {desc}
        </p>
      )}
    </Reveal>
  )
}
