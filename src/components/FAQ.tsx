import { useState } from 'react'

const items = [
  {
    q: 'I already integrated Crossmint. Why add Atara?',
    a: 'Crossmint covers card-payable merchants. Atara puts cards (Crossmint), on-chain stablecoins (Tempo), HTTP micro-payments (x402), and Lightning behind one API — and falls back automatically when one rail breaks.',
  },
  {
    q: 'Will consensus approval slow my agent down?',
    a: 'It only fires above the threshold you set. Sub-threshold payments settle in sub-second. Consensus calls run in parallel, so 3 validators usually return in 1–2 seconds.',
  },
  {
    q: 'Why bill in sats instead of dollars?',
    a: 'Sats are the native Lightning unit and let us meter at sub-cent precision (1 sat ≈ $0.0006). Customer-facing settlements display in USD / USDC / CNY at the live rate.',
  },
  {
    q: 'Where does the money sit? What about compliance?',
    a: 'Funds flow through licensed partners (Crossmint and regulated fiat on-ramps). Atara never custodies. Audit logs persist for 90 days by default and export to CSV, Feishu, or Notion. Enterprise supports private deployment.',
  },
  {
    q: 'Do you support merchants in China?',
    a: 'MVP focuses on overseas merchant scenarios (Stripe card rejections, foreign SaaS subscriptions). Domestic merchants route through Lightning + Sui as that ecosystem matures.',
  },
  {
    q: 'How is this different from Kite AI or Payman?',
    a: 'Kite is an agent-specific chain bound to its token. Payman targets vertical bank workflows. Atara is a protocol aggregation layer — no token, no chain lock-in, no merchant restriction. Whichever rail works best, we route through it.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 border-t border-faint relative">
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">VII. Questions</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-16 max-w-3xl">
        The questions builders actually ask.
      </h2>

      <div className="border-t border-faint">
        {items.map((it, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border-b border-faint">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex justify-between items-center text-left py-6 group"
              >
                <span className="font-display text-base md:text-lg text-core font-medium pr-8 group-hover:text-glow transition-colors">
                  {it.q}
                </span>
                <span className="text-[0.7rem] tracking-widest text-muted shrink-0">
                  {isOpen ? '[ − ]' : '[ + ]'}
                </span>
              </button>
              {isOpen && (
                <div className="pb-8 pr-12 text-[0.7rem] leading-loose tracking-widest text-main opacity-80">
                  {it.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
