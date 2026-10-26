"use client";

import { useTheme } from "fumadocs-ui/provider/base";
import { useEffect, useRef } from "react";

// Animated hero background, ported from the fluted glass effect in the
// shader-design repo (design/src/effects/flutedglass.js): soft pools of
// brand-green light drift behind ribbed glass. Each vertical flute refracts
// the light with a lens curve, rows are stretched into a "light curtain",
// and the rib edges get shading and a highlight. The canvas is transparent
// where the light is dim, so the section background shows through in both
// themes.

const VERT = `#version 300 es
void main() {
  // fullscreen triangle, no buffers needed
  vec2 v = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(v * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uFlutes;    // number of glass ribs across the canvas
uniform vec3  uDeep;      // shadow green
uniform vec3  uBrand;     // brand green
uniform vec3  uGlow;      // highlight
uniform float uStrength;  // overall opacity

out vec4 fragColor;

const float REFRACT   = 0.5;   // lens curve inside each flute
const float STRETCH   = 0.6;   // vertical pull toward one scanline
const float HIGHLIGHT = 0.55;  // rib shading and edge streak

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float blob(vec2 p, vec2 c, vec2 r) {
  vec2 d = (p - c) / r;
  return exp(-dot(d, d));
}

// The scene behind the glass: pools of light near the top, drifting slowly.
// The brightest pools sit to the sides so the headline stays on darker glass.
float scene(vec2 uv) {
  float a = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * a, uv.y);
  float t = uTime;
  float s = 0.0;
  s += 0.75 * blob(p, vec2(-0.36 * a + 0.12 * sin(t * 0.11), 0.95), vec2(0.38, 0.45));
  s += 0.65 * blob(p, vec2( 0.34 * a + 0.14 * sin(t * 0.09 + 2.0), 0.90), vec2(0.34, 0.42));
  s += 0.30 * blob(p, vec2( 0.10 * a * sin(t * 0.06 + 4.0), 1.20), vec2(0.60, 0.35));
  return s;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;

  // cylindrical refraction inside each vertical flute
  float fx = uv.x * uFlutes;
  float cell = floor(fx);
  float f = fract(fx) - 0.5;          // -0.5 .. 0.5 across the flute
  float bend = f * f * f * 4.0;       // lens curve
  float sx = (cell + 0.5 + mix(f, bend, REFRACT)) / uFlutes;

  // vertical stretch with a small blur, as in the original effect
  float sy = mix(uv.y, 0.75, STRETCH);
  float spread = 0.06 * STRETCH;
  float s = 0.0;
  for (int i = -2; i <= 2; i++) {
    s += scene(vec2(sx, sy + float(i) * spread * 0.5));
  }
  s /= 5.0;

  // light falls from the top and fades out before the bottom edge
  s *= smoothstep(0.2, 1.0, uv.y);

  // rib shading: darker toward flute edges, bright streak off-centre
  s *= 1.0 - HIGHLIGHT * 0.45 * pow(abs(f) * 2.0, 2.0);
  float spec = pow(clamp(1.0 - abs(f - 0.18) * 2.6, 0.0, 1.0), 6.0);
  s += HIGHLIGHT * 0.4 * spec * (0.12 + 0.88 * s);

  // a touch of noise so the soft gradients don't band
  float t = clamp(s + (hash21(gl_FragCoord.xy) - 0.5) * 0.02, 0.0, 1.0);

  vec3 col = mix(uDeep, uBrand, smoothstep(0.15, 0.7, t));
  col = mix(col, uGlow, smoothstep(0.7, 1.0, t));
  float alpha = smoothstep(0.0, 0.75, t) * uStrength;
  fragColor = vec4(col * alpha, alpha);  // premultiplied
}`;

// One flute per this many CSS pixels.
const FLUTE_WIDTH = 44;

type Rgb = [number, number, number];
type Palette = { deep: Rgb; brand: Rgb; glow: Rgb; strength: number };

function rgb(hex: string): Rgb {
  const n = Number.parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// Brand green is #83d63a (see global.css). #156e1d is the deep green the
// hero's CSS glow already uses.
const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    deep: rgb("#156e1d"),
    brand: rgb("#83d63a"),
    glow: rgb("#e4f8cf"),
    strength: 0.7,
  },
  light: {
    deep: rgb("#cfeab8"),
    brand: rgb("#a6e070"),
    glow: rgb("#83d63a"),
    strength: 0.6,
  },
};

function createProgram(gl: WebGL2RenderingContext) {
  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vert = compile(gl.VERTEX_SHADER, VERT);
  const frag = compile(gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vert || !frag || !prog) return null;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export function FlutedGlassShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const paletteRef = useRef<Palette>(PALETTES.dark);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    paletteRef.current =
      resolvedTheme === "light" ? PALETTES.light : PALETTES.dark;
    redrawRef.current();
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Without WebGL2 the hero's CSS gradient stays as the fallback.
    const gl = canvas?.getContext("webgl2", { antialias: false });
    if (!canvas || !gl) return;
    const prog = createProgram(gl);
    if (!prog) return;
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL call, not a React hook
    gl.useProgram(prog);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      res: u("uRes"),
      time: u("uTime"),
      flutes: u("uFlutes"),
      deep: u("uDeep"),
      brand: u("uBrand"),
      glow: u("uGlow"),
      strength: u("uStrength"),
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let flutes = 36;
    let time = 0;
    let last: number | null = null;
    let visible = true;
    let raf = 0;

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      flutes = Math.max(8, Math.round(canvas.clientWidth / FLUTE_WIDTH));
    };

    const draw = () => {
      const p = paletteRef.current;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, time);
      gl.uniform1f(U.flutes, flutes);
      gl.uniform3fv(U.deep, p.deep);
      gl.uniform3fv(U.brand, p.brand);
      gl.uniform3fv(U.glow, p.glow);
      gl.uniform1f(U.strength, p.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.style.opacity = "1";
    };

    const frame = (ts: number) => {
      raf = 0;
      if (last !== null) time += Math.min((ts - last) / 1000, 0.1);
      last = ts;
      draw();
      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reducedMotion || raf) return;
      last = null;
      raf = requestAnimationFrame(frame);
    };

    // Theme changes and resizes redraw at once when nothing is animating.
    const redrawIfIdle = () => {
      if (!raf) draw();
    };
    redrawRef.current = redrawIfIdle;

    const resizeObserver = new ResizeObserver(() => {
      resize();
      redrawIfIdle();
    });
    resizeObserver.observe(canvas);

    // Pause while the hero is scrolled out of view.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    intersectionObserver.observe(canvas);

    resize();
    if (reducedMotion) draw();
    else start();

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      redrawRef.current = () => {};
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity: 0, transition: "opacity 1.2s ease" }}
    />
  );
}
