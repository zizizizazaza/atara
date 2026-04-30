import AuroraVisual from './AuroraVisual'

export default function Hero() {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center relative mb-32">
      <div className="crosshair v -top-10 left-1/2 -translate-x-1/2"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7">
          <div className="text-[0.65rem] tracking-superwide text-muted mb-6">
            Genus: Programmable Capital
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-core mb-8 leading-[1.02]">
            One API.<br />Money moves.<br />
            <span className="font-display font-medium opacity-80">Across currencies, chains, and agents.</span>
          </h1>
          <p className="max-w-xl text-[0.75rem] md:text-xs leading-loose tracking-widest text-main font-bold mb-10">
            Send, receive, and orchestrate stablecoin payments in any app — with built-in support for AI agents, embedded wallets, and investment workflows.
          </p>
          <div className="flex flex-wrap items-center gap-8">
            <button className="action-btn text-sm">Get an API Key</button>
            <button className="action-btn text-sm">Read the Docs</button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <AuroraVisual />
        </div>
      </div>

      <div className="mt-24 pt-8 border-t border-faint">
        <div className="text-[0.55rem] tracking-superwide text-muted mb-6">
          Trusted by builders at
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4 opacity-40">
          {['North', 'Obelisk', 'Stellar/Co', 'Kestrel', 'Meridian', 'Axiom'].map((n) => (
            <span key={n} className="font-display text-xl font-medium text-core tracking-tight">{n}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
