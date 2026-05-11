import { useState } from 'react'

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
    index: 'IV.a',
    name: 'Pay Layer',
    title: 'Route across rails. Auto-fallback.',
    body: 'One API to send through cards, stablecoins, and Lightning. Smart routing picks the cheapest, fastest path. If one rail fails, the next takes over.',
    bullets: ['Crossmint', 'Tempo', 'x402', 'Lightning'],
    diagram: 'pay',
  },
  {
    index: 'IV.b',
    name: 'Consensus Layer',
    title: 'Multi-agent voting before money moves.',
    body: 'High-risk payments trigger N-of-M consensus. Pluggable validators for KYC, fraud, and policy. Every decision logged with confidence and rationale.',
    bullets: ['Multi-agent voting', 'Risk validators', 'Audit trail', 'Above-threshold gating'],
    diagram: 'consensus',
    className: 'mt-0 lg:mt-16',
  },
  {
    index: 'IV.c',
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
  const rails = [
    { y: 22, label: 'Crossmint', active: true },
    { y: 58, label: 'Tempo' },
    { y: 94, label: 'x402' },
    { y: 130, label: 'Lightning' },
  ]
  return (
    <svg viewBox="0 0 280 152" className="w-full h-32 mb-6" aria-hidden>
      {/* api source node */}
      <circle cx="38" cy="76" r="6" fill={INK} />
      <text x="20" y="92" fontSize="6" fill={INK} opacity="0.55" fontFamily="Space Mono, monospace">api</text>

      {rails.map((r) => {
        const active = !!r.active
        const path = `M 44 76 C 100 76, 110 ${r.y}, 178 ${r.y}`
        return (
          <g key={r.label}>
            <path
              d={path}
              fill="none"
              stroke={INK}
              strokeOpacity={active ? 0.55 : 0.2}
              strokeWidth="1"
              strokeDasharray={active ? '0' : '3 3'}
            />
            {/* rail endpoint */}
            <circle cx="178" cy={r.y} r="3" fill={active ? BLUE : INK} fillOpacity={active ? 0.85 : 0.4} />
            <text
              x="186"
              y={r.y + 3}
              fontSize="7"
              fill={INK}
              opacity={active ? 0.78 : 0.42}
              fontFamily="Space Mono, monospace"
            >
              {r.label}
            </text>
            {active && (
              <circle r="3" fill={BLUE}>
                <animateMotion dur="2.6s" repeatCount="indefinite" path={path} />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur="2.6s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        )
      })}

      {/* "active" badge near the chosen rail */}
      <text x="186" y="13" fontSize="6" fill={GREEN} opacity="0.85" fontFamily="Space Mono, monospace">
        ▸ routed
      </text>
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
  const [hovered, setHovered] = useState<number | null>(null)
  const active = layers[hovered ?? 0]

  return (
    <section id="layers" className="py-24 border-t border-faint relative">
      <div className="crosshair h top-0 left-0 -translate-y-1/2"></div>
      <div className="crosshair h top-0 right-0 -translate-y-1/2"></div>
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">IV. Architecture</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-4 max-w-3xl">
        Three layers. One API key.
      </h2>
      <p className="text-[0.7rem] leading-relaxed tracking-widest text-main opacity-70 mb-20 max-w-2xl">
        Atara Gateway sits in front. <span className="font-mono">X-Atara-Key</span> authenticates, the prepay wallet settles, every call lands in the audit trail with a single <span className="font-mono">trace_id</span>. Hover a layer to inspect.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-16 items-center">
        {/* isometric stack — architectural floor-plate look */}
        <div
          className="relative h-[620px] flex items-center justify-center"
          style={{ perspective: '2200px', perspectiveOrigin: '50% 50%' }}
        >
          <div
            className="relative w-full max-w-[680px] h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {layers.map((p, idx) => {
              const isActive = hovered === idx
              const someoneActive = hovered !== null
              const baseY = (idx - 1) * 110
              const baseZ = (layers.length - 1 - idx) * 40
              const popZ = isActive ? 140 : 0
              const dim = someoneActive && !isActive ? 0.4 : 1
              return (
                <div
                  key={p.index}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute inset-x-0 top-1/2 cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translate(-50%, -50%) translateY(${baseY}px) translateZ(${baseZ + popZ}px) rotateX(58deg) rotateZ(-32deg) ${isActive ? 'scale(1.06)' : ''}`,
                    left: '50%',
                    width: '100%',
                    opacity: dim,
                    zIndex: isActive ? 50 : 10 + (layers.length - idx),
                    transition:
                      'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease',
                  }}
                >
                  <div
                    className="relative border border-main/35 bg-[#F1E2D2]/95 px-12 py-10 flex items-center gap-8"
                    style={{
                      boxShadow: isActive
                        ? '0 60px 100px -25px rgba(60,100,184,0.5), 0 24px 48px -12px rgba(26,21,28,0.35), inset 0 1px 0 rgba(255,255,255,0.6)'
                        : '0 36px 70px -22px rgba(60,100,184,0.32), 0 12px 28px -10px rgba(26,21,28,0.22), inset 0 1px 0 rgba(255,255,255,0.55)',
                      borderRadius: 4,
                      transition: 'box-shadow 500ms ease',
                    }}
                  >
                    {/* layer index marker */}
                    <div className="flex flex-col items-center justify-center shrink-0 border-r border-main/20 pr-8">
                      <span className="font-mono text-[0.6rem] tracking-widest text-muted">{p.index}</span>
                      <span className="font-display text-3xl text-core font-semibold mt-1">{p.name.split(' ')[0]}</span>
                      <span className="font-mono text-[0.6rem] tracking-widest text-muted mt-0.5">{p.name.split(' ').slice(1).join(' ') || 'layer'}</span>
                    </div>
                    {/* mini diagram on the slab face */}
                    <div className="flex-1 max-w-[420px] opacity-90">
                      <Diagram kind={p.diagram} />
                    </div>

                    {/* slab side edge */}
                    <div
                      aria-hidden
                      className="absolute left-0 right-0 -bottom-2.5 h-2.5 border-x border-b border-main/30"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(26,21,28,0.1), rgba(26,21,28,0.22))',
                        borderRadius: '0 0 4px 4px',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* flat detail panel — text always legible, updates with hovered slab */}
        <div
          key={active.index}
          className="relative p-8 border border-faint bg-white/40 backdrop-blur-md"
          style={{
            animation: 'panel-fade-in 400ms ease both',
          }}
        >
          <div className="text-[0.6rem] tracking-widest text-muted mb-4 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-glow border border-glow rounded-full"></span>
            {active.index} · {active.name}
          </div>
          <h3 className="font-display text-2xl mb-3 text-core font-semibold leading-snug">{active.title}</h3>
          <p className="text-[0.75rem] leading-relaxed text-main tracking-widest opacity-85 mb-5">
            {active.body}
          </p>
          <ul className="text-[0.65rem] tracking-widest text-main flex flex-col gap-2 border-l border-faint pl-4">
            {active.bullets.map((b) => (
              <li key={b} className="opacity-80">{b}</li>
            ))}
          </ul>
          <div className="mt-6 text-[0.55rem] tracking-widest text-muted opacity-60">
            {hovered === null ? 'Showing default · hover a slab to switch' : 'Active layer'}
          </div>
        </div>
      </div>
    </section>
  )
}
