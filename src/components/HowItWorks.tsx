const steps = [
  { n: '01', title: 'Install the SDK', code: 'npm install @atara/sdk' },
  { n: '02', title: 'Authenticate', code: 'const atara = new Atara(API_KEY);' },
  { n: '03', title: 'Ship payment features', code: 'await atara.payments.transfer({ to, amount });' },
]

export default function HowItWorks() {
  return (
    <section className="py-24 border-t border-faint relative">
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">III. How It Works</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-16 max-w-3xl">
        Three steps to a live integration.
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {steps.map((s) => (
          <div key={s.n} className="relative">
            <div className="text-[0.55rem] tracking-widest text-muted mb-4">Step {s.n}</div>
            <h3 className="font-display text-2xl font-semibold text-core mb-6">{s.title}</h3>
            <div className="bg-core/95 text-cool/90 px-4 py-3 rounded-sm">
              <code className="text-[0.7rem] tracking-wide">{s.code}</code>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
