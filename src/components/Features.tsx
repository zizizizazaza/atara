const features = [
  {
    n: '01',
    title: 'Stablecoin Transfers',
    body: 'USDC, USDT, and PYUSD across major chains. Single or batch transfers, sub-cent fees on supported networks.',
  },
  {
    n: '02',
    title: 'Embedded Wallets',
    body: 'Auto-create wallets for users or AI agents. Built-in spending limits, audit trails, and recovery flows.',
  },
  {
    n: '03',
    title: 'Onramp & Offramp',
    body: 'Card, ACH, and local payment methods in. Bank deposits out. Compliance handled.',
  },
  {
    n: '04',
    title: 'AI Agent Ready',
    body: 'Idempotent calls, structured errors, MCP-compatible. Agents transact autonomously — with N-of-M consensus approval for high-value payments.',
  },
]

export default function Features() {
  return (
    <section className="py-24 border-t border-faint relative">
      <div className="crosshair h top-0 left-0 -translate-y-1/2"></div>
      <div className="text-[0.6rem] uppercase tracking-widest text-muted mb-6">IV. Capabilities</div>
      <h2 className="font-serif text-3xl md:text-4xl italic font-light text-core mb-16 max-w-3xl">
        Everything you need to ship stablecoin payments.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
        {features.map((f) => (
          <div key={f.n} className="group relative">
            <div className="text-[0.55rem] uppercase tracking-widest text-muted mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 border border-main rounded-full group-hover:bg-glow group-hover:border-glow transition-colors"></span>
              {f.n}
            </div>
            <h3 className="font-serif text-2xl italic font-light text-core mb-4">{f.title}</h3>
            <p className="text-[0.7rem] leading-relaxed tracking-widest text-main uppercase opacity-80">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
