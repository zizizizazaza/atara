export default function Overlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 md:p-10 mix-blend-multiply">
      <header className="flex justify-between items-start pointer-events-auto w-full">
        <div className="font-serif text-2xl tracking-superwide uppercase font-light">ATARA</div>
        <button className="w-8 h-4 flex flex-col justify-between items-end group hover:opacity-70 transition-opacity">
          <span className="block h-px bg-main w-full transition-all group-hover:w-3/4"></span>
          <span className="block h-px bg-main w-3/4 transition-all group-hover:w-full"></span>
        </button>
      </header>

      <div className="absolute top-28 left-6 md:left-10 text-[0.6rem] uppercase tracking-widest leading-relaxed flex flex-col gap-4 text-main">
        <div className="flex flex-col">
          <span className="text-muted mb-0.5">Protocol Hash</span>
          <span className="font-bold">0xATARA...992C</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted mb-0.5">Status</span>
          <span className="font-bold flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-glow animate-pulse"></span>
            Operational
          </span>
        </div>
      </div>

      <div className="absolute top-28 right-6 md:right-10 text-[0.6rem] uppercase tracking-widest leading-relaxed flex flex-col gap-4 text-right text-main">
        <div className="flex flex-col items-end">
          <span className="text-muted mb-0.5">System Resonance</span>
          <span className="font-bold">14.2 MS</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-muted mb-0.5">Active Agents</span>
          <span className="font-bold">+8,402 NODES</span>
        </div>
      </div>

      <footer className="flex justify-between items-end w-full border-t border-faint pt-4 pointer-events-auto mix-blend-multiply">
        <div className="flex flex-col gap-1.5">
          <div className="text-[0.6rem] text-muted tracking-widest uppercase flex items-center gap-2">I. INITIALIZATION</div>
          <div className="text-[0.6rem] text-main font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-glow"></span>
            II. ORCHESTRATION
          </div>
          <div className="text-[0.6rem] text-muted tracking-widest uppercase flex items-center gap-2">III. CONSENSUS</div>
          <div className="text-[0.6rem] text-muted tracking-widest uppercase flex items-center gap-2">IV. SETTLEMENT</div>
        </div>

        <div className="flex gap-6">
          <button className="action-btn">Docs</button>
          <button className="action-btn">Get Keys</button>
        </div>
      </footer>
    </div>
  )
}
