const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/ mo',
    desc: '100 transfers + 50 consensus calls per month. Build your demo. No card required.',
    cta: 'Start Free',
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/ mo',
    desc: '5,000 transfers + 1,000 consensus calls per month. Ship to production.',
    cta: 'Go Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Private deployment, SLA, dedicated support. Talk to sales.',
    cta: 'Contact Sales',
  },
]

export default function Pricing() {
  return (
    <section className="py-24 border-t border-faint relative">
      <div className="text-[0.6rem] uppercase tracking-widest text-muted mb-6">VII. Pricing</div>
      <h2 className="font-serif text-3xl md:text-4xl italic font-light text-core mb-4 max-w-3xl">
        Simple, usage-based pricing. No seat tax.
      </h2>
      <p className="text-[0.7rem] leading-relaxed tracking-widest text-main uppercase opacity-60 mb-16">
        Pricing scales with usage, not seats.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`border p-8 transition-colors ${
              t.highlight ? 'border-core bg-cool/30' : 'border-faint hover:border-main/40'
            }`}
          >
            <div className="text-[0.55rem] uppercase tracking-widest text-muted mb-6">
              {t.name}
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-serif text-5xl italic text-core font-light">{t.price}</span>
              <span className="text-[0.6rem] uppercase tracking-widest text-muted">{t.period}</span>
            </div>
            <p className="text-[0.65rem] leading-relaxed tracking-widest text-main uppercase opacity-80 mb-8 min-h-[5rem]">
              {t.desc}
            </p>
            <button className="action-btn">{t.cta}</button>
          </div>
        ))}
      </div>
    </section>
  )
}
