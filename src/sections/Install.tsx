import SectionHead from '../components/SectionHead'
import Reveal from '../components/Reveal'
import CopyButton from '../components/CopyButton'
import { INSTALL_STEPS, strings, useLang, useT } from '../i18n'

const STEPS = INSTALL_STEPS

export default function Install() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="install" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          index="03"
          en="GETTING STARTED"
          title={t(strings['install.title'])}
          desc={t(strings['install.desc'])}
        />

        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-[var(--line)] lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.no} delay={i * 80}>
              <div className="flex h-full flex-col p-6" style={{ background: 'var(--panel)' }}>
                <div className="font-mono2 mb-4 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded border border-[var(--mist)] text-[13px] font-bold text-mist2">
                    {s.no}
                  </span>
                  <span className="text-[15px] font-bold text-head">{s.title[lang]}</span>
                </div>
                <div
                  className="font-mono2 flex items-center gap-2 rounded border border-soft px-3 py-2.5"
                  style={{ background: 'var(--bg-2)' }}
                >
                  <span className="text-faint select-none">$</span>
                  <code className="min-w-0 flex-1 break-all text-[12px] leading-relaxed text-mist3">{s.cmd}</code>
                  <CopyButton text={s.cmd} />
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-faint">{s.note[lang]}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="mt-6">
          <div
            className="font-mono2 flex flex-col gap-2 rounded-lg border border-line px-5 py-4 text-[12px] text-dim sm:flex-row sm:items-center sm:gap-6"
            style={{ background: 'var(--panel)' }}
          >
            <span className="text-mist2 font-semibold">{t(strings['install.alt.label'])}</span>
            <code className="text-mist3">sh install.sh</code>
            <span className="text-faint">{t(strings['install.alt.or'])}</span>
            <code className="break-all text-mist3">dsh plugin --profile dsh-tui add @deepseek-harness-tui/dsh-tui</code>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
