import { useEffect, useRef } from 'react'

type Orbit = {
  rx: number
  ry: number
  rot: number
  speed: number
  phase: number
  nodes: number
}

export default function OrbitVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let t = 0

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

    const orbits: Orbit[] = [
      { rx: 0.42, ry: 0.18, rot: -0.15, speed: 0.0008, phase: 0, nodes: 6 },
      { rx: 0.34, ry: 0.32, rot: 0.55, speed: -0.0012, phase: 1.4, nodes: 5 },
      { rx: 0.46, ry: 0.12, rot: 1.3, speed: 0.0006, phase: 2.7, nodes: 4 },
      { rx: 0.28, ry: 0.26, rot: -0.7, speed: -0.0014, phase: 3.9, nodes: 7 },
    ]

    type Pulse = { orbitIdx: number; from: number; to: number; t: number; speed: number }
    const pulses: Pulse[] = []

    const colorBase = 'rgba(26, 21, 28, '
    const colorAccent = 'rgba(140, 182, 232, '
    const colorWarm = 'rgba(237, 161, 103, '

    const draw = () => {
      raf = requestAnimationFrame(draw)
      t += 1

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.5

      ctx.clearRect(0, 0, w, h)

      // Soft halo around the core
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.55)
      halo.addColorStop(0, colorAccent + '0.18)')
      halo.addColorStop(0.5, colorAccent + '0.04)')
      halo.addColorStop(1, colorAccent + '0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.55, 0, Math.PI * 2)
      ctx.fill()

      // Orbit rings + nodes
      const nodePositions: { x: number; y: number; orbitIdx: number; nodeIdx: number }[] = []

      orbits.forEach((o, oi) => {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(o.rot)

        // Ring
        ctx.beginPath()
        ctx.strokeStyle = colorBase + '0.18)'
        ctx.lineWidth = 0.75
        ctx.ellipse(0, 0, R * o.rx, R * o.ry, 0, 0, Math.PI * 2)
        ctx.stroke()

        // Nodes
        const angleStep = (Math.PI * 2) / o.nodes
        const baseAngle = o.phase + t * o.speed
        for (let i = 0; i < o.nodes; i++) {
          const a = baseAngle + i * angleStep
          const lx = Math.cos(a) * R * o.rx
          const ly = Math.sin(a) * R * o.ry
          // back to world coords (un-rotate)
          const wx = cx + (lx * Math.cos(o.rot) - ly * Math.sin(o.rot))
          const wy = cy + (lx * Math.sin(o.rot) + ly * Math.cos(o.rot))
          nodePositions.push({ x: wx, y: wy, orbitIdx: oi, nodeIdx: i })

          // Node dot (in local frame for crispness)
          const pulse = 0.6 + 0.4 * Math.sin(t * 0.04 + i * 1.7 + oi)
          ctx.beginPath()
          ctx.fillStyle = colorBase + (0.55 + pulse * 0.25) + ')'
          ctx.arc(lx, ly, 1.6, 0, Math.PI * 2)
          ctx.fill()

          // Soft glow around brightest nodes
          if (pulse > 0.85) {
            const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 8)
            g.addColorStop(0, colorAccent + '0.5)')
            g.addColorStop(1, colorAccent + '0)')
            ctx.fillStyle = g
            ctx.beginPath()
            ctx.arc(lx, ly, 8, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.restore()
      })

      // Spawn pulses occasionally
      if (Math.random() < 0.03 && pulses.length < 8) {
        const orbitIdx = Math.floor(Math.random() * orbits.length)
        const o = orbits[orbitIdx]
        const from = Math.floor(Math.random() * o.nodes)
        let to = from
        while (to === from) to = Math.floor(Math.random() * o.nodes)
        pulses.push({ orbitIdx, from, to, t: 0, speed: 0.012 + Math.random() * 0.012 })
      }

      // Draw pulses traveling between nodes on the same orbit
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.t += p.speed
        if (p.t >= 1) {
          pulses.splice(i, 1)
          continue
        }
        const o = orbits[p.orbitIdx]
        const angleStep = (Math.PI * 2) / o.nodes
        const baseAngle = o.phase + t * o.speed
        const aFrom = baseAngle + p.from * angleStep
        const aTo = baseAngle + p.to * angleStep
        // pick shortest direction
        let delta = aTo - aFrom
        while (delta > Math.PI) delta -= Math.PI * 2
        while (delta < -Math.PI) delta += Math.PI * 2
        const a = aFrom + delta * p.t
        const lx = Math.cos(a) * R * o.rx
        const ly = Math.sin(a) * R * o.ry
        const wx = cx + (lx * Math.cos(o.rot) - ly * Math.sin(o.rot))
        const wy = cy + (lx * Math.sin(o.rot) + ly * Math.cos(o.rot))
        const alpha = Math.sin(p.t * Math.PI)
        const g = ctx.createRadialGradient(wx, wy, 0, wx, wy, 14)
        g.addColorStop(0, colorWarm + alpha * 0.9 + ')')
        g.addColorStop(1, colorWarm + '0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(wx, wy, 14, 0, Math.PI * 2)
        ctx.fill()
      }

      // Connection lines between brightest cross-orbit pairs
      for (let i = 0; i < nodePositions.length; i += 3) {
        const a = nodePositions[i]
        const b = nodePositions[(i + 7) % nodePositions.length]
        if (a.orbitIdx === b.orbitIdx) continue
        const dx = a.x - b.x
        const dy = a.y - b.y
        const d = Math.hypot(dx, dy)
        if (d > R * 0.8) continue
        const flicker = 0.04 + 0.06 * Math.sin(t * 0.03 + i)
        ctx.strokeStyle = colorBase + flicker + ')'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // Core
      const corePulse = 0.7 + 0.3 * Math.sin(t * 0.03)
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18)
      coreGrad.addColorStop(0, colorWarm + corePulse * 0.95 + ')')
      coreGrad.addColorStop(0.4, colorWarm + corePulse * 0.5 + ')')
      coreGrad.addColorStop(1, colorWarm + '0)')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(cx, cy, 18, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = colorBase + '0.95)'
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fill()

      // Crosshair ticks
      ctx.strokeStyle = colorBase + '0.15)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx, cy - R * 0.6); ctx.lineTo(cx, cy - R * 0.55)
      ctx.moveTo(cx, cy + R * 0.55); ctx.lineTo(cx, cy + R * 0.6)
      ctx.moveTo(cx - R * 0.6, cy); ctx.lineTo(cx - R * 0.55, cy)
      ctx.moveTo(cx + R * 0.55, cy); ctx.lineTo(cx + R * 0.6, cy)
      ctx.stroke()
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
      <div className="absolute top-3 left-3 text-[0.6rem] tracking-widest text-muted font-mono">
        agent_orbit / live
      </div>
      <div className="absolute bottom-3 right-3 text-[0.6rem] tracking-widest text-muted font-mono">
        consensus.routing
      </div>
    </div>
  )
}
