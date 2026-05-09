import ShaderBackground from './components/ShaderBackground'
import Overlay from './components/Overlay'
import Hero from './components/Hero'
import UseCases from './components/UseCases'
import ThreeLayers from './components/ThreeLayers'
import WhyAtara from './components/WhyAtara'
import Integration from './components/Integration'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'

export default function App() {
  return (
    <>
      <ShaderBackground />
      <Overlay />
      <main className="relative z-10 w-full min-h-screen grid-bg pt-40 pb-20 px-6 md:px-20 lg:px-32 xl:px-48">
        <Hero />
        <UseCases />
        <ThreeLayers />
        <WhyAtara />
        <Integration />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  )
}
