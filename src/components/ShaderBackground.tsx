import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  void main() { gl_Position = vec4(position, 1.0); }
`

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_scroll;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 4; i++) {
      f += amp * vnoise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return f;
  }

  void main() {
    // Canvas covers the viewport; convert to a "doc y" using scrollY.
    // y: 1 at top of doc, 0 at bottom of first viewport, negative further down.
    float vh = u_resolution.y;
    float y = (gl_FragCoord.y - u_scroll) / vh;

    vec3 colorTop      = vec3( 50.0/255.0,  70.0/255.0,  84.0/255.0);
    vec3 colorMidHigh  = vec3(113.0/255.0, 133.0/255.0, 147.0/255.0);
    vec3 colorHorizon  = vec3(208.0/255.0, 209.0/255.0, 206.0/255.0);
    vec3 colorMidLow   = vec3(237.0/255.0, 161.0/255.0, 103.0/255.0);
    vec3 colorBottom   = vec3(212.0/255.0,  97.0/255.0,  40.0/255.0);
    vec3 colorPeach    = vec3(232.0/255.0, 213.0/255.0, 196.0/255.0);
    vec3 colorCool     = vec3(232.0/255.0, 213.0/255.0, 196.0/255.0);

    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float yShift = y + sin(st.x * 2.0 + u_time * 0.2) * 0.02;

    vec3 gradientColor = colorCool;
    gradientColor = mix(gradientColor, colorPeach,    smoothstep(-2.2, -0.7, yShift));
    gradientColor = mix(gradientColor, colorBottom,   smoothstep(-0.4,  0.05, yShift));
    gradientColor = mix(gradientColor, colorMidLow,   smoothstep( 0.05, 0.22, yShift));
    gradientColor = mix(gradientColor, colorHorizon,  smoothstep( 0.22, 0.45, yShift));
    gradientColor = mix(gradientColor, colorMidHigh,  smoothstep( 0.45, 0.7,  yShift));
    gradientColor = mix(gradientColor, colorTop,      smoothstep( 0.7,  1.05, yShift));

    // Petal: positioned in document space, projected into viewport.
    float petalCenterX_doc = u_resolution.x + vh * 0.05;
    float petalCenterDocY  = vh * 2.2;             // distance below top of doc
    float petalCenterCanvY = u_scroll - petalCenterDocY + vh;

    vec2 ppos;
    ppos.x = (gl_FragCoord.x - petalCenterX_doc) / vh;
    ppos.y = (gl_FragCoord.y - petalCenterCanvY) / vh;

    float r = length(ppos);
    float a = atan(ppos.y, ppos.x);
    float distortion = fbm(ppos * 2.0 + u_time * 0.15) * 0.4;
    float petal_shape = sin(a * 5.0 + u_time * 0.3) * 0.18;
    float base_radius = 0.2;
    float shape_edge = base_radius + petal_shape + distortion;

    float core_mask = smoothstep(shape_edge + 0.2, shape_edge - 0.2, r);
    float glow_mask = smoothstep(shape_edge + 0.35, shape_edge - 0.1, r);

    float belowFold = smoothstep(0.0, -0.2, y);
    core_mask *= belowFold;
    glow_mask *= belowFold;

    vec3 final_color = gradientColor;
    final_color = mix(final_color, vec3( 90.0/255.0, 115.0/255.0, 132.0/255.0), glow_mask * 0.45);
    final_color = mix(final_color, vec3( 50.0/255.0,  70.0/255.0,  84.0/255.0), core_mask * 0.7);

    float n = random(st * u_resolution + u_time * 10.0);
    final_color += (n - 0.5) * 0.12;

    float vy = clamp(y, 0.0, 1.0);
    vec2 vUv = vec2(st.x, vy);
    float vignetteFade = smoothstep(-0.3, 0.05, y);
    float vignette = length(vUv - 0.5) * vignetteFade;
    final_color -= vignette * 0.15;

    gl_FragColor = vec4(final_color, 1.0);
  }
`

export default function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current!
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    const pr = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pr)

    const getSize = () => ({ w: window.innerWidth, h: window.innerHeight })
    let size = getSize()
    renderer.setSize(size.w, size.h)
    container.appendChild(renderer.domElement)

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const scene = new THREE.Scene()

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(size.w * pr, size.h * pr) },
      u_scroll: { value: 0.0 },
    }

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(plane)

    const syncSize = () => {
      const next = getSize()
      if (next.w !== size.w || next.h !== size.h) {
        size = next
        renderer.setSize(size.w, size.h)
        uniforms.u_resolution.value.set(size.w * pr, size.h * pr)
      }
      uniforms.u_scroll.value = window.scrollY * pr
    }

    const clock = new THREE.Clock()
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      syncSize()
      uniforms.u_time.value = clock.getElapsedTime()
      renderer.render(scene, camera)
    }
    animate()

    window.addEventListener('resize', syncSize)
    window.addEventListener('scroll', syncSize, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', syncSize)
      window.removeEventListener('scroll', syncSize)
      renderer.dispose()
      material.dispose()
      plane.geometry.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div id="canvas-container" ref={containerRef} />
}
