import Reveal from './Reveal'

interface Props {
  index: string
  title: string
  en: string
  desc?: string
}

export default function SectionHead({ index, title, en, desc }: Props) {
  return (
    <Reveal className="mb-10">
      <div className="font-mono2 mb-3 flex items-center gap-3 text-[12px] text-faint">
        <span className="text-mist">//</span>
        <span>{index}</span>
        <span className="h-px w-10 bg-[var(--line)]" />
        <span className="tracking-[0.2em]">{en}</span>
      </div>
      <h2 className="text-[30px] font-bold leading-tight text-head sm:text-[38px]">{title}</h2>
      {desc && <p className="mt-3 max-w-2xl text-[14px] leading-[1.9] text-dim">{desc}</p>}
    </Reveal>
  )
}
