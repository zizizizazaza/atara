import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

type ToastState = {
  notify: (message: string) => void
}

const Ctx = createContext<ToastState | null>(null)

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const notify = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 2400)
  }, [])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <div
        aria-live="polite"
        className={`fixed top-6 right-6 z-[100] pointer-events-none transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {message && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium tracking-wide shadow-lg"
            style={{ backgroundColor: '#1A151C' }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#F59E5B' }}
              aria-hidden
            />
            {message}
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}
