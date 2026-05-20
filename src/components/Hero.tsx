import { useState } from 'react'
import AuroraVisual from './AuroraVisual'

type Brand = { name: string; src: string }

const partners: Brand[] = [
  { name: 'Hetu', src: '/logos/hetu.svg' },
  { name: 'MIT', src: '/logos/logo-mit.svg' },
  { name: 'Columbia University', src: '/logos/logo-cus.svg' },
  { name: 'National University of Singapore', src: '/logos/logo-nus.svg' },
  { name: 'Washington University', src: '/logos/logo-wash.svg' },
  { name: 'Manifold', src: '/logos/logo-mh.svg' },
  { name: 'dao5', src: '/logos/logo-dao5.svg' },
  { name: 'Robot Ventures', src: '/logos/logo-robot.svg' },
]

function Logo({ brand }: { brand: Brand }) {
  return (
    <img
      src={brand.src}
      alt={brand.name}
      title={brand.name}
      className="h-5 md:h-6 w-auto opacity-65 hover:opacity-100 transition-opacity shrink-0"
      style={{ filter: 'brightness(0)' }}
    />
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
              onClick={() => { window.location.hash = '#/guide' }}
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
          Trusted by
        </div>
        <div className="marquee">
          <div className="marquee-track items-center">
            {[0, 1, 2, 3].flatMap((rep) => [
              ...partners.map((b) => (
                <Logo key={`r${rep}-${b.name}`} brand={b} />
              )),
              <span
                key={`gap-${rep}`}
                aria-hidden
                className="shrink-0"
                style={{ width: '14rem' }}
              />,
            ])}
          </div>
        </div>
      </div>
    </section>
  )
}
