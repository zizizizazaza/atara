import { useState } from 'react'
import AuroraVisual from './AuroraVisual'
import { useToast } from './ToastProvider'

type Brand = { name: string; icon?: string }

const partners: Brand[] = [
  { name: 'Anthropic', icon: 'simple-icons:anthropic' },
  { name: 'OpenAI', icon: 'simple-icons:openai' },
  { name: 'Cursor', icon: 'simple-icons:cursor' },
  { name: 'Gemini', icon: 'simple-icons:googlegemini' },
  { name: 'Perplexity', icon: 'simple-icons:perplexity' },
  { name: 'Replit', icon: 'simple-icons:replit' },
  { name: 'Vercel', icon: 'simple-icons:vercel' },
  { name: 'GitHub', icon: 'simple-icons:github' },
  { name: 'Notion', icon: 'simple-icons:notion' },
  { name: 'Linear', icon: 'simple-icons:linear' },
  { name: 'Slack', icon: 'simple-icons:slack' },
  { name: 'Stripe', icon: 'simple-icons:stripe' },
  { name: 'Crossmint' },
  { name: 'Tempo' },
  { name: 'x402' },
  { name: 'Lightning', icon: 'simple-icons:lightning' },
  { name: 'Circle', icon: 'simple-icons:circle' },
  { name: 'Sui', icon: 'token:sui' },
  { name: 'Amazon', icon: 'simple-icons:amazon' },
  { name: 'Shopify', icon: 'simple-icons:shopify' },
  { name: 'DoorDash', icon: 'simple-icons:doordash' },
  { name: 'Booking', icon: 'simple-icons:bookingdotcom' },
]

function Logo({ brand, size = 22 }: { brand: Brand; size?: number }) {
  if (brand.icon) {
    return (
      <span className="inline-flex items-center gap-2 opacity-75 hover:opacity-100 transition-opacity shrink-0">
        <img
          src={`https://api.iconify.design/${brand.icon}.svg?color=%231A151C`}
          alt={brand.name}
          title={brand.name}
          style={{ height: size, width: size }}
        />
        <span className="font-display text-sm font-medium text-core tracking-tight whitespace-nowrap">
          {brand.name}
        </span>
      </span>
    )
  }
  return (
    <span
      title={brand.name}
      className="font-display font-semibold text-core tracking-tight opacity-75 whitespace-nowrap shrink-0"
      style={{ fontSize: '0.95rem', letterSpacing: '-0.01em' }}
    >
      {brand.name}
    </span>
  )
}

export default function Hero() {
  const [copied, setCopied] = useState(false)
  const { notify } = useToast()
  const installCmd = 'curl -fsSL https://atara.cn/install | sh'

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCmd)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // ignore
    }
  }

  return (
    <section className="flex flex-col justify-start relative mb-24 pt-4">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7">
          <div className="text-[0.65rem] tracking-superwide text-muted mb-6">
            The payment layer for AI agents
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-core mb-4 leading-[1.05]">
            0-fee payments for agents.<br />One API, every rail.
          </h1>
          <p className="font-display text-xl md:text-2xl text-core opacity-70 font-medium tracking-tight mb-8">
            Across agents, currencies, and chains.
          </p>
          <p className="max-w-xl text-[0.75rem] md:text-xs leading-loose tracking-widest text-main font-bold mb-8">
            One API for your agent to subscribe, pay-per-call, and check out anywhere. Lightning underneath, smart routing on top, audit trail end-to-end.
          </p>

          <div className="flex flex-wrap items-center gap-8 mb-10">
            <button
              onClick={() => notify('Coming soon')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium text-sm tracking-wide shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1A151C' }}
            >
              Get started
              <span aria-hidden>→</span>
            </button>
          </div>

          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-cool/40 border border-main/30 rounded-full text-[0.6rem] tracking-widest text-core font-medium">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-glow"></span>
                Atara skill
              </span>
              <span className="text-[0.55rem] tracking-superwide text-muted">
                Drop into Claude, Cursor, or any MCP-aware agent
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/40 border border-main/30 rounded-full px-5 py-3 backdrop-blur-sm">
              <code className="flex-1 font-mono text-[0.8rem] text-core truncate">
                {installCmd}
              </code>
              <button
                onClick={onCopy}
                className="text-[0.65rem] tracking-widest text-core hover:text-glow transition-colors font-medium shrink-0 px-3 py-1 bg-cool/60 hover:bg-cool/80 rounded-full"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <AuroraVisual />
        </div>
      </div>

      <div className="mt-20 pt-4 relative z-10">
        <div className="text-[0.55rem] tracking-superwide text-muted mb-3">
          Investors & partners
        </div>
        <div className="marquee">
          <div className="marquee-track">
            {partners.map((b) => (
              <Logo key={`a-${b.name}`} brand={b} />
            ))}
            {partners.map((b) => (
              <Logo key={`b-${b.name}`} brand={b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
