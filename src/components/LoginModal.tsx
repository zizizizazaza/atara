import { useEffect, useState } from 'react'
import { setAuthed } from '../auth'

const mockHasPasskey = (email: string) => /p/i.test(email)

type Method = 'idle' | 'google' | 'twitter' | 'wallet' | 'email'

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [busy, setBusy] = useState<Method>('idle')
  const [email, setEmail] = useState('')
  const [lookupState, setLookupState] = useState<'idle' | 'checking' | 'has-passkey' | 'no-passkey'>('idle')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (!open) {
      setBusy('idle')
      setEmail('')
      setCode('')
      setCodeSent(false)
      setResendIn(0)
      setLookupState('idle')
    }
  }, [open])

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

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const completeLogin = async (method: Method, ms = 900) => {
    setBusy(method)
    await new Promise((r) => setTimeout(r, ms))
    setAuthed(true)
    onClose()
    window.location.hash = '#/dashboard'
  }

  const sendCode = () => {
    setCodeSent(true)
    setResendIn(60)
  }

  const useTouchId = lookupState === 'has-passkey'
  const canSubmitEmail = useTouchId || (lookupState === 'no-passkey' && code.length === 6)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <button
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-core/55 backdrop-blur-md"
      />
      <div className="relative w-full max-w-[420px] rounded-3xl border border-core/10 bg-[#FBF6EE] shadow-[0_40px_100px_-24px_rgba(26,21,28,0.55)] animate-scale-in overflow-hidden">
        <div
          aria-hidden
          className="absolute -bottom-32 -left-24 w-[280px] h-[280px] rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, #C28A2C, transparent 65%)' }}
        />

        <button
          onClick={onClose}
          aria-label="close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full text-core/45 hover:text-core hover:bg-core/8 transition-colors flex items-center justify-center z-10"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="relative px-8 md:px-9 pt-9 pb-7">
          <h2 className="font-display text-[1.75rem] leading-[1.05] font-semibold text-core tracking-[-0.01em]">
            Login
          </h2>
          <p className="mt-2.5 text-[0.85rem] text-core/55 leading-snug">
            Sign in to manage your agent wallets.
          </p>

          <div className="mt-7 space-y-2.5">
            <ProviderButton
              label="Continue with Google"
              busy={busy === 'google'}
              disabled={busy !== 'idle'}
              onClick={() => completeLogin('google')}
              icon={<GoogleIcon />}
            />
            <ProviderButton
              label="Continue with X"
              busy={busy === 'twitter'}
              disabled={busy !== 'idle'}
              onClick={() => completeLogin('twitter')}
              icon={<TwitterIcon />}
            />
            <ProviderButton
              label="Connect Web3 wallet"
              busy={busy === 'wallet'}
              disabled={busy !== 'idle'}
              onClick={() => completeLogin('wallet', 1100)}
              icon={<WalletIcon />}
            />
          </div>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-core/12" />
            <span className="font-mono text-[0.6rem] tracking-[0.22em] text-core/40">or with email</span>
            <div className="h-px flex-1 bg-core/12" />
          </div>

          <label className="block">
            <div className="font-mono text-[0.62rem] tracking-wide text-core/55 mb-1.5">Email</div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setCodeSent(false); setCode('') }}
                placeholder="you@example.com"
                className={`w-full bg-white border border-core/15 rounded-xl py-3 font-mono text-[0.85rem] text-core placeholder:text-core/30 focus:outline-none focus:border-core/50 transition-colors ${
                  lookupState === 'no-passkey' ? 'pl-3.5 pr-[7.5rem]' : 'pl-3.5 pr-3.5'
                }`}
              />
              {lookupState === 'checking' && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[0.62rem] text-core/40">checking…</div>
              )}
              {lookupState === 'has-passkey' && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 font-mono text-[0.62rem] tracking-wide text-[#3F7E4F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3F7E4F]" /> passkey
                </div>
              )}
              {lookupState === 'no-passkey' && (
                <button
                  onClick={sendCode}
                  disabled={codeSent && resendIn > 0}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-core text-peach font-display text-[0.72rem] font-semibold px-3 py-1.5 hover:bg-core/90 disabled:bg-core/25 disabled:cursor-not-allowed transition-colors tracking-tight whitespace-nowrap"
                >
                  {!codeSent ? 'Send code' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend'}
                </button>
              )}
            </div>
          </label>

          {lookupState === 'no-passkey' && (
            <label className="block mt-3 animate-fade-in">
              <div className="font-mono text-[0.62rem] tracking-wide text-core/55 mb-1.5">Verification code</div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full bg-white border border-core/15 rounded-xl px-3.5 py-3 font-mono text-[1.05rem] text-core tracking-[0.4em] tabular-nums text-center placeholder:text-core/20 focus:outline-none focus:border-core/50"
              />
            </label>
          )}

          <button
            onClick={() => completeLogin('email')}
            disabled={!canSubmitEmail || busy !== 'idle'}
            className="w-full mt-6 rounded-2xl bg-core text-peach py-3.5 px-5 flex items-center justify-center gap-2.5 hover:bg-core/90 disabled:bg-core/25 disabled:cursor-not-allowed transition-colors shadow-[0_10px_24px_-12px_rgba(26,21,28,0.5)]"
          >
            {busy === 'email' ? (
              <>
                <span className="w-4 h-4 border-2 border-peach/30 border-t-peach rounded-full animate-spin" />
                <span className="font-display font-semibold text-[0.92rem] tracking-tight">
                  {useTouchId ? 'Waiting for Touch ID…' : 'Signing in…'}
                </span>
              </>
            ) : (
              <>
                {useTouchId && (
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 11c0-1.1.9-2 2-2s2 .9 2 2v3a4 4 0 01-4 4" />
                    <path d="M8 11c0-2.2 1.8-4 4-4s4 1.8 4 4" />
                    <path d="M5 11c0-3.9 3.1-7 7-7s7 3.1 7 7v3a7 7 0 01-7 7" />
                    <path d="M12 14v3" />
                  </svg>
                )}
                <span className="font-display font-semibold text-[0.92rem] tracking-tight">
                  {useTouchId ? 'Continue with Touch ID' : 'Sign in with email'}
                </span>
              </>
            )}
          </button>

          <div className="mt-6 pt-5 border-t border-core/8 font-mono text-[0.58rem] tracking-wide text-core/40 leading-relaxed text-center">
            By continuing you agree to Atara's Terms and Privacy.
          </div>
        </div>
      </div>
    </div>
  )
}

function ProviderButton({
  label,
  icon,
  busy,
  disabled,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  busy: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative w-full flex items-center justify-center gap-3 rounded-xl border border-core/12 bg-white px-4 py-3 text-[0.9rem] text-core font-medium hover:border-core/30 hover:bg-white hover:shadow-[0_8px_22px_-12px_rgba(26,21,28,0.25)] hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
    >
      <span className="w-6 h-6 flex items-center justify-center shrink-0">
        {busy ? (
          <span className="w-4 h-4 border-2 border-core/25 border-t-core rounded-full animate-spin" />
        ) : (
          icon
        )}
      </span>
      <span className="font-display tracking-tight">{label}</span>
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[19px] h-[19px]" fill="#1A151C">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="#1A151C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2H5a2 2 0 0 0-2 2V7z" />
      <path d="M3 11h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" />
      <circle cx="16" cy="15" r="1.2" fill="#1A151C" stroke="none" />
    </svg>
  )
}
