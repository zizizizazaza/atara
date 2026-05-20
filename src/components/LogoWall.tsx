const protocols = ['Crossmint', 'Tempo', 'x402', 'Lightning', 'Sui']
const merchants = ['Amazon', 'Shopify', 'OpenAI', 'Anthropic', 'Cursor', 'Notion', 'Linear']

export default function LogoWall() {
  return (
    <section className="py-20 border-t border-faint relative">
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">I. Rails</div>
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-core mb-12 max-w-3xl">
        Built on the rails your agents already use.
      </h2>

      <div className="space-y-8">
        <div>
          <div className="text-[0.55rem] tracking-superwide text-muted mb-4">
            Aggregated payment protocols
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4 opacity-70">
            {protocols.map((n) => (
              <span key={n} className="font-display text-xl font-medium text-core tracking-tight">{n}</span>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-faint">
          <div className="text-[0.55rem] tracking-superwide text-muted mb-4">
            Merchant network reachable today
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4 opacity-50">
            {merchants.map((n) => (
              <span key={n} className="font-display text-xl font-medium text-core tracking-tight">{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
