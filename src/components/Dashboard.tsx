import { useMemo, useState } from 'react'
import { useToast } from './ToastProvider'

type Section = 'overview' | 'wallets' | 'transactions' | 'sessions' | 'keys' | 'logs' | 'settings'
type Env = 'test' | 'live'
type WalletChain = 'base' | 'eth' | 'tempo'

const account = {
  email: 'cto@ai-tutor.com',
  company: 'AI-Tutor Inc',
  tenant_id: 'tn_01JX7K2Z8A',
}

const chainMeta: Record<WalletChain, { label: string; color: string }> = {
  base:  { label: 'Base',  color: '#3C64B8' },
  eth:   { label: 'Ethereum', color: '#6E7A8A' },
  tempo: { label: 'Tempo', color: '#C28A2C' },
}

type WalletRow = {
  id: string
  label: string
  agent: string
  chain: WalletChain
  balance: number
  address: string
  created: string
}

const walletRows: WalletRow[] = [
  { id: 'wlt_01JX7K2Z8A', label: 'Tutor — Primary', agent: 'tutor-prod',  chain: 'base',  balance: 124.5, address: '0xA1B2C3D4E5F60718293A4B5C6D7E8F9001020304', created: '2026-03-12' },
  { id: 'wlt_02NQ4R7P5B', label: 'Tutor — Treasury', agent: 'tutor-prod', chain: 'eth',   balance: 612.8, address: '0xB7C9D2E3F4051628394A5B6C7D8E9F0011223344', created: '2026-02-04' },
  { id: 'wlt_03MV8X1L9C', label: 'Research Agent',    agent: 'research-1', chain: 'tempo', balance: 338.2, address: '0xC9E1F23456788091A2B3C4D5E6F708091A2B3C4D', created: '2026-04-22' },
  { id: 'wlt_04ZK6H2T0D', label: 'Crawler Pool',      agent: 'crawler-fleet', chain: 'base', balance: 47.9, address: '0xD0123456789ABCDEF0123456789ABCDEF0123456', created: '2026-05-01' },
  { id: 'wlt_05PL9Q3W7E', label: 'Sandbox',           agent: 'tutor-dev',  chain: 'tempo', balance: 12.04, address: '0xE56789ABCDEF0123456789ABCDEF0123456789AB', created: '2026-05-14' },
]

type TxStatus = 'success' | 'pending' | 'failed'
type TxRow = {
  id: string
  time: string
  agent: string
  merchant: string
  amount: number
  chain: WalletChain
  status: TxStatus
  hash: string
}

const txRows: TxRow[] = [
  { id: 'tx_01J7K8P2', time: '14:32:08', agent: 'tutor-prod',     merchant: 'openai · gpt-4o',     amount: 0.05, chain: 'base',  status: 'success', hash: '0xdeadbeef1234abcd' },
  { id: 'tx_02L9N3R4', time: '14:31:55', agent: 'tutor-prod',     merchant: 'openai · gpt-4o',     amount: 0.05, chain: 'base',  status: 'success', hash: '0xfacefeed5678aabb' },
  { id: 'tx_03M0Q4S5', time: '14:30:11', agent: 'research-1',     merchant: 'anthropic · claude',  amount: 0.18, chain: 'tempo', status: 'success', hash: '0xab12cd34ef56aa11' },
  { id: 'tx_04N1R5T6', time: '14:28:47', agent: 'tutor-prod',     merchant: 'serper · search',     amount: 0.01, chain: 'base',  status: 'failed',  hash: '—' },
  { id: 'tx_05P2S6U7', time: '14:26:02', agent: 'crawler-fleet',  merchant: 'firecrawl · scrape',  amount: 0.02, chain: 'base',  status: 'success', hash: '0x55667788aabbccdd' },
  { id: 'tx_06Q3T7V8', time: '14:22:30', agent: 'research-1',     merchant: 'arxiv · pdf',         amount: 0.12, chain: 'tempo', status: 'success', hash: '0x44556677ddeeff00' },
  { id: 'tx_07R4U8W9', time: '14:20:14', agent: 'tutor-prod',     merchant: 'replicate · sdxl',    amount: 0.22, chain: 'eth',   status: 'pending', hash: '—' },
  { id: 'tx_08S5V9X0', time: '14:18:02', agent: 'tutor-dev',      merchant: 'elevenlabs · tts',    amount: 0.08, chain: 'tempo', status: 'success', hash: '0x99887766bbccddee' },
  { id: 'tx_09T6W0Y1', time: '14:15:48', agent: 'tutor-prod',     merchant: 'openai · whisper',    amount: 0.03, chain: 'base',  status: 'success', hash: '0x11aa22bb33cc44dd' },
  { id: 'tx_10U7X1Z2', time: '14:11:09', agent: 'crawler-fleet',  merchant: 'firecrawl · scrape',  amount: 0.02, chain: 'base',  status: 'success', hash: '0xeeddccbbaa998877' },
]

type SessionKeyStatus = 'active' | 'expired' | 'revoked'
type SessionKey = {
  id: string
  agent: string
  wallet: string
  chain: WalletChain
  limitDaily: number
  usedToday: number
  expires: string
  status: SessionKeyStatus
}

const sessionKeys: SessionKey[] = [
  { id: 'sk_8a2f3c91', agent: 'tutor-prod',    wallet: 'wlt_01JX7K2Z8A', chain: 'base',  limitDaily: 25, usedToday: 18.42, expires: '2026-05-23 18:00', status: 'active'  },
  { id: 'sk_7b1e4d12', agent: 'research-1',    wallet: 'wlt_03MV8X1L9C', chain: 'tempo', limitDaily: 50, usedToday: 12.08, expires: '2026-05-25 09:00', status: 'active'  },
  { id: 'sk_6c0d5e03', agent: 'crawler-fleet', wallet: 'wlt_04ZK6H2T0D', chain: 'base',  limitDaily: 10, usedToday: 9.71,  expires: '2026-05-22 23:00', status: 'active'  },
  { id: 'sk_5d9c6f14', agent: 'tutor-dev',     wallet: 'wlt_05PL9Q3W7E', chain: 'tempo', limitDaily: 5,  usedToday: 5.00,  expires: '2026-05-22 12:00', status: 'expired' },
  { id: 'sk_4e8b7g25', agent: 'tutor-prod',    wallet: 'wlt_02NQ4R7P5B', chain: 'eth',   limitDaily: 80, usedToday: 0,     expires: '2026-05-30 00:00', status: 'revoked' },
]

type Day = { iso: string; label: string; base: number; tp: number; n: number }

const spendDays: Day[] = (() => {
  const out: Day[] = []
  const today = new Date(2026, 4, 19)
  const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const r1 = seed(i + 1)
    const r2 = seed(i * 3 + 11)
    const r3 = seed(i * 7 + 5)
    const isWeekend = d.getDay() === 0 || d.getDay() === 6
    const scale = isWeekend ? 0.35 : 1
    const base = +(2 + r1 * 22 * scale).toFixed(2)
    const tp = +(3 + r2 * 26 * scale).toFixed(2)
    const n = Math.max(1, Math.round((base + tp) * 0.45 + r3 * 4))
    out.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      label: `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`,
      base,
      tp,
      n,
    })
  }
  return out
})()

const apiKeys = [
  { id: 'k_test', name: 'Default (test)', env: 'test' as Env, prefix: 'sk_test_4Hf2…aQ91', pub: 'pk_test_8Kd3…mN02', created: '2026-04-12', last_used: '2 min ago', status: 'active' },
  { id: 'k_live', name: 'Production',     env: 'live' as Env, prefix: 'sk_live_9Bc7…xZ44', pub: 'pk_live_2Re5…fW88', created: '2026-05-02', last_used: '18 sec ago', status: 'active' },
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

function ChainPill({ chain }: { chain: WalletChain }) {
  const m = chainMeta[chain]
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-wide text-core/70">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
      {m.label}
    </span>
  )
}

function TxStatusPill({ s }: { s: TxStatus }) {
  const map: Record<TxStatus, { fg: string; bg: string; label: string }> = {
    success: { fg: '#3F7E4F', bg: 'rgba(63,126,79,0.12)', label: 'success' },
    pending: { fg: '#8a5e0e', bg: 'rgba(194,138,44,0.15)', label: 'pending' },
    failed:  { fg: '#9c2929', bg: 'rgba(184,60,60,0.15)',  label: 'failed' },
  }
  const m = map[s]
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[0.65rem] tracking-wide" style={{ color: m.fg, backgroundColor: m.bg }}>
      {m.label}
    </span>
  )
}

function SessionKeyStatusPill({ s }: { s: SessionKeyStatus }) {
  const map: Record<SessionKeyStatus, { fg: string; bg: string }> = {
    active:  { fg: '#3F7E4F', bg: 'rgba(63,126,79,0.12)' },
    expired: { fg: '#8a5e0e', bg: 'rgba(194,138,44,0.15)' },
    revoked: { fg: '#9c2929', bg: 'rgba(184,60,60,0.15)'  },
  }
  const m = map[s]
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[0.65rem] tracking-wide" style={{ color: m.fg, backgroundColor: m.bg }}>
      {s}
    </span>
  )
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
  const color = m === 'POST' ? 'text-[#3C64B8]' : m === 'GET' ? 'text-[#3F7E4F]' : 'text-[#9c2929]'
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

type Range = 7 | 14 | 30

function SpendChart() {
  const [range, setRange] = useState<Range>(7)
  const [hover, setHover] = useState<number | null>(null)
  const data = spendDays.slice(-range)
  const max = Math.max(...data.map((d) => d.base + d.tp))
  const total = data.reduce((a, d) => a + d.base + d.tp, 0)
  const txCount = data.reduce((a, d) => a + d.n, 0)
  const avg = total / data.length

  const prior = spendDays.slice(-range * 2, -range)
  const priorTotal = prior.reduce((a, d) => a + d.base + d.tp, 0)
  const delta = priorTotal > 0 ? ((total - priorTotal) / priorTotal) * 100 : 0

  const W = 760, H = 200, padL = 38, padR = 12, padT = 12, padB = 26
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const slot = innerW / data.length
  const barW = Math.max(3, Math.min(18, slot * 0.55))

  const ticks = (() => {
    const niceMax = Math.ceil(max / 10) * 10
    return [0, niceMax / 2, niceMax].map((v) => ({ v, y: padT + innerH - (v / niceMax) * innerH }))
  })()
  const niceMax = ticks[ticks.length - 1].v
  const labelEvery = range === 7 ? 1 : range === 14 ? 2 : 5
  const ranges: Range[] = [7, 14, 30]

  return (
    <div className="rounded-2xl border border-core/12 bg-white/55 p-6">
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
            <span className="font-mono text-[0.62rem] tracking-wide text-core/45">
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
                className={`px-2.5 py-1 rounded-full font-mono text-[0.62rem] tracking-wide transition-colors ${
                  range === r ? 'bg-core text-white' : 'text-core/60 hover:text-core'
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 font-mono text-[0.58rem] tracking-wide text-core/55">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#3C64B8' }} />
              base
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
          {ticks.map((t) => (
            <g key={t.v}>
              <line x1={padL} x2={W - padR} y1={t.y} y2={t.y} stroke="rgba(26,21,28,0.08)" strokeWidth="1" strokeDasharray={t.v === 0 ? '0' : '2 4'} />
              <text x={padL - 8} y={t.y + 3} fontFamily="Space Mono, monospace" fontSize="8.5" fill="rgba(26,21,28,0.4)" textAnchor="end">${t.v}</text>
            </g>
          ))}

          <line x1={padL} x2={W - padR} y1={padT + innerH - (avg / niceMax) * innerH} y2={padT + innerH - (avg / niceMax) * innerH} stroke="rgba(60,100,184,0.5)" strokeWidth="1" strokeDasharray="1 3" />
          <text x={W - padR} y={padT + innerH - (avg / niceMax) * innerH - 4} fontFamily="Space Mono, monospace" fontSize="7.5" fill="rgba(60,100,184,0.7)" textAnchor="end" letterSpacing="0.1em">avg ${avg.toFixed(0)}</text>

          {data.map((d, i) => {
            const cx = padL + slot * (i + 0.5)
            const totalH = ((d.base + d.tp) / niceMax) * innerH
            const baseH = (d.base / niceMax) * innerH
            const tpH = (d.tp / niceMax) * innerH
            const x = cx - barW / 2
            const yTop = padT + innerH - totalH
            const yBaseStart = padT + innerH - baseH
            const isHovered = hover === i
            return (
              <g key={d.iso} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
                <rect x={cx - slot / 2} y={padT} width={slot} height={innerH} fill="transparent" />
                <rect x={x} y={yTop} width={barW} height={tpH} fill="#C28A2C" opacity={isHovered ? 1 : 0.88} rx="1" />
                <rect x={x} y={yBaseStart} width={barW} height={baseH} fill="#3C64B8" opacity={isHovered ? 1 : 0.88} rx="1" />
                {(i % labelEvery === 0 || i === data.length - 1) && (
                  <text x={cx} y={H - 8} fontFamily="Space Mono, monospace" fontSize="8" fill="rgba(26,21,28,0.5)" textAnchor="middle" letterSpacing="0.06em">{d.label}</text>
                )}
                <line x1={cx} x2={cx} y1={padT + innerH} y2={padT + innerH + 3} stroke="rgba(26,21,28,0.25)" strokeWidth="1" />
              </g>
            )
          })}

          <line x1={padL} x2={W - padR} y1={padT + innerH} y2={padT + innerH} stroke="rgba(26,21,28,0.3)" strokeWidth="1" />
        </svg>

        {hover !== null && (() => {
          const d = data[hover]
          const pct = ((hover + 0.5) / data.length) * 100
          const side = pct > 70 ? 'right' : 'left'
          return (
            <div
              className="pointer-events-none absolute top-1 z-10 rounded-lg border border-core/15 bg-white/95 backdrop-blur shadow-[0_12px_28px_-18px_rgba(26,21,28,0.5)] px-3.5 py-3 min-w-[160px]"
              style={side === 'left' ? { left: `calc(${pct}% + 12px)` } : { right: `calc(${100 - pct}% + 12px)` }}
            >
              <div className="font-mono text-[0.6rem] tracking-wide text-core/55 mb-2">{d.label} · {d.iso}</div>
              <div className="font-display text-[1.05rem] font-semibold text-core tabular-nums leading-none mb-3">${(d.base + d.tp).toFixed(2)}</div>
              <div className="space-y-1.5 font-mono text-[0.7rem] text-core/75 tabular-nums">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#3C64B8' }} />base</span>
                  <span>${d.base.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#C28A2C' }} />tempo</span>
                  <span>${d.tp.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1.5 mt-1.5 border-t border-core/10 text-core/55 text-[0.62rem] tracking-wide">
                  <span>tx count</span><span>{d.n}</span>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

function SectionHeader({ title, sub, action }: { title: string; sub: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7">
      <div>
        <h2 className="font-display text-[1.55rem] font-semibold text-core tracking-tight leading-none">{title}</h2>
        <p className="text-[0.78rem] text-core/60 mt-2 max-w-xl leading-relaxed">{sub}</p>
      </div>
      {action}
    </div>
  )
}

function OverviewSection() {
  const { notify } = useToast()
  const total = walletRows.reduce((a, w) => a + w.balance, 0)
  const byChain = (['base', 'eth', 'tempo'] as WalletChain[]).map((c) => {
    const rows = walletRows.filter((w) => w.chain === c)
    return { chain: c, balance: rows.reduce((a, w) => a + w.balance, 0), count: rows.length }
  })

  return (
    <div className="space-y-7">
      <SectionHeader
        title="Overview"
        sub={`Welcome back, ${account.email}. ${walletRows.length} wallets across ${byChain.filter((b) => b.count > 0).length} chains.`}
        action={
          <button
            onClick={() => notify('Top up — coming soon')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-[0.82rem] tracking-tight shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A151C' }}
          >
            Top up <span aria-hidden>+</span>
          </button>
        }
      />

      <div className="rounded-2xl border border-core/12 bg-white/45 p-6">
        <div className="font-mono text-[0.6rem] tracking-wide text-core/50 mb-2">total balance</div>
        <div className="font-display text-[3rem] md:text-[3.6rem] font-semibold text-core leading-none tracking-[-0.02em] tabular-nums">
          ${total.toFixed(2)}
        </div>
        <div className="font-mono text-[0.62rem] tracking-wide text-core/45 mt-2">
          usdc · {walletRows.length} wallets
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-core/10">
          {byChain.map((b) => {
            const m = chainMeta[b.chain]
            return (
              <div key={b.chain} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="font-display text-[0.85rem] font-medium text-core tracking-tight">{m.label}</span>
                </div>
                <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums">${b.balance.toFixed(2)}</div>
                <div className="font-mono text-[0.6rem] tracking-wide text-core/45">{b.count} wallet{b.count === 1 ? '' : 's'}</div>
              </div>
            )
          })}
        </div>
      </div>

      <SpendChart />
    </div>
  )
}

function WalletsSection() {
  const { notify } = useToast()
  const [chainFilter, setChainFilter] = useState<WalletChain | 'all'>('all')
  const total = walletRows.reduce((a, w) => a + w.balance, 0)
  const visible = useMemo(
    () => chainFilter === 'all' ? walletRows : walletRows.filter((w) => w.chain === chainFilter),
    [chainFilter]
  )

  return (
    <div>
      <SectionHeader
        title="Wallets"
        sub="All wallets provisioned through your tenant. Spin up new agent wallets via the API or here."
        action={
          <button
            onClick={() => notify('Create wallet — coming soon')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-[0.82rem] tracking-tight shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A151C' }}
          >
            Create wallet <span aria-hidden>+</span>
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-px bg-core/10 rounded-2xl overflow-hidden border border-core/12 mb-7">
        <div className="bg-white/55 px-5 py-4">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">total balance</div>
          <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums mt-1.5">${total.toFixed(2)}</div>
        </div>
        <div className="bg-white/55 px-5 py-4">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">wallets</div>
          <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums mt-1.5">{walletRows.length}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {(['all', 'base', 'eth', 'tempo'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setChainFilter(c)}
            className={`px-2.5 py-1 rounded-full font-mono text-[0.65rem] tracking-wide transition-colors ${
              chainFilter === c ? 'bg-core text-white' : 'border border-core/15 text-core/60 hover:text-core'
            }`}
          >
            {c === 'all' ? 'all' : chainMeta[c].label.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-core/12 bg-white/55 overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-core/10 font-mono text-[0.6rem] tracking-wide text-core/55 bg-white/35">
          <span>wallet</span>
          <span>agent</span>
          <span>chain</span>
          <span>balance</span>
          <span>address</span>
          <span></span>
        </div>
        {visible.map((w) => (
          <div key={w.id} className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-core/8 last:border-b-0 items-center">
            <div className="min-w-0">
              <div className="font-display text-[0.88rem] font-medium text-core truncate">{w.label}</div>
              <div className="font-mono text-[0.62rem] text-core/45 truncate">{w.id}</div>
            </div>
            <span className="font-mono text-[0.72rem] text-core/70">{w.agent}</span>
            <ChainPill chain={w.chain} />
            <span className="font-display text-[0.95rem] text-core tabular-nums">${w.balance.toFixed(2)}</span>
            <CopyText text={w.address} label={shortAddr(w.address)} />
            <button onClick={() => notify('Wallet detail — coming soon')} className="font-mono text-[0.65rem] tracking-wide text-core/55 hover:text-core transition-colors">
              detail →
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="px-5 py-12 text-center font-mono text-[0.72rem] tracking-wide text-core/45">no wallets on this chain</div>
        )}
      </div>
    </div>
  )
}

function TransactionsSection() {
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'all'>('all')
  const visible = statusFilter === 'all' ? txRows : txRows.filter((t) => t.status === statusFilter)
  const totalSpend = txRows.filter((t) => t.status === 'success').reduce((a, t) => a + t.amount, 0)
  const successCount = txRows.filter((t) => t.status === 'success').length
  const failedCount = txRows.filter((t) => t.status === 'failed').length

  return (
    <div>
      <SectionHeader
        title="Transactions"
        sub="Every agent payment, on-chain or routed via Tempo. Click a row for the full request."
      />

      <div className="grid grid-cols-3 gap-px bg-core/10 rounded-2xl overflow-hidden border border-core/12 mb-7">
        <div className="bg-white/55 px-5 py-4">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">spend today</div>
          <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums mt-1.5">${totalSpend.toFixed(2)}</div>
        </div>
        <div className="bg-white/55 px-5 py-4">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">success</div>
          <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums mt-1.5">{successCount}</div>
        </div>
        <div className="bg-white/55 px-5 py-4">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">failed</div>
          <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums mt-1.5">{failedCount}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {(['all', 'success', 'pending', 'failed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-2.5 py-1 rounded-full font-mono text-[0.65rem] tracking-wide transition-colors ${
              statusFilter === s ? 'bg-core text-white' : 'border border-core/15 text-core/60 hover:text-core'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-core/12 bg-white/55 overflow-hidden">
        <div className="grid grid-cols-[0.7fr_1fr_1.6fr_0.8fr_0.8fr_0.9fr_1fr] gap-3 px-5 py-3 border-b border-core/10 font-mono text-[0.6rem] tracking-wide text-core/55 bg-white/35">
          <span>time</span>
          <span>agent</span>
          <span>merchant</span>
          <span>amount</span>
          <span>chain</span>
          <span>status</span>
          <span>hash</span>
        </div>
        {visible.map((t) => (
          <div key={t.id} className="grid grid-cols-[0.7fr_1fr_1.6fr_0.8fr_0.8fr_0.9fr_1fr] gap-3 px-5 py-3 border-b border-core/8 last:border-b-0 items-center">
            <span className="font-mono text-[0.7rem] text-core/65 tabular-nums">{t.time}</span>
            <span className="font-mono text-[0.72rem] text-core/75 truncate">{t.agent}</span>
            <span className="font-mono text-[0.72rem] text-core truncate">{t.merchant}</span>
            <span className="font-mono text-[0.72rem] text-core tabular-nums">${t.amount.toFixed(2)}</span>
            <ChainPill chain={t.chain} />
            <TxStatusPill s={t.status} />
            <span className="font-mono text-[0.7rem] text-core/55 truncate">{t.hash}</span>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="px-5 py-12 text-center font-mono text-[0.72rem] tracking-wide text-core/45">no transactions match</div>
        )}
      </div>
    </div>
  )
}

function SessionKeysSection() {
  const { notify } = useToast()
  return (
    <div>
      <SectionHeader
        title="Session keys"
        sub="Scoped, time-bound keys agents use at runtime. Each carries a daily spend ceiling per wallet."
        action={
          <button
            onClick={() => notify('Mint session key — coming soon')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-[0.82rem] tracking-tight shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A151C' }}
          >
            Mint session key <span aria-hidden>+</span>
          </button>
        }
      />

      <div className="rounded-2xl border border-core/12 bg-white/55 overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.6fr_0.7fr_auto] gap-4 px-5 py-3 border-b border-core/10 font-mono text-[0.6rem] tracking-wide text-core/55 bg-white/35">
          <span>key · agent</span>
          <span>wallet · chain</span>
          <span>expires</span>
          <span>daily usage</span>
          <span>status</span>
          <span></span>
        </div>
        {sessionKeys.map((k) => {
          const pct = Math.min(100, (k.usedToday / k.limitDaily) * 100)
          const near = pct >= 80
          return (
            <div key={k.id} className="grid grid-cols-[1.4fr_1fr_1fr_1.6fr_0.7fr_auto] gap-4 px-5 py-4 border-b border-core/8 last:border-b-0 items-center">
              <div>
                <div className="font-mono text-[0.72rem] text-core">{k.id}</div>
                <div className="font-mono text-[0.62rem] text-core/55 mt-0.5">{k.agent}</div>
              </div>
              <div>
                <div className="font-mono text-[0.7rem] text-core/75 truncate">{k.wallet}</div>
                <div className="mt-0.5"><ChainPill chain={k.chain} /></div>
              </div>
              <span className="font-mono text-[0.7rem] text-core/65 tabular-nums">{k.expires}</span>
              <div>
                <div className="flex items-baseline justify-between font-mono text-[0.68rem] text-core/75 tabular-nums mb-1.5">
                  <span>${k.usedToday.toFixed(2)} / ${k.limitDaily.toFixed(0)}</span>
                  <span className="text-core/45 text-[0.6rem] tracking-wide">{pct.toFixed(0)}%</span>
                </div>
                <div className="h-1 rounded-full bg-core/10 overflow-hidden">
                  <div className="h-full" style={{ width: `${pct}%`, backgroundColor: near ? '#C28A2C' : '#3C64B8' }} />
                </div>
              </div>
              <SessionKeyStatusPill s={k.status} />
              <button onClick={() => notify('Revoke — coming soon')} className="font-mono text-[0.65rem] tracking-wide text-[#9c2929]/70 hover:text-[#9c2929] transition-colors">
                revoke
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KeysSection({ env }: { env: Env }) {
  const { notify } = useToast()
  const visible = apiKeys.filter((k) => k.env === env)
  return (
    <div>
      <SectionHeader
        title="API keys"
        sub="Secret keys (sk_…) authenticate your backend; publishable keys (pk_…) are safe in the browser. Full secret is shown once at creation."
        action={
          <button
            onClick={() => notify('Key creation — coming soon')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-[0.82rem] tracking-tight shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A151C' }}
          >
            Create key <span aria-hidden>+</span>
          </button>
        }
      />

      <div className="rounded-2xl border border-core/12 bg-white/55 overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_auto] gap-4 px-5 py-3 border-b border-core/10 font-mono text-[0.6rem] tracking-wide text-core/55 bg-white/35">
          <span>name</span>
          <span>secret</span>
          <span>publishable</span>
          <span>created</span>
          <span>last used</span>
          <span></span>
        </div>
        {visible.map((k) => (
          <div key={k.id} className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_auto] gap-4 px-5 py-4 border-b border-core/8 last:border-b-0 items-center">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F7E4F]" />
              <span className="font-display text-[0.88rem] font-medium text-core">{k.name}</span>
            </div>
            <CopyText text={k.prefix} />
            <CopyText text={k.pub} />
            <span className="font-mono text-[0.72rem] text-core/65">{k.created}</span>
            <span className="font-mono text-[0.72rem] text-core/65">{k.last_used}</span>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => notify('Rotate — coming soon')} className="font-mono text-[0.65rem] tracking-wide text-core/60 hover:text-core transition-colors">rotate</button>
              <button onClick={() => notify('Revoke — coming soon')} className="font-mono text-[0.65rem] tracking-wide text-[#9c2929]/70 hover:text-[#9c2929] transition-colors">revoke</button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="px-5 py-12 text-center font-mono text-[0.72rem] tracking-wide text-core/45">no keys in {env} yet</div>
        )}
      </div>
    </div>
  )
}

function LogsSection({ env }: { env: Env }) {
  const [open, setOpen] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const visible = logs.filter((l) => l.env === env).filter((l) => !filter || l.path.includes(filter) || l.request_id.includes(filter))

  return (
    <div>
      <SectionHeader
        title="Logs"
        sub="Every API request to api.atara.xyz. Click a row to see the full request, response, and timing breakdown."
        action={
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="filter by path or request_id…"
            className="w-72 px-3 py-2 rounded-full border border-core/15 bg-white/65 font-mono text-[0.72rem] text-core placeholder:text-core/35 focus:outline-none focus:border-core/40"
          />
        }
      />

      <div className="rounded-2xl border border-core/12 bg-white/55 overflow-hidden">
        <div className="grid grid-cols-[0.7fr_0.6fr_2.6fr_0.6fr_0.6fr_1fr_1fr] gap-3 px-5 py-3 border-b border-core/10 font-mono text-[0.6rem] tracking-wide text-core/55 bg-white/35">
          <span>time</span><span>method</span><span>endpoint</span><span>status</span><span>latency</span><span>request_id</span><span>key</span>
        </div>
        {visible.map((l) => {
          const expanded = open === l.request_id
          return (
            <div key={l.request_id} className="border-b border-core/8 last:border-b-0">
              <button onClick={() => setOpen(expanded ? null : l.request_id)} className="w-full grid grid-cols-[0.7fr_0.6fr_2.6fr_0.6fr_0.6fr_1fr_1fr] gap-3 px-5 py-3 items-center text-left hover:bg-white/35 transition-colors">
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
                      <div className="text-[#8CB6E8] mb-1.5 text-[0.6rem] tracking-wide">request</div>
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
                      <div className="text-[#8CB6E8] mb-1.5 text-[0.6rem] tracking-wide">response · {l.latency}ms</div>
                      <pre className="whitespace-pre-wrap text-[#E8D5C4]/85">
{l.status < 300 ? `{
  "id":     "tx_01J7K8P2…",
  "status": "pending",
  "hash":   "0xdeadbeef…",
  "chain":  "base"
}` : l.status === 402 ? `{
  "error": "session_limit_exceeded",
  "limit": { "daily": "5 USDC", "used": "5.00" }
}` : l.status === 429 ? `{
  "error": "rate_limited",
  "retry_after": 12
}` : `{
  "error": "upstream_timeout",
  "chain": "base"
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
          <div className="px-5 py-12 text-center font-mono text-[0.72rem] tracking-wide text-core/45">no logs match</div>
        )}
      </div>
    </div>
  )
}

function SettingsSection() {
  return (
    <div>
      <SectionHeader title="Settings" sub="Tenant configuration, webhooks, members." />
      <div className="rounded-2xl border border-core/12 bg-white/55 p-6 font-mono text-[0.72rem] text-core/55">coming soon</div>
    </div>
  )
}

const nav: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',     label: 'Overview',     icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg> },
  { id: 'wallets',      label: 'Wallets',      icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v3"/><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M16 12h6v4h-6a2 2 0 0 1 0-4z"/></svg> },
  { id: 'transactions', label: 'Transactions', icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h14"/><path d="m13 3 4 4-4 4"/><path d="M21 17H7"/><path d="m11 21-4-4 4-4"/></svg> },
  { id: 'sessions',     label: 'Session keys', icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="3"/><path d="m10 13 8-8"/><path d="m14 9 3 3"/><path d="m17 6 3 3"/></svg> },
  { id: 'keys',         label: 'API keys',     icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 14h3"/></svg> },
  { id: 'logs',         label: 'Logs',         icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h10"/></svg> },
  { id: 'settings',     label: 'Settings',     icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg> },
]

export default function Dashboard() {
  const [section, setSection] = useState<Section>('overview')
  const [env, setEnv] = useState<Env>('test')

  return (
    <div className="relative min-h-screen bg-peach text-core">
      <div aria-hidden="true" className="bg-noise pointer-events-none" style={{ opacity: 0.35 }} />

      <aside className="lg:fixed lg:inset-y-0 lg:left-0 lg:w-[248px] lg:border-r lg:border-core/10 lg:bg-[#EFE3D3]/60 lg:backdrop-blur-sm lg:flex lg:flex-col z-20">
        <div className="px-6 pt-7 pb-6">
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '' }} className="font-display text-[1.35rem] tracking-[0.2em] font-semibold text-core hover:opacity-70 transition-opacity">Atara</a>
          <div className="font-mono text-[0.55rem] tracking-wide text-core/45 mt-2">dashboard</div>
        </div>

        <nav className="px-3 flex flex-col gap-1 flex-1">
          {nav.map((n) => {
            const active = section === n.id
            return (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-lg text-[0.85rem] tracking-tight transition-colors ${
                  active ? 'bg-core text-white font-medium' : 'text-core/70 hover:text-core hover:bg-white/40'
                }`}
              >
                <span className={active ? 'text-white' : 'text-core/45'}>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="px-6 border-t border-core/8 pt-5 pb-5">
          <div className="font-mono text-[0.55rem] tracking-wide text-core/45 mb-2">environment</div>
          <div className="inline-flex rounded-full border border-core/15 bg-white/55 p-0.5 mb-5">
            {(['test', 'live'] as Env[]).map((e) => (
              <button
                key={e}
                onClick={() => setEnv(e)}
                className={`px-3 py-1 rounded-full font-mono text-[0.65rem] tracking-wide transition-colors ${
                  env === e ? 'bg-core text-white' : 'text-core/60 hover:text-core'
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border border-core/10 bg-white/40 px-3 py-2.5">
            <div className="w-7 h-7 rounded-full bg-core/15 flex items-center justify-center font-display text-[0.75rem] font-semibold text-core">{account.email[0]}</div>
            <div className="min-w-0 flex-1">
              <div className="font-display text-[0.78rem] font-medium text-core truncate">{account.company}</div>
              <div className="font-mono text-[0.6rem] text-core/55 truncate">{account.tenant_id}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative z-10 lg:pl-[248px]">
        <div className="px-6 md:px-10 lg:px-16 pt-14 pb-24">
          <div className="max-w-[1120px] mx-auto">
            {section === 'overview'     && <OverviewSection />}
            {section === 'wallets'      && <WalletsSection />}
            {section === 'transactions' && <TransactionsSection />}
            {section === 'sessions'     && <SessionKeysSection />}
            {section === 'keys'         && <KeysSection env={env} />}
            {section === 'logs'         && <LogsSection env={env} />}
            {section === 'settings'     && <SettingsSection />}
          </div>
        </div>
      </main>
    </div>
  )
}
