type Bill = {
  line: string
  amount: string
  meta?: string
  cta: string
}

type Case = {
  n: string
  category: string
  scenario: string
  story: string
  user: string
  reply: string
  bill?: Bill
  highlight?: boolean
}

const cases: Case[] = [
  {
    n: '01',
    category: 'SaaS subscriptions',
    scenario: 'Renewed Cursor Pro for the team',
    story: 'Maya runs a 6-person team. Every December, finance chases who owns which Cursor seat. Now her ops agent renews them all overnight, tags them to the AI-Agent project, and pings finance with a single line item.',
    user: 'Renew all 6 Cursor Pro seats for the year, charge to the ai-agent project.',
    reply: 'Done. $240.00 settled on cursor.com in 3.8s. Receipt logged, finance pinged.',
  },
  {
    n: '02',
    category: 'Pay-per-call APIs',
    scenario: 'Topped up the OpenAI key',
    story: 'A research agent burns through tokens overnight. Instead of waking the on-call engineer when the key runs dry, the agent tops itself up to the weekly cap and keeps running.',
    user: 'OpenAI key is dry — top it up to the weekly cap.',
    reply: 'Topped up. $50.00 added in 2.1s, $450 left this week. Tagged to research-agent.',
  },
  {
    n: '03',
    category: 'Shopify checkout',
    scenario: 'Sent a birthday gift across town',
    story: 'It was Priya\'s birthday on Friday. The team\'s ops agent searched a few curated Shopify gift shops, picked a bundle within the team gift budget, and surfaced the cart for the manager to confirm before charging the team card.',
    user: 'Send Priya a birthday gift under $80 — she likes scented candles.',
    reply: 'Found a candle + small-batch wine bundle on a Shopify boutique, $74 with shipping. Confirm and I will ship it to her place.',
    bill: {
      line: 'Otherland · candle + wine bundle',
      amount: '$74.00',
      meta: 'Routed via Crossmint · ships to Brooklyn',
      cta: 'Approve and ship',
    },
  },
  {
    n: '04',
    category: 'Travel',
    scenario: 'Booked a red-eye to JFK',
    story: 'A customer-success lead needed to be in New York Friday. The travel agent searched fares across carriers, surfaced the cheapest red-eye, and waited for sign-off before locking in the booking.',
    user: 'Cheapest red-eye SFO → JFK next Friday, aisle seat.',
    reply: 'Found United UA1234 · 11:45pm · aisle 14C. Confirm and I will book it.',
    bill: {
      line: 'United UA1234 · SFO → JFK · Fri 11:45pm',
      amount: '$312.40',
      meta: 'Routed via Crossmint · Amadeus',
      cta: 'Approve and book',
    },
  },
  {
    n: '05',
    category: 'Agent-to-agent',
    scenario: 'Paid an inference node in sats',
    story: 'A planning agent farmed out 234k tokens of inference to a community-run Qwen node. Settlement happened on Lightning at sub-cent precision — no invoices, no Stripe, no monthly minimums.',
    user: 'Pay node n_x32a for the 234k tokens we just consumed.',
    reply: 'Settled. 1,170 sats over Lightning in 0.4s. Trace t_b91d logged.',
  },
  {
    n: '06',
    category: 'Cross-border checkout',
    scenario: 'Restocked the SF office',
    story: 'The office manager asked an agent to order two new mice. It compared SKUs on Amazon, picked the in-stock variant, and checked out with the team card — without a Stripe rejection from a foreign card.',
    user: 'Order 2 Logitech MX Master 3S to the SF office.',
    reply: 'Ordered from Amazon US. $199.98 captured, tracking dropped in #ops. Arrives Wed.',
  },
]

function Bubble({ side, children }: { side: 'user' | 'ai'; children: React.ReactNode }) {
  const isUser = side === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[88%] px-5 py-3.5 rounded-2xl text-[0.8rem] leading-relaxed ${
          isUser
            ? 'rounded-tl-sm font-medium shadow-md text-white'
            : 'bg-white/70 text-core rounded-tr-sm border border-faint'
        }`}
        style={isUser ? { backgroundColor: '#3F7E4F' } : undefined}
      >
        {children}
      </div>
    </div>
  )
}

function BillCard({ bill }: { bill: Bill }) {
  return (
    <div className="mt-3 border border-main/30 bg-white/80 rounded-xl p-4">
      <div className="text-[0.6rem] tracking-superwide text-muted mb-2">Pending authorization</div>
      <div className="font-display text-base text-core font-medium mb-1 leading-snug">
        {bill.line}
      </div>
      <div className="flex items-baseline justify-between mt-3 mb-3">
        <span className="font-display text-2xl text-core font-semibold">{bill.amount}</span>
        {bill.meta && (
          <span className="text-[0.55rem] tracking-widest text-muted text-right max-w-[55%]">
            {bill.meta}
          </span>
        )}
      </div>
      <button
        className="w-full text-[0.7rem] tracking-widest text-white hover:opacity-90 transition-opacity py-2 rounded-full font-medium"
        style={{ backgroundColor: '#3F7E4F' }}
      >
        {bill.cta} →
      </button>
    </div>
  )
}

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 border-t border-faint relative">
      <div className="crosshair h top-0 left-0 -translate-y-1/2"></div>
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">II. Customer stories</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-4 max-w-3xl">
        What teams are paying for, today.
      </h2>
      <p className="text-[0.75rem] leading-relaxed tracking-widest text-main opacity-70 mb-16 max-w-2xl">
        A short story plus the actual exchange between someone on the team and their agent. Small payments settle on their own; bigger ones come back for sign-off.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c) => (
          <article
            key={c.n}
            className={`group p-7 transition-colors flex flex-col bg-white/30 backdrop-blur-sm ${
              c.highlight
                ? 'border border-core'
                : 'border border-faint hover:border-main/40'
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.7rem] tracking-widest font-semibold ${
                  c.highlight ? 'text-white shadow-sm' : 'text-core border border-main/40 bg-white/60'
                }`}
                style={c.highlight ? { backgroundColor: '#3F7E4F' } : undefined}
              >
                {c.highlight && <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/90"></span>}
                {c.category}
              </span>
              <span className="text-[0.55rem] tracking-widest text-muted">Case {c.n}</span>
            </div>

            <h3 className="font-display text-xl font-semibold text-core mb-3 leading-snug">
              {c.scenario}
            </h3>
            <p className="text-[0.78rem] leading-loose text-main opacity-80 mb-6">
              {c.story}
            </p>

            <div className="flex flex-col gap-3 mt-auto">
              <Bubble side="user">{c.user}</Bubble>
              <Bubble side="ai">
                <div>{c.reply}</div>
                {c.bill && <BillCard bill={c.bill} />}
              </Bubble>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
