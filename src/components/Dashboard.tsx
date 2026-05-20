import { useState } from 'react'
import Overlay from './Overlay'
import { useToast } from './ToastProvider'

type Section = 'overview' | 'keys' | 'logs' | 'settings'
type Env = 'test' | 'live'

const account = {
  email: 'cto@ai-tutor.com',
  company: 'AI-Tutor Inc',
  tenant_id: 'tn_01JX7K2Z8A',
}

const wallets = {
  crossmint: {
    connected: true,
    balance: 124.5,
    address: '0xA1B2C3D4E5F60718293A4B5C6D7E8F9001020304',
    chain: 'base',
    explorer: 'https://basescan.org/address/',
  },
  tempo: {
    connected: true,
    balance: 338.2,
    address: '0xB7C9D2E3F4051628394A5B6C7D8E9F0011223344',
    chain: 'tempo',
    explorer: 'https://explorer.tempo.xyz/address/',
  },
}

// 30 days of spend (most recent last). amounts in USDC. count = tx count.
type Day = { iso: string; label: string; cm: number; tp: number; n: number }

const spendDays: Day[] = (() => {
  const out: Day[] = []
  const today = new Date(2026, 4, 19) // 2026-05-19, Mon
  const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const r1 = seed(i + 1)
    const r2 = seed(i * 3 + 11)
    const r3 = seed(i * 7 + 5)
    const isWeekend = d.getDay() === 0 || d.getDay() === 6
    const scale = isWeekend ? 0.35 : 1
    const cm = +(2 + r1 * 22 * scale).toFixed(2)
    const tp = +(3 + r2 * 26 * scale).toFixed(2)
    const n = Math.max(1, Math.round((cm + tp) * 0.45 + r3 * 4))
    out.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      label: `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`,
      cm,
      tp,
      n,
    })
  }
  return out
})()

const apiKeys = [
  {
    id: 'k_test',
    name: 'Default (test)',
    env: 'test' as Env,
    prefix: 'sk_test_4Hf2…aQ91',
    pub: 'pk_test_8Kd3…mN02',
    created: '2026-04-12',
    last_used: '2 min ago',
    status: 'active',
  },
  {
    id: 'k_live',
    name: 'Production',
    env: 'live' as Env,
    prefix: 'sk_live_9Bc7…xZ44',
    pub: 'pk_live_2Re5…fW88',
    created: '2026-05-02',
    last_used: '18 sec ago',
    status: 'active',
  },
]

type Log = {
  time: string
  method: 'GET' | 'POST' | 'DELETE'
  path: string
  status: number
  latency: number
  request_id: string
  key: string
  env: Env
}

const logs: Log[] = [
  { time: '14:32:08', method: 'POST', path: '/v1/transactions',                  status: 200, latency: 412, request_id: 'req_8a2f3c91', key: 'sk_live_…xZ44', env: 'live' },
  { time: '14:31:55', method: 'POST', path: '/v1/transactions',                  status: 200, latency: 388, request_id: 'req_7b1e4d12', key: 'sk_live_…xZ44', env: 'live' },
  { time: '14:31:40', method: 'GET',  path: '/v1/wallets/wlt_01JX…/balance',      status: 200, latency: 88,  request_id: 'req_6c0d5e03', key: 'sk_test_…aQ91', env: 'test' },
  { time: '14:30:22', method: 'POST', path: '/v1/wallets/wlt_01JX…/session-keys', status: 201, latency: 1124, request_id: 'req_5d9c6f14', key: 'sk_test_…aQ91', env: 'test' },
  { time: '14:29:11', method: 'POST', path: '/v1/onramp/orders',                  status: 200, latency: 642, request_id: 'req_4e8b7g25', key: 'sk_live_…xZ44', env: 'live' },
  { time: '14:28:47', method: 'POST', path: '/v1/transactions',                  status: 402, latency: 73,  request_id: 'req_3f7a8h36', key: 'sk_live_…xZ44', env: 'live' },
  { time: '14:28:02', method: 'POST', path: '/v1/transactions',                  status: 200, latency: 401, request_id: 'req_2g6z9i47', key: 'sk_live_…xZ44', env: 'live' },
  { time: '14:26:18', method: 'GET',  path: '/v1/wallets/wlt_01JX…',              status: 200, latency: 64,  request_id: 'req_1h5y0j58', key: 'sk_test_…aQ91', env: 'test' },
  { time: '14:24:55', method: 'POST', path: '/v1/wallets',                       status: 201, latency: 982, request_id: 'req_0i4x1k69', key: 'sk_test_…aQ91', env: 'test' },
  { time: '14:22:30', method: 'POST', path: '/v1/transactions',                  status: 200, latency: 376, request_id: 'req_9j3w2l70', key: 'sk_live_…xZ44', env: 'live' },
  { time: '14:20:14', method: 'POST', path: '/v1/transactions',                  status: 429, latency: 22,  request_id: 'req_8k2v3m81', key: 'sk_live_…xZ44', env: 'live' },
  { time: '14:18:02', method: 'GET',  path: '/v1/transactions',                  status: 200, latency: 132, request_id: 'req_7l1u4n92', key: 'sk_test_…aQ91', env: 'test' },
  { time: '14:15:48', method: 'POST', path: '/v1/transactions',                  status: 200, latency: 419, request_id: 'req_6m0t5o03', key: 'sk_live_…xZ44', env: 'live' },
  { time: '14:13:22', method: 'POST', path: '/v1/transactions',                  status: 500, latency: 2104, request_id: 'req_5n9s6p14', key: 'sk_live_…xZ44', env: 'live' },
  { time: '14:11:09', method: 'GET',  path: '/v1/wallets/wlt_01JX…/balance',      status: 200, latency: 91,  request_id: 'req_4o8r7q25', key: 'sk_test_…aQ91', env: 'test' },
]

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`
}

function StatusPill({ code }: { code: number }) {
  const ok = code >= 200 && code < 300
  const warn = code >= 400 && code < 500
  const err = code >= 500
  const bg = ok ? 'bg-[#3F7E4F]/12 text-[#3F7E4F]' : warn ? 'bg-[#C28A2C]/15 text-[#8a5e0e]' : err ? 'bg-[#B83C3C]/15 text-[#9c2929]' : 'bg-core/10 text-core/70'
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[0.65rem] tabular-nums ${bg}`}>
      {code}
    </span>
  )
}

function MethodPill({ m }: { m: Log['method'] }) {
  const color =
    m === 'POST' ? 'text-[#3C64B8]' :
    m === 'GET'  ? 'text-[#3F7E4F]' :
                   'text-[#9c2929]'
  return <span className={`font-mono text-[0.65rem] font-semibold tracking-tight ${color}`}>{m}</span>
}

function CopyText({ text, label }: { text: string; label?: string }) {
  const { notify } = useToast()
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); notify('Copied') }}
      className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] text-core/80 hover:text-core transition-colors group"
      title="copy"
    >
      <span>{label ?? text}</span>
      <svg viewBox="0 0 24 24" className="w-3 h-3 opacity-40 group-hover:opacity-80 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  )
}

function WalletCard({
  rail, balance, address, chain, explorer, accent,
}: {
  rail: 'Crossmint' | 'Tempo'
  balance: number
  address: string
  chain: string
  explorer: string
  accent: string
}) {
  return (
    <div className="relative rounded-2xl border border-core/15 bg-white/65 p-6 overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
      />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
          <span className="font-display text-[0.95rem] font-semibold text-core tracking-tight">{rail}</span>
        </div>
        <span className="font-mono text-[0.6rem] tracking-widest text-core/50">{chain}</span>
      </div>

      <div className="font-display text-[2.1rem] font-semibold text-core leading-none tracking-tight tabular-nums mb-1">
        ${balance.toFixed(2)}
      </div>
      <div className="font-mono text-[0.6rem] tracking-widest text-core/50 mb-5">usdc · available</div>

      <div className="pt-4 border-t border-core/10 flex items-center justify-between gap-2">
        <CopyText text={address} label={shortAddr(address)} />
        <a
          href={`${explorer}${address}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[0.6rem] tracking-widest text-core/50 hover:text-core transition-colors inline-flex items-center gap-1"
        >
          explorer <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  )
}

function ConnectCard({ rail, accent }: { rail: 'Crossmint' | 'Tempo'; accent: string }) {
  const { notify } = useToast()
  return (
    <button
      onClick={() => notify(`Connect ${rail} — coming soon`)}
      className="relative rounded-2xl border border-dashed border-core/25 bg-white/30 p-6 flex flex-col items-start justify-between gap-5 hover:border-core/55 hover:bg-white/45 transition-colors text-left"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent, opacity: 0.4 }} />
        <span className="font-display text-[0.95rem] font-medium text-core/70 tracking-tight">{rail}</span>
      </div>
      <div className="font-display text-[1.05rem] text-core/55">+ Connect {rail}</div>
      <span className="font-mono text-[0.6rem] tracking-widest text-core/40">not connected</span>
    </button>
  )
}

type Range = 7 | 14 | 30

function SpendChart() {
  const [range, setRange] = useState<Range>(7)
  const [hover, setHover] = useState<number | null>(null)
  const data = spendDays.slice(-range)
  const max = Math.max(...data.map((d) => d.cm + d.tp))
  const total = data.reduce((a, d) => a + d.cm + d.tp, 0)
  const txCount = data.reduce((a, d) => a + d.n, 0)
  const avg = total / data.length

  // prior period for delta
  const prior = spendDays.slice(-range * 2, -range)
  const priorTotal = prior.reduce((a, d) => a + d.cm + d.tp, 0)
  const delta = priorTotal > 0 ? ((total - priorTotal) / priorTotal) * 100 : 0

  // chart geometry
  const W = 760
  const H = 200
  const padL = 38
  const padR = 12
  const padT = 12
  const padB = 26
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const slot = innerW / data.length
  const barW = Math.max(3, Math.min(18, slot * 0.55))

  // y-axis ticks
  const ticks = (() => {
    const niceMax = Math.ceil(max / 10) * 10
    return [0, niceMax / 2, niceMax].map((v) => ({
      v,
      y: padT + innerH - (v / niceMax) * innerH,
    }))
  })()
  const niceMax = ticks[ticks.length - 1].v

  // x-axis labels: subsample for longer ranges
  const labelEvery = range === 7 ? 1 : range === 14 ? 2 : 5

  const ranges: Range[] = [7, 14, 30]

  return (
    <div className="rounded-2xl border border-core/15 bg-white/65 p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="font-display text-[0.95rem] font-semibold text-core tracking-tight">Spend</div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="font-display text-[1.9rem] font-semibold text-core leading-none tracking-tight tabular-nums">
              ${total.toFixed(2)}
            </span>
            <span className={`font-mono text-[0.7rem] tabular-nums ${delta >= 0 ? 'text-[#3F7E4F]' : 'text-[#9c2929]'}`}>
              {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
            </span>
            <span className="font-mono text-[0.62rem] tracking-widest text-core/45">
              · {txCount} tx · vs prior {range}d
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2.5">
          <div className="inline-flex rounded-full border border-core/15 bg-white/60 p-0.5">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => { setRange(r); setHover(null) }}
                className={`px-2.5 py-1 rounded-full font-mono text-[0.62rem] tracking-widest transition-colors ${
                  range === r ? 'bg-core text-white' : 'text-core/60 hover:text-core'
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 font-mono text-[0.58rem] tracking-widest text-core/55">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#3F7E4F' }} />
              crossmint
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#C28A2C' }} />
              tempo
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
          {/* gridlines */}
          {ticks.map((t) => (
            <g key={t.v}>
              <line
                x1={padL} x2={W - padR}
                y1={t.y} y2={t.y}
                stroke="rgba(26,21,28,0.08)"
                strokeWidth="1"
                strokeDasharray={t.v === 0 ? '0' : '2 4'}
              />
              <text
                x={padL - 8}
                y={t.y + 3}
                fontFamily="Space Mono, monospace"
                fontSize="8.5"
                fill="rgba(26,21,28,0.4)"
                textAnchor="end"
              >
                ${t.v}
              </text>
            </g>
          ))}

          {/* avg line */}
          <line
            x1={padL} x2={W - padR}
            y1={padT + innerH - (avg / niceMax) * innerH}
            y2={padT + innerH - (avg / niceMax) * innerH}
            stroke="rgba(60,100,184,0.5)"
            strokeWidth="1"
            strokeDasharray="1 3"
          />
          <text
            x={W - padR}
            y={padT + innerH - (avg / niceMax) * innerH - 4}
            fontFamily="Space Mono, monospace"
            fontSize="7.5"
            fill="rgba(60,100,184,0.7)"
            textAnchor="end"
            letterSpacing="0.1em"
          >
            avg ${avg.toFixed(0)}
          </text>

          {/* bars */}
          {data.map((d, i) => {
            const cx = padL + slot * (i + 0.5)
            const totalH = ((d.cm + d.tp) / niceMax) * innerH
            const cmH = (d.cm / niceMax) * innerH
            const tpH = (d.tp / niceMax) * innerH
            const x = cx - barW / 2
            const yTop = padT + innerH - totalH
            const yCmStart = padT + innerH - cmH
            const isHovered = hover === i
            return (
              <g
                key={d.iso}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* widened hover hit area */}
                <rect
                  x={cx - slot / 2}
                  y={padT}
                  width={slot}
                  height={innerH}
                  fill="transparent"
                />
                {/* tempo segment (top) */}
                <rect
                  x={x}
                  y={yTop}
                  width={barW}
                  height={tpH}
                  fill="#C28A2C"
                  opacity={isHovered ? 1 : 0.88}
                  rx="1"
                />
                {/* crossmint segment (bottom) */}
                <rect
                  x={x}
                  y={yCmStart}
                  width={barW}
                  height={cmH}
                  fill="#3F7E4F"
                  opacity={isHovered ? 1 : 0.88}
                  rx="1"
                />
                {/* tick / label below */}
                {(i % labelEvery === 0 || i === data.length - 1) && (
                  <text
                    x={cx}
                    y={H - 8}
                    fontFamily="Space Mono, monospace"
                    fontSize="8"
                    fill="rgba(26,21,28,0.5)"
                    textAnchor="middle"
                    letterSpacing="0.06em"
                  >
                    {d.label}
                  </text>
                )}
                {/* baseline tick */}
                <line
                  x1={cx} x2={cx}
                  y1={padT + innerH}
                  y2={padT + innerH + 3}
                  stroke="rgba(26,21,28,0.25)"
                  strokeWidth="1"
                />
              </g>
            )
          })}

          {/* baseline */}
          <line
            x1={padL} x2={W - padR}
            y1={padT + innerH} y2={padT + innerH}
            stroke="rgba(26,21,28,0.3)"
            strokeWidth="1"
          />
        </svg>

        {/* hover tooltip */}
        {hover !== null && (() => {
          const d = data[hover]
          const pct = ((hover + 0.5) / data.length) * 100
          const side = pct > 70 ? 'right' : 'left'
          return (
            <div
              className="pointer-events-none absolute top-1 z-10 rounded-lg border border-core/15 bg-white/95 backdrop-blur shadow-[0_12px_28px_-18px_rgba(26,21,28,0.5)] px-3.5 py-3 min-w-[160px]"
              style={side === 'left'
                ? { left: `calc(${pct}% + 12px)` }
                : { right: `calc(${100 - pct}% + 12px)` }
              }
            >
              <div className="font-mono text-[0.6rem] tracking-widest text-core/55 mb-2">{d.label} · {d.iso}</div>
              <div className="font-display text-[1.05rem] font-semibold text-core tabular-nums leading-none mb-3">
                ${(d.cm + d.tp).toFixed(2)}
              </div>
              <div className="space-y-1.5 font-mono text-[0.7rem] text-core/75 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#3F7E4F' }} />
                    crossmint
                  </span>
                  <span>${d.cm.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#C28A2C' }} />
                    tempo
                  </span>
                  <span>${d.tp.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1.5 mt-1.5 border-t border-core/10 text-core/55 text-[0.62rem] tracking-widest">
                  <span>tx count</span>
                  <span>{d.n}</span>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

function OverviewSection() {
  const both = wallets.crossmint.connected && wallets.tempo.connected
  const total = (wallets.crossmint.connected ? wallets.crossmint.balance : 0)
              + (wallets.tempo.connected ? wallets.tempo.balance : 0)

  return (
    <div className="space-y-7">
      {/* account header */}
      <div className="rounded-2xl border border-core/15 bg-white/55 px-6 py-5">
        <div className="font-mono text-[0.6rem] tracking-widest text-core/50 mb-1.5">connected account</div>
        <div className="font-display text-[1.15rem] font-medium text-core tracking-tight">{account.email}</div>
      </div>

      {/* balance */}
      <div className="rounded-2xl border border-core/15 bg-white/45 p-6">
        {both && (
          <div className="mb-6 pb-6 border-b border-core/10">
            <div className="font-mono text-[0.6rem] tracking-widest text-core/50 mb-2">total balance</div>
            <div className="font-display text-[3rem] md:text-[3.6rem] font-semibold text-core leading-none tracking-[-0.02em] tabular-nums">
              ${total.toFixed(2)}
            </div>
            <div className="font-mono text-[0.62rem] tracking-widest text-core/45 mt-2">
              usdc · across {both ? '2' : '1'} wallet{both ? 's' : ''}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets.crossmint.connected ? (
            <WalletCard
              rail="Crossmint"
              balance={wallets.crossmint.balance}
              address={wallets.crossmint.address}
              chain={wallets.crossmint.chain}
              explorer={wallets.crossmint.explorer}
              accent="#3F7E4F"
            />
          ) : (
            <ConnectCard rail="Crossmint" accent="#3F7E4F" />
          )}
          {wallets.tempo.connected ? (
            <WalletCard
              rail="Tempo"
              balance={wallets.tempo.balance}
              address={wallets.tempo.address}
              chain={wallets.tempo.chain}
              explorer={wallets.tempo.explorer}
              accent="#C28A2C"
            />
          ) : (
            <ConnectCard rail="Tempo" accent="#C28A2C" />
          )}
        </div>
      </div>

      {/* 7-day spend */}
      <SpendChart />
    </div>
  )
}

function KeysSection({ env }: { env: Env }) {
  const { notify } = useToast()
  const visible = apiKeys.filter((k) => k.env === env)
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-[1.4rem] font-semibold text-core tracking-tight leading-none">API keys</h2>
          <p className="text-[0.78rem] text-core/60 mt-2 max-w-lg leading-relaxed">
            Secret keys (<code className="font-mono text-core/80">sk_…</code>) authenticate your backend; publishable keys
            (<code className="font-mono text-core/80">pk_…</code>) are safe in the browser. Full secret is shown only once at creation.
          </p>
        </div>
        <button
          onClick={() => notify('Key creation — coming soon')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-[0.82rem] tracking-wide shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#1A151C' }}
        >
          Create key <span aria-hidden>+</span>
        </button>
      </div>

      <div className="rounded-2xl border border-core/15 bg-white/55 overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_auto] gap-4 px-5 py-3 border-b border-core/10 font-mono text-[0.6rem] tracking-widest text-core/55 bg-white/35">
          <span>name</span>
          <span>secret</span>
          <span>publishable</span>
          <span>created</span>
          <span>last used</span>
          <span></span>
        </div>
        {visible.map((k) => (
          <div
            key={k.id}
            className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_auto] gap-4 px-5 py-4 border-b border-core/8 last:border-b-0 items-center"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F7E4F]" />
              <span className="font-display text-[0.88rem] font-medium text-core">{k.name}</span>
            </div>
            <CopyText text={k.prefix} />
            <CopyText text={k.pub} />
            <span className="font-mono text-[0.72rem] text-core/65">{k.created}</span>
            <span className="font-mono text-[0.72rem] text-core/65">{k.last_used}</span>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => notify('Rotate — coming soon')} className="font-mono text-[0.65rem] tracking-widest text-core/60 hover:text-core transition-colors">
                rotate
              </button>
              <button onClick={() => notify('Revoke — coming soon')} className="font-mono text-[0.65rem] tracking-widest text-[#9c2929]/70 hover:text-[#9c2929] transition-colors">
                revoke
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="px-5 py-12 text-center font-mono text-[0.72rem] tracking-widest text-core/45">
            no keys in {env} yet
          </div>
        )}
      </div>
    </div>
  )
}

function LogsSection({ env }: { env: Env }) {
  const [open, setOpen] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const visible = logs
    .filter((l) => l.env === env)
    .filter((l) => !filter || l.path.includes(filter) || l.request_id.includes(filter))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[1.4rem] font-semibold text-core tracking-tight leading-none">Logs</h2>
          <p className="text-[0.78rem] text-core/60 mt-2 max-w-lg leading-relaxed">
            Every API request to <code className="font-mono text-core/80">api.atara.xyz</code>. Click a row to see the full request, response, and timing breakdown.
          </p>
        </div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="filter by path or request_id…"
          className="w-72 px-3 py-2 rounded-full border border-core/15 bg-white/65 font-mono text-[0.72rem] text-core placeholder:text-core/35 focus:outline-none focus:border-core/40"
        />
      </div>

      <div className="rounded-2xl border border-core/15 bg-white/55 overflow-hidden">
        <div className="grid grid-cols-[0.7fr_0.6fr_2.6fr_0.6fr_0.6fr_1fr_1fr] gap-3 px-5 py-3 border-b border-core/10 font-mono text-[0.6rem] tracking-widest text-core/55 bg-white/35">
          <span>time</span>
          <span>method</span>
          <span>endpoint</span>
          <span>status</span>
          <span>latency</span>
          <span>request_id</span>
          <span>key</span>
        </div>
        {visible.map((l) => {
          const expanded = open === l.request_id
          return (
            <div key={l.request_id} className="border-b border-core/8 last:border-b-0">
              <button
                onClick={() => setOpen(expanded ? null : l.request_id)}
                className="w-full grid grid-cols-[0.7fr_0.6fr_2.6fr_0.6fr_0.6fr_1fr_1fr] gap-3 px-5 py-3 items-center text-left hover:bg-white/35 transition-colors"
              >
                <span className="font-mono text-[0.7rem] text-core/65 tabular-nums">{l.time}</span>
                <MethodPill m={l.method} />
                <span className="font-mono text-[0.72rem] text-core truncate">{l.path}</span>
                <StatusPill code={l.status} />
                <span className="font-mono text-[0.7rem] text-core/65 tabular-nums">{l.latency}ms</span>
                <span className="font-mono text-[0.7rem] text-core/55 truncate">{l.request_id}</span>
                <span className="font-mono text-[0.7rem] text-core/55 truncate">{l.key}</span>
              </button>
              {expanded && (
                <div className="px-5 py-4 bg-[#1A151C] text-[#E8D5C4]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-[0.72rem] leading-relaxed">
                    <div>
                      <div className="text-[#8CB6E8] mb-1.5 text-[0.6rem] tracking-widest">request</div>
                      <pre className="whitespace-pre-wrap text-[#E8D5C4]/85">
{`${l.method} ${l.path}
Authorization: Bearer ${l.key.replace('…', '…<redacted>…')}
Content-Type: application/json

${l.method !== 'GET' ? `{
  "from":   "wlt_01JX7K2Z8A...",
  "to":     "merchant:openai",
  "amount": "0.05",
  "asset":  "USDC"
}` : '—'}`}
                      </pre>
                    </div>
                    <div>
                      <div className="text-[#8CB6E8] mb-1.5 text-[0.6rem] tracking-widest">response · {l.latency}ms</div>
                      <pre className="whitespace-pre-wrap text-[#E8D5C4]/85">
{l.status < 300 ? `{
  "id":     "tx_01J7K8P2…",
  "status": "pending",
  "hash":   "0xdeadbeef…",
  "rail":   "crossmint"
}` : l.status === 402 ? `{
  "error": "session_limit_exceeded",
  "limit": { "daily": "5 USDC", "used": "5.00" }
}` : l.status === 429 ? `{
  "error": "rate_limited",
  "retry_after": 12
}` : `{
  "error": "upstream_timeout",
  "rail":  "crossmint"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {visible.length === 0 && (
          <div className="px-5 py-12 text-center font-mono text-[0.72rem] tracking-widest text-core/45">
            no logs match
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-[1.4rem] font-semibold text-core tracking-tight leading-none">Settings</h2>
        <p className="text-[0.78rem] text-core/60 mt-2">Tenant configuration, webhooks, members.</p>
      </div>
      <div className="rounded-2xl border border-core/15 bg-white/55 p-6 font-mono text-[0.72rem] text-core/55">
        coming soon
      </div>
    </div>
  )
}

const nav: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'keys',     label: 'API Keys' },
  { id: 'logs',     label: 'Logs' },
  { id: 'settings', label: 'Settings' },
]

export default function Dashboard() {
  const [section, setSection] = useState<Section>('overview')
  const [env, setEnv] = useState<Env>('test')

  return (
    <div className="relative min-h-screen bg-peach text-core">
      <Overlay />

      <main className="relative z-10 pt-28 pb-24 px-6 md:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10 max-w-7xl mx-auto">
          {/* sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="font-mono text-[0.55rem] tracking-widest text-core/45 mb-3">dashboard</div>
            <nav className="flex lg:flex-col gap-1">
              {nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSection(n.id)}
                  className={`text-left px-3 py-2 rounded-lg text-[0.85rem] tracking-tight transition-colors ${
                    section === n.id
                      ? 'bg-core text-white font-medium'
                      : 'text-core/70 hover:text-core hover:bg-white/40'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 hidden lg:block">
              <div className="font-mono text-[0.55rem] tracking-widest text-core/45 mb-2">environment</div>
              <div className="inline-flex rounded-full border border-core/15 bg-white/55 p-0.5">
                {(['test', 'live'] as Env[]).map((e) => (
                  <button
                    key={e}
                    onClick={() => setEnv(e)}
                    className={`px-3 py-1 rounded-full font-mono text-[0.65rem] tracking-widest transition-colors ${
                      env === e ? 'bg-core text-white' : 'text-core/60 hover:text-core'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* body */}
          <div>
            {section === 'overview' && <OverviewSection />}
            {section === 'keys'     && <KeysSection env={env} />}
            {section === 'logs'     && <LogsSection env={env} />}
            {section === 'settings' && <SettingsSection />}
          </div>
        </div>
      </main>
    </div>
  )
}
