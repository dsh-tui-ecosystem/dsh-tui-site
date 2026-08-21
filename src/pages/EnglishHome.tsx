import { useEffect } from 'react'
import { LangProvider } from '../i18n'
import { HomeSections } from './Home'

export default function EnglishHome() {
  useEffect(() => {
    document.documentElement.lang = 'en'
  }, [])
  return (
    <LangProvider lang="en">
      <HomeSections />
    </LangProvider>
  )
}
