import Reveal from './Reveal'

interface Props {
  title: string
  desc?: string
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
export default function SectionHead({ title, desc }: Props) {
  return (
    <Reveal className="mb-10">
      <h2 className="text-[30px] font-bold leading-tight text-head sm:text-[38px]">{title}</h2>
      {desc && <p className="mt-3 max-w-2xl text-[14px] leading-[1.9] text-dim">{desc}</p>}
    </Reveal>
  )
}
