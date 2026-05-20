type Bill = {
  line: string
  amount: string
  meta?: string
  cta: string
}

type Case = {
  n: string
  title: string
  icon: string
  art: { icon: string; tint: string; glow: string }
  story: string
  user: string
  reply: string
  bill?: Bill
}

const cases: Case[] = [
  {
    n: '01',
    title: 'Buying SaaS subscriptions',
    icon: 'lucide:repeat',
    art: { icon: 'lucide:credit-card', tint: '#EADBC6', glow: '#3F7E4F' },
    story: 'Maya\'s ops agent renews the team\'s 6 Cursor seats overnight, tags them to the AI-Agent project, and pings finance with one line item.',
    user: 'Renew all 6 Cursor Pro seats for the year, charge to the ai-agent project.',
    reply: 'Done. $240.00 settled on cursor.com in 3.8s. Receipt logged, finance pinged.',
  },
  {
    n: '02',
    title: 'Topping up pay-per-call APIs',
    icon: 'lucide:key-round',
    art: { icon: 'lucide:zap', tint: '#EDDCBE', glow: '#C28A2C' },
    story: 'When a research agent burns through tokens overnight, it tops itself up to the weekly cap instead of waking on-call.',
    user: 'OpenAI key is dry — top it up to the weekly cap.',
    reply: 'Topped up. $50.00 added in 2.1s, $450 left this week. Tagged to research-agent.',
  },
  {
    n: '03',
    title: 'Shopping on Shopify',
    icon: 'simple-icons:shopify',
    art: { icon: 'lucide:shopping-bag', tint: '#DDE3CB', glow: '#5A8A2C' },
    story: 'A teammate\'s birthday is Friday. The agent picks a bundle within budget and surfaces the cart for sign-off.',
    user: 'Send Priya a birthday gift under $80 — she likes scented candles.',
    reply: 'Found a candle + small-batch wine bundle on a Shopify boutique, $74 with shipping. Confirm and I will ship it.',
    bill: {
      line: 'Otherland · candle + wine bundle',
      amount: '$74.00',
      meta: 'Routed via Crossmint · ships to Brooklyn',
      cta: 'Approve and ship',
    },
  },
  {
    n: '04',
    title: 'Booking travel',
    icon: 'lucide:plane',
    art: { icon: 'lucide:plane-takeoff', tint: '#D8DFD8', glow: '#3A6E8F' },
    story: 'The CS lead needs to be in NYC Friday. The travel agent surfaces the cheapest red-eye and waits for sign-off.',
    user: 'Cheapest red-eye SFO → JFK next Friday, aisle seat.',
    reply: 'Found United UA1234 · 11:45pm · aisle 14C. Confirm and I will book it.',
    bill: {
      line: 'United UA1234 · SFO → JFK · Fri 11:45pm',
      amount: '$312.40',
      meta: 'Routed via Crossmint · Amadeus',
      cta: 'Approve and book',
    },
  },
  {
    n: '05',
    title: 'Agent-to-agent payments',
    icon: 'simple-icons:lightning',
    art: { icon: 'lucide:zap', tint: '#E9D8C2', glow: '#B66E2A' },
    story: 'A planning agent farms out 234k tokens to a community Qwen node. Lightning settles at sub-cent precision — no invoices.',
    user: 'Pay node n_x32a for the 234k tokens we just consumed.',
    reply: 'Settled. 1,170 sats over Lightning in 0.4s. Trace t_b91d logged.',
  },
  {
    n: '06',
    title: 'Shopping on Amazon',
    icon: 'simple-icons:amazon',
    art: { icon: 'lucide:package', tint: '#EFDDC2', glow: '#9C5A1F' },
    story: 'The office manager asks an agent to restock two mice. It picks the in-stock SKU and checks out with the team card.',
    user: 'Order 2 Logitech MX Master 3S to the SF office.',
    reply: 'Ordered from Amazon US. $199.98 captured, tracking dropped in #ops. Arrives Wed.',
  },
]

function Bubble({ side, children }: { side: 'user' | 'ai'; children: React.ReactNode }) {
  const isUser = side === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[88%] px-5 py-3.5 rounded-2xl text-[0.8rem] leading-relaxed ${
          isUser
            ? 'rounded-tl-sm font-medium shadow-md text-white'
            : 'bg-white/70 text-core rounded-tr-sm border border-faint'
        }`}
        style={isUser ? { backgroundColor: '#3F7E4F' } : undefined}
      >
        {children}
      </div>
    </div>
  )
}

function BillCard({ bill }: { bill: Bill }) {
  return (
    <div className="mt-3 border border-main/30 bg-white/80 rounded-xl p-4">
      <div className="text-[0.6rem] tracking-superwide text-muted mb-2">Pending authorization</div>
      <div className="font-display text-base text-core font-medium mb-1 leading-snug">
        {bill.line}
      </div>
      <div className="flex items-baseline justify-between mt-3 mb-3">
        <span className="font-display text-2xl text-core font-semibold">{bill.amount}</span>
        {bill.meta && (
          <span className="text-[0.55rem] tracking-widest text-muted text-right max-w-[55%]">
            {bill.meta}
          </span>
        )}
      </div>
      <button
        className="w-full text-[0.7rem] tracking-widest text-white hover:opacity-90 transition-opacity py-2 rounded-full font-medium"
        style={{ backgroundColor: '#3F7E4F' }}
      >
        {bill.cta} →
      </button>
    </div>
  )
}

function ArtFrame({
  n,
  children,
}: {
  n: string
  children: React.ReactNode
}) {
  return (
    <div
      className="relative overflow-hidden -mx-7 -mt-7 mb-7 bg-white/25"
      style={{ height: 152 }}
    >
      {/* faint paper grid */}
      <svg
        viewBox="0 0 400 152"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          <pattern id={`grid-${n}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1A151C" strokeWidth="0.4" opacity="0.06" />
          </pattern>
        </defs>
        <rect width="400" height="152" fill={`url(#grid-${n})`} />
        {/* horizon */}
        <line x1="0" y1="118" x2="400" y2="118" stroke="#1A151C" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.18" />
      </svg>

      {/* illustration layer */}
      <svg
        viewBox="0 0 400 152"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <g className="uc-art">{children}</g>
      </svg>
    </div>
  )
}

const ink = '#1A151C'
const forest = '#3F7E4F'

function Art01() {
  // clean grid of SaaS logo tiles
  const logos = [
    'simple-icons:cursor',
    'simple-icons:notion',
    'simple-icons:slack',
    'simple-icons:figma',
    'simple-icons:linear',
    'simple-icons:claude',
  ]
  const tileW = 60
  const tileH = 44
  const gap = 14
  const cols = 3
  const rows = 2
  const totalW = cols * tileW + (cols - 1) * gap
  const totalH = rows * tileH + (rows - 1) * gap
  const startX = (400 - totalW) / 2
  const startY = (152 - totalH) / 2

  return (
    <g>
      {logos.map((slug, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = startX + col * (tileW + gap)
        const y = startY + row * (tileH + gap)
        const cx = x + tileW - 8
        const cy = y + tileH - 8
        return (
          <g key={slug} className="uc-tile" style={{ transitionDelay: `${i * 50}ms` }}>
            <rect x={x} y={y} width={tileW} height={tileH} rx="8" fill="#FFFFFF" stroke={ink} strokeWidth="1.1" opacity="0.95" />
            <image
              href={`https://api.iconify.design/${slug}.svg?color=%231A151C`}
              x={x + (tileW - 22) / 2}
              y={y + (tileH - 22) / 2}
              width="22"
              height="22"
            />
            {/* completion check badge — appears on card hover, staggered */}
            <g
              className="uc-check"
              style={{ transitionDelay: `${120 + i * 90}ms` }}
            >
              <circle cx={cx} cy={cy} r="6.5" fill={forest} stroke="#FFFFFF" strokeWidth="1.2" />
              <path
                d={`M ${cx - 3},${cy + 0.2} L ${cx - 0.8},${cy + 2.4} L ${cx + 3},${cy - 2}`}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        )
      })}
    </g>
  )
}

function Art02() {
  // row of LLM tiles with usage meters underneath — no text
  const llms = [
    { slug: 'simple-icons:openai', fill: 0.82 },
    { slug: 'simple-icons:anthropic', fill: 0.46 },
    { slug: 'simple-icons:googlegemini', fill: 0.64 },
    { slug: 'simple-icons:x', fill: 0.3 },
  ]
  const tileW = 60
  const tileH = 60
  const gap = 18
  const totalW = llms.length * tileW + (llms.length - 1) * gap
  const startX = (400 - totalW) / 2
  const tileY = 32
  const meterY = tileY + tileH + 14
  return (
    <g>
      {llms.map((l, i) => {
        const x = startX + i * (tileW + gap)
        return (
          <g key={l.slug}>
            <rect x={x} y={tileY} width={tileW} height={tileH} rx="10" fill="#FFFFFF" stroke={ink} strokeWidth="1.1" opacity="0.95" />
            <image
              href={`https://api.iconify.design/${l.slug}.svg?color=%231A151C`}
              x={x + (tileW - 30) / 2}
              y={tileY + (tileH - 30) / 2}
              width="30"
              height="30"
            />
            {/* meter base */}
            <rect x={x} y={meterY} width={tileW} height="4" rx="2" fill={ink} opacity="0.14" />
            <rect
              className="uc-meter-fill"
              x={x}
              y={meterY}
              width={tileW * l.fill}
              height="4"
              rx="2"
              fill={forest}
              style={{ animationDelay: `${i * 220}ms` }}
            />
          </g>
        )
      })}
    </g>
  )
}

function Art03() {
  // hand-drawn physical goods in matching line-art style
  return (
    <g>
      {/* washing machine */}
      <g transform="translate(74 38)" stroke={ink} strokeWidth="1.2" fill="none">
        <rect x="0" y="0" width="60" height="76" rx="5" fill="#FFFFFF" />
        {/* control panel */}
        <line x1="0" y1="14" x2="60" y2="14" />
        <circle cx="10" cy="7" r="2" />
        <circle cx="18" cy="7" r="2" />
        <rect x="36" y="4" width="20" height="6" rx="1" fill={ink} opacity="0.12" stroke="none" />
        {/* door — outer ring stays still, inner drum spins on hover */}
        <circle cx="30" cy="46" r="20" fill="#FFFFFF" />
        <g transform="translate(30 46)">
          <g className="uc-drum">
            <circle r="14" />
            <line x1="-9" y1="0" x2="9" y2="0" stroke={ink} strokeWidth="1" opacity="0.45" />
            <line x1="0" y1="-9" x2="0" y2="9" stroke={ink} strokeWidth="1" opacity="0.3" />
            <circle r="4" fill={forest} stroke="none" />
          </g>
        </g>
      </g>

      {/* television on stand */}
      <g transform="translate(160 40)" stroke={ink} strokeWidth="1.2" fill="none">
        <rect x="0" y="0" width="80" height="56" rx="4" fill="#FFFFFF" />
        <rect x="5" y="5" width="70" height="42" rx="2" fill={ink} opacity="0.08" stroke="none" />
        <rect x="5" y="5" width="70" height="42" rx="2" />
        <circle cx="72" cy="52" r="1.6" fill={forest} stroke="none" />
        {/* stand */}
        <path d="M 30,56 L 26,68 L 54,68 L 50,56" />
        <line x1="20" y1="68" x2="60" y2="68" strokeLinecap="round" />
      </g>

      {/* shopping bag with gift accent */}
      <g transform="translate(266 38)" stroke={ink} strokeWidth="1.2" fill="none">
        <path d="M 4,18 L 0,76 L 64,76 L 60,18 Z" fill="#FFFFFF" />
        {/* handles */}
        <path d="M 16,18 v-5 a 12,10 0 0 1 32,0 v5" />
        {/* ribbon vertical */}
        <rect x="28" y="18" width="8" height="58" fill={forest} stroke="none" opacity="0.9" />
        {/* bow */}
        <path className="uc-bow" d="M 32,18 q -8,-4 -8,2 q 0,6 8,2 q 8,4 8,-2 q 0,-6 -8,-2 Z" fill={forest} stroke="none" />
      </g>
    </g>
  )
}

function Art04() {
  // continental backdrop with flight arc, two pins, and a commercial jet
  return (
    <g>
      {/* simplified continent silhouette */}
      <path
        d="M 46,54 Q 100,40 180,48 Q 260,42 336,58 Q 360,74 336,96 Q 280,108 220,100 Q 160,108 100,104 Q 48,98 38,78 Q 36,62 46,54 Z"
        fill={ink}
        opacity="0.07"
      />
      <path
        d="M 46,54 Q 100,40 180,48 Q 260,42 336,58 Q 360,74 336,96 Q 280,108 220,100 Q 160,108 100,104 Q 48,98 38,78 Q 36,62 46,54 Z"
        fill="none"
        stroke={ink}
        strokeWidth="0.7"
        strokeDasharray="2 3"
        opacity="0.28"
      />

      {/* dashed flight arc */}
      <path
        d="M 78,86 Q 200,16 322,72"
        fill="none"
        stroke={ink}
        strokeWidth="1.2"
        strokeDasharray="3 5"
        opacity="0.65"
      />

      {/* origin pin */}
      <circle cx="78" cy="86" r="5" fill="#FFFFFF" stroke={ink} strokeWidth="1.3" />
      <circle cx="78" cy="86" r="1.8" fill={ink} />

      {/* destination pin */}
      <circle cx="322" cy="72" r="5" fill={forest} stroke={ink} strokeWidth="1.3" />

      {/* commercial airliner — line-frame style, nose pointing up-right */}
      <g transform="translate(200 40)">
        <g className="uc-plane">
          <g
            transform="rotate(78)"
            stroke={ink}
            strokeWidth="1.3"
            fill="#FFFFFF"
            strokeLinejoin="round"
          >
            {/* fuselage */}
            <path d="M 0,-30 Q 4.5,-25 4.5,-18 L 4.5,12 Q 4,20 0,22 Q -4,20 -4.5,12 L -4.5,-18 Q -4.5,-25 0,-30 Z" />
            {/* main wings (swept back) */}
            <path d="M -4,-2 L -30,5 L -30,9 L -4,4 Z" />
            <path d="M 4,-2 L 30,5 L 30,9 L 4,4 Z" />
            {/* tail stabilizers */}
            <path d="M -3,13 L -11,16 L -11,18 L -3,16 Z" />
            <path d="M 3,13 L 11,16 L 11,18 L 3,16 Z" />
            {/* engine pods under wings */}
            <ellipse cx="-14" cy="7" rx="2" ry="4" />
            <ellipse cx="14" cy="7" rx="2" ry="4" />
            {/* window strip */}
            <line
              x1="0"
              y1="-18"
              x2="0"
              y2="10"
              stroke={ink}
              strokeWidth="0.5"
              strokeDasharray="1.5 2"
              opacity="0.45"
              fill="none"
            />
          </g>
        </g>
      </g>
    </g>
  )
}

function Art05() {
  // two hand-drawn robot heads connected by a wire
  function Robot({ cx, cy, eyeFill }: { cx: number; cy: number; eyeFill: string }) {
    return (
      <g transform={`translate(${cx} ${cy})`} stroke={ink} strokeWidth="1.2" fill="none" strokeLinejoin="round">
        {/* antenna */}
        <line x1="0" y1="-44" x2="0" y2="-34" />
        <circle cx="0" cy="-46" r="3" fill={eyeFill} stroke={ink} />
        {/* head */}
        <rect x="-28" y="-34" width="56" height="46" rx="10" fill="#FFFFFF" />
        {/* side bolts */}
        <rect x="-34" y="-18" width="6" height="14" rx="2" fill="#FFFFFF" />
        <rect x="28" y="-18" width="6" height="14" rx="2" fill="#FFFFFF" />
        {/* face plate */}
        <rect x="-20" y="-26" width="40" height="26" rx="5" fill={ink} opacity="0.08" stroke="none" />
        <rect x="-20" y="-26" width="40" height="26" rx="5" />
        {/* eyes */}
        <circle className="uc-eye" cx="-9" cy="-15" r="3.2" fill={eyeFill} stroke="none" />
        <circle className="uc-eye uc-eye-late" cx="9" cy="-15" r="3.2" fill={eyeFill} stroke="none" />
        {/* smile */}
        <path d="M -8,-4 Q 0,2 8,-4" strokeLinecap="round" />
        {/* neck */}
        <line x1="-12" y1="12" x2="12" y2="12" />
      </g>
    )
  }

  return (
    <g>
      {/* connection wire — gentle wave */}
      <path
        className="uc-wire"
        d="M 140,76 C 174,62 226,90 260,76"
        fill="none"
        stroke={ink}
        strokeWidth="1.3"
        strokeDasharray="4 5"
        opacity="0.6"
      />

      <Robot cx={92} cy={84} eyeFill={ink} />
      <Robot cx={308} cy={84} eyeFill={forest} />

      {/* coin flies between robots on hover */}
      <g className="uc-coin">
        <circle cx="142" cy="76" r="4" fill={forest} stroke={ink} strokeWidth="0.8" />
        <circle cx="142" cy="76" r="1.4" fill="#FFFFFF" stroke="none" />
      </g>
    </g>
  )
}

function Art06() {
  // isometric cardboard parcel
  const cx = 200
  // top diamond corners
  const A: [number, number] = [cx, 24]       // back
  const B: [number, number] = [cx + 70, 54]  // right
  const C: [number, number] = [cx, 84]       // front
  const D: [number, number] = [cx - 70, 54]  // left
  const dy = 50
  const D2: [number, number] = [D[0], D[1] + dy]
  const C2: [number, number] = [C[0], C[1] + dy]
  const B2: [number, number] = [B[0], B[1] + dy]

  // smile on the right face — map face-local (u,v) to screen
  const onRight = (u: number, v: number): [number, number] => [
    C[0] + u * (B[0] - C[0]),
    C[1] + u * (B[1] - C[1]) + v * (C2[1] - C[1]),
  ]
  const s0 = onRight(0.22, 0.55)
  const sCtl = onRight(0.5, 0.92)
  const s1 = onRight(0.78, 0.55)

  return (
    <g strokeLinejoin="round">
      {/* left face — slightly shadowed */}
      <path
        d={`M ${D[0]},${D[1]} L ${C[0]},${C[1]} L ${C2[0]},${C2[1]} L ${D2[0]},${D2[1]} Z`}
        fill={ink}
        fillOpacity="0.12"
        stroke={ink}
        strokeWidth="1.3"
      />
      {/* right face */}
      <path
        d={`M ${C[0]},${C[1]} L ${B[0]},${B[1]} L ${B2[0]},${B2[1]} L ${C2[0]},${C2[1]} Z`}
        fill="#FFFFFF"
        stroke={ink}
        strokeWidth="1.3"
      />
      {/* top face */}
      <path
        d={`M ${A[0]},${A[1]} L ${B[0]},${B[1]} L ${C[0]},${C[1]} L ${D[0]},${D[1]} Z`}
        fill="#FFFFFF"
        stroke={ink}
        strokeWidth="1.3"
      />
      {/* center crease on top */}
      <line x1={A[0]} y1={A[1]} x2={C[0]} y2={C[1]} stroke={ink} strokeWidth="1" opacity="0.45" />
      {/* packing tape along the top center seam */}
      <path
        d={`M ${cx - 7},${A[1] + 2} L ${cx + 7},${A[1] + 2} L ${cx + 7},${C[1] - 2} L ${cx - 7},${C[1] - 2} Z`}
        fill={ink}
        fillOpacity="0.1"
        stroke={ink}
        strokeWidth="0.9"
        strokeOpacity="0.4"
      />

      {/* amazon smile on right face */}
      <path
        d={`M ${s0[0]},${s0[1]} Q ${sCtl[0]},${sCtl[1]} ${s1[0]},${s1[1]}`}
        stroke={forest}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${s1[0] - 1},${s1[1] - 6} L ${s1[0] + 7},${s1[1] - 4} L ${s1[0] + 3},${s1[1] + 3} Z`}
        fill={forest}
        stroke="none"
      />
    </g>
  )
}

function CaseArt({ n }: { n: string }) {
  const inner = {
    '01': <Art01 />,
    '02': <Art02 />,
    '03': <Art03 />,
    '04': <Art04 />,
    '05': <Art05 />,
    '06': <Art06 />,
  }[n] ?? null
  return <ArtFrame n={n}>{inner}</ArtFrame>
}

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 relative">
      <div className="crosshair h top-0 left-0 -translate-y-1/2"></div>
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">I. Use cases</div>
      <div className="flex flex-wrap items-end justify-between gap-6 mb-4">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-core max-w-3xl">
          Agentic spending, in motion.
        </h2>
        <button
          onClick={() => { window.location.hash = '#/guide' }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium text-sm tracking-wide shadow-md hover:opacity-90 transition-opacity shrink-0"
          style={{ backgroundColor: '#1A151C' }}
        >
          Try it now
          <span aria-hidden>→</span>
        </button>
      </div>
      <p className="text-[0.75rem] leading-relaxed tracking-widest text-main opacity-70 mb-16 max-w-2xl">
        Small payments settle on their own; bigger ones come back for sign-off.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c) => (
          <article
            key={c.n}
            className="uc-card group p-7 flex flex-col bg-white/30 backdrop-blur-sm border border-faint hover:border-main/40"
          >
            <CaseArt n={c.n} />
            <h3 className="font-display text-2xl font-semibold text-core leading-tight mb-5">
              {c.title}
            </h3>

            <p className="text-[0.78rem] leading-loose text-main opacity-80 mb-6">
              {c.story}
            </p>

            <div className="flex flex-col gap-3 mt-auto">
              <Bubble side="user">{c.user}</Bubble>
              <Bubble side="ai">
                <div>{c.reply}</div>
                {c.bill && <BillCard bill={c.bill} />}
              </Bubble>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
