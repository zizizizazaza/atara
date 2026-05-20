import { useEffect, useRef, useState } from 'react'
import { useToast } from './ToastProvider'

export default function Overlay() {
  const [scrolled, setScrolled] = useState(false)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const { notify } = useToast()
  const closeTimer = useRef<number | null>(null)

  const openSolution = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setSolutionOpen(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setSolutionOpen(false), 120)
  }

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
          : ''
      }`}
    >
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.location.hash = '' }}
        className={`font-display text-2xl tracking-[0.2em] font-semibold cursor-pointer hover:text-glow transition-colors ${scrolled ? '' : 'mix-blend-multiply'}`}
      >
        Atara
      </a>

      <nav className="flex items-center gap-6 md:gap-10">
        <div
          className="relative"
          onMouseEnter={openSolution}
          onMouseLeave={scheduleClose}
        >
          <button
            type="button"
            onClick={() => setSolutionOpen((v) => !v)}
            aria-expanded={solutionOpen}
            className="inline-flex items-center gap-1.5 text-[0.9rem] tracking-wide text-core hover:text-glow transition-colors font-medium"
          >
            Ecosystem
            <span
              aria-hidden
              className={`text-[0.6rem] transition-transform duration-200 ${solutionOpen ? 'rotate-180' : ''}`}
            >
              ▾
            </span>
          </button>
          <div
            className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-150 isolate mix-blend-normal ${
              solutionOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
            }`}
          >
            <div
              className="w-[320px] rounded-2xl border border-main/15 backdrop-blur-xl shadow-[0_24px_50px_-20px_rgba(60,30,20,0.4),0_6px_18px_-10px_rgba(60,30,20,0.22)] overflow-hidden"
              style={{ backgroundColor: scrolled ? 'rgba(232, 213, 196, 0.88)' : 'rgba(232, 213, 196, 0.45)' }}
            >
              <div className="p-2">
                <a
                  href="https://setu-web-five.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-main/[0.04] transition-colors"
                >
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-[0.85rem] text-core font-medium tracking-tight">
                      Setu
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 4h6v6" />
                        <path d="M20 4 10 14" />
                        <path d="M20 14v6H4V4h6" />
                      </svg>
                    </span>
                    <span className="block text-[0.68rem] text-main/60 mt-0.5 font-mono">AI Agent Ledger</span>
                  </span>
                </a>
                <a
                  href="#agent-consensus"
                  className="group flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-main/[0.04] transition-colors"
                >
                  <span className="flex-1">
                    <span className="block text-[0.85rem] text-core font-medium tracking-tight">Agent Consensus</span>
                    <span className="block text-[0.68rem] text-main/60 mt-0.5 font-mono">Coordination layer</span>
                  </span>
                </a>
                <a
                  href="#/lokachain"
                  className="group flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-main/[0.04] transition-colors"
                >
                  <span className="flex-1">
                    <span className="block text-[0.85rem] text-core font-medium tracking-tight">Loka Chain</span>
                    <span className="block text-[0.68rem] text-main/60 mt-0.5 font-mono">Stablecoin chain</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <a href="#docs" className="text-[0.9rem] tracking-wide text-core hover:text-glow transition-colors font-medium">
          Docs
        </a>
        <button
          onClick={() => { window.location.hash = '#/dashboard' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-core/40 text-core font-medium text-[0.9rem] tracking-wide hover:border-glow hover:text-glow transition-colors"
        >
          Dashboard
        </button>
        <button
          onClick={() => { window.location.hash = '#/guide' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-[0.9rem] tracking-wide shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#1A151C' }}
        >
          Quick Start
          <span aria-hidden>→</span>
        </button>
      </nav>
    </header>
  )
}
