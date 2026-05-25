import { useEffect, useRef, useState } from 'react'

type Bill = {
  line: string
  amount: string
  meta?: string
  cta: string
}

type ReceiptKind = 'saas-invoice' | 'api-statement' | 'order-card' | 'boarding-pass' | 'shipping-label'
type ProductKind =
  | 'candle' | 'wine' | 'mug' | 'plant' | 'tee' | 'sneaker'
  | 'box' | 'headphones' | 'mouse' | 'book' | 'batteries'
  | 'plane' | 'hotel' | 'taxi' | 'train' | 'suitcase' | 'pin'

type Case = {
  n: string
  title: string
  icon: string
  art: { icon: string; tint: string; glow: string }
  panel: {
    brand: string
    amount: string
    meta: string
    status: string
    receipt?: ReceiptKind
    brands?: string[]
    products?: ProductKind[]
  }
  story: string
  user: string
  reply: string
  bill?: Bill
}

const cases: Case[] = [
  {
    n: '01',
    title: 'Buying SaaS subscriptions',
    icon: 'lucide:repeat',
    art: { icon: 'lucide:credit-card', tint: '#F4EFE6', glow: '#3F7E4F' },
    panel: { brand: 'cursor.com', amount: '$240.00', meta: '6 seats · 3.8s', status: 'settled', receipt: 'saas-invoice', brands: ['simple-icons:notion','simple-icons:anthropic','simple-icons:openai','simple-icons:linear','simple-icons:slack','simple-icons:github','simple-icons:figma','simple-icons:vercel'] },
    story: 'Maya\'s ops agent renews the team\'s 6 Cursor seats overnight, tags them to the ai-agent project, and pings finance with one line item.',
    user: 'Renew all 6 Cursor Pro seats for the year, charge to the ai-agent project.',
    reply: 'Done. $240.00 settled on cursor.com in 3.8s. Receipt logged, finance pinged.',
  },
  {
    n: '02',
    title: 'Topping up pay-per-call APIs',
    icon: 'lucide:key-round',
    art: { icon: 'lucide:zap', tint: '#F4EFE6', glow: '#C28A2C' },
    panel: { brand: 'openai · api', amount: '$50.00', meta: 'weekly cap · 2.1s', status: 'topped up', receipt: 'api-statement', brands: ['simple-icons:openai','simple-icons:anthropic','simple-icons:google','simple-icons:perplexity','simple-icons:huggingface','simple-icons:mistralai'] },
    story: 'When a research agent burns through tokens overnight, it tops itself up to the weekly cap instead of waking on-call.',
    user: 'OpenAI key is dry — top it up to the weekly cap.',
    reply: 'Topped up. $50.00 added in 2.1s, $450 left this week. Tagged to research-agent.',
  },
  {
    n: '03',
    title: 'Shopping on Shopify',
    icon: 'simple-icons:shopify',
    art: { icon: 'lucide:shopping-bag', tint: '#F4EFE6', glow: '#3F6A2C' },
    panel: { brand: 'otherland', amount: '$74.00', meta: 'candle + wine bundle', status: 'pending sign-off', receipt: 'order-card', products: ['candle','wine','mug','plant','tee','sneaker'] },
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
    art: { icon: 'lucide:plane-takeoff', tint: '#F4EFE6', glow: '#3C64B8' },
    panel: { brand: 'united · ua1234', amount: '$312.40', meta: 'sfo → jfk · fri 11:45pm', status: 'pending sign-off', receipt: 'boarding-pass', products: ['plane','hotel','taxi','train','suitcase','pin'] },
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
    title: 'Shopping on Amazon',
    icon: 'simple-icons:amazon',
    art: { icon: 'lucide:package', tint: '#F4EFE6', glow: '#9C5A1F' },
    panel: { brand: 'amazon · us', amount: '$199.98', meta: '2 × mx master 3s', status: 'captured', receipt: 'shipping-label', products: ['box','headphones','mouse','book','batteries','mug'] },
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

function SaaSInvoice({ accent }: { accent: string }) {
  // vertical paper invoice; cursor seat renewal
  const lines = [
    { name: 'cursor pro · seat × 6', amount: '$240.00' },
    { name: 'platform fee', amount: '$0.00' },
    { name: 'discount · annual', amount: '−$0.00' },
  ]
  return (
    <div className="uc-receipt relative w-[78%] max-w-[340px] bg-white text-core rounded-[4px] shadow-[0_30px_60px_-30px_rgba(26,21,28,0.45)] px-6 pt-5 pb-6 font-mono text-[0.65rem] leading-relaxed">
      {/* header */}
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-display font-semibold tracking-tight text-[0.85rem]">atara · invoice</span>
        <span className="opacity-50 text-[0.6rem]">inv_2026-05-118</span>
      </div>
      <div className="flex items-baseline justify-between opacity-60 mb-3 text-[0.6rem]">
        <span>cursor.com</span>
        <span>2026-05-18 · 03:47</span>
      </div>
      <div className="border-t border-dashed border-core/30 mb-2" />
      {lines.map((l) => (
        <div key={l.name} className="flex items-baseline justify-between py-0.5">
          <span className="opacity-80 truncate">{l.name}</span>
          <span className="tabular-nums">{l.amount}</span>
        </div>
      ))}
      <div className="border-t border-dashed border-core/30 mt-2 mb-2.5" />
      <div className="flex items-baseline justify-between font-semibold text-[0.95rem] font-display tracking-tight">
        <span>total</span>
        <span className="tabular-nums">$240.00</span>
      </div>
      <div className="flex items-baseline justify-between mt-3 opacity-65 text-[0.55rem]">
        <span>trace_id</span>
        <span>t_8c3f91a</span>
      </div>

      {/* paid stamp */}
      <div
        className="uc-stamp absolute bottom-5 right-4 px-2.5 py-1 border-2 rounded font-display font-bold tracking-[0.18em] text-[0.65rem]"
        style={{ color: accent, borderColor: accent, transform: 'rotate(-8deg)' }}
      >
        paid
      </div>
    </div>
  )
}

function BrandRow({ slugs }: { slugs: string[] }) {
  return (
    <div className="uc-brand-row absolute left-6 right-6 bottom-6 flex items-center justify-center gap-2.5">
      {slugs.map((slug, i) => (
        <div
          key={slug}
          className="uc-brand-chip w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-[0_6px_18px_-12px_rgba(26,21,28,0.4)] border border-core/8"
          style={{ transitionDelay: `${i * 40}ms` }}
          aria-hidden
        >
          <img
            src={`https://api.iconify.design/${slug}.svg?color=%231A151C`}
            alt=""
            className="w-4 h-4 opacity-85"
          />
        </div>
      ))}
    </div>
  )
}

function ApiStatement({ accent }: { accent: string }) {
  // weekly API usage statement w/ tiny sparkline
  const rows = [
    { name: 'gpt-4o-mini · 1.2M tok', amount: '$18.40' },
    { name: 'gpt-4o · 240k tok',      amount: '$24.10' },
    { name: 'embeddings · 3.1M tok',  amount: '$7.50' },
  ]
  const spark = '2,18 12,14 22,16 32,10 42,12 52,6 62,9 72,4'
  return (
    <div className="uc-receipt relative w-[78%] max-w-[340px] bg-white text-core rounded-[4px] shadow-[0_30px_60px_-30px_rgba(26,21,28,0.45)] px-6 pt-5 pb-6 font-mono text-[0.65rem] leading-relaxed">
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-display font-semibold tracking-tight text-[0.85rem]">atara · top-up</span>
        <span className="opacity-50 text-[0.6rem]">tx_2026-05-204</span>
      </div>
      <div className="flex items-baseline justify-between opacity-60 mb-3 text-[0.6rem]">
        <span>openai · api</span>
        <span>2026-05-19 · 02:14</span>
      </div>
      <div className="border-t border-dashed border-core/30 mb-2" />
      <div className="flex items-baseline justify-between py-0.5">
        <span className="opacity-80">this week · usage</span>
        <svg viewBox="0 0 76 22" className="w-16 h-4" aria-hidden>
          <polyline points={spark} fill="none" stroke={accent} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      {rows.map((r) => (
        <div key={r.name} className="flex items-baseline justify-between py-0.5">
          <span className="opacity-80 truncate">{r.name}</span>
          <span className="tabular-nums">{r.amount}</span>
        </div>
      ))}
      <div className="border-t border-dashed border-core/30 mt-2 mb-2.5" />
      <div className="flex items-baseline justify-between font-semibold text-[0.95rem] font-display tracking-tight">
        <span>added</span>
        <span className="tabular-nums" style={{ color: accent }}>+$50.00</span>
      </div>
      <div className="flex items-baseline justify-between mt-3 opacity-65 text-[0.55rem]">
        <span>weekly cap · $500 · $450 left</span>
        <span>t_4f2c10b</span>
      </div>
    </div>
  )
}

function OrderCard({ accent }: { accent: string }) {
  // shopify-style order confirmation card — text-only, no thumb
  return (
    <div className="uc-receipt relative w-[82%] max-w-[360px] bg-white text-core rounded-[6px] shadow-[0_30px_60px_-30px_rgba(26,21,28,0.45)] overflow-hidden font-mono text-[0.65rem]">
      <div className="px-4 py-3 border-b border-core/10">
        <div className="flex items-baseline justify-between">
          <span className="font-display font-semibold tracking-tight text-[0.85rem]">otherland · order</span>
          <span className="opacity-50 text-[0.6rem]">ord_2026-05-3a7</span>
        </div>
        <div className="opacity-55 text-[0.55rem] mt-1">candle + small-batch wine bundle · qty 1</div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="opacity-55 text-[0.55rem]">subtotal</span>
          <span className="font-display font-semibold text-[0.95rem] tabular-nums">$74.00</span>
        </div>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-y-1.5 gap-x-3 text-[0.6rem]">
        <div className="opacity-55">ship to</div>
        <div className="text-right tabular-nums">Brooklyn, NY</div>
        <div className="opacity-55">arrives</div>
        <div className="text-right tabular-nums">thu · may 22</div>
        <div className="opacity-55">routed</div>
        <div className="text-right">crossmint · usdc</div>
      </div>
      <div className="px-4 py-3 border-t border-dashed border-core/30 flex items-center justify-between">
        <span className="opacity-55 text-[0.55rem] tabular-nums">t_a07e3c9</span>
        <span
          className="uc-stamp px-2 py-0.5 border rounded font-display font-bold tracking-[0.18em] text-[0.6rem]"
          style={{ color: accent, borderColor: accent }}
        >
          pending
        </span>
      </div>
    </div>
  )
}

function ShippingLabel({ accent }: { accent: string }) {
  // amazon-style shipping label
  return (
    <div className="uc-receipt relative w-[82%] max-w-[380px] bg-white text-core rounded-[4px] shadow-[0_30px_60px_-30px_rgba(26,21,28,0.45)] overflow-hidden font-mono text-[0.6rem]">
      <div className="px-4 py-2 flex items-baseline justify-between border-b border-dashed border-core/30">
        <span className="font-display font-semibold tracking-tight text-[0.8rem]">amazon · shipment</span>
        <span className="opacity-55 text-[0.55rem]">prime · ground</span>
      </div>
      <div className="px-4 py-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 items-start">
        <div>
          <div className="opacity-55 text-[0.5rem] tracking-superwide">ship to</div>
          <div className="font-display text-[0.85rem] leading-tight mt-1">SF Office · Ops</div>
          <div className="opacity-75 text-[0.6rem] mt-0.5">501 Sansome St · Floor 6</div>
          <div className="opacity-75 text-[0.6rem]">San Francisco, CA 94111</div>
        </div>
        <div className="text-right">
          <div className="opacity-55 text-[0.5rem] tracking-superwide">amount</div>
          <div className="font-display font-semibold text-[1.05rem] tabular-nums mt-0.5">$199.98</div>
          <div className="opacity-55 text-[0.55rem] mt-0.5">2 × MX Master 3S</div>
        </div>
      </div>
      <div className="px-4 pb-3 pt-1">
        <div className="flex items-end gap-px h-9">
          {Array.from({ length: 56 }).map((_, i) => (
            <span key={i} className="block bg-core" style={{ width: (i * 11) % 4 === 0 ? 2 : 1, height: ((i * 7) % 5) > 3 ? '72%' : '100%' }} />
          ))}
        </div>
        <div className="flex items-baseline justify-between mt-1.5">
          <span className="opacity-55 text-[0.55rem] tabular-nums">tba 2891 3047 18</span>
          <span
            className="uc-stamp px-2 py-0.5 border rounded font-display font-bold tracking-[0.18em] text-[0.6rem]"
            style={{ color: accent, borderColor: accent }}
          >
            captured
          </span>
        </div>
      </div>
    </div>
  )
}

function ProductIcon({ kind, accent }: { kind: ProductKind; accent: string }) {
  const stroke = '#1A151C'
  const sw = 1.4
  switch (kind) {
    case 'candle':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          {/* jar candle: glass cup with wax inside and a flame on top */}
          <rect x="12" y="16" width="16" height="20" rx="2" fill="#FFFFFF" />
          <path d="M 14 21 L 26 21" />
          <ellipse cx="20" cy="16" rx="8" ry="1.6" fill="#FFFFFF" />
          <path d="M 20 14 L 20 11" />
          <path d="M 20 11 C 17.5 9 17.5 6 20 4 C 22.5 6 22.5 9 20 11 Z" fill={accent} stroke="none" />
          <path d="M 20 11 C 17.5 9 17.5 6 20 4 C 22.5 6 22.5 9 20 11 Z" />
        </svg>
      )
    case 'wine':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="17" y="6" width="6" height="6" fill="#FFFFFF" />
          <path d="M 17 12 L 16 18 C 16 22 16 30 16 32 L 24 32 C 24 30 24 22 24 18 L 23 12 Z" fill="#FFFFFF" />
          <rect x="17" y="20" width="7" height="6" fill={accent} stroke="none" opacity="0.85" />
        </svg>
      )
    case 'mug':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 11 14 L 11 28 C 11 30 13 32 15 32 L 23 32 C 25 32 27 30 27 28 L 27 14 Z" fill="#FFFFFF" />
          <path d="M 27 18 C 31 18 32 20 32 22 C 32 24 31 26 27 26" />
          <path d="M 14 10 C 14 8 16 9 16 6" />
          <path d="M 19 10 C 19 8 21 9 21 6" />
        </svg>
      )
    case 'plant':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 20 22 C 14 20 12 14 14 10 C 18 11 21 16 20 22 Z" fill={accent} fillOpacity="0.55" />
          <path d="M 20 22 C 26 20 28 14 26 10 C 22 11 19 16 20 22 Z" fill={accent} fillOpacity="0.85" />
          <path d="M 20 22 L 20 32" />
          <path d="M 13 32 L 27 32 L 25 36 L 15 36 Z" fill="#FFFFFF" />
        </svg>
      )
    case 'tee':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 12 10 L 16 8 C 17 10 23 10 24 8 L 28 10 L 32 14 L 28 18 L 28 32 L 12 32 L 12 18 L 8 14 Z" fill="#FFFFFF" />
        </svg>
      )
    case 'sneaker':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          {/* low-top side profile */}
          <path d="M 6 28 C 6 24 9 22 12 22 L 14 20 L 17 17 L 21 17 L 21 21 L 26 22 C 30 22.5 33 25 34 28 L 6 28 Z" fill="#FFFFFF" />
          <path d="M 6 28 L 34 28 L 34 31 C 34 32 33 33 32 33 L 8 33 C 7 33 6 32 6 31 Z" fill={accent} fillOpacity="0.85" stroke="none" />
          <path d="M 6 28 L 34 28 L 34 31 C 34 32 33 33 32 33 L 8 33 C 7 33 6 32 6 31 Z" />
          <path d="M 18 18 L 21 21" />
          <path d="M 16 20 L 19 23" />
          <path d="M 14 22 L 17 25" />
          <path d="M 9 30 L 31 30" stroke="#FFFFFF" strokeWidth="1" />
        </svg>
      )
    case 'box':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 8 14 L 20 8 L 32 14 L 32 30 L 20 36 L 8 30 Z" fill="#FFFFFF" />
          <path d="M 8 14 L 20 20 L 32 14 M 20 20 L 20 36" />
          <path d="M 14 11 L 26 17" stroke={accent} strokeWidth="2" />
        </svg>
      )
    case 'headphones':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 8 24 C 8 14 14 8 20 8 C 26 8 32 14 32 24" />
          <rect x="6" y="22" width="6" height="10" rx="2" fill="#FFFFFF" />
          <rect x="28" y="22" width="6" height="10" rx="2" fill="#FFFFFF" />
        </svg>
      )
    case 'mouse':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 14 8 C 10 8 8 12 8 18 L 8 28 C 8 32 12 36 16 36 L 24 36 C 28 36 32 32 32 28 L 32 18 C 32 12 30 8 26 8 Z" fill="#FFFFFF" />
          <path d="M 20 8 L 20 20" />
          <rect x="18.5" y="11" width="3" height="6" rx="1.5" fill={accent} stroke="none" />
        </svg>
      )
    case 'book':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 8 8 L 20 10 L 32 8 L 32 32 L 20 34 L 8 32 Z" fill="#FFFFFF" />
          <path d="M 20 10 L 20 34" />
          <path d="M 12 14 L 17 15 M 12 18 L 17 19" />
        </svg>
      )
    case 'batteries':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="10" y="14" width="8" height="22" rx="1.5" fill="#FFFFFF" />
          <rect x="12" y="11" width="4" height="3" fill="#FFFFFF" />
          <rect x="22" y="14" width="8" height="22" rx="1.5" fill="#FFFFFF" />
          <rect x="24" y="11" width="4" height="3" fill="#FFFFFF" />
          <path d="M 14 28 L 14 32 M 26 28 L 26 32" stroke={accent} strokeWidth="2" />
        </svg>
      )
    case 'plane':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          {/* top-down airliner */}
          <path d="M 20 4 C 18 4 17 6 17 10 L 17 16 L 6 22 L 6 25 L 17 23 L 17 30 L 13 33 L 13 35 L 20 33.5 L 27 35 L 27 33 L 23 30 L 23 23 L 34 25 L 34 22 L 23 16 L 23 10 C 23 6 22 4 20 4 Z" fill="#FFFFFF" />
          <path d="M 20 4 L 20 33" stroke={accent} strokeWidth="1" opacity="0.6" />
        </svg>
      )
    case 'hotel':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          {/* building: rectangle with rows of windows + door + roof sign */}
          <path d="M 8 8 L 32 8 L 32 36 L 8 36 Z" fill="#FFFFFF" />
          <rect x="11" y="13" width="4" height="3" fill={accent} fillOpacity="0.7" stroke="none" />
          <rect x="18" y="13" width="4" height="3" fill={accent} fillOpacity="0.7" stroke="none" />
          <rect x="25" y="13" width="4" height="3" fill={accent} fillOpacity="0.7" stroke="none" />
          <rect x="11" y="19" width="4" height="3" fill={accent} fillOpacity="0.7" stroke="none" />
          <rect x="18" y="19" width="4" height="3" fill={accent} fillOpacity="0.7" stroke="none" />
          <rect x="25" y="19" width="4" height="3" fill={accent} fillOpacity="0.7" stroke="none" />
          <rect x="11" y="25" width="4" height="3" fill={accent} fillOpacity="0.7" stroke="none" />
          <rect x="25" y="25" width="4" height="3" fill={accent} fillOpacity="0.7" stroke="none" />
          <path d="M 17 36 L 17 28 L 23 28 L 23 36" />
          <path d="M 6 8 L 34 8 L 32 4 L 8 4 Z" fill="#FFFFFF" />
        </svg>
      )
    case 'taxi':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 6 28 L 6 22 L 11 16 L 29 16 L 34 22 L 34 28 L 30 28 L 30 30 L 26 30 L 26 28 L 14 28 L 14 30 L 10 30 L 10 28 Z" fill={accent} fillOpacity="0.85" />
          <path d="M 11 22 L 29 22" />
          <circle cx="13" cy="28" r="2.2" fill="#FFFFFF" />
          <circle cx="27" cy="28" r="2.2" fill="#FFFFFF" />
          <rect x="16" y="10" width="8" height="3" fill="#FFFFFF" />
        </svg>
      )
    case 'train':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 10 8 L 30 8 C 32 8 34 10 34 12 L 34 26 C 34 28 32 30 30 30 L 10 30 C 8 30 6 28 6 26 L 6 12 C 6 10 8 8 10 8 Z" fill="#FFFFFF" />
          <path d="M 6 18 L 34 18" />
          <rect x="10" y="11" width="8" height="5" fill={accent} fillOpacity="0.6" stroke="none" />
          <rect x="22" y="11" width="8" height="5" fill={accent} fillOpacity="0.6" stroke="none" />
          <circle cx="12" cy="24" r="1.5" fill="#1A151C" stroke="none" />
          <circle cx="28" cy="24" r="1.5" fill="#1A151C" stroke="none" />
          <path d="M 12 32 L 9 36 M 28 32 L 31 36" />
        </svg>
      )
    case 'suitcase':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="14" width="24" height="20" rx="2" fill="#FFFFFF" />
          <path d="M 15 14 L 15 10 L 25 10 L 25 14" />
          <path d="M 8 22 L 32 22" stroke={accent} strokeWidth="2" />
        </svg>
      )
    case 'pin':
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 20 6 C 14 6 10 10 10 16 C 10 22 20 34 20 34 C 20 34 30 22 30 16 C 30 10 26 6 20 6 Z" fill="#FFFFFF" />
          <circle cx="20" cy="16" r="3.5" fill={accent} stroke="none" />
        </svg>
      )
  }
}

function ProductRow({ kinds, accent }: { kinds: ProductKind[]; accent: string }) {
  return (
    <div className="uc-brand-row absolute left-6 right-6 bottom-6 flex items-center justify-between gap-3">
      {kinds.map((kind, i) => (
        <div
          key={`${kind}-${i}`}
          className="uc-brand-chip flex items-center justify-center flex-1"
          style={{ transitionDelay: `${i * 40}ms` }}
          aria-hidden
        >
          <div className="w-12 h-12">
            <ProductIcon kind={kind} accent={accent} />
          </div>
        </div>
      ))}
    </div>
  )
}

function BoardingPass({ accent, panelBg }: { accent: string; panelBg: string }) {
  // horizontal ticket with perforated stub
  return (
    <div className="uc-receipt relative w-[88%] max-w-[440px] bg-white text-core rounded-[6px] shadow-[0_30px_60px_-30px_rgba(26,21,28,0.45)] font-mono text-[0.6rem] flex overflow-hidden">
      {/* main */}
      <div className="flex-1 px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="font-display font-semibold tracking-tight text-[0.8rem]">united · ua1234</span>
          <span className="opacity-55 text-[0.55rem]">boarding pass</span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="opacity-55 text-[0.55rem] tracking-superwide">from</div>
            <div className="font-display font-semibold text-[1.6rem] leading-none tracking-tight">SFO</div>
          </div>
          <div className="flex-1 flex items-center mb-1">
            <span className="h-px flex-1" style={{ backgroundColor: accent, opacity: 0.6 }} />
            <span className="px-1.5 text-[0.7rem]" style={{ color: accent }}>✈</span>
            <span className="h-px flex-1" style={{ backgroundColor: accent, opacity: 0.6 }} />
          </div>
          <div className="text-right">
            <div className="opacity-55 text-[0.55rem] tracking-superwide">to</div>
            <div className="font-display font-semibold text-[1.6rem] leading-none tracking-tight">JFK</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 text-[0.55rem]">
          <div>
            <div className="opacity-55 tracking-superwide">depart</div>
            <div className="tabular-nums mt-0.5">fri · 11:45p</div>
          </div>
          <div>
            <div className="opacity-55 tracking-superwide">arrive</div>
            <div className="tabular-nums mt-0.5">sat · 7:32a</div>
          </div>
          <div>
            <div className="opacity-55 tracking-superwide">seat</div>
            <div className="tabular-nums mt-0.5">14C aisle</div>
          </div>
          <div>
            <div className="opacity-55 tracking-superwide">gate</div>
            <div className="tabular-nums mt-0.5">b07</div>
          </div>
        </div>
      </div>

      {/* perforation */}
      <div className="relative w-px" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(26,21,28,0.3) 0 4px, transparent 4px 8px)' }}>
        <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full" style={{ backgroundColor: panelBg }} />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full" style={{ backgroundColor: panelBg }} />
      </div>

      {/* stub */}
      <div className="w-[34%] px-3 py-4 flex flex-col items-center justify-center gap-2">
        <div className="opacity-55 text-[0.5rem] tracking-superwide">total</div>
        <div className="font-display font-semibold text-[1.1rem] tracking-tight leading-none">$312.40</div>
        {/* barcode */}
        <div className="flex items-end gap-px mt-2 h-7">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className="block w-px h-full bg-core" style={{ opacity: 0.85, width: (i * 7) % 4 === 0 ? 2 : 1, height: ((i * 13) % 6) > 4 ? '70%' : '100%' }} />
          ))}
        </div>
        <div className="opacity-55 text-[0.5rem] tracking-superwide tabular-nums">t_b91d04f</div>
      </div>
    </div>
  )
}

function TypoPanel({ c, active }: { c: Case; active: boolean }) {
  const hasReceipt = !!c.panel.receipt
  return (
    <div
      className="uc-typo absolute inset-0 transition-opacity duration-700 ease-out"
      style={{ opacity: active ? 1 : 0, backgroundColor: c.art.tint }}
      aria-hidden={!active}
    >
      <svg
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          <pattern id={`uc-grid-${c.n}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1A151C" strokeWidth="0.4" opacity="0.06" />
          </pattern>
        </defs>
        <rect width="500" height="500" fill={`url(#uc-grid-${c.n})`} />
      </svg>

      {/* receipt slot — center-stage; reserve bottom space for brand/product row */}
      {hasReceipt && (
        <div
          className={`uc-typo-receipt absolute inset-x-0 top-0 ${c.panel.brands || c.panel.products ? 'bottom-24' : 'bottom-0'} flex items-center justify-center px-6`}
        >
          {c.panel.receipt === 'saas-invoice'   && <SaaSInvoice accent={c.art.glow} />}
          {c.panel.receipt === 'api-statement'  && <ApiStatement accent={c.art.glow} />}
          {c.panel.receipt === 'order-card'     && <OrderCard accent={c.art.glow} />}
          {c.panel.receipt === 'boarding-pass'  && <BoardingPass accent={c.art.glow} panelBg={c.art.tint} />}
          {c.panel.receipt === 'shipping-label' && <ShippingLabel accent={c.art.glow} />}
        </div>
      )}

      {/* brand row — bottom strip */}
      {c.panel.brands && <BrandRow slugs={c.panel.brands} />}
      {c.panel.products && <ProductRow kinds={c.panel.products} accent={c.art.glow} />}

      {/* fallback content card — only when no receipt */}
      {!hasReceipt && (
        <>
          <div className="absolute top-7 left-8 font-mono text-[0.6rem] tracking-superwide text-core/55">
            {c.panel.brand}
          </div>
          <div
            className="uc-typo-numeral absolute font-display font-semibold leading-none select-none pointer-events-none text-core/[0.07]"
            style={{
              fontSize: 'clamp(14rem, 26vw, 24rem)',
              letterSpacing: '-0.07em',
              left: '-1rem',
              bottom: '-3rem',
            }}
          >
            {c.n}
          </div>
          <div
            className="uc-typo-block absolute right-8 top-1/2 -translate-y-1/2 rounded-2xl"
            style={{
              width: '34%',
              height: '44%',
              backgroundColor: c.art.glow,
              opacity: 0.18,
            }}
          />
          <div className="uc-typo-card absolute left-8 right-8 bottom-8 text-core">
            <div className="font-mono text-[0.65rem] tracking-superwide text-core/70 mb-2">
              {c.panel.brand}
            </div>
            <div
              className="font-display font-semibold leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}
            >
              {c.panel.amount}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="h-px flex-1" style={{ backgroundColor: c.art.glow, opacity: 0.6 }} />
              <span className="font-mono text-[0.625rem] tracking-superwide text-core/70 shrink-0">
                {c.panel.meta}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


export default function UseCases() {
  const rowsRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const root = rowsRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('.uc-row'))

    const fadeIn = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            fadeIn.unobserve(e.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    )
    items.forEach((el) => fadeIn.observe(el))

    const tracker = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const idx = itemRefs.current.findIndex((el) => el === visible.target)
        if (idx >= 0) setActiveIdx(idx)
      },
      { threshold: [0.35, 0.6, 0.85], rootMargin: '-30% 0px -30% 0px' },
    )
    itemRefs.current.forEach((el) => el && tracker.observe(el))

    return () => {
      fadeIn.disconnect()
      tracker.disconnect()
    }
  }, [])

  return (
    <section id="use-cases" className="py-24 relative">
      <div className="crosshair h top-0 left-0 -translate-y-1/2"></div>
      <div className="text-[0.6rem] tracking-widest text-muted mb-6">I. Use cases</div>
      <div className="flex flex-wrap items-end justify-between gap-6 mb-4">
        <h2 className="font-display text-4xl md:text-[3.4rem] font-semibold text-core max-w-3xl leading-[1.05] tracking-tighter">
          Agentic spending, in motion.
        </h2>
        <button
          onClick={() => { window.location.hash = '#/guide' }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium text-sm tracking-wide shadow-md hover:opacity-90 transition-opacity shrink-0"
          style={{ backgroundColor: '#1A151C' }}
        >
          Try it now
          <span aria-hidden>→</span>
        </button>
      </div>
      <p className="text-[0.75rem] leading-relaxed tracking-widest text-main opacity-70 mb-16 max-w-2xl">
        Small payments settle on their own; bigger ones come back for sign-off.
      </p>

      <div ref={rowsRef} className="grid grid-cols-1 md:grid-cols-12 md:gap-14">
        {/* sticky panel column — desktop only */}
        <div className="hidden md:block md:col-span-6">
          <div className="sticky top-24">
            <div className="relative w-full aspect-[5/6] rounded-3xl overflow-hidden border border-core/10 shadow-[0_30px_70px_-50px_rgba(26,21,28,0.5)]">
              {cases.map((c, i) => (
                <TypoPanel key={c.n} c={c} active={i === activeIdx} />
              ))}
              {/* progress rail */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {cases.map((c, i) => (
                  <span
                    key={c.n}
                    className="block w-0.5 transition-all duration-500"
                    style={{
                      height: i === activeIdx ? 28 : 12,
                      backgroundColor: i === activeIdx ? '#1A151C' : 'rgba(26,21,28,0.22)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* scrolling cases column */}
        <div className="md:col-span-6 flex flex-col gap-24 md:gap-40">
          {cases.map((c, i) => (
            <div
              key={c.n}
              ref={(el) => { itemRefs.current[i] = el }}
              className="uc-row"
            >
              {/* inline panel — mobile only */}
              <div className="md:hidden relative w-full aspect-[5/6] rounded-3xl overflow-hidden border border-core/10 mb-8">
                <TypoPanel c={c} active />
              </div>

              <div className="font-mono text-[0.6rem] tracking-superwide text-muted mb-5">
                — case {c.n}
              </div>
              <h3 className="font-display text-[2rem] md:text-[2.7rem] font-semibold text-core leading-[1.05] mb-5 tracking-tighter">
                {c.title}
              </h3>
              <p className="text-[0.875rem] leading-loose text-main opacity-85 mb-7 max-w-md">
                {c.story}
              </p>
              <div className="flex flex-col gap-3 max-w-md">
                <Bubble side="user">{c.user}</Bubble>
                <Bubble side="ai">
                  <div>{c.reply}</div>
                  {c.bill && <BillCard bill={c.bill} />}
                </Bubble>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
