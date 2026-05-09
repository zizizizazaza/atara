const rows: { label: string; direct: string; atara: string }[] = [
  { label: 'Merchant coverage', direct: 'Locked to one rail', atara: 'Crossmint + Tempo + x402 + Lightning' },
  { label: 'Failure handling', direct: 'Hard-fail', atara: 'Auto-fallback to next rail' },
  { label: 'High-risk approval', direct: 'Roll your own', atara: 'Built-in multi-agent consensus' },
  { label: 'Cost optimization', direct: 'Manual', atara: 'Smart routing picks cheapest path' },
  { label: 'Audit trail', direct: 'Per-protocol logs', atara: 'Unified trace_id across all rails' },
  { label: 'Time to first payment', direct: 'Weeks', atara: '10 minutes' },
]

const INK = '#1A151C'
const BLUE = '#3C64B8'
const GREEN = '#3F7E4F'
const RED = '#B8553C'

function FallbackDiagram() {
  return (
    <svg viewBox="0 0 560 130" className="w-full h-32" aria-hidden>
      {/* Left side: direct integration — single rail, breaks */}
      <text x="0" y="14" fontSize="8" fill={INK} opacity="0.55" fontFamily="Space Mono, monospace">direct integration</text>
      <circle cx="14" cy="60" r="5" fill={INK} />
      <text x="0" y="80" fontSize="6" fill={INK} opacity="0.5" fontFamily="Space Mono, monospace">api</text>
      <line x1="20" y1="60" x2="120" y2="60" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
      {/* break marker */}
      <line x1="120" y1="54" x2="130" y2="66" stroke={RED} strokeWidth="1.2" />
      <line x1="130" y1="54" x2="120" y2="66" stroke={RED} strokeWidth="1.2" />
      <line x1="135" y1="60" x2="220" y2="60" stroke={INK} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="3 3" />
      <text x="226" y="63" fontSize="7" fill={RED} opacity="0.85" fontFamily="Space Mono, monospace">hard-fail</text>
      {/* dot that hits the break and disappears */}
      <circle r="3" fill={RED}>
        <animate attributeName="cx" values="20;120;120" keyTimes="0;0.7;1" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="60;60;60" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.7;0.72" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* divider */}
      <line x1="290" y1="10" x2="290" y2="120" stroke={INK} strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 4" />

      {/* Right side: atara — three rails, auto-fallback */}
      <text x="310" y="14" fontSize="8" fill={INK} opacity="0.7" fontFamily="Space Mono, monospace">with atara</text>
      <circle cx="324" cy="60" r="5" fill={INK} />
      <text x="310" y="80" fontSize="6" fill={INK} opacity="0.5" fontFamily="Space Mono, monospace">api</text>
      {[
        { y: 35, label: 'rail a', state: 'broken' },
        { y: 60, label: 'rail b', state: 'active' },
        { y: 85, label: 'rail c', state: 'standby' },
      ].map((r) => (
        <g key={r.y}>
          <line
            x1="330" y1={r.y} x2="500" y2={r.y}
            stroke={r.state === 'active' ? INK : INK}
            strokeOpacity={r.state === 'active' ? 0.5 : r.state === 'broken' ? 0.18 : 0.22}
            strokeWidth="1"
            strokeDasharray={r.state === 'active' ? '0' : '3 3'}
          />
          {r.state === 'broken' && (
            <>
              <line x1="395" y1={r.y - 4} x2="403" y2={r.y + 4} stroke={RED} strokeOpacity="0.7" strokeWidth="1" />
              <line x1="403" y1={r.y - 4} x2="395" y2={r.y + 4} stroke={RED} strokeOpacity="0.7" strokeWidth="1" />
            </>
          )}
          <text x="506" y={r.y + 3} fontSize="7" fill={r.state === 'active' ? GREEN : INK} opacity={r.state === 'active' ? 0.9 : 0.4} fontFamily="Space Mono, monospace">
            {r.state === 'active' ? 'ok' : r.label}
          </text>
        </g>
      ))}
      {/* fallback dot: tries rail a, drops to rail b, completes */}
      <circle r="3" fill={BLUE}>
        <animate attributeName="cx" values="330;395;395;330;500" keyTimes="0;0.25;0.27;0.3;1" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="35;35;60;60;60" keyTimes="0;0.25;0.3;0.32;1" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;1;1;0" keyTimes="0;0.05;0.27;0.3;0.95;1" dur="3.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Mark({ kind }: { kind: 'x' | 'check' }) {
  if (kind === 'x') {
    return (
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 mr-2 align-[-1px]" style={{ color: RED, opacity: 0.75 }}>
        <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.4">
          <line x1="2" y1="2" x2="8" y2="8" />
          <line x1="8" y1="2" x2="2" y2="8" />
        </svg>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 mr-2 align-[-1px]" style={{ color: GREEN }}>
      <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.4">
        <polyline points="2,5.5 4.2,7.5 8,3" />
      </svg>
    </span>
  )
}

export default function WhyAtara() {
  return (
    <section id="why" className="py-24 border-t border-faint relative">
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">IV. Why Atara</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-4 max-w-3xl">
        Why route through Atara, not just one protocol?
      </h2>
      <p className="text-[0.7rem] leading-relaxed tracking-widest text-main opacity-70 mb-10 max-w-2xl">
        Single-protocol integrations work — until the rail fails, the merchant isn't supported, or finance asks for a unified audit trail.
      </p>

      <div className="mb-10 p-6 border border-faint bg-white/30 backdrop-blur-sm">
        <div className="text-[0.6rem] tracking-widest text-muted mb-4">One rail vs. auto-fallback</div>
        <FallbackDiagram />
      </div>

      <div className="border border-faint">
        <div className="grid grid-cols-12 text-[0.55rem] tracking-widest text-muted border-b border-faint">
          <div className="col-span-4 px-5 py-4">Dimension</div>
          <div className="col-span-4 px-5 py-4 border-l border-faint">Direct integration</div>
          <div className="col-span-4 px-5 py-4 border-l border-faint bg-cool/30 text-core">With Atara</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`grid grid-cols-12 text-[0.7rem] tracking-widest text-main ${
              i !== rows.length - 1 ? 'border-b border-faint' : ''
            }`}
          >
            <div className="col-span-4 px-5 py-5 font-display text-core text-sm font-medium">{r.label}</div>
            <div className="col-span-4 px-5 py-5 border-l border-faint opacity-60 flex items-center">
              <Mark kind="x" />
              <span>{r.direct}</span>
            </div>
            <div className="col-span-4 px-5 py-5 border-l border-faint bg-cool/10 flex items-center">
              <Mark kind="check" />
              <span>{r.atara}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
