import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  void main() { gl_Position = vec4(position, 1.0); }
`

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_viewport_h;

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
    // y: 1 at top of doc, 0 at bottom of first viewport, negative further down
    float y = (gl_FragCoord.y - (u_resolution.y - u_viewport_h)) / u_viewport_h;

    // Sunset palette (first viewport)
    vec3 colorTop      = vec3( 50.0/255.0,  70.0/255.0,  84.0/255.0);
    vec3 colorMidHigh  = vec3(113.0/255.0, 133.0/255.0, 147.0/255.0);
    vec3 colorHorizon  = vec3(208.0/255.0, 209.0/255.0, 206.0/255.0);
    vec3 colorMidLow   = vec3(237.0/255.0, 161.0/255.0, 103.0/255.0);
    vec3 colorBottom   = vec3(212.0/255.0,  97.0/255.0,  40.0/255.0);

    // Below-fold palette (peach -> cool grey)
    vec3 colorPeach    = vec3(232.0/255.0, 213.0/255.0, 196.0/255.0);
    vec3 colorCool     = vec3(226.0/255.0, 226.0/255.0, 230.0/255.0);

    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float yShift = y + sin(st.x * 2.0 + u_time * 0.2) * 0.02;

    vec3 gradientColor;
    if (yShift > 0.65) {
      gradientColor = mix(colorMidHigh, colorTop, smoothstep(0.65, 1.0, yShift));
    } else if (yShift > 0.4) {
      gradientColor = mix(colorHorizon, colorMidHigh, smoothstep(0.4, 0.65, yShift));
    } else if (yShift > 0.15) {
      gradientColor = mix(colorMidLow, colorHorizon, smoothstep(0.15, 0.4, yShift));
    } else if (yShift > 0.0) {
      gradientColor = mix(colorBottom, colorMidLow, smoothstep(0.0, 0.15, yShift));
    } else {
      // Smoothly transition: sunset bottom -> peach -> cool grey, no hard line
      vec3 belowTop = mix(colorBottom, colorPeach, smoothstep(0.0, -0.5, yShift));
      gradientColor = mix(belowTop, colorCool, smoothstep(-0.5, -2.0, yShift));
    }

    // Petal / flower form, positioned below the first viewport
    vec2 ppos;
    float petalCenterX = 0.22 * u_resolution.x;
    float petalCenterY_fromTop = u_viewport_h * 1.5;
    ppos.x = (gl_FragCoord.x - petalCenterX) / u_viewport_h;
    ppos.y = (gl_FragCoord.y - (u_resolution.y - petalCenterY_fromTop)) / u_viewport_h;

    float r = length(ppos);
    float a = atan(ppos.y, ppos.x);
    float distortion = fbm(ppos * 2.0 + u_time * 0.15) * 0.4;
    float petal_shape = sin(a * 5.0 + u_time * 0.3) * 0.18;
    float base_radius = 0.2;
    float shape_edge = base_radius + petal_shape + distortion;

    float core_mask = smoothstep(shape_edge + 0.2, shape_edge - 0.2, r);
    float glow_mask = smoothstep(shape_edge + 0.6, shape_edge - 0.1, r);

    float belowFold = smoothstep(0.0, -0.2, y);
    core_mask *= belowFold;
    glow_mask *= belowFold;

    vec3 final_color = gradientColor;
    final_color = mix(final_color, vec3(140.0/255.0, 182.0/255.0, 232.0/255.0), glow_mask * 0.55);
    final_color = mix(final_color, vec3( 26.0/255.0,  21.0/255.0,  28.0/255.0), core_mask * 0.85);

    // Heavy film grain
    float n = random(st * u_resolution + u_time * 10.0);
    final_color += (n - 0.5) * 0.12;

    // Vignette only within first viewport
    float vy = clamp(y, 0.0, 1.0);
    vec2 vUv = vec2(st.x, vy);
    float vignette = length(vUv - 0.5) * step(0.0, y);
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
    const getSize = () => ({
      w: window.innerWidth,
      h: Math.max(document.documentElement.scrollHeight, window.innerHeight),
    })
    let size = getSize()
    renderer.setSize(size.w, size.h)
    container.appendChild(renderer.domElement)

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const scene = new THREE.Scene()

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(size.w * pr, size.h * pr) },
      u_viewport_h: { value: window.innerHeight * pr },
    }

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(plane)

    const clock = new THREE.Clock()
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      uniforms.u_time.value = clock.getElapsedTime()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      size = getSize()
      renderer.setSize(size.w, size.h)
      uniforms.u_resolution.value.set(size.w * pr, size.h * pr)
      uniforms.u_viewport_h.value = window.innerHeight * pr
    }
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      material.dispose()
      plane.geometry.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div id="canvas-container" ref={containerRef} />
}
