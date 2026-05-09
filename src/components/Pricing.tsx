const tiers = [
  {
    name: 'Builder',
    price: '0.5%',
    period: '/ routed',
    desc: 'For solo developers and small teams. Sats-level metering, free to start, pay only when your agent pays.',
    cta: 'Start building',
  },
  {
    name: 'Team',
    price: '0.3%',
    period: '/ routed',
    desc: 'For cross-border teams and growing companies. Monthly reconciliation export, optional consensus layer.',
    cta: 'Start a team',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For sustained GMV, multi-team setups, and compliance requirements. Custom SLA, dedicated audit ingest.',
    cta: 'Talk to sales',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 border-t border-faint relative">
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">VI. Pricing</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-4 max-w-3xl">
        Pay only when your agent pays.
      </h2>
      <p className="text-[0.7rem] leading-relaxed tracking-widest text-main opacity-60 mb-16">
        No seat fees. No minimums. Routing fee taken out of each settled payment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`border p-8 transition-colors ${
              t.highlight ? 'border-core bg-cool/30' : 'border-faint hover:border-main/40'
            }`}
          >
            <div className="text-[0.55rem] tracking-widest text-muted mb-6">
              {t.name}
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display text-5xl text-core font-semibold">{t.price}</span>
              <span className="text-[0.6rem] tracking-widest text-muted">{t.period}</span>
            </div>
            <p className="text-[0.65rem] leading-relaxed tracking-widest text-main opacity-80 mb-8 min-h-[5rem]">
              {t.desc}
            </p>
            <button className="action-btn">{t.cta}</button>
          </div>
        ))}
      </div>
    </section>
  )
}
