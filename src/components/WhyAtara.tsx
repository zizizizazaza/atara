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

const pillars = [
  {
    n: '01',
    icon: 'lucide:key-round',
    title: 'One key, three superpowers',
    body: 'A single Atara key unlocks the broadest merchant network, automatic routing, and an end-to-end audit trail — no per-protocol SDKs, no merchant negotiations.',
    bullets: [
      'OpenAI-compatible patterns devs already know',
      'One bill, one trace_id across all rails',
      '10 minutes to first payment',
    ],
  },
  {
    n: '02',
    icon: 'lucide:store',
    title: 'Broadest merchant coverage',
    body: 'Three aggregated networks reach almost anywhere an agent needs to spend — physical commerce, SaaS, and agent-native APIs.',
    bullets: [
      'Crossmint — Amazon, Shopify, retail checkouts',
      'Tempo — SaaS subscriptions (Cursor, OpenAI, Notion…)',
      'x402 — pay-per-call APIs and agent-to-agent',
    ],
  },
  {
    n: '03',
    icon: 'lucide:git-fork',
    title: 'Auto-routing by context',
    body: 'Atara picks the right rail based on the wallet, merchant, and scenario — cheapest path for SaaS, fastest path for checkout, Lightning for sats-level metering. If one fails, the next takes over.',
    bullets: [
      'Scenario-aware (subscription · checkout · pay-per-call)',
      'Wallet-aware (cards · stablecoins · Lightning)',
      'Auto-fallback on rail failure',
    ],
  },
]

function PillarIcon({ icon }: { icon: string }) {
  return (
    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/60 border border-main/25 shrink-0">
      <img
        src={`https://api.iconify.design/${icon}.svg?color=%231A151C`}
        alt=""
        aria-hidden
        className="w-5 h-5"
      />
    </span>
  )
}

export default function WhyAtara() {
  const rowConfigs = [
    { reverse: false, duration: 90 },
    { reverse: true,  duration: 110 },
    { reverse: false, duration: 80 },
  ]
  const rowChips = splitRows(allChips, rowConfigs.length)

  return (
    <section id="why" className="py-24 relative">
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">III. Why Atara</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-4 max-w-3xl">
        One key. Every rail. Auto-routed.
      </h2>
      <p className="text-[0.75rem] leading-relaxed tracking-widest text-main opacity-70 mb-12 max-w-2xl">
        Atara is the OpenRouter for agent payments — one integration, the broadest merchant network on the market, and routing that picks the right rail for every wallet and scenario.
      </p>

      <div className="mb-12 py-10 flex flex-col gap-8">
        {rowConfigs.map((r, i) => (
          <BackdropRow key={i} chips={rowChips[i]} reverse={r.reverse} duration={r.duration} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pillars.map((p) => (
          <article key={p.n} className="p-7 border border-faint bg-white/30 backdrop-blur-sm flex flex-col">
            <div className="flex items-center gap-4 mb-5">
              <PillarIcon icon={p.icon} />
              <span className="text-[0.55rem] tracking-widest text-muted">Pillar {p.n}</span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-core leading-snug mb-3">
              {p.title}
            </h3>
            <p className="text-[0.78rem] leading-loose text-main opacity-80 mb-5">
              {p.body}
            </p>
            <ul className="text-[0.7rem] tracking-widest text-main flex flex-col gap-2 border-l border-faint pl-4 mt-auto">
              {p.bullets.map((b) => (
                <li key={b} className="opacity-75">{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
