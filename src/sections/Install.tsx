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

        {/* 整合包安装（新手推荐） */}
        <Reveal delay={40}>
          <div
            className="mb-6 flex flex-col gap-5 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
            style={{ background: 'var(--panel)', borderColor: 'var(--mist)' }}
          >
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="font-mono2 rounded border border-[var(--mist)] px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide text-mist2">
                  NEW
                </span>
                <h3 className="text-[17px] font-bold text-head">{t(strings['bundle.title'])}</h3>
              </div>
              <p className="max-w-2xl text-[13px] leading-relaxed text-dim">{t(strings['bundle.desc'])}</p>
              <p className="font-mono2 mt-2 text-[11px] text-faint">{t(strings['bundle.note'])}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {[
                  { no: '1', txt: t(strings['bundle.step1']) },
                  { no: '2', txt: t(strings['bundle.step2']) },
                  { no: '3', txt: t(strings['bundle.step3']) },
                ].map((s) => (
                  <span
                    key={s.no}
                    className="font-mono2 flex items-center gap-1.5 rounded border border-soft px-2.5 py-1 text-[11.5px] text-mist3"
                    style={{ background: 'var(--bg-2)' }}
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--mist)] text-[9.5px] font-bold text-white">
                      {s.no}
                    </span>
                    {s.txt}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
              <a
                href="/downloads/dsh-tui-setup.zip"
                className="btn-press rounded bg-[var(--mist)] px-6 py-3 text-center text-[14px] font-semibold text-white transition-colors hover:bg-[#5d7dff]"
              >
                {t(strings['bundle.download'])}
              </a>
              <a
                href="https://github.com/ccch1mneyyy/dsh-TUI/releases/latest/download/dsh-tui-setup.zip"
                target="_blank"
                rel="noreferrer"
                className="font-mono2 text-center text-[11px] text-faint transition-colors hover:text-mist3"
              >
                {t(strings['bundle.mirror'])} ↗
              </a>
            </div>
          </div>
        </Reveal>

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
