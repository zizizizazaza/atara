import ShaderBackground from './components/ShaderBackground'
import Overlay from './components/Overlay'
import Hero from './components/Hero'
import Problem from './components/Problem'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Templates from './components/Templates'
import Integration from './components/Integration'
import Pricing from './components/Pricing'
import FinalCTA from './components/FinalCTA'

export default function App() {
  return (
    <>
      <ShaderBackground />
      <Overlay />
      <main className="relative z-10 w-full min-h-screen grid-bg pt-40 pb-20 px-6 md:px-20 lg:px-32 xl:px-48">
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Templates />
        <Integration />
        <Pricing />
        <FinalCTA />
      </main>
    </>
  )
}
