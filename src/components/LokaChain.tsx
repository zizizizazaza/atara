import { useEffect, useRef } from 'react'
import bodyHtml from './lokachain-imported.html?raw'

type FieldOpts = {
  cell: number
  freqA: number
  freqB: number
  freqC: number
  timeA: number
  timeB: number
  timeC: number
  threshold: number
  alphaScale: number
  nodeRate: number
  nodeColor: string
  ink: string
}

function initAsciiField(field: HTMLElement, opts: FieldOpts) {
  const canvas = document.createElement('canvas')
  field.innerHTML = ''
  field.appendChild(canvas)
  const ctx = canvas.getContext('2d')!
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const CELL = opts.cell
  let cols = 0, rows = 0, cssW = 0, cssH = 0

  const resize = () => {
    const r = field.getBoundingClientRect()
    if (!r.width || !r.height) return
    cssW = r.width; cssH = r.height
    canvas.width = Math.floor(cssW * dpr)
    canvas.height = Math.floor(cssH * dpr)
    canvas.style.width = cssW + 'px'
    canvas.style.height = cssH + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    cols = Math.ceil(cssW / CELL)
    rows = Math.ceil(cssH / CELL)
  }
  resize()

  let resizeTimer: number | undefined
  const onResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(resize, 200)
  }
  window.addEventListener('resize', onResize)

  const start = performance.now() + Math.random() * 4000
  let lastDraw = 0
  let raf = 0

  const draw = (now: number) => {
    raf = requestAnimationFrame(draw)
    if (now - lastDraw < 33) return
    lastDraw = now
    const t = (now - start) / 1000
    ctx.clearRect(0, 0, cssW, cssH)
    ctx.font = '11px "Space Mono", monospace'
    ctx.textBaseline = 'top'
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const w =
          Math.sin(x * opts.freqA + t * opts.timeA) * 0.35 +
          Math.sin(y * opts.freqB - t * opts.timeB) * 0.35 +
          Math.sin((x + y) * opts.freqC + t * opts.timeC) * 0.30
        const b = (w + 1) / 2
        if (b < opts.threshold) continue
        const ch = b > 0.86 ? '◦' : b > 0.68 ? '∙' : '·'
        const alpha = (b - opts.threshold) * opts.alphaScale
        const isNode = Math.sin(x * 1.31 + y * 0.71) > 1 - opts.nodeRate && b > 0.7
        if (isNode) {
          const a = (0.6 + 0.4 * Math.sin(t * 2.4 + x + y)).toFixed(3)
          ctx.fillStyle = opts.nodeColor.replace('ALPHA', a)
          ctx.fillText('+', x * CELL, y * CELL)
        } else {
          ctx.fillStyle = opts.ink.replace('ALPHA', alpha.toFixed(3))
          ctx.fillText(ch, x * CELL, y * CELL)
        }
      }
    }
  }
  raf = requestAnimationFrame(draw)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    window.clearTimeout(resizeTimer)
  }
}

const heroOpts: FieldOpts = {
  cell: 16,
  freqA: 0.18, freqB: 0.22, freqC: 0.12,
  timeA: 0.55, timeB: 0.42, timeC: 0.6,
  threshold: 0.32, alphaScale: 0.55,
  nodeRate: 0.015,
  nodeColor: 'rgba(140,182,232,ALPHA)',
  ink: 'rgba(26,21,28,ALPHA)',
}

function randomizedOpts(seed: number, onDark: boolean): FieldOpts {
  // deterministic-ish per section so reloads feel consistent
  const r = (k: number) => {
    const s = Math.sin(seed * 928.31 + k * 47.13) * 43758.5453
    return s - Math.floor(s)
  }
  return {
    cell: 14 + Math.floor(r(1) * 6),
    freqA: 0.10 + r(2) * 0.18,
    freqB: 0.10 + r(3) * 0.18,
    freqC: 0.06 + r(4) * 0.14,
    timeA: 0.30 + r(5) * 0.45,
    timeB: 0.25 + r(6) * 0.40,
    timeC: 0.35 + r(7) * 0.45,
    threshold: 0.35 + r(8) * 0.08,
    alphaScale: 0.5,
    nodeRate: 0.006 + r(9) * 0.008,
    nodeColor: onDark
      ? 'rgba(232,213,196,ALPHA)'
      : 'rgba(140,182,232,ALPHA)',
    ink: onDark
      ? 'rgba(232,213,196,ALPHA)'
      : 'rgba(26,21,28,ALPHA)',
  }
}

export default function LokaChain() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const cleanups: Array<() => void> = []

    const hero = root.querySelector<HTMLElement>('#ascii-hero')
    if (hero) cleanups.push(initAsciiField(hero, heroOpts))

    // Add a subtler dot field to other sections, with varied params.
    const sections = Array.from(root.querySelectorAll<HTMLElement>('main > section'))
    sections.forEach((section, idx) => {
      // Skip the hero section (it has its own #ascii-hero handled above).
      if (section.querySelector('#ascii-hero')) return
      // Strict-mode remount may have left a stale field behind — clear it.
      section.querySelectorAll('.ascii-field').forEach((el) => el.remove())
      const styles = getComputedStyle(section)
      if (styles.position === 'static') section.style.position = 'relative'
      // Detect dark sections (e.g. AIUSD) by inspecting child background
      const dark = !!section.querySelector<HTMLElement>('.aiusd-stamp')

      // Lift the section's existing content above the (to-be-inserted) field
      // so we don't have to wrestle with z-index escapes.
      Array.from(section.children).forEach((child) => {
        const el = child as HTMLElement
        if (!el.style) return
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
        el.style.zIndex = el.style.zIndex || '1'
      })

      const field = document.createElement('div')
      field.setAttribute('aria-hidden', 'true')
      field.className = 'ascii-field ascii-field-bg'
      // Use a softer, full-bleed mask so the dots are ambient rather than
      // focused like the hero centerpiece.
      const mask = 'radial-gradient(ellipse at 50% 50%, #000 0%, rgba(0,0,0,0.85) 60%, transparent 100%)'
      field.style.maskImage = mask
      ;(field.style as CSSStyleDeclaration & { webkitMaskImage?: string }).webkitMaskImage = mask
      field.style.opacity = dark ? '0.7' : '0.65'
      field.style.zIndex = '0'
      section.insertBefore(field, section.firstChild)
      cleanups.push(initAsciiField(field, randomizedOpts(idx + 1, dark)))
    })

    return () => { cleanups.forEach((c) => c()) }
  }, [])

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
}
