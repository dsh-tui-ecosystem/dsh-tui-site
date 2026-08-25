import { useEffect } from 'react'
import { LangProvider, strings, useLang } from '../i18n'
import Nav from '../sections/Nav'
import Hero from '../sections/Hero'
import Features from '../sections/Features'
import Showcase from '../sections/Showcase'
import Install from '../sections/Install'
import Shortcuts from '../sections/Shortcuts'
import Commands from '../sections/Commands'
import Arch from '../sections/Arch'
import Faq from '../sections/Faq'
import Guides from '../sections/Guides'
import Community from '../sections/Community'
import Footer from '../sections/Footer'

/** 中英文首页共享的完整页面结构（语言由外层 LangProvider 决定） */
export function HomeSections() {
  const lang = useLang()
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <a className="skip-link" href="#main-content">{strings['home.skip'][lang]}</a>
      <Nav />
      <main id="main-content">
        <Hero />
        <Features />
        <Showcase />
        <Install />
        <Shortcuts />
        <Commands />
        <Arch />
        <Guides />
        <Faq />
        <Community />
      </main>
      <Footer />
    </div>
  )
}

export default function Home() {
  useEffect(() => {
    document.documentElement.lang = 'zh-CN'
  }, [])
  return (
    <LangProvider lang="zh">
      <HomeSections />
    </LangProvider>
  )
}
