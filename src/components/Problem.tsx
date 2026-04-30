const stats = [
  { value: '$33T', label: 'Annual stablecoin transaction volume in 2025 — already exceeds Visa.' },
  { value: '$390B', label: 'Real B2B / C2B stablecoin payments. Growing 100% year over year.' },
  { value: '5+', label: 'Average number of SDKs developers stitch together for a single payment use case.' },
]

export default function Problem() {
  return (
    <section className="py-24 border-t border-faint relative">
      <div className="crosshair h top-0 left-0 -translate-y-1/2"></div>
      <div className="crosshair h top-0 right-0 -translate-y-1/2"></div>

      <div className="text-[0.6rem] uppercase tracking-widest text-muted mb-6">II. Problem</div>
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl italic font-light text-core leading-tight mb-12 max-w-4xl">
        Stablecoin payments are eating the world. Integration is still hard.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-12">
        {stats.map((s, i) => (
          <div key={s.value} className="border-l border-faint pl-6">
            <div className="text-[0.55rem] uppercase tracking-widest text-muted mb-3">
              {String(i + 1).padStart(2, '0')} / 03
            </div>
            <div className="font-serif text-5xl lg:text-6xl italic text-core font-light mb-4">
              {s.value}
            </div>
            <p className="text-[0.65rem] leading-relaxed tracking-widest text-main uppercase opacity-80">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[0.7rem] leading-relaxed tracking-widest text-main uppercase font-bold max-w-2xl">
        Atara replaces multiple SDKs with one programmable payment API.
      </p>
    </section>
  )
}
