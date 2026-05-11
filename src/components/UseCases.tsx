type Bill = {
  line: string
  amount: string
  meta?: string
  cta: string
}

type Case = {
  n: string
  title: string
  icon: string
  story: string
  user: string
  reply: string
  bill?: Bill
}

const cases: Case[] = [
  {
    n: '01',
    title: 'Renewing SaaS subscriptions',
    icon: 'lucide:repeat',
    story: 'Maya\'s ops agent renews the team\'s 6 Cursor seats overnight, tags them to the AI-Agent project, and pings finance with one line item.',
    user: 'Renew all 6 Cursor Pro seats for the year, charge to the ai-agent project.',
    reply: 'Done. $240.00 settled on cursor.com in 3.8s. Receipt logged, finance pinged.',
  },
  {
    n: '02',
    title: 'Topping up pay-per-call APIs',
    icon: 'lucide:key-round',
    story: 'When a research agent burns through tokens overnight, it tops itself up to the weekly cap instead of waking on-call.',
    user: 'OpenAI key is dry — top it up to the weekly cap.',
    reply: 'Topped up. $50.00 added in 2.1s, $450 left this week. Tagged to research-agent.',
  },
  {
    n: '03',
    title: 'Shopping on Shopify',
    icon: 'simple-icons:shopify',
    story: 'A teammate\'s birthday is Friday. The agent picks a bundle within budget and surfaces the cart for sign-off.',
    user: 'Send Priya a birthday gift under $80 — she likes scented candles.',
    reply: 'Found a candle + small-batch wine bundle on a Shopify boutique, $74 with shipping. Confirm and I will ship it.',
    bill: {
      line: 'Otherland · candle + wine bundle',
      amount: '$74.00',
      meta: 'Routed via Crossmint · ships to Brooklyn',
      cta: 'Approve and ship',
    },
  },
  {
    n: '04',
    title: 'Booking travel',
    icon: 'lucide:plane',
    story: 'The CS lead needs to be in NYC Friday. The travel agent surfaces the cheapest red-eye and waits for sign-off.',
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
    title: 'Agent-to-agent payments',
    icon: 'simple-icons:lightning',
    story: 'A planning agent farms out 234k tokens to a community Qwen node. Lightning settles at sub-cent precision — no invoices.',
    user: 'Pay node n_x32a for the 234k tokens we just consumed.',
    reply: 'Settled. 1,170 sats over Lightning in 0.4s. Trace t_b91d logged.',
  },
  {
    n: '06',
    title: 'Shopping on Amazon',
    icon: 'simple-icons:amazon',
    story: 'The office manager asks an agent to restock two mice. It picks the in-stock SKU and checks out with the team card.',
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

function TitleIcon({ icon }: { icon: string }) {
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 border border-main/25 shrink-0">
      <img
        src={`https://api.iconify.design/${icon}.svg?color=%231A151C`}
        alt=""
        aria-hidden
        className="w-5 h-5"
      />
    </span>
  )
}

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 relative">
      <div className="crosshair h top-0 left-0 -translate-y-1/2"></div>
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">II. Use cases</div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-core mb-4 max-w-3xl">
        Agentic spending, in motion.
      </h2>
      <p className="text-[0.75rem] leading-relaxed tracking-widest text-main opacity-70 mb-16 max-w-2xl">
        Small payments settle on their own; bigger ones come back for sign-off.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c) => (
          <article
            key={c.n}
            className="group p-7 transition-colors flex flex-col bg-white/30 backdrop-blur-sm border border-faint hover:border-main/40"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-start gap-4 min-w-0">
                <TitleIcon icon={c.icon} />
                <h3 className="font-display text-2xl font-semibold text-core leading-tight min-w-0">
                  {c.title}
                </h3>
              </div>
              <span className="text-[0.55rem] tracking-widest text-muted shrink-0 mt-2">Case {c.n}</span>
            </div>

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
