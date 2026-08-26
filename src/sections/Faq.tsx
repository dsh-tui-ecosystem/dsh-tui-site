import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import SectionHead from '../components/SectionHead'
import { FAQ_ITEMS, strings, useLang, useT } from '../i18n'

const FAQS = FAQ_ITEMS

export default function Faq() {
  const lang = useLang()
  const t = useT()
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-6xl px-page">
        <SectionHead
          title={t(strings['faq.title'])}
          desc={t(strings['faq.desc'])}
        />

        {/* 单列：问答是纵向阅读的列表。双列网格会把行高绑在一起，
            同行有一条展开、另一条折叠时，折叠那条被拉出大片空白。 */}
        <Reveal>
          <div
            className="divide-y divide-[var(--line-soft)] overflow-hidden rounded-lg border border-line"
            style={{ background: 'var(--panel)' }}
          >
            {FAQS.map((item) => (
              <details key={item.question.zh} className="faq-item group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 transition-colors hover:bg-[var(--panel-2)] [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] font-semibold text-head">{item.question[lang]}</span>
                  <Icon
                    name="chevron-down"
                    size={16}
                    weight={2}
                    className="shrink-0 text-mist transition-transform duration-200 ease-out group-open:-rotate-180"
                  />
                </summary>
                {/* 答案单独收窄：整段跨满 1152px 每行会到 130+ 字符，远超舒适行长 */}
                <p className="faq-answer max-w-3xl px-5 pb-5 text-[13.5px] leading-[1.9] text-dim">
                  {item.answer[lang]}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
