import { useEffect, useState } from 'react'
import { setAuthed } from '../auth'

type Step = 'email' | 'verify' | 'approving'

const mockHasPasskey = (email: string) => /p/i.test(email)

export default function Login() {
  const [email, setEmail] = useState('')
  const [lookupState, setLookupState] = useState<'idle' | 'checking' | 'has-passkey' | 'no-passkey'>('idle')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [step, setStep] = useState<Step>('email')

  useEffect(() => {
    if (resendIn <= 0) return
    const t = window.setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [resendIn])

  useEffect(() => {
    if (!email || !/.+@.+\..+/.test(email)) {
      setLookupState('idle')
      return
    }
    setLookupState('checking')
    const t = window.setTimeout(() => {
      setLookupState(mockHasPasskey(email) ? 'has-passkey' : 'no-passkey')
    }, 450)
    return () => window.clearTimeout(t)
  }, [email])

  const sendCode = () => {
    setCodeSent(true)
    setResendIn(60)
  }

  const finish = async () => {
    setStep('approving')
    await new Promise((r) => setTimeout(r, 900))
    setAuthed(true)
    window.location.hash = '#/dashboard'
  }

  const useTouchId = lookupState === 'has-passkey'
  const canSubmit = useTouchId || (lookupState === 'no-passkey' && code.length === 6)

  return (
    <div className="relative min-h-screen w-full bg-peach overflow-hidden">
      <div aria-hidden="true" className="bg-noise pointer-events-none" />

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

      <header className="relative z-10 flex items-center px-6 md:px-10 py-6">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.location.hash = '' }}
          className="font-display text-2xl tracking-[0.2em] font-semibold text-core hover:text-glow transition-colors"
        >
          Atara
        </a>
      </header>

      <main className="relative z-10 px-6 pb-20 pt-2 flex justify-center">
        <div className="w-full max-w-[440px]">
          <div className="rounded-3xl border border-core/12 bg-white/75 backdrop-blur-sm shadow-[0_2px_30px_-12px_rgba(26,21,28,0.18)] p-7 md:p-9">
            <h1 className="font-display text-[1.7rem] md:text-[2rem] leading-[1.1] font-semibold text-core tracking-tight">
              Log in
            </h1>
            <p className="mt-2 text-[0.95rem] text-core/65 leading-snug">
              Sign in to your Atara account.
            </p>

            <div className="mt-6">
              <label className="block">
                <div className="font-mono text-[0.68rem] text-core/55 mb-1.5">email</div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setCodeSent(false); setCode('') }}
                    placeholder="you@example.com"
                    autoFocus
                    className={`w-full bg-white/70 border border-core/12 rounded-xl py-2.5 font-mono text-[0.85rem] text-core placeholder:text-core/30 focus:outline-none focus:border-glow ${
                      lookupState === 'no-passkey' ? 'pl-3.5 pr-[7.5rem]' : 'pl-3.5 pr-3.5'
                    }`}
                  />
                  {lookupState === 'checking' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.65rem] text-core/40">checking…</div>
                  )}
                  {lookupState === 'has-passkey' && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.6rem] tracking-widest text-[#3F7E4F]">passkey ✓</div>
                  )}
                  {lookupState === 'no-passkey' && (
                    <button
                      onClick={sendCode}
                      disabled={codeSent && resendIn > 0}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-core text-peach font-display text-[0.74rem] font-semibold px-3 py-1.5 hover:bg-core/90 disabled:bg-core/25 disabled:cursor-not-allowed transition-colors tracking-tight whitespace-nowrap"
                    >
                      {!codeSent ? 'Send code' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend'}
                    </button>
                  )}
                </div>
              </label>

              {lookupState === 'no-passkey' && (
                <label className="block mt-3 animate-fade-in">
                  <div className="font-mono text-[0.68rem] text-core/55 mb-1.5">verify</div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full bg-white/70 border border-core/12 rounded-xl px-3.5 py-2.5 font-mono text-[1rem] text-core tracking-[0.4em] tabular-nums text-center placeholder:text-core/20 focus:outline-none focus:border-glow"
                  />
                </label>
              )}
            </div>

            <button
              onClick={finish}
              disabled={!canSubmit || step === 'approving'}
              className="w-full mt-6 rounded-2xl bg-core text-peach py-3.5 px-5 flex items-center justify-center gap-3 hover:bg-core/90 disabled:bg-core/25 disabled:cursor-not-allowed transition-colors"
            >
              {step === 'approving' ? (
                <>
                  <span className="w-5 h-5 border-2 border-peach/30 border-t-peach rounded-full animate-spin" />
                  <span className="font-display font-semibold text-[0.95rem] tracking-tight">
                    {useTouchId ? 'Waiting for Touch ID…' : 'Signing in…'}
                  </span>
                </>
              ) : (
                <>
                  {useTouchId && (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 11c0-1.1.9-2 2-2s2 .9 2 2v3a4 4 0 01-4 4" />
                      <path d="M8 11c0-2.2 1.8-4 4-4s4 1.8 4 4" />
                      <path d="M5 11c0-3.9 3.1-7 7-7s7 3.1 7 7v3a7 7 0 01-7 7" />
                      <path d="M12 14v3" />
                    </svg>
                  )}
                  <span className="font-display font-semibold text-[0.95rem] tracking-tight">
                    {useTouchId ? 'Continue with Touch ID' : 'Sign in'}
                  </span>
                </>
              )}
            </button>

            <div className="mt-4 pt-4 border-t border-core/8 font-mono text-[0.65rem] text-core/40 leading-relaxed text-center">
              New to Atara? Enter your email — we'll set you up.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
