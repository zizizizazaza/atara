export default function Integration() {
  return (
    <section id="example" className="py-32 relative border-t border-faint">
      <div className="crosshair v -top-8 left-1/2 -translate-x-1/2"></div>

      <div className="flex flex-col xl:flex-row gap-16 items-start">
        <div className="w-full xl:w-1/3 pt-4">
          <div className="text-[0.6rem] tracking-widest text-muted mb-6">III. Live Example</div>
          <h2 className="font-display text-4xl mb-6 text-core font-semibold leading-tight">
            One command. One bill. Every receipt.
          </h2>
          <p className="text-[0.7rem] leading-relaxed text-main tracking-widest opacity-80 mb-8">
            One CLI call resolves the merchant, picks the cheapest rail, checks the spending session, settles, and writes a signed receipt to the trace.
          </p>
          <p className="text-[0.65rem] leading-relaxed text-main tracking-widest opacity-60 mb-12">
            Compare to building from scratch: provider SDKs, retry logic, fallback handling, audit pipeline.
          </p>

          <div className="space-y-4 text-[0.6rem] tracking-widest text-muted border-t border-faint pt-8">
            <div className="flex justify-between items-center hover:text-main transition-colors">
              <span>&gt; Merchant</span>
              <span className="text-main font-bold">OpenAI API credits</span>
            </div>
            <div className="flex justify-between items-center hover:text-main transition-colors">
              <span>&gt; Amount</span>
              <span className="text-main font-bold">$50 USD</span>
            </div>
            <div className="flex justify-between items-center hover:text-main transition-colors">
              <span>&gt; Project</span>
              <span className="text-main font-bold">ai-agent</span>
            </div>
            <div className="flex justify-between items-center hover:text-main transition-colors">
              <span>&gt; Spend limit</span>
              <span className="text-main font-bold">$500 / week</span>
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
              <div className="text-[0.55rem] tracking-widest text-white/40">
                ~/agent · zsh
              </div>
            </div>

            <pre className="text-[0.75rem] leading-loose tracking-wide overflow-x-auto terminal-scroll pb-4">
              <code className="text-cool/90">
                <span style={{ color: '#56b6c2' }}>$</span>{' '}
                <span style={{ color: '#61afef' }}>atara</span> pay{' \\'}
                {'\n    '}--to <span style={{ color: '#98c379' }}>"OpenAI API credits"</span>{' \\'}
                {'\n    '}--amount <span style={{ color: '#d19a66' }}>50usd</span>{' \\'}
                {'\n    '}--project <span style={{ color: '#98c379' }}>ai-agent</span>
                {'\n\n'}
                <span style={{ color: '#98c379' }}>✓</span> Routing: Crossmint (3 rails compared, lowest fee)
                {'\n'}
                <span style={{ color: '#98c379' }}>✓</span> Spending session OK ($50 of $500 limit)
                {'\n'}
                <span style={{ color: '#98c379' }}>✓</span> Settled in 2.1s
                {'\n\n'}
                <span style={{ color: '#5c6370' }}>  trace_id     :</span>{' '}
                <span style={{ color: '#e5c07b' }}>t_8a2f...</span>
                {'\n'}
                <span style={{ color: '#5c6370' }}>  cost         :</span>{' '}
                <span style={{ color: '#d19a66' }}>$50.00</span>{' '}
                <span style={{ color: '#5c6370' }}>+ $0.15 fee</span>
                {'\n'}
                <span style={{ color: '#5c6370' }}>  rail_used    :</span>{' '}
                <span style={{ color: '#61afef' }}>crossmint_card</span>
                {'\n'}
                <span style={{ color: '#5c6370' }}>  rail_fallback:</span>{' '}
                <span style={{ color: '#61afef' }}>tempo</span>{' '}
                <span style={{ color: '#5c6370' }}>(skipped)</span>
                {'\n'}
                <span style={{ color: '#5c6370' }}>  receipt      :</span>{' '}
                <span style={{ color: '#98c379' }}>https://atara.cn/r/t_8a2f</span>
                {'\n'}
                <span style={{ color: '#5c6370' }}>  balance      :</span>{' '}
                <span style={{ color: '#d19a66' }}>9,095 sats</span>{' '}
                <span style={{ color: '#5c6370' }}>remaining</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
