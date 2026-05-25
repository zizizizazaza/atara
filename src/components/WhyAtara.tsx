type Chip = { name: string; icon?: string }

// Three rows of real partners from Crossmint / Tempo / x402 ecosystems.
const row1: Chip[] = [
  { name: 'Amazon', icon: 'simple-icons:amazon' },
  { name: 'Shopify', icon: 'simple-icons:shopify' },
  { name: 'Visa', icon: 'simple-icons:visa' },
  { name: 'Mastercard', icon: 'simple-icons:mastercard' },
  { name: 'Stripe', icon: 'simple-icons:stripe' },
  { name: 'OpenAI', icon: 'simple-icons:openai' },
  { name: 'Anthropic', icon: 'simple-icons:anthropic' },
  { name: 'Google', icon: 'simple-icons:google' },
  { name: 'Coinbase', icon: 'simple-icons:coinbase' },
  { name: 'Cloudflare', icon: 'simple-icons:cloudflare' },
  { name: 'AWS', icon: 'simple-icons:amazonaws' },
  { name: 'Vercel', icon: 'simple-icons:vercel' },
]

const row2: Chip[] = [
  { name: 'Klarna', icon: 'simple-icons:klarna' },
  { name: 'Revolut', icon: 'simple-icons:revolut' },
  { name: 'DoorDash', icon: 'simple-icons:doordash' },
  { name: 'Polygon', icon: 'simple-icons:polygon' },
  { name: 'Stellar', icon: 'simple-icons:stellar' },
  { name: 'Mercury' },
  { name: 'Brex' },
  { name: 'Ramp' },
  { name: 'Deel' },
  { name: 'Payoneer' },
  { name: 'OKX' },
  { name: 'Nubank' },
  { name: 'Coupang' },
  { name: 'Faire' },
]

const row3: Chip[] = [
  { name: 'Notion', icon: 'simple-icons:notion' },
  { name: 'Linear', icon: 'simple-icons:linear' },
  { name: 'Cursor', icon: 'simple-icons:cursor' },
  { name: 'Replit', icon: 'simple-icons:replit' },
  { name: 'Perplexity', icon: 'simple-icons:perplexity' },
  { name: 'Slack', icon: 'simple-icons:slack' },
  { name: 'GitHub', icon: 'simple-icons:github' },
  { name: 'Alchemy' },
  { name: 'QuickNode' },
  { name: 'Pinata' },
  { name: 'thirdweb' },
  { name: 'Bitrefill' },
  { name: 'Lightning' },
  { name: 'Kalshi' },
  { name: 'Gusto' },
]

const allChips: Chip[] = [...row1, ...row2, ...row3]

function shuffleSeeded(arr: Chip[], seed: number): Chip[] {
  const out = [...arr]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Distribute all chips across N rows with no cross-row duplication.
function splitRows(chips: Chip[], rowCount: number): Chip[][] {
  const shuffled = shuffleSeeded(chips, 42)
  const rows: Chip[][] = Array.from({ length: rowCount }, () => [])
  shuffled.forEach((c, i) => rows[i % rowCount].push(c))
  return rows
}

function LogoItem({ chip }: { chip: Chip }) {
  return (
    <span className="inline-flex items-center gap-2 shrink-0">
      {chip.icon && (
        <img
          src={`https://api.iconify.design/${chip.icon}.svg?color=%231A151C`}
          alt=""
          aria-hidden
          className="w-5 h-5"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
      )}
      <span className="font-display text-sm font-medium text-core tracking-tight whitespace-nowrap">
        {chip.name}
      </span>
    </span>
  )
}

function BackdropRow({ chips, reverse, duration }: { chips: Chip[]; reverse?: boolean; duration: number }) {
  const items = [...chips, ...chips]
  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-14 pr-14 will-change-transform"
        style={{
          animationName: reverse ? 'marquee-scroll-reverse' : 'marquee-scroll',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {items.map((chip, i) => (
          <LogoItem key={`${chip.name}-${i}`} chip={chip} />
        ))}
      </div>
    </div>
  )
}

function PillarArt01() {
  // mock invoice receipt — looks like a real digital receipt, one bill across rails
  const lines = [
    { name: 'cursor.com · 6 seats', rail: 'tempo',     amount: '$240.00' },
    { name: 'openai.com · api top-up', rail: 'x402',   amount:  '$50.00' },
    { name: 'otherland · candle bundle', rail: 'crossmint', amount: '$74.00' },
  ]
  return (
    <div className="pa-receipt-wrap relative w-full h-full flex items-center justify-center pt-1">
      <div className="pa-receipt bg-white text-core rounded-[3px] shadow-[0_10px_28px_-20px_rgba(26,21,28,0.45)] px-4 pt-3 pb-1 w-[78%] font-mono text-[0.6rem] leading-snug">
        <div className="flex items-center justify-between">
          <span className="font-semibold tracking-tight">atara · invoice</span>
          <span className="opacity-50">2026-05</span>
        </div>
        <div className="border-t border-dashed border-core/30 my-1.5" />
        {lines.map((l) => (
          <div key={l.name} className="flex items-baseline justify-between gap-2">
            <span className="truncate">
              {l.name}
              <span className="opacity-50"> · {l.rail}</span>
            </span>
            <span className="tabular-nums">{l.amount}</span>
          </div>
        ))}
        <div className="border-t border-dashed border-core/30 my-1.5" />
        <div className="flex items-baseline justify-between font-semibold">
          <span>total · 1 trace_id</span>
          <span className="tabular-nums">$364.00</span>
        </div>
      </div>
    </div>
  )
}

function PillarArt02() {
  // three small brand wordmarks, no chrome
  const brands = [
    { name: 'Crossmint', src: '/logos/brands/crossmint.svg', h: 14, soon: false },
    { name: 'Tempo',     src: '/logos/brands/tempo.svg',     h: 17, soon: false },
    { name: 'Loka Pay',  src: null,                          h: 14, soon: true },
  ]
  return (
    <div className="pa-rails relative w-full h-full flex flex-col items-center justify-center gap-4 px-1 pt-1">
      {brands.map((b, i) => (
        <div key={b.name} className="pa-rail flex flex-col items-center w-full">
          <div className="h-5 flex items-center gap-2" style={{ opacity: b.soon ? 0.55 : 0.85 }}>
            {b.src ? (
              <img src={b.src} alt={b.name} style={{ height: b.h }} className="w-auto" />
            ) : (
              <span className="font-display font-medium text-core text-[0.95rem] tracking-tight leading-none">
                {b.name}
              </span>
            )}
            {b.soon && (
              <span className="font-mono text-[0.55rem] tracking-widest text-core/55 leading-none">
                soon
              </span>
            )}
          </div>
          {i < brands.length - 1 && (
            <div className="w-10 h-px bg-core/15 mt-4" />
          )}
        </div>
      ))}
    </div>
  )
}

function PillarArt03() {
  // a router node fanning out to three rails, with one path highlighted
  const stroke = 'rgba(26, 21, 28, 0.22)'
  const inkSoft = 'rgba(26, 21, 28, 0.55)'
  const blue = '#8CB6E8'
  return (
    <svg viewBox="0 0 200 110" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="pa-route-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={blue} stopOpacity="0.35" />
          <stop offset="55%" stopColor={blue} stopOpacity="0.95" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* fan-out paths */}
      <path d="M 52 55 C 92 55, 112 26, 158 26" fill="none" stroke={stroke} strokeWidth="1" />
      <path d="M 52 55 C 92 55, 112 84, 158 84" fill="none" stroke={stroke} strokeWidth="1" />
      <path
        d="M 52 55 C 92 55, 112 55, 158 55"
        fill="none"
        stroke="url(#pa-route-grad)"
        strokeWidth="1.6"
        className="pa-route"
      />

      {/* request node */}
      <circle cx="38" cy="55" r="11" fill="#FFFFFF" stroke={stroke} strokeWidth="1" />
      <circle cx="38" cy="55" r="3.4" fill={blue} />

      {/* destinations */}
      {[
        { y: 26, label: 'A' },
        { y: 55, label: 'B', active: true },
        { y: 84, label: 'C' },
      ].map((d) => (
        <g key={d.label}>
          <circle
            cx="170"
            cy={d.y}
            r="9"
            fill={d.active ? blue : '#FFFFFF'}
            stroke={d.active ? 'transparent' : stroke}
            strokeWidth="1"
          />
          <text
            x="170"
            y={d.y + 3}
            fontFamily="Space Mono, monospace"
            fontSize="8.5"
            fill={d.active ? '#FFFFFF' : inkSoft}
            textAnchor="middle"
          >
            {d.label}
          </text>
        </g>
      ))}

      {/* travelling pulse along the chosen route */}
      <circle r="2.6" fill={blue} className="pa-pulse">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M 52 55 C 92 55, 112 55, 158 55" />
      </circle>
    </svg>
  )
}

const pillars: {
  index: string
  title: string
  body: React.ReactNode
  art: React.ReactNode
  tint: string
  accent: string
}[] = [
  {
    index: '01',
    title: 'One key, one bill',
    body: (
      <>
        Replace Crossmint, Tempo, and x402 integrations with a single Atara API
        key. One invoice, one <code className="font-mono text-core">trace_id</code> across every rail.
      </>
    ),
    art: <PillarArt01 />,
    tint: '#F7F1E6',
    accent: '#3F7E4F',
  },
  {
    index: '02',
    title: 'Three rails, full coverage',
    body: (
      <>
        Crossmint for retail checkouts. Tempo for SaaS subscriptions. Loka Pay
        for Lightning-native agent micropayments — coming soon.
      </>
    ),
    art: <PillarArt02 />,
    tint: '#F7F1E6',
    accent: '#C28A2C',
  },
  {
    index: '03',
    title: 'Routing that picks the rail',
    body: (
      <>
        Cheapest path per transaction. Automatic fallback when a rail fails.
      </>
    ),
    art: <PillarArt03 />,
    tint: '#F7F1E6',
    accent: '#3C64B8',
  },
]

export default function WhyAtara() {
  const rowConfigs = [
    { reverse: false, duration: 90 },
    { reverse: true,  duration: 110 },
    { reverse: false, duration: 80 },
  ]
  const rowChips = splitRows(allChips, rowConfigs.length)

  return (
    <section id="why" className="py-24 relative">
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">II. Why Atara</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-4 max-w-3xl">
        One key. Every rail. Auto-routed.
      </h2>
      <p className="text-[0.75rem] leading-relaxed tracking-widest text-main opacity-70 mb-12 max-w-2xl">
        Atara is the OpenRouter for agent payments — one integration, the broadest merchant network on the market, and routing that picks the right rail for every wallet and scenario.
      </p>

      <div className="mb-16 py-10 flex flex-col gap-8">
        {rowConfigs.map((r, i) => (
          <BackdropRow key={i} chips={rowChips[i]} reverse={r.reverse} duration={r.duration} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="pillar-card relative flex flex-col rounded-2xl border border-core/15 overflow-hidden"
            style={{ backgroundColor: p.tint }}
          >
            <div className="pillar-art relative h-56 px-5 pt-5">
              {p.art}
              <span
                className="absolute top-3 right-4 font-mono text-[0.65rem] tracking-widest text-core/70"
              >
                · {p.index}
              </span>
            </div>
            <div
              className="h-0.5 mx-5"
              style={{ backgroundColor: p.accent }}
            />
            <div className="p-5 pt-4">
              <h3 className="font-display text-xl md:text-[1.3rem] font-semibold text-core leading-snug mb-2 tracking-tight">
                {p.title}
              </h3>
              <p className="text-[0.9rem] leading-relaxed text-main">
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
