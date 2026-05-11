import { useEffect, useState } from 'react'

export default function Overlay() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-6 pointer-events-auto transition-all duration-300 ${
        scrolled
          ? 'bg-[#E8D5C4]/85 backdrop-blur-md border-b border-main/15'
          : 'mix-blend-multiply'
      }`}
    >
      <div className="font-display text-2xl tracking-[0.2em] font-semibold">Atara</div>

      <nav className="flex items-center gap-6 md:gap-10">
        <a href="#use-cases" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
          Use cases
        </a>
        <a href="#layers" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
          Architecture
        </a>
        <a href="#pricing" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
          Pricing
        </a>
        <a href="#faq" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
          FAQ
        </a>
        <button className="action-btn">Docs</button>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-[0.75rem] tracking-wide shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#1A151C' }}
        >
          Get started
          <span aria-hidden>→</span>
        </button>
      </nav>
    </header>
  )
}
