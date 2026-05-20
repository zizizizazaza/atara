import { useEffect, useState } from 'react'

type Audience = 'dev' | 'biz'

const devSections = [
  { id: 'install', label: '01 · Install once' },
  { id: 'wallets', label: '02 · Create your wallets' },
  { id: 'fund', label: '03 · Top up' },
  { id: 'session', label: '04 · Authorize spending' },
  { id: 'spend', label: '05 · Let it spend' },
]

const bizSections = [
  { id: 'what', label: '01 · What you get' },
  { id: 'dashboard', label: '02 · Open your Dashboard' },
  { id: 'integrate', label: '03 · Integrate in 5 minutes' },
]

function CopyableCommand({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="my-4 rounded-md border border-faint bg-core text-cool overflow-hidden flex items-stretch">
      <pre className="flex-1 px-4 py-3 text-[0.8rem] leading-relaxed font-mono overflow-x-auto terminal-scroll whitespace-pre">
        <span className="text-glow mr-2">$</span>
        {cmd}
      </pre>
      <button
        onClick={onCopy}
        className="px-4 border-l border-white/10 text-[0.65rem] tracking-widest font-mono text-cool/70 hover:text-glow transition-colors"
      >
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  )
}

function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="my-4 rounded-md border border-faint bg-core/95 text-cool/90 overflow-hidden">
      {label && (
        <div className="px-4 py-2 border-b border-white/10 text-[0.6rem] tracking-widest text-cool/60 font-mono">
          {label}
        </div>
      )}
      <pre className="px-4 py-3 text-[0.75rem] leading-relaxed font-mono overflow-x-auto terminal-scroll whitespace-pre">
        {children}
      </pre>
    </div>
  )
}

function Callout({ tone = 'note', children }: { tone?: 'note' | 'warn'; children: React.ReactNode }) {
  const isWarn = tone === 'warn'
  return (
    <div
      className={`my-4 rounded-md border px-4 py-3 text-[0.78rem] leading-relaxed ${
        isWarn
          ? 'border-amber-700/40 bg-amber-100/40 text-amber-900'
          : 'border-faint bg-white/50 text-main'
      }`}
    >
      <span className="font-mono text-[0.6rem] tracking-widest mr-2 opacity-60">
        {isWarn ? 'caution' : 'note'}
      </span>
      {children}
    </div>
  )
}

type ChatTurn = { role: 'user' | 'agent' | 'system'; text: React.ReactNode }

function Chat({ turns }: { turns: ChatTurn[] }) {
  return (
    <div className="my-5 rounded-xl border border-faint bg-white/60 p-4 space-y-3">
      {turns.map((t, i) => {
        if (t.role === 'system') {
          return (
            <div
              key={i}
              className="text-center text-[0.65rem] tracking-widest font-mono text-muted py-1"
            >
              — {t.text} —
            </div>
          )
        }
        const isUser = t.role === 'user'
        return (
          <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-[0.82rem] leading-relaxed ${
                isUser
                  ? 'bg-core text-white rounded-tr-sm'
                  : 'bg-cool/70 text-core rounded-tl-sm border border-faint'
              }`}
            >
              <div
                className={`text-[0.55rem] tracking-widest font-mono mb-1 ${
                  isUser ? 'text-white/60' : 'text-muted'
                }`}
              >
                {isUser ? 'you' : 'agent'}
              </div>
              {t.text}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Section({
  id,
  index,
  title,
  subtitle,
  children,
}: {
  id: string
  index: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="border-t border-faint pt-12 mt-12 first:border-t-0 first:mt-0 first:pt-0 scroll-mt-32"
    >
      <div className="text-[0.6rem] tracking-widest text-muted font-mono mb-3">{index}</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core leading-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-main/80 max-w-2xl mb-6 leading-relaxed">{subtitle}</p>
      )}
      <div className="text-[0.85rem] leading-relaxed text-main space-y-3">{children}</div>
    </section>
  )
}

type RailKey = 'crossmint' | 'tempo'
type Merchant = { name: string; mono?: string; color?: string }

const palette = ['#1A151C', '#3F7E4F', '#3C64B8', '#C24A2C', '#8A5A2B', '#5E3A8A', '#1E4D72', '#8CB6E8']
function merchantTint(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return palette[h % palette.length]
}
function merchantInitials(name: string) {
  const cleaned = name.replace(/[^A-Za-z0-9 ]/g, '').trim()
  const parts = cleaned.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return cleaned.slice(0, 2).toUpperCase()
}

const merchantData: Record<RailKey, { label: string; tagline: string; groups: { title: string; items: Merchant[] }[] }> = {
  crossmint: {
    label: 'Crossmint',
    tagline:
      'Headless / Agentic Checkout lets your agent buy from major retailers, Shopify storefronts, subscriptions, and on-chain marketplaces.',
    groups: [
      {
        title: 'Major retailers',
        items: [
          { name: 'Amazon' },
          { name: 'Walmart' },
          { name: 'Target' },
          { name: 'Best Buy' },
          { name: 'eBay' },
          { name: 'Etsy' },
          { name: 'Costco' },
        ],
      },
      {
        title: 'Shopify storefronts',
        items: [{ name: 'Any Shopify store' }, { name: 'Allbirds' }, { name: 'Gymshark' }, { name: 'Kylie Cosmetics' }],
      },
      {
        title: 'Subscriptions & consumer SaaS',
        items: [
          { name: 'Apple · iCloud' },
          { name: 'Adobe' },
          { name: 'Spotify' },
          { name: 'ChatGPT Plus' },
          { name: 'Netflix' },
          { name: 'Disney+' },
          { name: 'Discord Nitro' },
        ],
      },
      {
        title: 'Travel & on-demand',
        items: [{ name: 'DoorDash' }, { name: 'Uber' }, { name: 'Airbnb' }, { name: 'Booking.com' }],
      },
      {
        title: 'Gaming & digital goods',
        items: [{ name: 'Steam' }, { name: 'Epic Games' }, { name: 'Roblox' }, { name: 'PlayStation Store' }],
      },
      {
        title: 'On-chain marketplaces',
        items: [{ name: 'OpenSea' }, { name: 'Magic Eden' }, { name: 'Blur' }],
      },
    ],
  },
  tempo: {
    label: 'Tempo',
    tagline:
      'Tempo is Stripe-backed payments infra for agents. Your wallet pays APIs, on-chain merchants, and Tempo design partners.',
    groups: [
      {
        title: 'Agent APIs (pay-per-call)',
        items: [
          { name: 'OpenAI' },
          { name: 'Anthropic' },
          { name: 'Google Gemini' },
          { name: 'Perplexity' },
          { name: 'Replicate' },
          { name: 'Groq' },
          { name: 'Together AI' },
          { name: 'Hugging Face' },
        ],
      },
      {
        title: 'Media & generation',
        items: [{ name: 'ElevenLabs' }, { name: 'Stability AI' }, { name: 'Fal.ai' }, { name: 'Runway' }, { name: 'Suno' }],
      },
      {
        title: 'Search, scrape, infra',
        items: [
          { name: 'Tavily' },
          { name: 'Brave Search' },
          { name: 'SerpAPI' },
          { name: 'Firecrawl' },
          { name: 'Modal' },
          { name: 'Pinecone' },
          { name: 'x402 marketplace' },
        ],
      },
      {
        title: 'Design partners',
        items: [
          { name: 'Anthropic' },
          { name: 'Shopify' },
          { name: 'DoorDash' },
          { name: 'Visa' },
          { name: 'Mastercard' },
          { name: 'Robinhood' },
          { name: 'Worldpay' },
        ],
      },
      {
        title: 'On / off-ramps',
        items: [{ name: 'Stripe' }, { name: 'Kraken' }, { name: 'Banxa' }, { name: 'Transak' }, { name: 'Crossmint' }],
      },
    ],
  },
}

function MerchantChip({ name }: { name: string }) {
  const tint = merchantTint(name)
  return (
    <span className="inline-flex items-center gap-2 text-[0.78rem] pl-1 pr-3 py-1 rounded-full bg-white/70 border border-faint text-core">
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.55rem] font-mono font-bold text-white shrink-0"
        style={{ backgroundColor: tint }}
        aria-hidden
      >
        {merchantInitials(name)}
      </span>
      {name}
    </span>
  )
}

function MerchantsModal({ initial, onClose }: { initial: RailKey; onClose: () => void }) {
  const [tab, setTab] = useState<RailKey>(initial)
  const data = merchantData[tab]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-core/40 backdrop-blur-sm flex items-center justify-center px-6 py-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-peach border border-main/20 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]"
      >
        <div className="p-6 pb-4 border-b border-main/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[0.6rem] tracking-widest text-muted font-mono mb-2">Supported merchants</div>
              <h3 className="font-display text-2xl font-semibold text-core">Where each wallet can pay.</h3>
            </div>
            <button
              onClick={onClose}
              className="text-main/60 hover:text-core text-sm font-mono"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 inline-flex rounded-full border border-main/20 bg-white/50 p-1 text-[0.75rem] font-mono">
            {(['crossmint', 'tempo'] as RailKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  tab === k ? 'bg-core text-white' : 'text-main hover:text-core'
                }`}
              >
                {merchantData[k].label}
              </button>
            ))}
          </div>
          <p className="text-[0.78rem] text-main/75 mt-3 leading-relaxed">{data.tagline}</p>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-5">
            {data.groups.map((g) => (
              <div key={g.title}>
                <div className="text-[0.6rem] tracking-widest font-mono text-muted mb-2">{g.title}</div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((m) => (
                    <MerchantChip key={m.name} name={m.name} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-core/40 backdrop-blur-sm flex items-center justify-center px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-peach border border-main/20 rounded-2xl max-w-md w-full p-8 shadow-2xl"
      >
        <div className="text-[0.6rem] tracking-widest text-muted font-mono mb-3">Dashboard</div>
        <h3 className="font-display text-2xl font-semibold text-core mb-3">Coming soon.</h3>
        <p className="text-sm text-main/85 leading-relaxed mb-6">
          The self-serve dashboard (API keys, webhooks, Session Key templates) is in private
          beta. We're onboarding design partners by hand right now — public sign-up opens
          shortly.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-mono tracking-wide text-main hover:text-core"
          >
            close
          </button>
        </div>
      </div>
    </div>
  )
}

function DevGuide() {
  const [merchantsOpen, setMerchantsOpen] = useState<RailKey | null>(null)
  return (
    <article className="min-w-0">
      {merchantsOpen && (
        <MerchantsModal initial={merchantsOpen} onClose={() => setMerchantsOpen(null)} />
      )}
      <div className="mb-14">
        <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-core mb-4">
          One line, then just talk to your agent.
        </h2>
        <p className="text-base text-main/85 max-w-2xl leading-relaxed">
          Paste the install command into your agent once. From then on, everything —
          choosing wallets, topping up, setting a budget, paying merchants — happens in
          plain English inside your normal chat with the agent.
        </p>
        <div className="mt-7 max-w-2xl">
          <CopyableCommand cmd="curl -fsSL https://atara.cn/install | sh" />
          <div className="text-[0.7rem] text-muted font-mono mt-2">
            Works on macOS, Linux. Windows via WSL.
          </div>
        </div>
      </div>

      <Section
        id="install"
        index="01"
        title="Install once"
        subtitle="The one and only thing you copy-paste. After this, no more commands — you just chat."
      >
        <CopyableCommand cmd="curl -fsSL https://atara.cn/install | sh" />
        <p>The installer:</p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Drops the Atara plug-in into your agent's tool list.</li>
          <li>Opens your browser once to bind email + passkey.</li>
          <li>Says hello in your next chat and waits for instructions.</li>
        </ol>
      </Section>

      <Section
        id="wallets"
        index="02"
        title="Create your wallets"
        subtitle="Atara aggregates Crossmint and Tempo. Different merchants live on different rails — so you can keep one wallet on each."
      >
        <div className="grid md:grid-cols-2 gap-3 my-2">
          <div className="rounded-lg border border-faint bg-white/50 p-4 flex flex-col">
            <div className="font-display font-semibold text-core mb-2">Crossmint wallet</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="inline-flex items-center text-[0.6rem] tracking-wide font-mono px-2 py-0.5 rounded-full bg-[#E8D5C4]/70 border border-main/15 text-core">E-commerce</span>
              <span className="inline-flex items-center text-[0.6rem] tracking-wide font-mono px-2 py-0.5 rounded-full bg-[#E8D5C4]/70 border border-main/15 text-core">Shopping</span>
              <span className="inline-flex items-center text-[0.6rem] tracking-wide font-mono px-2 py-0.5 rounded-full bg-[#E8D5C4]/70 border border-main/15 text-core">Consumer SaaS</span>
              <span className="inline-flex items-center text-[0.6rem] tracking-wide font-mono px-2 py-0.5 rounded-full bg-[#E8D5C4]/70 border border-main/15 text-core">Card / browser checkout</span>
            </div>
            <p className="text-[0.78rem] leading-relaxed text-main/85 flex-1">
              Best for fiat top-up (card, ACH) and merchants on Base / Solana — Apple, Adobe,
              ChatGPT Plus, AWS, most consumer SaaS.
            </p>
            <button
              onClick={() => setMerchantsOpen('crossmint')}
              className="mt-3 self-start text-[0.7rem] font-mono tracking-wide text-core hover:text-glow underline underline-offset-2 transition-colors"
            >
              View full merchant list →
            </button>
          </div>
          <div className="rounded-lg border border-faint bg-white/50 p-4 flex flex-col">
            <div className="font-display font-semibold text-core mb-2">Tempo wallet</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="inline-flex items-center text-[0.6rem] tracking-wide font-mono px-2 py-0.5 rounded-full bg-cool/70 border border-main/15 text-core">SaaS APIs</span>
              <span className="inline-flex items-center text-[0.6rem] tracking-wide font-mono px-2 py-0.5 rounded-full bg-cool/70 border border-main/15 text-core">Agent-native</span>
              <span className="inline-flex items-center text-[0.6rem] tracking-wide font-mono px-2 py-0.5 rounded-full bg-cool/70 border border-main/15 text-core">Pay-per-call</span>
              <span className="inline-flex items-center text-[0.6rem] tracking-wide font-mono px-2 py-0.5 rounded-full bg-cool/70 border border-main/15 text-core">x402 / on-chain</span>
            </div>
            <p className="text-[0.78rem] leading-relaxed text-main/85 flex-1">
              Best for agent-native payments — OpenAI, Anthropic, x402 APIs, and any
              merchant that lives on the Tempo chain. Lower fees, native rate-limits.
            </p>
            <button
              onClick={() => setMerchantsOpen('tempo')}
              className="mt-3 self-start text-[0.7rem] font-mono tracking-wide text-core hover:text-glow underline underline-offset-2 transition-colors"
            >
              View full merchant list →
            </button>
          </div>
        </div>
        <p>Just ask the agent. Recommended: open both so you're ready for any merchant.</p>
        <Chat
          turns={[
            { role: 'user', text: 'set up my Atara wallets' },
            {
              role: 'agent',
              text: (
                <>
                  I can open a Crossmint wallet (good for card top-ups and consumer SaaS) and a
                  Tempo wallet (good for AI APIs). Most people want both — should I create both, or
                  just one?
                </>
              ),
            },
            { role: 'user', text: 'both' },
            {
              role: 'agent',
              text: (
                <>
                  Done. <span className="font-mono">wlt_cm_4Q…</span> (Crossmint) and{' '}
                  <span className="font-mono">wlt_tp_2V…</span> (Tempo) are ready. Want to top up
                  now?
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section
        id="fund"
        index="03"
        title="Top up"
        subtitle="Tell the agent how much, and which wallet. It generates a hosted checkout you complete in the browser."
      >
        <Chat
          turns={[
            { role: 'user', text: 'fund the Crossmint wallet with $50' },
            {
              role: 'agent',
              text: (
                <>
                  Opening a hosted checkout for $50 USDC → Crossmint wallet.{' '}
                  <span className="underline">checkout.atara.xyz/o/9f3…</span>
                </>
              ),
            },
            { role: 'system', text: 'you pay $50 by card in the browser' },
            { role: 'agent', text: 'Funds landed. Balance: 50 USDC on Crossmint. Tempo is still 0 — want to send some over, or top up Tempo separately?' },
          ]}
        />
        <p>
          Already hold USDC? Just say <em>"show me my deposit address"</em> and send to it from
          wherever you have funds.
        </p>
      </Section>

      <Section
        id="session"
        index="04"
        title="Authorize spending"
        subtitle="This is the budget envelope your agent operates inside. You describe it in chat; you approve it once with passkey."
      >
        <Chat
          turns={[
            {
              role: 'user',
              text: 'let yourself spend up to $1 per call, $5 a day, $50 total this week, only on OpenAI',
            },
            {
              role: 'agent',
              text: (
                <>
                  Got it. Drafting a Session Key on your Tempo wallet:
                  <div className="mt-2 text-[0.72rem] font-mono bg-core/5 rounded p-2 leading-relaxed">
                    per_tx 1 USDC · daily 5 USDC · total 50 USDC<br />
                    recipients merchant:openai · expires in 7 days
                  </div>
                  Approve with your passkey?
                </>
              ),
            },
            { role: 'system', text: 'browser pops up · you tap passkey · key is live' },
            { role: 'agent', text: 'Session Key is live. I’ll stay inside those limits — you can change them, pause them, or revoke them any time, just ask.' },
          ]}
        />
        <Callout>
          You don't see or copy the Session Key — Atara binds it to your agent's runtime
          identity. Revoke any time by telling the agent <em>"cancel my Session Key"</em>.
        </Callout>
      </Section>

      <Section
        id="spend"
        index="05"
        title="Let it spend"
        subtitle="From here, the agent just pays when work needs paying. Every charge is checked against the envelope you set."
      >
        <Chat
          turns={[
            { role: 'user', text: 'draft me three blog posts about Lightning' },
            {
              role: 'agent',
              text: (
                <>
                  Drafting now — three OpenAI calls, ~$0.18 total. Within limits, going ahead.
                </>
              ),
            },
            { role: 'system', text: '… work happens …' },
            {
              role: 'agent',
              text: 'Drafts ready. Spent $0.17. Daily budget left: $4.83.',
            },
            { role: 'user', text: 'show me everything you’ve spent this week' },
            {
              role: 'agent',
              text: (
                <>
                  This week so far: $4.92 on OpenAI across 27 calls. Full audit at{' '}
                  <span className="underline">atara.xyz/a/me</span>.
                </>
              ),
            },
          ]}
        />
        <p>
          That's it. Ask the agent for an audit, raise a limit, pause a key — all in chat.
          No CLI, no SDK, no keys to copy.
        </p>
      </Section>

      <div className="mt-16 pt-10 border-t border-faint flex flex-wrap gap-4 justify-between items-center">
        <div className="text-[0.65rem] tracking-widest text-muted font-mono">Last updated · 2026-05-18</div>
        <a href="#/" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
          ← back to home
        </a>
      </div>
    </article>
  )
}

function BizGuide({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  return (
    <article className="min-w-0">
      <div className="mb-14">
        <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-core mb-4">
          One API for wallets, limits, and settlement.
        </h2>
        <p className="text-base text-main/85 max-w-2xl leading-relaxed">
          Atara-Pay handles the wallet, the rail, and the Session Key gateway so your team
          can ship agent payments without becoming a payments company. Sign up takes a
          minute; first transfer takes an afternoon.
        </p>
        <div className="flex flex-wrap gap-3 mt-7">
          <button
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium text-sm tracking-wide shadow-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A151C' }}
          >
            Open Dashboard
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <Section
        id="what"
        index="01"
        title="What you get"
        subtitle="A single integration covers what would otherwise be 3–5 vendor relationships — and ships a polished payment experience to your end-users on day one."
      >
        <div className="mb-6">
          <div className="text-[0.6rem] tracking-widest text-muted font-mono mb-3">What your users get</div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-faint bg-white/50 p-4">
              <div className="font-display font-semibold text-core mb-1">A rich merchant catalog out of the box</div>
              <p className="text-[0.78rem] leading-relaxed text-main/85">
                One wallet, hundreds of destinations — Amazon, Shopify storefronts, Apple, Adobe,
                OpenAI, Anthropic, x402 APIs, and more. Smart routing picks Crossmint or Tempo
                automatically so users never see the plumbing.
              </p>
            </div>
            <div className="rounded-lg border border-faint bg-white/50 p-4">
              <div className="font-display font-semibold text-core mb-1">A truly minimal experience</div>
              <p className="text-[0.78rem] leading-relaxed text-main/85">
                Sign in with email or passkey, top up by card, then just talk to the agent — no
                seed phrases, no chain switching, no copy-pasting addresses. Session Keys are
                approved with one tap and revocable any time.
              </p>
            </div>
          </div>
        </div>

        <div className="text-[0.6rem] tracking-widest text-muted font-mono mb-3">What you get as the developer</div>
        <ul className="list-disc pl-5 space-y-2">
          <li><span className="font-semibold text-core">Wallets at scale.</span> Mint one per end-user with a single API call. Smart routing picks the right rail (Crossmint for email-based users, Tempo for AI agents).</li>
          <li><span className="font-semibold text-core">Scoped Session Keys.</span> Per-transaction caps, daily / weekly frequency, total spend, recipient whitelist — enforced both in our gateway and on the chain.</li>
          <li><span className="font-semibold text-core">Fiat in, fiat out.</span> Hosted checkout for top-ups; merchant payout to exchange or bank.</li>
          <li><span className="font-semibold text-core">Audit & webhooks.</span> Every event you need for reconciliation, no polling.</li>
        </ul>
      </Section>

      <Section
        id="dashboard"
        index="02"
        title="Open your Dashboard"
        subtitle="API keys, webhook endpoints, Session Key templates, and rail preferences live here."
      >
        <p>
          The dashboard is the fastest path to production. It walks you through tenant
          setup, generates test and live API keys, and lets you preview a wallet creation
          + Session Key + transfer flow before writing any code.
        </p>
        <div className="mt-5">
          <button
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium text-sm tracking-wide shadow-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A151C' }}
          >
            Open Dashboard
            <span aria-hidden>→</span>
          </button>
        </div>
        <Callout>
          Dashboard is in private beta. Public self-serve sign-up opens shortly.
        </Callout>
      </Section>

      <Section
        id="integrate"
        index="03"
        title="Integrate in 5 minutes"
        subtitle="The full happy path is four endpoints."
      >
        <ol className="list-decimal pl-5 space-y-2">
          <li><span className="font-semibold text-core">Create a wallet</span> for each new end-user — <code className="font-mono bg-cool/60 px-1.5 py-0.5 rounded">POST /v1/wallets</code>.</li>
          <li><span className="font-semibold text-core">Open a Session Key</span> with the limits your product allows — <code className="font-mono bg-cool/60 px-1.5 py-0.5 rounded">POST /v1/wallets/{`{id}`}/session-keys</code>.</li>
          <li><span className="font-semibold text-core">Charge</span> whenever your user (or their agent) takes a paid action — <code className="font-mono bg-cool/60 px-1.5 py-0.5 rounded">POST /v1/transactions</code>.</li>
          <li><span className="font-semibold text-core">Listen to webhooks</span> for confirmations and exhausted Session Keys.</li>
        </ol>
        <p>
          A working reference implementation in TypeScript and Python lives in the
          dashboard once you sign up.
        </p>
      </Section>

      <div className="mt-16 pt-10 border-t border-faint flex flex-wrap gap-4 justify-between items-center">
        <div className="text-[0.65rem] tracking-widest text-muted font-mono">Last updated · 2026-05-18</div>
        <a href="#/" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
          ← back to home
        </a>
      </div>
    </article>
  )
}

export default function Guide() {
  const [audience, setAudience] = useState<Audience>('dev')
  const [active, setActive] = useState('')
  const [showDashboardModal, setShowDashboardModal] = useState(false)

  const sections = audience === 'dev' ? devSections : bizSections

  useEffect(() => {
    setActive(sections[0].id)
  }, [audience, sections])

  useEffect(() => {
    const ids = sections.map((s) => s.id)
    const onScroll = () => {
      const y = window.scrollY + 160
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sections])

  return (
    <div className="relative z-10 w-full min-h-screen bg-peach">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-6 bg-peach/90 backdrop-blur-md border-b border-main/15">
        <a href="#/" className="font-display text-2xl tracking-[0.2em] font-semibold text-core">
          Atara
        </a>
        <nav className="flex items-center gap-6 md:gap-8">
          <a href="#/" className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono">
            Home
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-[0.75rem] tracking-wide text-main hover:text-glow transition-colors font-mono"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main className="pt-32 pb-24 px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-[0.65rem] tracking-superwide text-muted mb-4 font-mono">
              Quickstart
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-core leading-[1.05] mb-5">
              Start using Agent Pay in 1 minute.
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-main leading-relaxed">
              Pick your path below — individuals install once and just talk to their agent;
              developers wire Atara into their product through the dashboard.
            </p>
          </div>

          <div className="mb-10 inline-flex rounded-full border border-main/20 bg-white/40 p-1 text-[0.78rem] font-mono">
            <button
              onClick={() => setAudience('dev')}
              className={`px-5 py-1.5 rounded-full transition-colors ${
                audience === 'dev' ? 'bg-core text-white' : 'text-main hover:text-core'
              }`}
            >
              For Individuals
            </button>
            <button
              onClick={() => setAudience('biz')}
              className={`px-5 py-1.5 rounded-full transition-colors ${
                audience === 'biz' ? 'bg-core text-white' : 'text-main hover:text-core'
              }`}
            >
              For Developers
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <div className="text-[0.6rem] tracking-widest text-muted font-mono mb-4">
                  {audience === 'dev' ? 'Quickstart' : 'Get started'}
                </div>
                <ul className="flex flex-col gap-2 text-[0.75rem] font-mono">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          const el = document.getElementById(s.id)
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        className={`block transition-colors py-1 ${
                          active === s.id ? 'text-core font-bold' : 'text-main/70 hover:text-glow'
                        }`}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {audience === 'dev' ? (
              <DevGuide />
            ) : (
              <BizGuide onOpenDashboard={() => setShowDashboardModal(true)} />
            )}
          </div>
        </div>
      </main>

      {showDashboardModal && <DashboardModal onClose={() => setShowDashboardModal(false)} />}
    </div>
  )
}
