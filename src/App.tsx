import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import ShaderBackground from './components/ShaderBackground'
import Overlay from './components/Overlay'
import ToastProvider from './components/ToastProvider'
import Hero from './components/Hero'
import UseCases from './components/UseCases'
import WhyAtara from './components/WhyAtara'
import Integration from './components/Integration'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Guide from './components/Guide'
import LokaChain from './components/LokaChain'
import Dashboard from './components/Dashboard'
import Authorize from './components/Authorize'
import LoginModal from './components/LoginModal'
import { isAuthed } from './auth'

function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const route = useRoute()
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    const open = () => setLoginOpen(true)
    window.addEventListener('atara-login-open', open)
    return () => window.removeEventListener('atara-login-open', open)
  }, [])

  let content: ReactNode

  if (route.startsWith('#/guide')) {
    content = <Guide />
  } else if (route.startsWith('#/lokachain')) {
    content = <LokaChain />
  } else if (route.startsWith('#/dashboard')) {
    if (!isAuthed()) {
      window.location.hash = ''
      window.dispatchEvent(new Event('atara-login-open'))
      return null
    }
    content = <Dashboard />
  } else if (route.startsWith('#/authorize')) {
    content = <Authorize />
  } else {
    content = (
      <>
        <ShaderBackground />
        <div aria-hidden="true" className="bg-noise" />
        <Overlay />
        <main className="relative z-10 w-full min-h-screen grid-bg pt-28 pb-20 px-6 md:px-20 lg:px-32 xl:px-48">
          <Hero />
          <UseCases />
          <WhyAtara />
          <Integration />
          <FAQ />
          <FinalCTA />
        </main>
      </>
    )
  }

  return (
    <ToastProvider>
      {content}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </ToastProvider>
  )
}
