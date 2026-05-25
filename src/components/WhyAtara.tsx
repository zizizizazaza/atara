import { useEffect, useRef, useState } from 'react'

type Chip = { name: string; icon?: string }

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
    <div
      className="overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)',
      }}
    >
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

// --- Flip-board numerals --------------------------------------------------

function FlipDigit({ digit, animate, delayMs = 0, durationMs = 900 }: {
  digit: number
  animate: boolean
  delayMs?: number
  durationMs?: number
}) {
  return (
    <span className="fd">
      <span
        className="fd-strip"
        style={{
          transform: `translateY(-${digit * 10}%)`,
          transition: animate ? `transform ${durationMs}ms cubic-bezier(0.34, 1.32, 0.5, 1) ${delayMs}ms` : 'none',
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d} className="fd-row">{d}</span>
        ))}
      </span>
    </span>
  )
}

function FlipNumber({ value, animate, baseDelayMs = 0, durationMs = 900, perDigitDelay = 110, padTo }: {
  value: number
  animate: boolean
  baseDelayMs?: number
  durationMs?: number
  perDigitDelay?: number
  padTo?: number
}) {
  const raw = value.toString()
  const padded = padTo ? raw.padStart(padTo, '0') : raw
  const digits = padded.split('').map(Number)
  return (
    <span className="flip-number" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {digits.map((d, i) => (
        <FlipDigit
          key={i}
          digit={d}
          animate={animate}
          durationMs={durationMs}
          delayMs={baseDelayMs + i * perDigitDelay}
        />
      ))}
    </span>
  )
}

// --- Pillar 01 · merchant counter ----------------------------------------

function MerchantCounter() {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      })
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const categories = [
    { label: 'shops',      count: 12 },
    { label: 'saas',       count: 9  },
    { label: 'apis',       count: 8  },
    { label: 'cards',      count: 5  },
    { label: 'travel',     count: 4  },
    { label: 'wallets',    count: 4  },
  ]

  return (
    <div ref={ref} className="w-full h-full grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 items-end">
      <div>
        <div className="font-display text-[8rem] md:text-[11rem] font-semibold leading-[0.85] tracking-tighter text-core flex items-baseline">
          <FlipNumber value={started ? 42 : 0} animate={started} baseDelayMs={120} durationMs={1100} perDigitDelay={180} />
          <span className="text-core/35">+</span>
        </div>
        <div className="font-mono text-[0.6rem] tracking-superwide text-core/55 mt-2 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3F7E4F] animate-pulse" />
          merchants on the network · growing weekly
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 pb-3">
        {categories.map((c, i) => (
          <div
            key={c.label}
            className="flex items-baseline justify-between font-mono text-[0.65rem] tracking-superwide text-core/70 border-b border-core/10 pb-1.5"
            style={{ animation: 'mc-row-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: `${600 + i * 80}ms` }}
          >
            <span>{c.label}</span>
            <span className="text-core font-semibold font-display text-[1rem] leading-none">
              <FlipNumber
                value={started ? c.count : 0}
                animate={started}
                baseDelayMs={700 + i * 120}
                durationMs={800}
                perDigitDelay={90}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Pillar 02 · price race ---------------------------------------------

function PriceRace() {
  const [tick, setTick] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const visibleRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { visibleRef.current = e.isIntersecting })
    }, { threshold: 0.3 })
    io.observe(el)
    const id = setInterval(() => {
      if (visibleRef.current) setTick((t) => t + 1)
    }, 2800)
    return () => { io.disconnect(); clearInterval(id) }
  }, [])

  const rounds = [
    { quotes: [0.94, 0.61, 0.22], saved: 0.72 },
    { quotes: [1.10, 0.48, 0.18], saved: 0.92 },
    { quotes: [0.78, 0.55, 0.31], saved: 0.47 },
  ]
  const round = rounds[tick % rounds.length]
  const winnerIdx = round.quotes.indexOf(Math.min(...round.quotes))

  return (
    <div ref={ref} className="w-full h-full flex flex-col justify-end gap-2.5">
      {round.quotes.map((q, i) => {
        const isWin = i === winnerIdx
        const w = Math.max(14, 100 - q * 55)
        const intPart = Math.floor(q)
        const decPart = Math.round((q - intPart) * 100)
        return (
          <div
            key={`row-${i}`}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 border transition-colors ${
              isWin ? 'border-core/55 bg-white' : 'border-core/15 bg-white/40'
            }`}
          >
            <span className={`font-mono text-[0.5rem] tracking-superwide w-6 ${isWin ? 'text-core' : 'text-core/55'}`}>
              q{String.fromCharCode(97 + i)}
            </span>
            <div className="flex-1 h-1 rounded-full bg-core/10 overflow-hidden">
              <div
                key={`bar-${tick}-${i}`}
                className={`h-full ${isWin ? 'bg-core' : 'bg-core/35'}`}
                style={{
                  width: `${w}%`,
                  animation: 'pr-fill 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
                  animationDelay: `${i * 90}ms`,
                }}
              />
            </div>
            <span className={`font-mono text-[0.7rem] tracking-tight w-12 text-right ${isWin ? 'font-semibold text-core' : 'text-core/55'} inline-flex justify-end items-baseline leading-none`}>
              <FlipNumber value={intPart} animate baseDelayMs={i * 60} durationMs={550} perDigitDelay={60} />
              <span>.</span>
              <FlipNumber value={decPart} padTo={2} animate baseDelayMs={i * 60 + 80} durationMs={550} perDigitDelay={60} />
              <span>%</span>
            </span>
            {isWin && <span className="font-mono text-[0.45rem] tracking-superwide text-core/70 w-9 text-right">picked</span>}
            {!isWin && <span className="w-9" />}
          </div>
        )
      })}
      <div className="mt-1 font-mono text-[0.55rem] tracking-superwide text-core/60">
        ↳ saved {round.saved.toFixed(2)}% · auto-routed
      </div>
    </div>
  )
}

// --- Pillar 03 · one key snippet ----------------------------------------

function KeySnippet() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full rounded-lg bg-[#110e13] text-[#cfd2d8] font-mono text-[0.62rem] leading-relaxed px-4 py-3 shadow-[0_18px_38px_-26px_rgba(26,21,28,0.55)]">
        <div className="flex items-center justify-between mb-2 opacity-70">
          <span className="text-[0.5rem] tracking-superwide">~/agent</span>
          <span className="text-[0.5rem] tracking-superwide">1 key · 40+ merchants</span>
        </div>
        <div>
          <span style={{ color: '#56b6c2' }}>$</span>{' '}
          <span style={{ color: '#61afef' }}>export</span>{' '}
          <span style={{ color: '#e5c07b' }}>ATARA_KEY</span>=<span style={{ color: '#98c379' }}>"sk_…"</span>
        </div>
        <div>
          <span style={{ color: '#56b6c2' }}>$</span>{' '}
          <span style={{ color: '#61afef' }}>atara</span> pay{' '}
          <span style={{ color: '#98c379' }}>"any.merchant"</span>{' '}
          <span style={{ color: '#d19a66' }}>$50</span>
        </div>
        <div className="opacity-80 mt-1">
          <span style={{ color: '#98c379' }}>✓</span> routed · settled · receipt
        </div>
      </div>
    </div>
  )
}

type Pillar = {
  title: string
  body: string
  art: () => React.ReactElement
}

const pillars: Pillar[] = [
  {
    title: 'One key, the widest reach.',
    body: 'Subscriptions, retail, APIs, cards, travel, wallets — a single integration unlocks the broadest agent-payable network on the market.',
    art: MerchantCounter,
  },
  {
    title: 'Cheapest path, every charge.',
    body: 'Atara races quotes across the network behind the scenes and always picks the lowest-fee rail. You never have to pick.',
    art: PriceRace,
  },
  {
    title: 'One API key. Two lines of code.',
    body: 'No SDK soup, no rail-specific glue, no merchant onboarding. Drop in one key — any agent can spend anywhere Atara reaches.',
    art: KeySnippet,
  },
]

export default function WhyAtara() {
  const rowConfigs = [
    { reverse: false, duration: 90 },
    { reverse: true,  duration: 110 },
    { reverse: false, duration: 80 },
  ]
  const rowChips = splitRows(allChips, rowConfigs.length)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [gridIn, setGridIn] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setGridIn(true); io.disconnect() } })
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="why" className="py-24 relative">
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">II. Why Atara</div>
      <h2 className="font-display text-4xl md:text-[3.4rem] font-semibold text-core mb-4 max-w-3xl leading-[1.05] tracking-tighter">
        One key. Every merchant. Cheapest path, every time.
      </h2>
      <p className="text-[0.75rem] leading-relaxed tracking-widest text-main opacity-70 mb-12 max-w-2xl">
        The broadest agent-payable merchant network, auto-routed to the cheapest rail, behind a single API key.
      </p>

      <div className="mb-16 py-10 flex flex-col gap-8">
        {rowConfigs.map((r, i) => (
          <BackdropRow key={i} chips={rowChips[i]} reverse={r.reverse} duration={r.duration} />
        ))}
      </div>

      <div ref={gridRef} className={`grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-fr ${gridIn ? 'pillars-in' : ''}`}>
        {pillars.map((p, i) => {
          const Art = p.art
          const isHero = i === 0
          const fromLeft = i === 0
          return (
            <article
              key={i}
              className={`pillar-card pillar-fly ${fromLeft ? 'from-left' : 'from-right'} relative rounded-2xl border border-core/15 bg-[#F4EFE6] overflow-hidden ${
                isHero ? 'lg:col-span-7 lg:row-span-2 p-8 min-h-[420px]' : 'lg:col-span-5 p-6 min-h-[200px]'
              }`}
              style={{ transitionDelay: `${i * 140}ms` }}
            >
              <div className={`relative flex flex-col h-full ${isHero ? 'gap-6' : 'gap-5'}`}>
                <div className={`relative ${isHero ? 'flex-1 min-h-[200px]' : 'h-32'}`}>
                  <Art />
                </div>
                <div className="relative">
                  <h3 className={`font-display font-semibold text-core leading-[1.15] tracking-tight mb-2 ${
                    isHero ? 'text-[1.6rem] md:text-[1.9rem] max-w-md' : 'text-[1.05rem]'
                  }`}>
                    {p.title}
                  </h3>
                  <p className={`leading-relaxed text-main opacity-75 ${isHero ? 'text-[0.78rem] max-w-md' : 'text-[0.68rem]'}`}>
                    {p.body}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
