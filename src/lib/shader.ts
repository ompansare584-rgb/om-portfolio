/**
 * The sky: a small GLSL fragment shader (aurora ribbons, drifting dust, night stars) tinted by the visitor's
 * local hour. Loaded only after the first interaction, on screens that can afford it. Written in GLSL ES 1.00
 * style so Three.js and plain WebGL both accept it. Any failure just leaves the CSS sky in place.
 */
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';

export const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const FRAG = /* glsl */ `
precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform float uHour;
uniform vec2 uRes;
uniform vec2 uMouse;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.02 + vec2(7.1, 3.7);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float asp = uRes.x / max(uRes.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * asp, uv.y - 0.5);
  p += (uMouse - 0.5) * 0.06;

  // time of day: 0 = night, 1 = bright day
  float h = uHour;
  float day = smoothstep(5.5, 8.5, h) * (1.0 - smoothstep(16.5, 19.5, h));
  float golden = smoothstep(15.5, 17.5, h) * (1.0 - smoothstep(18.5, 20.0, h));
  float dawn = smoothstep(4.0, 5.8, h) * (1.0 - smoothstep(6.5, 8.0, h));

  vec3 night = vec3(0.04, 0.06, 0.17);
  vec3 dayc = vec3(0.35, 0.52, 0.72);
  vec3 warm = vec3(0.86, 0.52, 0.22);
  vec3 rose = vec3(0.72, 0.36, 0.38);
  vec3 base = mix(night, dayc, day);
  base = mix(base, warm, golden * 0.55);
  base = mix(base, rose, dawn * 0.5);

  // slow ribbons
  float t = uTime * 0.03;
  float r1 = fbm(vec2(p.x * 1.6 + t, p.y * 3.0 - t * 0.6));
  float r2 = fbm(vec2(p.x * 2.4 - t * 0.7, p.y * 4.0 + 3.0));
  float band = smoothstep(0.35, 0.8, r1) * smoothstep(0.55, 0.0, abs(p.y - 0.12 + (r2 - 0.5) * 0.35));
  vec3 ribbon = mix(vec3(0.94, 0.78, 0.4), vec3(0.8, 0.4, 0.5), r2);
  vec3 col = base + ribbon * band * (0.55 - day * 0.3);

  // stars, only at night
  vec2 sp = floor((uv + vec2(0.0, 0.0)) * vec2(asp * 90.0, 90.0));
  float s = step(0.9965, hash(sp));
  float tw = 0.6 + 0.4 * sin(uTime * 1.4 + hash(sp + 3.0) * 6.28);
  col += vec3(1.0, 0.95, 0.8) * s * tw * (1.0 - day) * 0.9;

  // vignette, so text on top always has calm edges
  float v = smoothstep(1.1, 0.25, length(p * vec2(0.9, 1.15)));
  col *= 0.55 + 0.45 * v;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function mountSky(canvas: HTMLCanvasElement): () => void {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power', depth: false, stencil: false });
  } catch {
    return () => {};
  }
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const hourNow = () => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  };
  const mat = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: { uTime: { value: 0 }, uHour: { value: hourNow() }, uRes: { value: new Vector2(1, 1) }, uMouse: { value: new Vector2(0.5, 0.5) } },
    depthTest: false,
    depthWrite: false,
  });
  const geo = new PlaneGeometry(2, 2);
  scene.add(new Mesh(geo, mat));

  const SCALE = 0.5; // the sky is soft, so render at half resolution: cheap and still smooth
  const resize = () => {
    const w = Math.max(2, Math.floor(innerWidth * SCALE));
    const h = Math.max(2, Math.floor(innerHeight * SCALE));
    renderer.setPixelRatio(1);
    renderer.setSize(w, h, false);
    mat.uniforms.uRes.value.set(w, h);
  };
  resize();

  let raf = 0;
  let last = 0;
  let alive = true;
  const t0 = performance.now();
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const onMove = (e: PointerEvent) => {
    mouse.tx = e.clientX / innerWidth;
    mouse.ty = 1 - e.clientY / innerHeight;
  };
  const frame = (now: number) => {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden || now - last < 33) return; // about 30 fps, and nothing while the tab is hidden
    last = now;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    mat.uniforms.uMouse.value.set(mouse.x, mouse.y);
    mat.uniforms.uTime.value = (now - t0) / 1000;
    mat.uniforms.uHour.value = hourNow();
    renderer.render(scene, camera);
  };
  const onLost = (e: Event) => {
    e.preventDefault();
    cleanup();
  };
  const cleanup = () => {
    alive = false;
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
    removeEventListener('pointermove', onMove);
    canvas.removeEventListener('webglcontextlost', onLost);
    geo.dispose();
    mat.dispose();
    renderer.dispose();
  };
  addEventListener('resize', resize, { passive: true });
  addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('webglcontextlost', onLost);
  raf = requestAnimationFrame(frame);
  canvas.classList.add('on');
  return cleanup;
}
