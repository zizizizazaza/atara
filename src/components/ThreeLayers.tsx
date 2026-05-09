type Layer = {
  index: string
  name: string
  title: string
  body: string
  bullets: string[]
  diagram: 'pay' | 'consensus' | 'router'
  className?: string
}

const layers: Layer[] = [
  {
    index: 'III.a',
    name: 'Pay Layer',
    title: 'Route across rails. Auto-fallback.',
    body: 'One API to send through cards, stablecoins, and Lightning. Smart routing picks the cheapest, fastest path. If one rail fails, the next takes over.',
    bullets: ['Crossmint', 'Tempo', 'x402', 'Lightning'],
    diagram: 'pay',
  },
  {
    index: 'III.b',
    name: 'Consensus Layer',
    title: 'Multi-agent voting before money moves.',
    body: 'High-risk payments trigger N-of-M consensus. Pluggable validators for KYC, fraud, and policy. Every decision logged with confidence and rationale.',
    bullets: ['Multi-agent voting', 'Risk validators', 'Audit trail', 'Above-threshold gating'],
    diagram: 'consensus',
    className: 'mt-0 lg:mt-16',
  },
  {
    index: 'III.c',
    name: 'LLM Router',
    title: 'OpenAI-compatible. One bill across models.',
    body: 'Closed-source models via aggregator. Open-source via P2P node cluster. Same endpoint, unified billing, sats-level micro-metering.',
    bullets: ['OpenAI-compatible API', 'Closed via praka.ai', 'Open via prakasa cluster', 'Per-call sats billing'],
    diagram: 'router',
    className: 'mt-0 lg:mt-32',
  },
]

const INK = '#1A151C'
const BLUE = '#3C64B8'
const GREEN = '#3F7E4F'

function PayDiagram() {
  return (
    <svg viewBox="0 0 280 130" className="w-full h-32 mb-6" aria-hidden>
      {[
        { y: 25, label: 'Crossmint', active: true },
        { y: 55, label: 'Tempo' },
        { y: 85, label: 'x402' },
        { y: 115, label: 'Lightning' },
      ].map((r) => (
        <g key={r.y}>
          <line
            x1="50" y1={r.y} x2="240" y2={r.y}
            stroke={INK} strokeOpacity={r.active ? 0.5 : 0.18}
            strokeWidth="1" strokeDasharray={r.active ? '0' : '3 3'}
          />
          <text x="246" y={r.y + 3} fontSize="7" fill={INK} opacity={r.active ? 0.7 : 0.4} fontFamily="Space Mono, monospace">
            {r.label}
          </text>
        </g>
      ))}
      <circle cx="50" cy="70" r="6" fill={INK} />
      <text x="32" y="74" fontSize="6" fill={INK} opacity="0.6" fontFamily="Space Mono, monospace">api</text>
      <line x1="50" y1="70" x2="50" y2="25" stroke={BLUE} strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="240" cy="70" r="6" fill={INK} />
      <line x1="240" y1="25" x2="240" y2="70" stroke={BLUE} strokeWidth="1" strokeOpacity="0.4" />
      <circle r="3.5" fill={BLUE}>
        <animate attributeName="cx" values="50;240" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="cy" values="25;25" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function ConsensusDiagram() {
  const validators = [
    { x: 50, y: 30, label: 'credit', delay: '0s' },
    { x: 50, y: 70, label: 'fraud', delay: '0.4s' },
    { x: 50, y: 110, label: 'policy', delay: '0.8s' },
  ]
  return (
    <svg viewBox="0 0 280 140" className="w-full h-32 mb-6" aria-hidden>
      {validators.map((v) => (
        <g key={v.label}>
          <line x1={v.x + 8} y1={v.y} x2="160" y2="70" stroke={INK} strokeOpacity="0.25" strokeWidth="1" />
          <circle cx={v.x} cy={v.y} r="8" fill="none" stroke={INK} strokeOpacity="0.6" strokeWidth="1" />
          <circle cx={v.x} cy={v.y} r="3" fill={GREEN}>
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin={v.delay} repeatCount="indefinite" />
          </circle>
          <text x="14" y={v.y + 3} fontSize="7" fill={INK} opacity="0.6" fontFamily="Space Mono, monospace">{v.label}</text>
        </g>
      ))}
      <circle cx="160" cy="70" r="14" fill="none" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="160" cy="70" r="14" fill="none" stroke={GREEN} strokeOpacity="0.5" strokeWidth="1">
        <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="160" y="73" fontSize="8" textAnchor="middle" fill={INK} opacity="0.7" fontFamily="Space Mono, monospace">vote</text>
      <line x1="178" y1="70" x2="240" y2="70" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
      <text x="245" y="60" fontSize="7" fill={GREEN} opacity="0.9" fontFamily="Space Mono, monospace">3/3</text>
      <text x="245" y="78" fontSize="6" fill={INK} opacity="0.5" fontFamily="Space Mono, monospace">approved</text>
    </svg>
  )
}

function RouterDiagram() {
  return (
    <svg viewBox="0 0 280 140" className="w-full h-32 mb-6" aria-hidden>
      <circle cx="40" cy="70" r="6" fill={INK} />
      <text x="22" y="86" fontSize="6" fill={INK} opacity="0.6" fontFamily="Space Mono, monospace">/llm</text>
      <path d="M 46 70 C 90 70, 100 35, 150 35" fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth="1" />
      <path d="M 46 70 C 90 70, 100 105, 150 105" fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth="1" />
      <rect x="150" y="22" width="86" height="26" rx="3" fill="none" stroke={INK} strokeOpacity="0.5" strokeWidth="1" />
      <text x="193" y="38" fontSize="7" textAnchor="middle" fill={INK} opacity="0.7" fontFamily="Space Mono, monospace">closed · praka.ai</text>
      {[160, 175, 190, 205, 220].map((cx, i) => (
        <circle key={cx} cx={cx} cy="105" r="4" fill="none" stroke={INK} strokeOpacity="0.55" strokeWidth="1">
          <animate attributeName="fill" values={i === 1 ? 'rgba(60,100,184,0.8);rgba(60,100,184,0)' : 'rgba(60,100,184,0)'} dur="1.6s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {[
        [160, 175], [175, 190], [190, 205], [205, 220],
      ].map(([a, b]) => (
        <line key={a} x1={a + 4} y1="105" x2={b - 4} y2="105" stroke={INK} strokeOpacity="0.3" strokeWidth="1" />
      ))}
      <text x="193" y="125" fontSize="7" textAnchor="middle" fill={INK} opacity="0.7" fontFamily="Space Mono, monospace">open · P2P cluster</text>
      <circle r="3" fill={BLUE}>
        <animateMotion dur="2.8s" repeatCount="indefinite" path="M 46 70 C 90 70, 100 35, 150 35" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill={BLUE}>
        <animateMotion dur="2.8s" begin="1.4s" repeatCount="indefinite" path="M 46 70 C 90 70, 100 105, 150 105" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Diagram({ kind }: { kind: Layer['diagram'] }) {
  if (kind === 'pay') return <PayDiagram />
  if (kind === 'consensus') return <ConsensusDiagram />
  return <RouterDiagram />
}

export default function ThreeLayers() {
  return (
    <section id="layers" className="py-24 border-t border-faint relative">
      <div className="crosshair h top-0 left-0 -translate-y-1/2"></div>
      <div className="crosshair h top-0 right-0 -translate-y-1/2"></div>
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">III. Architecture</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-4 max-w-3xl">
        Three layers. One API key.
      </h2>
      <p className="text-[0.7rem] leading-relaxed tracking-widest text-main opacity-70 mb-16 max-w-2xl">
        Atara Gateway sits in front. <span className="font-mono">X-Atara-Key</span> authenticates, the prepay wallet settles, every call lands in the audit trail with a single <span className="font-mono">trace_id</span>.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10">
        {layers.map((p) => (
          <div key={p.index} className={`relative group p-6 border border-faint bg-white/30 backdrop-blur-sm ${p.className ?? ''}`}>
            <div className="text-[0.6rem] tracking-widest text-muted mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 border border-main rounded-full group-hover:bg-glow group-hover:border-glow transition-colors"></span>
              {p.index} · {p.name}
            </div>
            <Diagram kind={p.diagram} />
            <h3 className="font-display text-2xl mb-4 text-core font-semibold leading-snug">{p.title}</h3>
            <p className="text-[0.7rem] leading-relaxed text-main tracking-widest opacity-80 mb-6">
              {p.body}
            </p>
            <ul className="text-[0.6rem] tracking-widest text-main flex flex-col gap-2 border-l border-faint pl-4">
              {p.bullets.map((b) => (
                <li key={b} className="opacity-70">{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
