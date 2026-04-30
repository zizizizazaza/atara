import { useEffect, useRef } from 'react'

export default function HudVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let raf = 0
    let t0 = performance.now()

    const ink = (a: number) => `rgba(26, 21, 28, ${a})`
    const warm = (a: number) => `rgba(212, 97, 40, ${a})`

    const draw = () => {
      raf = requestAnimationFrame(draw)
      const now = performance.now()
      const t = (now - t0) / 1000

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.46

      ctx.clearRect(0, 0, w, h)

      // Outer faint disc — soft halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.15, cx, cy, R * 1.05)
      halo.addColorStop(0, 'rgba(237, 161, 103, 0.18)')
      halo.addColorStop(0.55, 'rgba(237, 161, 103, 0.04)')
      halo.addColorStop(1, 'rgba(237, 161, 103, 0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2)
      ctx.fill()

      // ── Outermost ring with ticks (rotates slowly) ───────────────────────
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * 0.04)
      ctx.strokeStyle = ink(0.35)
      ctx.lineWidth = 0.75
      ctx.beginPath()
      ctx.arc(0, 0, R * 0.96, 0, Math.PI * 2)
      ctx.stroke()
      // Major ticks every 30°, minor every 6°
      for (let deg = 0; deg < 360; deg += 6) {
        const major = deg % 30 === 0
        const a = (deg * Math.PI) / 180
        const r1 = R * 0.96
        const r2 = R * (major ? 0.91 : 0.94)
        ctx.strokeStyle = ink(major ? 0.55 : 0.22)
        ctx.lineWidth = major ? 1 : 0.5
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1)
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2)
        ctx.stroke()
      }
      // Compass labels at every 45°
      ctx.fillStyle = ink(0.55)
      ctx.font = '500 9px "Space Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const labels = ['000', '045', '090', '135', '180', '225', '270', '315']
      labels.forEach((l, i) => {
        const a = (i * 45 * Math.PI) / 180
        const r = R * 0.86
        ctx.fillText(l, Math.cos(a) * r, Math.sin(a) * r)
      })
      ctx.restore()

      // ── Mid ring (rotates opposite, with broken arcs) ────────────────────
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-t * 0.07)
      ctx.lineWidth = 1
      const arcs = [
        { a: 0.05, len: 0.6, color: ink(0.5) },
        { a: 0.85, len: 0.4, color: ink(0.5) },
        { a: 1.5, len: 0.25, color: warm(0.6) },
        { a: 2.0, len: 0.2, color: ink(0.4) },
        { a: 2.6, len: 0.5, color: ink(0.5) },
        { a: 4.0, len: 0.35, color: ink(0.4) },
        { a: 4.7, len: 0.45, color: ink(0.5) },
        { a: 5.6, len: 0.18, color: warm(0.55) },
      ]
      arcs.forEach((seg) => {
        ctx.strokeStyle = seg.color
        ctx.beginPath()
        ctx.arc(0, 0, R * 0.74, seg.a, seg.a + seg.len)
        ctx.stroke()
      })
      ctx.restore()

      // ── Inner ring (full, with breathing dashed pattern) ─────────────────
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * 0.12)
      ctx.strokeStyle = ink(0.4)
      ctx.lineWidth = 1
      const dashLen = 6 + Math.sin(t * 0.6) * 1.5
      ctx.setLineDash([dashLen, dashLen])
      ctx.beginPath()
      ctx.arc(0, 0, R * 0.58, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // ── Solid faint ring close to center ─────────────────────────────────
      ctx.strokeStyle = ink(0.2)
      ctx.lineWidth = 0.75
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.42, 0, Math.PI * 2)
      ctx.stroke()

      // ── Sweeping radius (radar-style) ────────────────────────────────────
      ctx.save()
      ctx.translate(cx, cy)
      const sweep = t * 0.9
      ctx.rotate(sweep)
      const sweepGrad = ctx.createLinearGradient(0, 0, R * 0.96, 0)
      sweepGrad.addColorStop(0, 'rgba(212, 97, 40, 0.0)')
      sweepGrad.addColorStop(0.5, 'rgba(212, 97, 40, 0.35)')
      sweepGrad.addColorStop(1, 'rgba(212, 97, 40, 0.0)')
      ctx.strokeStyle = sweepGrad
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(R * 0.96, 0)
      ctx.stroke()
      ctx.restore()

      // ── Center reticle ───────────────────────────────────────────────────
      const corePulse = 0.6 + 0.4 * Math.sin(t * 1.0)
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28)
      coreGrad.addColorStop(0, `rgba(237, 161, 103, ${0.7 * corePulse})`)
      coreGrad.addColorStop(0.4, `rgba(237, 161, 103, ${0.2 * corePulse})`)
      coreGrad.addColorStop(1, 'rgba(237, 161, 103, 0)')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(cx, cy, 28, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = ink(0.9)
      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fill()

      // small + crosshair
      ctx.strokeStyle = ink(0.6)
      ctx.lineWidth = 0.75
      ctx.beginPath()
      ctx.moveTo(cx - 8, cy); ctx.lineTo(cx - 4, cy)
      ctx.moveTo(cx + 4, cy); ctx.lineTo(cx + 8, cy)
      ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy - 4)
      ctx.moveTo(cx, cy + 4); ctx.lineTo(cx, cy + 8)
      ctx.stroke()

      // ── Floating data labels orbiting at slow rate ───────────────────────
      const labels2 = [
        { txt: 'consensus', r: 0.66, speed: 0.05, phase: 0 },
        { txt: 'route.usdc', r: 0.66, speed: 0.05, phase: Math.PI * 0.7 },
        { txt: 'agent.gamma', r: 0.66, speed: 0.05, phase: Math.PI * 1.4 },
      ]
      ctx.font = '400 9px "Space Mono", monospace'
      ctx.fillStyle = ink(0.6)
      labels2.forEach((l) => {
        const a = l.phase + t * l.speed
        const x = cx + Math.cos(a) * R * l.r
        const y = cy + Math.sin(a) * R * l.r
        ctx.beginPath()
        ctx.fillStyle = warm(0.85)
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = ink(0.7)
        ctx.fillText(l.txt, x + 10, y)
      })

      // ── Numeric readouts top-right & bottom-left in mono ─────────────────
      ctx.fillStyle = ink(0.5)
      ctx.textAlign = 'left'
      ctx.font = '400 9px "Space Mono", monospace'
      ctx.fillText('LAT  40.7128° N', 12, 18)
      ctx.fillText('LON  74.0060° W', 12, 30)

      ctx.textAlign = 'right'
      const ts = (t * 1).toFixed(2)
      ctx.fillText(`T+ ${ts}s`, w - 12, h - 18)
      ctx.fillText('SYS · NORMAL', w - 12, h - 6)

      // Subtle vignette
      const v = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.05)
      v.addColorStop(0, 'rgba(0,0,0,0)')
      v.addColorStop(1, 'rgba(0,0,0,0.10)')
      ctx.fillStyle = v
      ctx.fillRect(0, 0, w, h)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="relative w-full aspect-square max-w-[520px] ml-auto">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
