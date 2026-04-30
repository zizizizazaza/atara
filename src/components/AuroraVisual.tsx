import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AuroraVisual() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current!
    const rect = mount.getBoundingClientRect()
    const W = rect.width
    const H = rect.height

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100)
    camera.position.set(0, 0.15, 5.2)
    camera.lookAt(0, 0, 0)

    const group = new THREE.Group()
    // Tilt the whole sphere strongly so horizontal rings read as 3D
    group.rotation.x = -0.45
    group.rotation.z = 0.12
    scene.add(group)

    type Ring = {
      line: THREE.LineLoop
      baseRadius: number
      y: number
      speed: number
      phase: number
    }

    const rings: Ring[] = []
    const RING_COUNT = 14
    const SPHERE_R = 1.5
    const SEGMENTS = 128

    for (let i = 0; i < RING_COUNT; i++) {
      // Distribute y from -1 to 1 of the sphere, slightly biased toward equator
      const tNorm = i / (RING_COUNT - 1)
      const y = (tNorm * 2 - 1) * SPHERE_R * 0.98
      const baseRadius = Math.sqrt(Math.max(0, SPHERE_R * SPHERE_R - y * y))

      // Pre-allocate buffer for the ring (closed loop)
      const positions = new Float32Array(SEGMENTS * 3)
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      // Edge rings get fainter
      const fade = 1 - Math.pow(Math.abs(tNorm - 0.5) * 2, 2.5) * 0.6
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#1A151C'),
        transparent: true,
        opacity: 0.55 * fade,
      })

      const line = new THREE.LineLoop(geo, mat)
      group.add(line)

      rings.push({
        line,
        baseRadius,
        y,
        speed: 0.12 + Math.random() * 0.18 + (1 - Math.abs(tNorm - 0.5)) * 0.18,
        phase: Math.random() * Math.PI * 2,
      })
    }

    let raf = 0
    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Rebuild each ring's geometry with current animation state
      rings.forEach((ring) => {
        const pos = ring.line.geometry.attributes.position as THREE.BufferAttribute
        const arr = pos.array as Float32Array
        const rotation = ring.phase + t * ring.speed

        // Vertical breathing
        const breath = Math.sin(t * 0.6 + ring.phase) * 0.04
        const yPos = ring.y + breath

        // Pulse traveling vertically — visible "wave"
        const pulse = Math.sin(t * 1.2 - ring.y * 1.8) * 0.07
        const radius = ring.baseRadius + pulse

        for (let s = 0; s < SEGMENTS; s++) {
          const angle = (s / SEGMENTS) * Math.PI * 2 + rotation
          arr[s * 3] = Math.cos(angle) * radius
          arr[s * 3 + 1] = yPos
          arr[s * 3 + 2] = Math.sin(angle) * radius
        }
        pos.needsUpdate = true
      })

      // Slow overall tumble (multi-axis so horizontal rings clearly move)
      group.rotation.y = t * 0.22
      group.rotation.x = -0.45 + Math.sin(t * 0.3) * 0.12
      group.rotation.z = 0.12 + Math.cos(t * 0.2) * 0.06

      renderer.render(scene, camera)
    }
    animate()

    const ro = new ResizeObserver(() => {
      const r = mount.getBoundingClientRect()
      renderer.setSize(r.width, r.height)
      camera.aspect = r.width / r.height
      camera.updateProjectionMatrix()
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      rings.forEach((r) => {
        r.line.geometry.dispose()
        ;(r.line.material as THREE.Material).dispose()
      })
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="relative w-full aspect-square max-w-[520px] ml-auto">
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  )
}
