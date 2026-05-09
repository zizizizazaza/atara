import { useState } from 'react'
import AuroraVisual from './AuroraVisual'

type Brand = { name: string; icon?: string }

const compatibleAgents: Brand[] = [
  { name: 'Claude', icon: 'simple-icons:claude' },
  { name: 'Cursor', icon: 'simple-icons:cursor' },
  { name: 'OpenAI', icon: 'simple-icons:openai' },
  { name: 'Gemini', icon: 'simple-icons:googlegemini' },
  { name: 'Anthropic', icon: 'simple-icons:anthropic' },
  { name: 'Codex', icon: 'simple-icons:openai' },
]

const poweredBy: Brand[] = [
  { name: 'Crossmint' },
  { name: 'Tempo' },
  { name: 'x402' },
  { name: 'Lightning', icon: 'simple-icons:lightning' },
  { name: 'Circle', icon: 'simple-icons:circle' },
  { name: 'Sui', icon: 'token:sui' },
]

function Logo({ brand, size = 22 }: { brand: Brand; size?: number }) {
  if (brand.icon) {
    return (
      <span className="inline-flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <img
          src={`https://api.iconify.design/${brand.icon}.svg?color=%231A151C`}
          alt={brand.name}
          title={brand.name}
          style={{ height: size, width: size }}
        />
        <span className="font-display text-sm font-medium text-core tracking-tight">
          {brand.name}
        </span>
      </span>
    )
  }
  return (
    <span
      title={brand.name}
      className="font-display font-semibold text-core tracking-tight opacity-80"
      style={{ fontSize: '0.95rem', letterSpacing: '-0.01em' }}
    >
      {brand.name}
    </span>
  )
}

export default function Hero() {
  const [copied, setCopied] = useState(false)
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
    <section className="min-h-[80vh] flex flex-col justify-center relative mb-24">
      <div className="crosshair v -top-10 left-1/2 -translate-x-1/2"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7">
          <div className="text-[0.65rem] tracking-superwide text-muted mb-6">
            The payment layer for AI agents
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-core mb-4 leading-[1.02]">
            One API.<br />Money moves.
          </h1>
          <p className="font-display text-xl md:text-2xl text-core opacity-70 font-medium tracking-tight mb-8">
            Across agents, currencies, and chains.
          </p>
          <p className="max-w-xl text-[0.75rem] md:text-xs leading-loose tracking-widest text-main font-bold mb-8">
            One API for your agent to subscribe, pay-per-call, and check out anywhere. Lightning underneath, smart routing on top, audit trail end-to-end.
          </p>

          <div className="flex flex-wrap items-center gap-8 mb-10">
            <button className="action-btn text-sm">Start building</button>
            <button className="action-btn text-sm">Talk to sales</button>
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

      <div className="mt-16 pt-8 border-t border-faint relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="text-[0.55rem] tracking-superwide text-muted mb-4">
            Works with
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {compatibleAgents.map((b) => (
              <Logo key={b.name} brand={b} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[0.55rem] tracking-superwide text-muted mb-4">
            Powered by
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {poweredBy.map((b) => (
              <Logo key={b.name} brand={b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
