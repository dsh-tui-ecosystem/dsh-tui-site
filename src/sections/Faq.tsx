import Reveal from '../components/Reveal'
import SectionHead from '../components/SectionHead'
import { FAQ_ITEMS, strings, useLang, useT } from '../i18n'

const FAQS = FAQ_ITEMS

export default function Faq() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          index="08"
          en="FREQUENTLY ASKED QUESTIONS"
          title={t(strings['faq.title'])}
          desc={t(strings['faq.desc'])}
        />

        <div className="grid gap-3 md:grid-cols-2">
          {FAQS.map((item, index) => (
            <Reveal key={item.question.zh} delay={index * 60}>
              <details className="group h-full rounded-lg border border-line p-5" style={{ background: 'var(--panel)' }}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-head">
                  <span>{item.question[lang]}</span>
                  <span aria-hidden="true" className="font-mono2 text-mist transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[13px] leading-[1.9] text-dim">{item.answer[lang]}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
