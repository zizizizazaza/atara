export default function Hero() {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center relative mb-32">
      <div className="crosshair v -top-10 left-1/2 -translate-x-1/2"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7">
          <div className="text-[0.65rem] tracking-superwide text-muted uppercase mb-6">
            Genus: Programmable Capital
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light italic tracking-wide text-core mb-8 leading-[1.05]">
            Programmable<br />stablecoin payments.<br />
            <span className="opacity-70">Built for what's next.</span>
          </h1>
          <p className="max-w-xl text-[0.75rem] md:text-xs leading-loose tracking-widest text-main uppercase font-bold mb-10">
            Send, receive, and orchestrate stablecoin payments in any app — with built-in support for AI agents, embedded wallets, and investment workflows.
          </p>
          <div className="flex flex-wrap items-center gap-8">
            <button className="action-btn text-sm">Get an API Key</button>
            <button className="action-btn text-sm">Read the Docs</button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-core/95 text-cool/90 rounded-sm shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
              <div className="w-2 h-2 rounded-full bg-white/20"></div>
            </div>
            <div className="text-[0.55rem] uppercase tracking-widest text-white/40">
              transfer.ts
            </div>
          </div>
          <pre className="text-[0.72rem] leading-loose px-5 py-4 overflow-x-auto terminal-scroll">
            <code>
              <span style={{ color: '#c678dd' }}>import</span>{' '}
              {'{ Atara } '}
              <span style={{ color: '#c678dd' }}>from</span>{' '}
              <span style={{ color: '#98c379' }}>'@atara/sdk'</span>;{'\n\n'}
              <span style={{ color: '#c678dd' }}>const</span> atara ={' '}
              <span style={{ color: '#e5c07b' }}>new</span>{' '}
              <span style={{ color: '#61afef' }}>Atara</span>(process.env.ATARA_KEY);{'\n\n'}
              <span style={{ color: '#c678dd' }}>await</span> atara.payments.
              <span style={{ color: '#61afef' }}>transfer</span>({'{'}
              {'\n  '}to: <span style={{ color: '#98c379' }}>'0xabc...'</span>,{'\n  '}
              amount: {'{'} asset:{' '}
              <span style={{ color: '#98c379' }}>'USDC'</span>, value:{' '}
              <span style={{ color: '#d19a66' }}>100</span> {'}'}
              {'\n'}
              {'}'});
            </code>
          </pre>
        </div>
      </div>

      <div className="mt-24 pt-8 border-t border-faint">
        <div className="text-[0.55rem] tracking-superwide text-muted uppercase mb-6">
          Trusted by builders at
        </div>
        <div className="flex flex-wrap gap-x-12 gap-y-4 opacity-40">
          {['NORTH', 'OBELISK', 'STELLAR/CO', 'KESTREL', 'MERIDIAN', 'AXIOM'].map((n) => (
            <span key={n} className="font-serif text-xl italic text-core">{n}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
