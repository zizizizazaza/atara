import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const noiseGLSL = /* glsl */ `
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  float fbm3(vec3 p) {
    float a = 0.5;
    float s = 0.0;
    for (int i = 0; i < 4; i++) {
      s += a * snoise(p);
      p = p * 2.03 + vec3(11.7, 5.3, 9.1);
      a *= 0.5;
    }
    return s;
  }
`

export default function GeometryVisual() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current!
    const rect = mount.getBoundingClientRect()
    const W = rect.width
    const H = rect.height

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100)
    camera.position.set(0, 0, 4.6)

    // Build an environment map from a sunset-gradient canvas
    const envCanvas = document.createElement('canvas')
    envCanvas.width = 2048
    envCanvas.height = 1024
    const ectx = envCanvas.getContext('2d')!
    const g = ectx.createLinearGradient(0, 0, 0, 512)
    g.addColorStop(0, '#324654')
    g.addColorStop(0.32, '#718593')
    g.addColorStop(0.5, '#D0D1CE')
    g.addColorStop(0.62, '#EDA167')
    g.addColorStop(0.85, '#D46128')
    g.addColorStop(1, '#1A151C')
    ectx.fillStyle = g
    ectx.fillRect(0, 0, envCanvas.width, envCanvas.height)
    // Sprinkle a few soft highlights for richer reflections
    const blob = (x: number, y: number, r: number, color: string) => {
      const rg = ectx.createRadialGradient(x, y, 0, x, y, r)
      rg.addColorStop(0, color)
      rg.addColorStop(1, 'rgba(0,0,0,0)')
      ectx.fillStyle = rg
      ectx.beginPath()
      ectx.arc(x, y, r, 0, Math.PI * 2)
      ectx.fill()
    }
    blob(440, 220, 380, 'rgba(255, 246, 230, 0.85)')
    blob(1640, 180, 320, 'rgba(220, 232, 255, 0.65)')
    blob(1000, 760, 480, 'rgba(255, 195, 135, 0.7)')
    blob(1500, 600, 240, 'rgba(255, 230, 200, 0.55)')

    const equirect = new THREE.CanvasTexture(envCanvas)
    equirect.mapping = THREE.EquirectangularReflectionMapping
    equirect.colorSpace = THREE.SRGBColorSpace

    const pmrem = new THREE.PMREMGenerator(renderer)
    pmrem.compileEquirectangularShader()
    const envMap = pmrem.fromEquirectangular(equirect).texture
    equirect.dispose()
    pmrem.dispose()

    scene.environment = envMap

    // Liquid-metal orb — high-poly icosahedron, displaced in vertex shader
    const orbGeo = new THREE.IcosahedronGeometry(1.15, 7)
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e8d8c8'),
      metalness: 1.0,
      roughness: 0.12,
      envMap,
      envMapIntensity: 2.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    })

    const uTime = { value: 0 }
    orbMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\nuniform float uTime;\n${noiseGLSL}`)
        .replace(
          '#include <begin_vertex>',
          `
          vec3 transformed = position;
          vec3 nrm = normal;
          float n1 = fbm3(position * 0.55 + vec3(uTime * 0.05, uTime * 0.035, -uTime * 0.04));
          float disp = n1 * 0.14;
          transformed += nrm * disp;
          `,
        )
      // Recompute normals analytically for smoother shading via central differences
      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        vec3 objectNormal = normal;
        // Stable tangent basis avoiding pole singularity
        vec3 ref = abs(normal.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
        vec3 tangent = normalize(cross(normal, ref));
        vec3 bitangent = normalize(cross(normal, tangent));
        float eps = 0.025;
        float dispC = fbm3(position * 0.55 + vec3(uTime * 0.05, uTime * 0.035, -uTime * 0.04)) * 0.14;
        vec3 pa = position + tangent * eps;
        vec3 pb = position + bitangent * eps;
        float dispA = fbm3(pa * 0.55 + vec3(uTime * 0.05, uTime * 0.035, -uTime * 0.04)) * 0.14;
        float dispB = fbm3(pb * 0.55 + vec3(uTime * 0.05, uTime * 0.035, -uTime * 0.04)) * 0.14;
        vec3 da = (pa + normal * dispA) - (position + normal * dispC);
        vec3 db = (pb + normal * dispB) - (position + normal * dispC);
        vec3 nDisp = normalize(cross(da, db));
        // Blend toward the original normal a bit for smoothness
        objectNormal = normalize(mix(normal, nDisp, 0.7));
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif
        `,
      )
    }

    const orb = new THREE.Mesh(orbGeo, orbMat)
    scene.add(orb)

    // Soft warm rim light to enhance the silhouette
    const rim = new THREE.PointLight(0xfff0d4, 2.4, 9, 1.5)
    rim.position.set(2.5, 1.6, 1.8)
    scene.add(rim)
    const rim2 = new THREE.PointLight(0xc9d8f2, 1.2, 9, 1.5)
    rim2.position.set(-2.2, -1.0, 1.2)
    scene.add(rim2)
    const ambient = new THREE.AmbientLight(0xffffff, 0.18)
    scene.add(ambient)

    let raf = 0
    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      uTime.value = t
      orb.rotation.y = t * 0.035
      orb.rotation.x = Math.sin(t * 0.025) * 0.12
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
      orbGeo.dispose()
      orbMat.dispose()
      envMap.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="relative w-full aspect-square max-w-[520px] ml-auto">
      <div ref={mountRef} className="absolute inset-0" style={{ filter: 'blur(0.7px)' }} />
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: '220px 220px',
        }}
      />
    </div>
  )
}
