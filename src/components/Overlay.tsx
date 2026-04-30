export default function Overlay() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-6 pointer-events-auto mix-blend-multiply">
      <div className="font-display text-2xl tracking-[0.2em] font-semibold">Atara</div>

      <nav className="flex items-center gap-6 md:gap-10">
        <a href="#features" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
          Features
        </a>
        <a href="#templates" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
          Templates
        </a>
        <a href="#pricing" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
          Pricing
        </a>
        <button className="action-btn">Docs</button>
        <button className="action-btn">Get keys</button>
      </nav>
    </header>
  )
}
