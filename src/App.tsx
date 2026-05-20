import { useEffect, useState } from 'react'
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

  if (route.startsWith('#/guide')) {
    return (
      <ToastProvider>
        <Guide />
      </ToastProvider>
    )
  }

  if (route.startsWith('#/lokachain')) {
    return (
      <ToastProvider>
        <LokaChain />
      </ToastProvider>
    )
  }

  if (route.startsWith('#/dashboard')) {
    return (
      <ToastProvider>
        <Dashboard />
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
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
    </ToastProvider>
  )
}
