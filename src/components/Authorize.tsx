import { useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastProvider'

type Step = 'review' | 'approving' | 'success'

const parseHashParams = (): Record<string, string> => {
  const hash = window.location.hash
  const q = hash.indexOf('?')
  if (q === -1) return {}
  const params = new URLSearchParams(hash.slice(q + 1))
  const out: Record<string, string> = {}
  params.forEach((v, k) => (out[k] = v))
  return out
}

// mock: emails containing "p" are treated as already bound to a passkey
const mockHasPasskey = (email: string) => /p/i.test(email)

type DurationUnit = 'hour' | 'day'

const formatDuration = (value: number, unit: DurationUnit) => {
  const n = Math.max(1, Math.floor(value || 0))
  return `${n} ${unit}${n === 1 ? '' : 's'}`
}

export default function Authorize() {
  const params = useMemo(parseHashParams, [])
  const pairCode = params.code || 'ATR-7K2P-9XQ4'
  const machine = params.machine || 'ellie-macbook'
  const signedIn = params.signedIn !== '0'
  const hasPasskey = params.passkey !== '0'
  const signedInEmail = 'ellie@atara.com'

  const { notify } = useToast()

  // session (always on, configurable)
  const [perTxLimit, setPerTxLimit] = useState('5.00')
  const [periodTotal, setPeriodTotal] = useState('20.00')
  const [duration, setDuration] = useState('7')
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('day')

  const [step, setStep] = useState<Step>('review')

  // signed-out fallback: email lookup + verification
  const [email, setEmail] = useState('')
  const [lookupState, setLookupState] = useState<'idle' | 'checking' | 'has-passkey' | 'no-passkey'>('idle')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (resendIn <= 0) return
    const t = window.setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [resendIn])

  useEffect(() => {
    if (signedIn) return
    if (!email || !/.+@.+\..+/.test(email)) {
      setLookupState('idle')
      return
    }
    setLookupState('checking')
    const t = window.setTimeout(() => {
      setLookupState(mockHasPasskey(email) ? 'has-passkey' : 'no-passkey')
    }, 450)
    return () => window.clearTimeout(t)
  }, [email, signedIn])

  const validSession = useMemo(() => {
    const a = parseFloat(perTxLimit)
    const b = parseFloat(periodTotal)
    return a > 0 && b > 0 && a <= b
  }, [perTxLimit, periodTotal])

  const needsCode = (signedIn && !hasPasskey) || (!signedIn && lookupState === 'no-passkey')
  const useTouchId = (signedIn && hasPasskey) || (!signedIn && lookupState === 'has-passkey')

  const canApprove = useTouchId || (needsCode && code.length === 6)

  const codeEmail = signedIn ? signedInEmail : email

  const approveViaPasskey = async () => {
    if (!validSession || !canApprove) return
    setStep('approving')
    await new Promise((r) => setTimeout(r, 1100))
    setStep('success')
  }

  const sendCode = () => {
    setCodeSent(true)
    setResendIn(60)
    notify(`Code sent to ${codeEmail}`)
  }

  const reject = () => {
    notify('Authorization rejected')
    window.setTimeout(() => window.close(), 400)
  }

  return (
    <div className="relative min-h-screen w-full bg-peach overflow-hidden">
      <div aria-hidden="true" className="bg-noise pointer-events-none" />

      {/* soft glow */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle at 30% 30%, #8CB6E8, transparent 60%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-32 w-[560px] h-[560px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle at 70% 70%, #E8D5C4, transparent 60%)' }}
      />

      {/* top bar */}
      <header className="relative z-10 flex items-center px-6 md:px-10 py-6">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.location.hash = ''
          }}
          className="font-display text-2xl tracking-[0.2em] font-semibold text-core hover:text-glow transition-colors"
        >
          Atara
        </a>
      </header>

      <main className="relative z-10 px-6 pb-20 pt-2 flex justify-center">
        <div className="w-full max-w-[520px]">
          {step === 'success' ? (
            <SuccessCard
              perTxLimit={perTxLimit}
              periodTotal={periodTotal}
              duration={duration}
              durationUnit={durationUnit}
            />
          ) : (
            <div className="rounded-3xl border border-core/12 bg-white/70 backdrop-blur-sm shadow-[0_2px_30px_-12px_rgba(26,21,28,0.18)] p-7 md:p-9">
              {/* heading */}
              <div className="mb-6">
                <h1 className="font-display text-[1.7rem] md:text-[2rem] leading-[1.1] font-semibold text-core tracking-tight">
                  Authorize
                </h1>
                <p className="mt-2 text-[0.95rem] text-core/65 leading-snug">
                  Atara cli is requesting access to your account.
                </p>
              </div>

              {/* pair code */}
              <div className="rounded-2xl border border-core/12 bg-cool/40 px-5 py-4 mb-6">
                <div className="font-mono text-[0.6rem] tracking-[0.22em] text-core/45 mb-1.5">pair code</div>
                <div className="font-mono font-semibold text-[1.7rem] md:text-[1.9rem] text-core tracking-[0.18em] tabular-nums leading-none">
                  {pairCode}
                </div>
                <div className="font-mono text-[0.68rem] text-core/50 mt-2.5 truncate">
                  <span className="text-core/40">machine</span> {machine}
                </div>
              </div>

              {/* session config */}
              <div className="mb-6">
                <div className="font-mono text-[0.6rem] tracking-[0.22em] text-core/45 mb-3">spending limits</div>
                <div className="rounded-2xl border border-core/10 bg-peach/40 p-4 space-y-3">
                  <SessionRow label="Per-transaction limit">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[0.78rem] text-core/55">$</span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={perTxLimit}
                        onChange={(e) => setPerTxLimit(e.target.value)}
                        className="w-20 bg-white/70 border border-core/12 rounded-lg px-2.5 py-1 font-mono text-[0.82rem] text-core text-right tabular-nums focus:outline-none focus:border-glow"
                      />
                    </div>
                  </SessionRow>
                  <SessionRow label="Period total">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[0.78rem] text-core/55">$</span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={periodTotal}
                        onChange={(e) => setPeriodTotal(e.target.value)}
                        className="w-24 bg-white/70 border border-core/12 rounded-lg px-2.5 py-1 font-mono text-[0.82rem] text-core text-right tabular-nums focus:outline-none focus:border-glow"
                      />
                    </div>
                  </SessionRow>
                  <SessionRow label="Authorization expires in">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        step="1"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-16 bg-white/70 border border-core/12 rounded-lg px-2.5 py-1 font-mono text-[0.82rem] text-core text-right tabular-nums focus:outline-none focus:border-glow"
                      />
                      <Select<DurationUnit>
                        value={durationUnit}
                        onChange={setDurationUnit}
                        options={[
                          ['hour', 'Hours'],
                          ['day', 'Days'],
                        ]}
                      />
                    </div>
                  </SessionRow>
                  {!validSession && (
                    <div className="text-[0.72rem] text-[#9c2929] font-mono">
                      Per-transaction limit must be ≤ period total
                    </div>
                  )}
                </div>
              </div>

              {/* account */}
              <div className="border-t border-core/10 pt-5 mb-5">
                <div className="font-mono text-[0.6rem] tracking-[0.22em] text-core/45 mb-3">your account</div>

                {signedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-core/10 bg-white/60 px-3.5 py-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-core/10 text-core/70 flex items-center justify-center font-display text-[0.78rem] font-semibold">
                          e
                        </div>
                        <div className="font-mono text-[0.82rem] text-core truncate">{signedInEmail}</div>
                      </div>
                      {hasPasskey ? (
                        <span className="font-mono text-[0.6rem] tracking-widest text-[#3F7E4F]">signed in</span>
                      ) : (
                        <SendCodeButton codeSent={codeSent} resendIn={resendIn} onSend={sendCode} />
                      )}
                    </div>
                    {!hasPasskey && (
                      <div className="animate-fade-in">
                        <CodeInput code={code} onChange={setCode} />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <label className="block">
                      <div className="font-mono text-[0.68rem] text-core/55 mb-1.5">email</div>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setCodeSent(false)
                            setCode('')
                          }}
                          placeholder="you@example.com"
                          autoFocus
                          className={`w-full bg-white/70 border border-core/12 rounded-xl py-2.5 font-mono text-[0.85rem] text-core placeholder:text-core/30 focus:outline-none focus:border-glow ${
                            lookupState === 'no-passkey' ? 'pl-3.5 pr-[7.5rem]' : 'pl-3.5 pr-3.5'
                          }`}
                        />
                        {lookupState === 'checking' && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.65rem] text-core/40">
                            checking…
                          </div>
                        )}
                        {lookupState === 'has-passkey' && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.6rem] tracking-widest text-[#3F7E4F]">
                            passkey ✓
                          </div>
                        )}
                        {lookupState === 'no-passkey' && (
                          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                            <SendCodeButton codeSent={codeSent} resendIn={resendIn} onSend={sendCode} />
                          </div>
                        )}
                      </div>
                    </label>

                    {lookupState === 'no-passkey' && (
                      <div className="mt-3 animate-fade-in">
                        <CodeInput code={code} onChange={setCode} />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* approve */}
              <PasskeyApprove
                onApprove={approveViaPasskey}
                approving={step === 'approving'}
                disabled={!validSession || !canApprove}
                label={useTouchId ? 'Approve with Touch ID' : 'Approve and connect'}
                useTouchId={useTouchId}
              />

              <button
                onClick={reject}
                className="w-full mt-2.5 font-mono text-[0.74rem] text-core/50 hover:text-core/80 py-2 transition-colors"
              >
                Reject
              </button>

              <div className="mt-4 pt-4 border-t border-core/8 font-mono text-[0.65rem] text-core/40 leading-relaxed">
                You can revoke this authorization any time from your Dashboard.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function CodeInput({
  code,
  onChange,
}: {
  code: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <div className="font-mono text-[0.68rem] text-core/55 mb-1.5">verify</div>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={code}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="000000"
        className="w-full bg-white/70 border border-core/12 rounded-xl px-3.5 py-2.5 font-mono text-[1rem] text-core tracking-[0.4em] tabular-nums text-center placeholder:text-core/20 focus:outline-none focus:border-glow"
      />
    </label>
  )
}

function SendCodeButton({
  codeSent,
  resendIn,
  onSend,
}: {
  codeSent: boolean
  resendIn: number
  onSend: () => void
}) {
  const label = !codeSent ? 'Send code' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend'
  return (
    <button
      onClick={onSend}
      disabled={codeSent && resendIn > 0}
      className="rounded-lg bg-core text-peach font-display text-[0.74rem] font-semibold px-3 py-1.5 hover:bg-core/90 disabled:bg-core/25 disabled:cursor-not-allowed transition-colors tracking-tight whitespace-nowrap"
    >
      {label}
    </button>
  )
}

function SessionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[0.74rem] text-core/65">{label}</span>
      {children}
    </div>
  )
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: [T, string][]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="appearance-none bg-white/70 border border-core/12 rounded-lg pl-2.5 pr-7 py-1 font-mono text-[0.78rem] text-core focus:outline-none focus:border-glow cursor-pointer"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 24 24" className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-core/45 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  )
}

function PasskeyApprove({
  onApprove,
  approving,
  disabled,
  label = 'Approve with Touch ID',
  useTouchId = true,
}: {
  onApprove: () => void
  approving: boolean
  disabled: boolean
  label?: string
  useTouchId?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <button
        onClick={onApprove}
        disabled={disabled || approving}
        className="group relative w-full rounded-2xl bg-core text-peach py-4 px-5 flex items-center justify-center gap-3 hover:bg-core/90 disabled:bg-core/25 disabled:cursor-not-allowed transition-colors"
      >
        {approving ? (
          <>
            <span className="w-5 h-5 border-2 border-peach/30 border-t-peach rounded-full animate-spin" />
            <span className="font-display font-semibold text-[0.95rem] tracking-tight">
              {useTouchId ? 'Waiting for Touch ID…' : 'Approving…'}
            </span>
          </>
        ) : (
          <>
            {useTouchId && (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 11c0-1.1.9-2 2-2s2 .9 2 2v3a4 4 0 01-4 4" />
                <path d="M8 11c0-2.2 1.8-4 4-4s4 1.8 4 4" />
                <path d="M5 11c0-3.9 3.1-7 7-7s7 3.1 7 7v3a7 7 0 01-7 7" />
                <path d="M12 14v3" />
              </svg>
            )}
            <span className="font-display font-semibold text-[0.95rem] tracking-tight">{label}</span>
          </>
        )}
      </button>
    </div>
  )
}

function SuccessCard({
  perTxLimit,
  periodTotal,
  duration,
  durationUnit,
}: {
  perTxLimit: string
  periodTotal: string
  duration: string
  durationUnit: DurationUnit
}) {
  const durationText = formatDuration(parseInt(duration, 10), durationUnit)
  return (
    <div className="rounded-3xl border border-core/12 bg-white/75 backdrop-blur-sm shadow-[0_2px_30px_-12px_rgba(26,21,28,0.18)] p-9 text-center">
      <div className="w-16 h-16 rounded-full bg-[#3F7E4F]/12 text-[#3F7E4F] flex items-center justify-center mx-auto mb-5 animate-scale-in">
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>
      <h2 className="font-display text-[1.4rem] font-semibold text-core tracking-tight mb-1.5">
        Atara cli is connected
      </h2>
      <p className="font-mono text-[0.78rem] text-core/55 mb-6">Your wallet is ready. Return to your terminal.</p>

      <div className="rounded-2xl border border-core/10 bg-peach/40 p-4 text-left space-y-2 mb-6">
        <SummaryRow label="Wallet balance" value="$0.00" />
        <SummaryRow label="Per-transaction" value={`$${perTxLimit}`} />
        <SummaryRow label="Period total" value={`$${periodTotal} / ${durationText}`} />
        <SummaryRow label="Expires" value={durationText} />
      </div>

      <div className="flex gap-2.5">
        <a
          href="#/dashboard"
          className="flex-1 rounded-2xl bg-core text-peach font-display font-semibold text-[0.9rem] py-3 hover:bg-core/90 transition-colors"
        >
          Go to Dashboard
        </a>
        <button
          onClick={() => window.close()}
          className="flex-1 rounded-2xl border border-core/15 text-core font-display font-semibold text-[0.9rem] py-3 hover:bg-core/5 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[0.72rem] text-core/55">{label}</span>
      <span className="font-mono text-[0.82rem] text-core tabular-nums">{value}</span>
    </div>
  )
}
