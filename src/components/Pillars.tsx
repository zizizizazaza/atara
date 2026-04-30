type Pillar = {
  index: string
  title: string
  body: string
  className?: string
  list?: { code: string; label: string }[]
  extraBody?: string
}

const pillars: Pillar[] = [
  {
    index: 'I. Architecture',
    title: 'AI-Native API Design',
    body: 'The API is built so AI agents can use it autonomously. Features include idempotent calls, structured machine-readable errors, MCP compatibility, and stringent safety controls including per-agent spending limits, immutable audit trails, and N-of-M consensus approvals for high-value transfers.',
  },
  {
    index: 'II. Scaffolding',
    title: 'Built-in Workflow Templates',
    body: 'Five production-ready templates for common financial use cases. Developers integrate complete workflows in minutes instead of building from scratch.',
    className: 'mt-0 lg:mt-24',
    list: [
      { code: 'Tmpl_01', label: 'Auto-Rebalance' },
      { code: 'Tmpl_02', label: 'Copy-Trading' },
      { code: 'Tmpl_03', label: 'DCA-With-Signals' },
      { code: 'Tmpl_04', label: 'Treasury-Mgmt' },
      { code: 'Tmpl_05', label: 'Conditional-Exec' },
    ],
  },
  {
    index: 'III. Execution',
    title: 'Decision-Driven Payments',
    body: 'Transactions are no longer bound to direct user clicks. Payments can be seamlessly triggered by AI signals, predictive models, or multi-agent consensus mechanisms. This fundamental shift unlocks entirely new product patterns for agentic applications.',
    className: 'mt-0 lg:mt-48',
  },
]

export default function Pillars() {
  return (
    <section className="py-24 border-t border-faint relative">
      <div className="crosshair h top-0 left-0 -translate-y-1/2"></div>
      <div className="crosshair h top-0 right-0 -translate-y-1/2"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-12">
        {pillars.map((p) => (
          <div key={p.index} className={`relative group ${p.className ?? ''}`}>
            <div className="text-[0.6rem] uppercase tracking-widest text-muted mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 border border-main rounded-full group-hover:bg-glow group-hover:border-glow transition-colors"></span>
              {p.index}
            </div>
            <h3 className="font-serif text-3xl mb-6 italic text-core font-light">{p.title}</h3>
            <p className={`text-[0.7rem] leading-relaxed text-main uppercase tracking-widest opacity-80 ${p.list ? 'mb-6' : ''}`}>
              {p.body}
            </p>
            {p.list && (
              <ul className="text-[0.6rem] tracking-widest text-main flex flex-col gap-2 border-l border-faint pl-4">
                {p.list.map((item) => (
                  <li key={item.code} className="flex justify-between">
                    <span>{item.code}</span>
                    <span className="opacity-60">{item.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
