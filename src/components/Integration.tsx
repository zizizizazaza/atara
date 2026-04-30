export default function Integration() {
  return (
    <section className="py-32 relative border-t border-faint">
      <div className="crosshair v -top-8 left-1/2 -translate-x-1/2"></div>

      <div className="flex flex-col xl:flex-row gap-16 items-start">
        <div className="w-full xl:w-1/3 pt-4">
          <div className="text-[0.6rem] uppercase tracking-widest text-muted mb-6">VI. Live Example</div>
          <h2 className="font-serif text-4xl italic mb-6 text-core font-light leading-tight">
            From idea to live agent in 30 minutes.
          </h2>
          <p className="text-[0.7rem] leading-relaxed text-main uppercase tracking-widest opacity-80 mb-8">
            Authorize a budget, pick a strategy, hand it to a council of agents. Atara handles wallet creation, chain routing, drift detection, and consensus approval.
          </p>
          <p className="text-[0.65rem] leading-relaxed text-main uppercase tracking-widest opacity-60 mb-12">
            Compare to building from scratch: weeks of wallet integration, chain routing, compliance, and orchestration logic.
          </p>

          <div className="space-y-4 text-[0.6rem] uppercase tracking-widest text-muted border-t border-faint pt-8">
            <div className="flex justify-between items-center hover:text-main transition-colors">
              <span>&gt; Budget</span>
              <span className="text-main font-bold">$1,000 USDC</span>
            </div>
            <div className="flex justify-between items-center hover:text-main transition-colors">
              <span>&gt; Assets</span>
              <span className="text-main font-bold">BTC · ETH · SOL</span>
            </div>
            <div className="flex justify-between items-center hover:text-main transition-colors">
              <span>&gt; Drift Threshold</span>
              <span className="text-main font-bold">5%</span>
            </div>
            <div className="flex justify-between items-center hover:text-main transition-colors">
              <span>&gt; Consensus</span>
              <span className="text-main font-bold">Investment-Gurus</span>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-2/3 bg-core text-cool p-1 rounded-sm shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-glow/20 to-transparent opacity-50 z-0 pointer-events-none"></div>

          <div className="bg-[#110e13] p-6 relative z-10 h-full w-full">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
              <div className="text-[0.55rem] uppercase tracking-widest text-white/40">
                rebalance-agent.ts — ~/atara-core
              </div>
            </div>

            <pre className="text-[0.75rem] leading-loose tracking-wide overflow-x-auto terminal-scroll pb-4">
              <code className="text-cool/90">
                <span style={{ color: '#c678dd' }}>import</span>{' '}
                {'{ Atara } '}
                <span style={{ color: '#c678dd' }}>from</span>{' '}
                <span style={{ color: '#98c379' }}>'@atara/sdk'</span>;{'\n\n'}
                <span style={{ color: '#c678dd' }}>const</span> atara ={' '}
                <span style={{ color: '#e5c07b' }}>new</span>{' '}
                <span style={{ color: '#61afef' }}>Atara</span>(process.env.ATARA_KEY);{'\n\n'}
                <span style={{ color: '#5c6370', fontStyle: 'italic' }}>
                  // Authorize a $1000 budget. Rebalance weekly across BTC/ETH/SOL,
                </span>
                {'\n'}
                <span style={{ color: '#5c6370', fontStyle: 'italic' }}>
                  // gated by a council of investment-master agents.
                </span>
                {'\n'}
                <span style={{ color: '#c678dd' }}>const</span> agent ={' '}
                <span style={{ color: '#c678dd' }}>await</span> atara.investment.
                <span style={{ color: '#61afef' }}>autoRebalance</span>({'{'}
                {'\n  '}user: <span style={{ color: '#98c379' }}>'alice@example.com'</span>,
                {'\n  '}budget: {'{'} amount:{' '}
                <span style={{ color: '#d19a66' }}>1000</span>, currency:{' '}
                <span style={{ color: '#98c379' }}>'USDC'</span> {'}'},
                {'\n  '}assets: [
                <span style={{ color: '#98c379' }}>'BTC'</span>,{' '}
                <span style={{ color: '#98c379' }}>'ETH'</span>,{' '}
                <span style={{ color: '#98c379' }}>'SOL'</span>],
                {'\n  '}consensus:{' '}
                <span style={{ color: '#98c379' }}>'investment-gurus'</span>,{'  '}
                <span style={{ color: '#5c6370', fontStyle: 'italic' }}>
                  // multi-agent council
                </span>
                {'\n  '}threshold: <span style={{ color: '#d19a66' }}>0.05</span>,{'             '}
                <span style={{ color: '#5c6370', fontStyle: 'italic' }}>
                  // rebalance only on &gt;5% drift
                </span>
                {'\n  '}schedule:{' '}
                <span style={{ color: '#98c379' }}>'weekly'</span>
                {'\n'}
                {'}'});{'\n\n'}
                <span style={{ color: '#5c6370', fontStyle: 'italic' }}>
                  // Returns a live, idempotent agent handle
                </span>
                {'\n'}
                <span style={{ color: '#e5c07b' }}>console</span>.
                <span style={{ color: '#56b6c2' }}>log</span>(agent.id,{' '}
                agent.status);
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
