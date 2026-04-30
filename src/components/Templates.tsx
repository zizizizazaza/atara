const templates = [
  { id: '01', name: 'auto-rebalance', desc: 'Keep a portfolio aligned to target weights; rebalance when drift exceeds threshold.', snippet: 'atara.investment.autoRebalance({ ... })' },
  { id: '02', name: 'copy-trading', desc: "Mirror an on-chain leader's positions in real time.", snippet: 'atara.investment.copyTrade({ leader })' },
  { id: '03', name: 'dca-with-signals', desc: 'Dollar-cost-averaging, modulated by AI market signals.', snippet: 'atara.investment.dca({ signals })' },
  { id: '04', name: 'treasury-management', desc: 'Multi-sig, multi-chain treasury with auto-rebalance and reporting.', snippet: 'atara.treasury.create({ ... })' },
  { id: '05', name: 'conditional-execution', desc: 'Trigger payments when on-chain or AI-driven conditions are met.', snippet: 'atara.payments.when({ if })' },
]

export default function Templates() {
  return (
    <section className="py-24 border-t border-faint relative">
      <div className="crosshair h top-0 right-0 -translate-y-1/2"></div>
      <div className="text-[0.6rem] uppercase tracking-widest text-muted mb-6">V. Scaffolding</div>
      <h2 className="font-serif text-3xl md:text-4xl italic font-light text-core mb-4 max-w-3xl">
        Production-ready templates for financial use cases.
      </h2>
      <p className="text-[0.7rem] leading-relaxed tracking-widest text-main uppercase opacity-80 mb-12 max-w-2xl">
        Skip the 5-week build. Drop in a template, ship in an afternoon.
      </p>

      <div className="flex gap-6 overflow-x-auto terminal-scroll pb-6 -mx-2 px-2">
        {templates.map((t) => (
          <div
            key={t.id}
            className="min-w-[280px] max-w-[320px] flex-shrink-0 border border-faint p-6 bg-cool/10 hover:bg-cool/30 transition-colors"
          >
            <div className="text-[0.55rem] uppercase tracking-widest text-muted mb-4">Tmpl_{t.id}</div>
            <h3 className="font-serif text-xl italic font-light text-core mb-3">{t.name}</h3>
            <p className="text-[0.65rem] leading-relaxed tracking-widest text-main uppercase opacity-80 mb-6 min-h-[5rem]">
              {t.desc}
            </p>
            <div className="bg-core/95 text-cool/90 px-3 py-2 rounded-sm">
              <code className="text-[0.6rem] tracking-wide">{t.snippet}</code>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
