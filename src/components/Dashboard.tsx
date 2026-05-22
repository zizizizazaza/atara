import { useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from './ToastProvider'
import { setAuthed } from '../auth'

type Section = 'overview' | 'wallets' | 'receipts' | 'keys' | 'logs' | 'settings'
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

type SessionKeyStatus = 'active' | 'inactive'
type SessionKey = {
  id: string
  perTx: number
  windowHours: number
  windowLimit: number
  windowUsed: number
  windowStart: string
  status: SessionKeyStatus
  inactiveReason?: 'expired' | 'limit_reached' | 'revoked'
}

type WalletRow = {
  id: string
  label: string
  agent: string
  chain: WalletChain
  balance: number
  address: string
  created: string
  sessionKey: SessionKey | null
}

const walletRows: WalletRow[] = [
  {
    id: 'wlt_01JX7K2Z8A', label: 'Tutor — Primary', agent: 'tutor-prod', chain: 'base', balance: 124.5,
    address: '0xA1B2C3D4E5F60718293A4B5C6D7E8F9001020304', created: '2026-03-12',
    sessionKey: { id: 'sk_run_01HG7P', perTx: 0.5, windowHours: 24, windowLimit: 25, windowUsed: 18.42, windowStart: '2026-05-22 00:00', status: 'active' },
  },
  {
    id: 'wlt_02NQ4R7P5B', label: 'Tutor — Treasury', agent: 'tutor-prod', chain: 'eth', balance: 612.8,
    address: '0xB7C9D2E3F4051628394A5B6C7D8E9F0011223344', created: '2026-02-04',
    sessionKey: null,
  },
  {
    id: 'wlt_03MV8X1L9C', label: 'Research Agent', agent: 'research-1', chain: 'tempo', balance: 338.2,
    address: '0xC9E1F23456788091A2B3C4D5E6F708091A2B3C4D', created: '2026-04-22',
    sessionKey: { id: 'sk_run_02JK4N', perTx: 1.0, windowHours: 168, windowLimit: 120, windowUsed: 58.40, windowStart: '2026-05-19 00:00', status: 'active' },
  },
  {
    id: 'wlt_04ZK6H2T0D', label: 'Crawler Pool', agent: 'crawler-fleet', chain: 'base', balance: 47.9,
    address: '0xD0123456789ABCDEF0123456789ABCDEF0123456', created: '2026-05-01',
    sessionKey: { id: 'sk_run_03LM6P', perTx: 0.2, windowHours: 24, windowLimit: 10, windowUsed: 9.71, windowStart: '2026-05-22 00:00', status: 'active' },
  },
  {
    id: 'wlt_05PL9Q3W7E', label: 'Sandbox', agent: 'tutor-dev', chain: 'tempo', balance: 12.04,
    address: '0xE56789ABCDEF0123456789ABCDEF0123456789AB', created: '2026-05-14',
    sessionKey: { id: 'sk_run_04NQ2S', perTx: 0.5, windowHours: 24, windowLimit: 5, windowUsed: 5.0, windowStart: '2026-05-21 00:00', status: 'inactive', inactiveReason: 'limit_reached' },
  },
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

function ChainLogo({ chain, size = 28 }: { chain: WalletChain; size?: number }) {
  if (chain === 'base') {
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
        <circle cx="16" cy="16" r="16" fill="#0052FF" />
        <path d="M15.97 26C21.5 26 26 21.52 26 16S21.5 6 15.97 6C10.72 6 6.42 10.04 6 15.18h13.27v1.64H6c.42 5.14 4.72 9.18 9.97 9.18Z" fill="#FFFFFF" />
      </svg>
    )
  }
  if (chain === 'eth') {
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
        <circle cx="16" cy="16" r="16" fill="#627EEA" />
        <g fill="#FFFFFF">
          <path opacity="0.6" d="M16.498 4v8.87l7.497 3.35z" />
          <path d="M16.498 4 9 16.22l7.498-3.35z" />
          <path opacity="0.6" d="M16.498 21.968v6.027L24 17.616z" />
          <path d="M16.498 27.995v-6.028L9 17.616z" />
          <path opacity="0.2" d="m16.498 20.573 7.497-4.353-7.497-3.348z" />
          <path opacity="0.6" d="m9 16.22 7.498 4.353v-7.701z" />
        </g>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#C28A2C" />
      <path d="M9 11h14v2.6h-5.6V23h-2.8v-9.4H9z" fill="#FAF1E4" />
    </svg>
  )
}

function ChainBadge({ chain, size = 16 }: { chain: WalletChain; size?: number }) {
  const m = chainMeta[chain]
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <ChainLogo chain={chain} size={size} />
      <span className="font-display text-[0.78rem] font-medium text-core tracking-tight truncate">{m.label}</span>
    </span>
  )
}

function MockQR({ value, size = 168 }: { value: string; size?: number }) {
  const N = 25
  const cells = useMemo(() => {
    let h = 2166136261
    for (let i = 0; i < value.length; i++) {
      h ^= value.charCodeAt(i)
      h = (h * 16777619) >>> 0
    }
    const arr: boolean[] = []
    for (let i = 0; i < N * N; i++) {
      h = (h * 1664525 + 1013904223) >>> 0
      arr.push((h & 0xff) > 128)
    }
    return arr
  }, [value])

  const isFinder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0)
  }
  const finderFill = (r: number, c: number) => {
    const test = (r0: number, c0: number) => {
      const rr = r - r0, cc = c - c0
      if (rr < 0 || cc < 0 || rr > 6 || cc > 6) return null
      const onOuter = rr === 0 || rr === 6 || cc === 0 || cc === 6
      const inInner = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4
      return onOuter || inInner
    }
    const a = test(0, 0); if (a !== null) return a
    const b = test(0, N - 7); if (b !== null) return b
    const c2 = test(N - 7, 0); if (c2 !== null) return c2
    return false
  }
  const cell = size / N

  return (
    <div className="rounded-xl bg-white p-3 border border-core/15" style={{ width: size + 24, height: size + 24 }}>
      <svg viewBox={`0 0 ${N} ${N}`} width={size} height={size} shapeRendering="crispEdges">
        {Array.from({ length: N }).map((_, r) =>
          Array.from({ length: N }).map((_, c) => {
            const on = isFinder(r, c) ? finderFill(r, c) : cells[r * N + c]
            return on ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#1A151C" /> : null
          })
        )}
      </svg>
    </div>
  )
}

type TopUpStep = 'chain' | 'address'

function TopUpModal({ wallets, presetChain, onClose }: { wallets: WalletRow[]; presetChain?: WalletChain; onClose: () => void }) {
  const { notify } = useToast()
  const [step, setStep] = useState<TopUpStep>(presetChain ? 'address' : 'chain')
  const [chain, setChain] = useState<WalletChain | null>(presetChain ?? null)

  const wallet = useMemo(() => (chain ? wallets.find((w) => w.chain === chain) ?? null : null), [chain, wallets])
  const chainsWithWallets = (['base', 'eth', 'tempo'] as WalletChain[]).filter((c) => wallets.some((w) => w.chain === c))

  const pickChain = (c: WalletChain) => {
    setChain(c)
    setStep('address')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#1A151C]/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[460px] rounded-2xl border border-core/15 bg-[#FAF1E4] shadow-[0_24px_60px_-24px_rgba(26,21,28,0.45)] overflow-hidden">
        <div className="px-6 pt-6 pb-5 border-b border-core/10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5 min-w-0">
            {step === 'address' && !presetChain && (
              <button
                onClick={() => setStep('chain')}
                aria-label="back"
                className="mt-0.5 -ml-1 p-1 rounded text-core/55 hover:text-core hover:bg-core/5 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <div className="min-w-0">
              <div className="font-display text-[1.05rem] font-semibold text-core tracking-tight">Top up</div>
              <div className="font-mono text-[0.62rem] text-core/55 mt-1.5">
                {step === 'chain' ? 'Choose the chain to receive funds' : `Send USDC on ${chain ? chainMeta[chain].label : ''}`}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-core/45 hover:text-core transition-colors font-mono text-[0.9rem] leading-none p-1" aria-label="close">×</button>
        </div>

        <div className="px-6 py-6">
          {step === 'chain' && (
            <div className="flex flex-col gap-2">
              {chainsWithWallets.map((c) => {
                const w = wallets.find((x) => x.chain === c)!
                return (
                  <button
                    key={c}
                    onClick={() => pickChain(c)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-core/15 bg-white/55 hover:bg-white/75 transition-colors text-left"
                  >
                    <ChainLogo chain={c} size={28} />
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-[0.92rem] font-semibold text-core tracking-tight">{chainMeta[c].label}</div>
                      <div className="font-mono text-[0.6rem] text-core/55 mt-0.5 truncate">{shortAddr(w.address)} · ${w.balance.toFixed(2)} usdc</div>
                    </div>
                    <span className="font-mono text-[0.65rem] text-core/45">→</span>
                  </button>
                )
              })}
            </div>
          )}

          {step === 'address' && wallet && chain && (
            <>
              <div className="flex items-center gap-2.5 mb-4">
                <ChainLogo chain={chain} size={22} />
                <div>
                  <div className="font-display text-[0.92rem] font-semibold text-core tracking-tight leading-none">{chainMeta[chain].label}</div>
                  <div className="font-mono text-[0.58rem] tracking-wide text-core/55 mt-1">{wallet.label}</div>
                </div>
              </div>

              <div className="flex justify-center mb-5">
                <MockQR value={wallet.address} size={168} />
              </div>

              <div className="font-mono text-[0.58rem] tracking-wide text-core/55 mb-1.5">wallet address</div>
              <div className="rounded-xl border border-core/15 bg-white/60 px-3.5 py-3 mb-3">
                <div className="font-mono text-[0.7rem] text-core break-all leading-relaxed">{wallet.address}</div>
              </div>

              <button
                onClick={() => { navigator.clipboard.writeText(wallet.address); notify('Address copied') }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-white font-medium text-[0.82rem] tracking-tight hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1A151C' }}
              >
                Copy address
              </button>

              <div className="rounded-xl border border-[#B83C3C]/30 bg-[#B83C3C]/8 px-4 py-3 mt-5 flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 text-[#9c2929] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
                <div className="min-w-0">
                  <div className="font-display text-[0.82rem] font-semibold text-[#9c2929] tracking-tight">Only send USDC on {chainMeta[chain].label}.</div>
                  <div className="font-mono text-[0.62rem] text-core/65 mt-1 leading-relaxed">Funds sent on another chain or asset will be lost and cannot be recovered.</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TxHashLink({ hash, chain }: { hash: string; chain: WalletChain }) {
  if (hash === '—') return <span className="font-mono text-[0.7rem] text-core/35">—</span>
  const short = `${hash.slice(0, 6)}…${hash.slice(-4)}`
  const explorer = chain === 'base' ? 'basescan' : chain === 'eth' ? 'etherscan' : 'tempo scan'
  return (
    <button
      onClick={(e) => e.stopPropagation()}
      title={`open on ${explorer}`}
      className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] text-core/70 hover:text-core transition-colors group"
    >
      <span className="underline decoration-core/20 group-hover:decoration-core/60 underline-offset-[3px] decoration-[0.5px]">{short}</span>
      <svg viewBox="0 0 24 24" className="w-3 h-3 opacity-50 group-hover:opacity-90 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4h6v6" />
        <path d="m20 4-9 9" />
        <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
      </svg>
    </button>
  )
}

function TxStatusPill({ s }: { s: TxStatus }) {
  const map: Record<TxStatus, { color: string; label: string }> = {
    success: { color: '#3F7E4F', label: 'success' },
    pending: { color: '#8a5e0e', label: 'pending' },
    failed:  { color: '#9c2929', label: 'failed' },
  }
  const m = map[s]
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] tracking-tight" style={{ color: m.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
      {m.label}
    </span>
  )
}

function SessionKeyStatusPill({ s, reason }: { s: SessionKeyStatus; reason?: 'expired' | 'limit_reached' | 'revoked' }) {
  if (s === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded font-mono text-[0.65rem] tracking-wide" style={{ color: '#3F7E4F', backgroundColor: 'rgba(63,126,79,0.12)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#3F7E4F]" />
        active
      </span>
    )
  }
  const label = reason === 'limit_reached' ? 'limit reached' : reason === 'revoked' ? 'revoked' : 'expired'
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[0.65rem] tracking-wide" style={{ color: '#7a6a55', backgroundColor: 'rgba(122,106,85,0.12)' }}>
      {label}
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
            const x = cx - barW / 2
            const yTop = padT + innerH - totalH
            const isHovered = hover === i
            return (
              <g key={d.iso} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
                <rect x={cx - slot / 2} y={padT} width={slot} height={innerH} fill="transparent" />
                <rect x={x} y={yTop} width={barW} height={totalH} fill="#3C64B8" opacity={isHovered ? 1 : 0.88} rx="1" />
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
  const [topUpOpen, setTopUpOpen] = useState(false)
  const total = walletRows.reduce((a, w) => a + w.balance, 0)
  const byChain = (['base', 'eth', 'tempo'] as WalletChain[])
    .map((c) => {
      const w = walletRows.find((r) => r.chain === c)
      if (!w) return null
      const balance = walletRows.filter((r) => r.chain === c).reduce((a, r) => a + r.balance, 0)
      return { chain: c, wallet: w, balance }
    })
    .filter((x): x is { chain: WalletChain; wallet: WalletRow; balance: number } => x !== null)

  const copy = (a: string) => { navigator.clipboard.writeText(a); notify('Address copied') }

  return (
    <div className="space-y-7">
      <SectionHeader
        title="Overview"
        sub={`Welcome back, ${account.email}.`}
        action={
          <button
            onClick={() => setTopUpOpen(true)}
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
          {byChain.map((b) => (
            <div key={b.chain} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ChainLogo chain={b.chain} size={18} />
                <span className="font-display text-[0.88rem] font-medium text-core tracking-tight">{chainMeta[b.chain].label}</span>
              </div>
              <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums">${b.balance.toFixed(2)}</div>
              <button
                onClick={() => copy(b.wallet.address)}
                title="copy address"
                className="inline-flex items-center gap-1.5 self-start font-mono text-[0.62rem] tracking-wide text-core/55 hover:text-core transition-colors group"
              >
                <span>{shortAddr(b.wallet.address)}</span>
                <svg viewBox="0 0 24 24" className="w-3 h-3 opacity-40 group-hover:opacity-80 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <SpendChart />

      {topUpOpen && <TopUpModal wallets={walletRows} onClose={() => setTopUpOpen(false)} />}
    </div>
  )
}

function sessionExpiry(k: SessionKey): Date {
  const [datePart, timePart] = k.windowStart.split(' ')
  const [y, mo, d] = datePart.split('-').map(Number)
  const [h, mi] = timePart.split(':').map(Number)
  const dt = new Date(y, mo - 1, d, h, mi)
  dt.setHours(dt.getHours() + k.windowHours)
  return dt
}

function formatExpiry(dt: Date): { date: string; time: string } {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const date = `${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`
  const time = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
  return { date, time }
}

function SessionExpiryCell({ k }: { k: SessionKey | null }) {
  if (!k) return <span className="font-mono text-[0.62rem] tracking-wide text-core/35">—</span>
  const dt = sessionExpiry(k)
  const { date, time } = formatExpiry(dt)
  const past = dt.getTime() < Date.now() || k.status === 'inactive'
  return (
    <div className="min-w-0">
      <div className={`font-mono text-[0.7rem] tabular-nums truncate ${past ? 'text-core/45 line-through decoration-core/30' : 'text-core/75'}`}>
        {date}
      </div>
      <div className={`font-mono text-[0.62rem] tabular-nums mt-0.5 ${past ? 'text-core/35' : 'text-core/55'}`}>
        {time}
      </div>
    </div>
  )
}

function WalletSessionCell({ k }: { k: SessionKey | null }) {
  if (!k) return <span className="font-mono text-[0.62rem] tracking-wide text-core/35">— not configured</span>
  if (k.status === 'inactive') {
    if (k.inactiveReason === 'limit_reached') {
      return (
        <div className="min-w-0">
          <div className="flex items-baseline justify-between font-mono text-[0.62rem] tabular-nums text-[#9c2929] mb-1">
            <span>${k.windowLimit.toFixed(2)} <span className="text-[#9c2929]/60">/ ${k.windowLimit.toFixed(0)}</span></span>
            <span className="text-[#9c2929]/70">limit reached</span>
          </div>
          <div className="h-1 rounded-full bg-core/8 overflow-hidden">
            <div className="h-full w-full" style={{ backgroundColor: '#B83C3C' }} />
          </div>
        </div>
      )
    }
    if (k.inactiveReason === 'expired') {
      return <span className="font-mono text-[0.62rem] tracking-wide text-core/55">Expired</span>
    }
    return <span className="font-mono text-[0.62rem] tracking-wide text-core/55">revoked</span>
  }
  const pct = Math.min(100, (k.windowUsed / k.windowLimit) * 100)
  const near = pct >= 80
  return (
    <div className="min-w-0">
      <div className="font-mono text-[0.62rem] tabular-nums text-core/75 mb-1">
        <span>${k.windowUsed.toFixed(2)} <span className="text-core/35">/ ${k.windowLimit.toFixed(0)}</span></span>
      </div>
      <div className="h-1 rounded-full bg-core/8 overflow-hidden">
        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: near ? '#C28A2C' : '#3F7E4F' }} />
      </div>
    </div>
  )
}

function WalletsSection({ onSelect }: { onSelect: (id: string) => void }) {
  const [chainFilter, setChainFilter] = useState<WalletChain | 'all'>('all')
  const total = walletRows.reduce((a, w) => a + w.balance, 0)
  const activeKeys = walletRows.filter((w) => w.sessionKey?.status === 'active').length
  const visible = useMemo(
    () => chainFilter === 'all' ? walletRows : walletRows.filter((w) => w.chain === chainFilter),
    [chainFilter]
  )

  return (
    <div>
      <SectionHeader
        title="Wallets"
        sub="All wallets provisioned through your tenant. Each wallet owns at most one active session key."
      />

      <div className="grid grid-cols-3 gap-px bg-core/10 rounded-2xl overflow-hidden border border-core/12 mb-7">
        <div className="bg-white/55 px-5 py-4">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">total balance</div>
          <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums mt-1.5">${total.toFixed(2)}</div>
        </div>
        <div className="bg-white/55 px-5 py-4">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">wallets</div>
          <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums mt-1.5">{walletRows.length}</div>
        </div>
        <div className="bg-white/55 px-5 py-4">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">active session keys</div>
          <div className="font-display text-[1.35rem] font-semibold text-core leading-none tabular-nums mt-1.5">{activeKeys}</div>
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
        <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.8fr_1fr_0.95fr_auto] gap-4 px-5 py-3 border-b border-core/10 font-mono text-[0.6rem] tracking-wide text-core/55 bg-white/35">
          <span>Wallet</span>
          <span>Agent</span>
          <span>Chain</span>
          <span>Balance</span>
          <span>Authorized limit</span>
          <span>Session expires</span>
          <span></span>
        </div>
        {visible.map((w) => (
          <button
            key={w.id}
            onClick={() => onSelect(w.id)}
            className="w-full text-left grid grid-cols-[1.2fr_0.8fr_0.7fr_0.8fr_1fr_0.95fr_auto] gap-4 px-5 py-4 border-b border-core/8 last:border-b-0 items-center hover:bg-white/35 transition-colors"
          >
            <div className="min-w-0">
              <div className="font-display text-[0.92rem] font-medium text-core tabular-nums truncate">{shortAddr(w.address)}</div>
              <div className="font-mono text-[0.62rem] text-core/55 truncate">{w.label}</div>
            </div>
            <span className="font-mono text-[0.72rem] text-core/70 truncate">{w.agent}</span>
            <ChainBadge chain={w.chain} size={16} />
            <span className="font-display text-[0.95rem] text-core tabular-nums">${w.balance.toFixed(2)}</span>
            <WalletSessionCell k={w.sessionKey} />
            <SessionExpiryCell k={w.sessionKey} />
            <span className="font-mono text-[0.65rem] tracking-wide text-core/45">→</span>
          </button>
        ))}
        {visible.length === 0 && (
          <div className="px-5 py-12 text-center font-mono text-[0.72rem] tracking-wide text-core/45">no wallets on this chain</div>
        )}
      </div>
    </div>
  )
}

function SessionKeyPanel({ k, walletLabel }: { k: SessionKey; walletLabel: string }) {
  const { notify } = useToast()
  const pct = Math.min(100, (k.windowUsed / k.windowLimit) * 100)
  const near = pct >= 80
  const isActive = k.status === 'active'

  return (
    <div className="rounded-2xl border border-core/12 bg-white/55 p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50 mb-1.5">active session key</div>
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[1.05rem] font-semibold text-core tracking-tight">{k.id}</span>
            <SessionKeyStatusPill s={k.status} reason={k.inactiveReason} />
          </div>
          <div className="font-mono text-[0.62rem] text-core/50 mt-1">bound to {walletLabel}</div>
        </div>
        {isActive && (
          <div className="flex items-center gap-3">
            <button onClick={() => notify('Edit limits — coming soon')} className="font-mono text-[0.65rem] tracking-wide text-core/60 hover:text-core transition-colors">
              edit limits
            </button>
            <button onClick={() => notify('Revoke — coming soon')} className="font-mono text-[0.65rem] tracking-wide text-[#9c2929]/70 hover:text-[#9c2929] transition-colors">
              revoke
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-core/10 rounded-xl overflow-hidden border border-core/10 mb-5">
        <div className="bg-white/55 px-4 py-3">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">per-tx max</div>
          <div className="font-display text-[1.15rem] font-semibold text-core leading-none tabular-nums mt-1.5">${k.perTx.toFixed(2)}</div>
        </div>
        <div className="bg-white/55 px-4 py-3">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">window</div>
          <div className="font-display text-[1.15rem] font-semibold text-core leading-none tabular-nums mt-1.5">{k.windowHours}h</div>
        </div>
        <div className="bg-white/55 px-4 py-3">
          <div className="font-mono text-[0.58rem] tracking-wide text-core/50">window cap</div>
          <div className="font-display text-[1.15rem] font-semibold text-core leading-none tabular-nums mt-1.5">${k.windowLimit.toFixed(2)}</div>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between font-mono text-[0.68rem] tabular-nums mb-1.5">
          <span className="text-core/55 tracking-wide">used this window</span>
          <span className="text-core/75">${k.windowUsed.toFixed(2)} <span className="text-core/35">/ ${k.windowLimit.toFixed(2)}</span></span>
        </div>
        <div className="h-1.5 rounded-full bg-core/8 overflow-hidden">
          <div className="h-full" style={{ width: `${pct}%`, backgroundColor: near ? '#C28A2C' : '#3F7E4F' }} />
        </div>
        <div className="font-mono text-[0.6rem] tracking-wide text-core/45 mt-2">
          window started <span className="text-core/65 tabular-nums">{k.windowStart}</span>
        </div>
      </div>
    </div>
  )
}

function fakePrivateKey(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 131 + seed.charCodeAt(i)) >>> 0
  let out = '0x'
  for (let i = 0; i < 64; i++) {
    h = (h * 1664525 + 1013904223) >>> 0
    out += (h & 0xf).toString(16)
  }
  return out
}

type ExportStep = 'choose' | 'passkey' | 'email_sent' | 'verifying' | 'revealed'

function ExportKeyModal({ wallet, onClose }: { wallet: WalletRow; onClose: () => void }) {
  const { notify } = useToast()
  const [step, setStep] = useState<ExportStep>('choose')
  const [code, setCode] = useState('')
  const [revealed, setRevealed] = useState(false)

  const privateKey = useMemo(() => fakePrivateKey(wallet.id), [wallet.id])

  const startPasskey = () => {
    setStep('passkey')
    setTimeout(() => setStep('revealed'), 1600)
  }

  const sendEmail = () => {
    setStep('email_sent')
  }

  const verifyCode = () => {
    if (code.length < 6) return
    setStep('verifying')
    setTimeout(() => setStep('revealed'), 900)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#1A151C]/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] rounded-2xl border border-core/15 bg-[#FAF1E4] shadow-[0_24px_60px_-24px_rgba(26,21,28,0.45)] overflow-hidden">
        <div className="px-6 pt-6 pb-5 border-b border-core/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-[1.05rem] font-semibold text-core tracking-tight">Export private key</div>
              <div className="font-mono text-[0.62rem] text-core/55 mt-1.5">{wallet.label} · {wallet.id}</div>
            </div>
            <button onClick={onClose} className="text-core/45 hover:text-core transition-colors font-mono text-[0.9rem] leading-none p-1" aria-label="close">×</button>
          </div>
        </div>

        <div className="px-6 py-6">
          {step === 'choose' && (
            <>
              <div className="rounded-lg border border-[#B83C3C]/25 bg-[#B83C3C]/8 px-3.5 py-3 mb-5">
                <div className="font-display text-[0.78rem] font-medium text-[#9c2929] tracking-tight">Anyone with this key controls the wallet.</div>
                <div className="font-mono text-[0.62rem] text-core/65 mt-1 leading-relaxed">
                  Atara cannot recover funds lost to a leaked key. We recommend exporting only to a hardware wallet or secure password manager.
                </div>
              </div>

              <div className="font-mono text-[0.6rem] tracking-wide text-core/55 mb-2.5">verify it's you</div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={startPasskey}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-core/15 bg-white/55 hover:bg-white/75 transition-colors text-left"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-core/65" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[0.85rem] font-medium text-core tracking-tight">Passkey</div>
                    <div className="font-mono text-[0.6rem] text-core/55 mt-0.5">Touch ID, Face ID, or device PIN</div>
                  </div>
                  <span className="font-mono text-[0.65rem] text-core/45">→</span>
                </button>
                <button
                  onClick={sendEmail}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-core/15 bg-white/55 hover:bg-white/75 transition-colors text-left"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-core/65" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[0.85rem] font-medium text-core tracking-tight">Email code</div>
                    <div className="font-mono text-[0.6rem] text-core/55 mt-0.5 truncate">Send a 6-digit code to {account.email}</div>
                  </div>
                  <span className="font-mono text-[0.65rem] text-core/45">→</span>
                </button>
              </div>
            </>
          )}

          {step === 'passkey' && (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border-2 border-core/15 border-t-core animate-spin mb-4" />
              <div className="font-display text-[0.92rem] font-medium text-core tracking-tight">Waiting for passkey…</div>
              <div className="font-mono text-[0.62rem] text-core/55 mt-1.5">Follow the prompt on your device.</div>
            </div>
          )}

          {step === 'email_sent' && (
            <>
              <div className="font-mono text-[0.62rem] tracking-wide text-core/55 mb-2">
                code sent to <span className="text-core/80">{account.email}</span>
              </div>
              <input
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl border border-core/15 bg-white/65 font-mono text-[1.05rem] tabular-nums tracking-[0.4em] text-core text-center placeholder:text-core/25 focus:outline-none focus:border-core/40"
              />
              <button
                onClick={verifyCode}
                disabled={code.length < 6}
                className="w-full mt-4 px-4 py-2.5 rounded-full text-white font-medium text-[0.82rem] tracking-tight transition-opacity disabled:opacity-40"
                style={{ backgroundColor: '#1A151C' }}
              >
                Verify
              </button>
              <button onClick={() => { setCode(''); notify('Code re-sent') }} className="block mx-auto mt-3 font-mono text-[0.62rem] tracking-wide text-core/55 hover:text-core transition-colors">
                resend code
              </button>
            </>
          )}

          {step === 'verifying' && (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border-2 border-core/15 border-t-core animate-spin mb-4" />
              <div className="font-display text-[0.92rem] font-medium text-core tracking-tight">Verifying…</div>
            </div>
          )}

          {step === 'revealed' && (
            <>
              <div className="font-mono text-[0.6rem] tracking-wide text-core/55 mb-2">private key</div>
              <div className="relative">
                <div
                  className={`rounded-xl border border-core/15 bg-[#1A151C] text-[#E8D5C4] px-4 py-3.5 font-mono text-[0.7rem] leading-relaxed break-all select-all transition-[filter] ${
                    revealed ? '' : 'blur-[6px] pointer-events-none'
                  }`}
                >
                  {privateKey}
                </div>
                {!revealed && (
                  <button
                    onClick={() => setRevealed(true)}
                    className="absolute inset-0 flex items-center justify-center font-display text-[0.82rem] font-medium text-core tracking-tight"
                  >
                    Tap to reveal
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => { navigator.clipboard.writeText(privateKey); notify('Private key copied') }}
                  className="flex-1 px-4 py-2.5 rounded-full text-white font-medium text-[0.82rem] tracking-tight transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#1A151C' }}
                >
                  Copy to clipboard
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full border border-core/20 font-display text-[0.82rem] font-medium text-core/75 hover:text-core transition-colors"
                >
                  Done
                </button>
              </div>
              <div className="font-mono text-[0.6rem] text-core/55 mt-3 leading-relaxed">
                This key is shown once. Atara does not store it after this view closes.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function WalletDetailView({ wallet, onBack }: { wallet: WalletRow; onBack: () => void }) {
  const { notify } = useToast()
  const [exportOpen, setExportOpen] = useState(false)
  const [topUpOpen, setTopUpOpen] = useState(false)
  const recent = txRows.filter((t) => t.agent === wallet.agent).slice(0, 5)
  const chain = chainMeta[wallet.chain]

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
    notify('Address copied')
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-wide text-core/55 hover:text-core transition-colors">
        <span aria-hidden>←</span> back to wallets
      </button>

      <div className="rounded-2xl border border-core/12 bg-white/55 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2.5 px-2.5 py-1.5 rounded-full border border-core/12 bg-white/60">
            <ChainLogo chain={wallet.chain} size={20} />
            <span className="font-display text-[0.85rem] font-semibold text-core tracking-tight">{chain.label}</span>
            <span className="font-mono text-[0.58rem] tracking-wide text-core/45">network</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExportOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-core/20 font-display text-[0.78rem] font-medium text-core/80 hover:text-core hover:border-core/40 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" />
              </svg>
              Export key
            </button>
            <button
              onClick={() => setTopUpOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-[0.82rem] tracking-tight shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1A151C' }}
            >
              Top up <span aria-hidden>+</span>
            </button>
          </div>
        </div>

        <button
          onClick={copyAddress}
          title="copy address"
          className="group mt-5 flex items-center gap-3 text-left max-w-full"
        >
          <span className="font-display text-[1.7rem] md:text-[2rem] font-semibold text-core tracking-tight leading-none break-all">
            {shortAddr(wallet.address)}
          </span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-core/40 group-hover:text-core/80 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <div className="font-mono text-[0.6rem] tracking-wide text-core/45 mt-2 break-all">{wallet.address}</div>

        <div className="mt-5 pt-5 border-t border-core/10 flex items-baseline justify-between gap-4">
          <div>
            <div className="font-mono text-[0.6rem] tracking-wide text-core/50">balance</div>
            <div className="font-display text-[2rem] font-semibold text-core leading-none tracking-tight tabular-nums mt-1.5">
              ${wallet.balance.toFixed(2)} <span className="font-mono text-[0.7rem] tracking-wide text-core/45 ml-1">usdc</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[0.6rem] tracking-wide text-core/50">{wallet.label}</div>
            <div className="font-mono text-[0.62rem] text-core/55 mt-1">agent {wallet.agent} · {wallet.id}</div>
            <div className="font-mono text-[0.6rem] text-core/40 mt-0.5">created {wallet.created}</div>
          </div>
        </div>
      </div>

      {wallet.sessionKey ? (
        <SessionKeyPanel k={wallet.sessionKey} walletLabel={wallet.label} />
      ) : (
        <div className="rounded-2xl border border-dashed border-core/20 bg-white/30 p-6 flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-[0.95rem] font-medium text-core tracking-tight">No active session key</div>
            <div className="font-mono text-[0.65rem] text-core/55 mt-1.5">Agents need a session key to spend from this wallet at runtime.</div>
          </div>
          <button
            onClick={() => notify('Mint session key — coming soon')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-[0.78rem] tracking-tight shadow-sm hover:opacity-90 transition-opacity shrink-0"
            style={{ backgroundColor: '#1A151C' }}
          >
            Mint session key <span aria-hidden>+</span>
          </button>
        </div>
      )}

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-display text-[0.95rem] font-semibold text-core tracking-tight">Recent receipts</h3>
          <span className="font-mono text-[0.6rem] tracking-wide text-core/45">last 5</span>
        </div>
        <div className="rounded-2xl border border-core/12 bg-white/55 overflow-hidden">
          {recent.length === 0 && (
            <div className="px-5 py-10 text-center font-mono text-[0.72rem] tracking-wide text-core/45">no receipts yet</div>
          )}
          {recent.map((t) => (
            <div key={t.id} className="grid grid-cols-[0.7fr_1.6fr_0.8fr_0.9fr_1fr] gap-3 px-5 py-3 border-b border-core/8 last:border-b-0 items-center">
              <span className="font-mono text-[0.7rem] text-core/65 tabular-nums">{t.time}</span>
              <span className="font-mono text-[0.72rem] text-core truncate">{t.merchant}</span>
              <span className="font-mono text-[0.72rem] text-core tabular-nums">${t.amount.toFixed(2)}</span>
              <TxStatusPill s={t.status} />
              <TxHashLink hash={t.hash} chain={t.chain} />
            </div>
          ))}
        </div>
      </div>

      {exportOpen && <ExportKeyModal wallet={wallet} onClose={() => setExportOpen(false)} />}
      {topUpOpen && <TopUpModal wallets={walletRows} presetChain={wallet.chain} onClose={() => setTopUpOpen(false)} />}
    </div>
  )
}

function ReceiptsSection() {
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'all'>('all')
  const visible = statusFilter === 'all' ? txRows : txRows.filter((t) => t.status === statusFilter)
  const totalSpend = txRows.filter((t) => t.status === 'success').reduce((a, t) => a + t.amount, 0)
  const successCount = txRows.filter((t) => t.status === 'success').length
  const failedCount = txRows.filter((t) => t.status === 'failed').length

  return (
    <div>
      <SectionHeader
        title="Receipts"
        sub="Every agent payment your tenant has settled. Click a row for the full request and on-chain hash."
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
          <span>Time</span>
          <span>Agent</span>
          <span>Merchant</span>
          <span>Amount</span>
          <span>Chain</span>
          <span>Status</span>
          <span>Hash</span>
        </div>
        {visible.map((t) => (
          <div key={t.id} className="grid grid-cols-[0.7fr_1fr_1.6fr_0.8fr_0.8fr_0.9fr_1fr] gap-3 px-5 py-3 border-b border-core/8 last:border-b-0 items-center">
            <span className="font-mono text-[0.7rem] text-core/65 tabular-nums">{t.time}</span>
            <span className="font-mono text-[0.72rem] text-core/75 truncate">{t.agent}</span>
            <span className="font-mono text-[0.72rem] text-core truncate">{t.merchant}</span>
            <span className="font-mono text-[0.72rem] text-core tabular-nums">${t.amount.toFixed(2)}</span>
            <ChainBadge chain={t.chain} size={16} />
            <TxStatusPill s={t.status} />
            <TxHashLink hash={t.hash} chain={t.chain} />
          </div>
        ))}
        {visible.length === 0 && (
          <div className="px-5 py-12 text-center font-mono text-[0.72rem] tracking-wide text-core/45">no transactions match</div>
        )}
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
          <span>Name</span>
          <span>Secret</span>
          <span>Publishable</span>
          <span>Created</span>
          <span>Last used</span>
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
          <span>Time</span><span>Method</span><span>Endpoint</span><span>Status</span><span>Latency</span><span>Request id</span><span>Key</span>
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
  { id: 'receipts',     label: 'Receipts',     icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h3"/></svg> },
  { id: 'keys',         label: 'API keys',     icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 14h3"/></svg> },
  { id: 'logs',         label: 'Logs',         icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h10"/></svg> },
]

function AccountMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const signOut = () => {
    setOpen(false)
    setAuthed(false)
    window.location.hash = ''
  }

  return (
    <div ref={ref} className="relative">
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-core/12 bg-[#FAF1E4] shadow-[0_18px_40px_-22px_rgba(26,21,28,0.5)] overflow-hidden">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/55 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#9c2929]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            <span className="font-display text-[0.8rem] font-medium text-[#9c2929]">Sign out</span>
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-2.5 rounded-lg border border-core/10 bg-white/40 px-3 py-2.5 text-left hover:bg-white/60 transition-colors ${open ? 'bg-white/60' : ''}`}
      >
        <div className="w-7 h-7 rounded-full bg-core/15 flex items-center justify-center font-display text-[0.75rem] font-semibold text-core">{account.email[0]}</div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-[0.78rem] font-medium text-core truncate">{account.company}</div>
          <div className="font-mono text-[0.6rem] text-core/55 truncate">{account.tenant_id}</div>
        </div>
        <svg viewBox="0 0 24 24" className={`w-3 h-3 text-core/45 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  )
}

export default function Dashboard() {
  const [section, setSectionState] = useState<Section>('overview')
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const env: Env = 'live'

  const setSection = (s: Section) => {
    setSectionState(s)
    if (s !== 'wallets') setSelectedWallet(null)
  }

  const activeWallet = selectedWallet ? walletRows.find((w) => w.id === selectedWallet) ?? null : null

  return (
    <div className="relative min-h-screen bg-peach text-core">
      <div aria-hidden="true" className="bg-noise pointer-events-none" style={{ opacity: 0.35 }} />

      <aside className="lg:fixed lg:inset-y-0 lg:left-0 lg:w-[232px] lg:border-r lg:border-core/10 lg:bg-[#EFE3D3]/55 lg:backdrop-blur-sm lg:flex lg:flex-col z-20">
        <div className="px-5 pt-8 pb-7">
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '' }} className="font-display text-[1.3rem] tracking-[0.2em] font-semibold text-core hover:opacity-70 transition-opacity">Atara</a>
          <div className="font-mono text-[0.55rem] tracking-wide text-core/45 mt-1.5">dashboard</div>
        </div>

        <nav className="px-3 flex flex-col gap-0.5 flex-1">
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

        <div className="px-5 pt-5 pb-6 mt-4 border-t border-core/8">
          <AccountMenu />
        </div>
      </aside>

      <main className="relative z-10 lg:pl-[232px]">
        <div className="px-6 md:px-10 lg:pl-14 lg:pr-12 pt-12 pb-24 max-w-[1160px]">
          {section === 'overview' && <OverviewSection />}
          {section === 'wallets' && (
            activeWallet
              ? <WalletDetailView wallet={activeWallet} onBack={() => setSelectedWallet(null)} />
              : <WalletsSection onSelect={setSelectedWallet} />
          )}
          {section === 'receipts' && <ReceiptsSection />}
          {section === 'keys' && <KeysSection env={env} />}
          {section === 'logs' && <LogsSection env={env} />}
          {section === 'settings' && <SettingsSection />}
        </div>
      </main>
    </div>
  )
}
