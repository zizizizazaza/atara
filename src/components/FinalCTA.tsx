const cols = [
  { title: 'Product', items: ['Pay Layer', 'Consensus Layer', 'LLM Router', 'Pricing', 'Changelog'] },
  { title: 'Developers', items: ['Documentation', 'API Reference', 'SDK · TypeScript', 'SDK · Python', 'Status'] },
  { title: 'Company', items: ['About', 'Customers', 'Blog', 'Contact'] },
  { title: 'Legal', items: ['Terms', 'Privacy', 'Compliance'] },
]

export default function FinalCTA() {
  return (
    <section className="py-32 border-t border-faint relative">
      <div className="crosshair v -top-8 left-1/2 -translate-x-1/2"></div>

      <div className="text-center max-w-3xl mx-auto mb-32 relative z-10">
        <div className="text-[0.6rem] tracking-widest text-muted mb-6">V. Initialize</div>
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-core leading-none mb-12">
          Your agent has work to do.<br />Let it pay.
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <button className="action-btn text-sm">Get an atara-key</button>
          <button className="action-btn text-sm">Read the docs</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-faint pt-12">
        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-[0.55rem] tracking-widest text-muted mb-4">{c.title}</div>
            <ul className="flex flex-col gap-2 text-[0.65rem] tracking-widest text-main">
              {c.items.map((i) => (
                <li key={i} className="hover:text-glow cursor-pointer transition-colors">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-faint flex justify-between items-center">
        <p className="text-[0.65rem] tracking-widest text-main font-bold font-display text-base">
          Atara · The payment layer for AI agents.
        </p>
        <p className="text-[0.55rem] tracking-widest text-muted">
          © 2026 Atara Labs
        </p>
      </div>
    </section>
  )
}
