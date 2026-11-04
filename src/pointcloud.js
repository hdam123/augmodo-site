// WebGL port of the Figma "Point cloud" shader effect (custom effect 5d788002…).
// Same per-pixel algorithm as the WGSL source: a grid of rounded squares whose
// size and gradient colour come from the luminance of the underlying image.
// Figma's runtime needs WebGPU + the HTML-in-Canvas API; this runs anywhere.
import React, { useEffect, useRef } from 'react';
import { html } from './lib.js';

const VERT = `
attribute vec2 pos;
varying vec2 vuv;
void main() {
  vuv = vec2(pos.x * 0.5 + 0.5, 0.5 - pos.y * 0.5);
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D tex;
uniform vec2 dims;
uniform float grid;
uniform float pmin;
uniform float pmax;
uniform float corner;
uniform vec3 c0;
uniform vec3 c1;
uniform vec3 c2;
uniform vec3 stops;
varying vec2 vuv;

vec3 grad(float t) {
  if (t <= stops.x) return c0;
  if (t <= stops.y) return mix(c0, c1, (t - stops.x) / max(stops.y - stops.x, 0.0001));
  if (t <= stops.z) return mix(c1, c2, (t - stops.y) / max(stops.z - stops.y, 0.0001));
  return c2;
}

void main() {
  vec2 p = vuv * dims;
  vec2 cell = floor(p / grid);
  float searchR = ceil(pmax / grid) + 1.0;
  float best = 99999.0;
  vec4 col = vec4(0.0);
  for (int iy = -3; iy <= 3; iy++) {
    for (int ix = -3; ix <= 3; ix++) {
      vec2 o = vec2(float(ix), float(iy));
      if (abs(o.x) > searchR || abs(o.y) > searchR) continue;
      vec2 gp = (cell + o) * grid + grid * 0.5;
      vec4 src = texture2D(tex, clamp(gp / dims, 0.0, 1.0));
      // Tone curve calibrated against Figma renders of the effect.
      float depth = dot(pow(src.rgb, vec3(1.5)), vec3(0.299, 0.587, 0.114));
      float r = mix(pmin, pmax, depth);
      float cr = (corner / 100.0) * r;
      vec2 q = abs(p - gp) - vec2(r - cr);
      float sdf = min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - cr;
      if (sdf < 0.0 && sdf < best) {
        best = sdf;
        float edge = 1.0 - smoothstep(-1.0, 0.0, sdf);
        float a = src.a * edge;
        col = vec4(grad(depth) * a, a);
      }
    }
  }
  gl_FragColor = col;
}`;

// Shader params copied from the Figma file.
export const SCAN_PARAMS = {
  grid: 4, pmin: 1.1, pmax: 3, corner: 34,
  stops: [0, 0.4856, 0.9856],
  colors: [[1, 1, 1], [0.4902, 0.498, 1], [0.7877, 0.791, 0.9998]],
};
export const PRIVACY_PARAMS = {
  grid: 6, pmin: 3.7, pmax: 10, corner: 0,
  stops: [0, 0.5, 1],
  colors: [[0.349, 0.2941, 1], [0.7647, 0.7686, 1], [1, 1, 1]],
};

const imageCache = new Map();
function loadImage(src) {
  if (!imageCache.has(src)) {
    imageCache.set(src, new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    }));
  }
  return imageCache.get(src);
}

function compile(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

// One shared, offscreen WebGL renderer. Each overlay is rendered there once and copied into
// its own 2D canvas: Safari can drop on-page WebGL canvases when they're transformed or
// clipped by the scroll animations, while 2D canvas content always persists.
let renderer = null;
function getRenderer() {
  if (renderer) return renderer;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, preserveDrawingBuffer: true });
  if (!gl) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // If the browser reclaims the context, rebuild it on the next render.
  canvas.addEventListener('webglcontextlost', () => { renderer = null; });
  renderer = { canvas, gl, prog };
  return renderer;
}

// Backing-store cap per overlay. Full 2× Retina on the big overlays is ~8M px each, and
// Safari silently leaves canvases blank once the page's total canvas memory is too high.
const MAX_PIXELS = 2.4e6;

// box: [w, h] of the canvas in design px. imgRect: [x, y, w, h] of the source image
// relative to the canvas box, in design px (mirrors the Figma image crop).
function render(canvas, img, box, imgRect, params) {
  const r = getRenderer();
  if (!r) return false;
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  if (!cssW || !cssH) return false;
  const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / (cssW * cssH)));
  const W = Math.round(cssW * dpr);
  const H = Math.round(cssH * dpr);
  const s = W / box[0]; // device px per design px

  const src = document.createElement('canvas');
  src.width = W;
  src.height = H;
  src.getContext('2d').drawImage(img, imgRect[0] * s, imgRect[1] * s, imgRect[2] * s, imgRect[3] * s);

  const { gl, prog } = r;
  r.canvas.width = W;
  r.canvas.height = H;
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);

  const set = (name, ...v) => gl[`uniform${v.length}f`](gl.getUniformLocation(prog, name), ...v);
  set('dims', W, H);
  set('grid', params.grid * s);
  set('pmin', params.pmin * s);
  set('pmax', params.pmax * s);
  set('corner', params.corner);
  set('stops', ...params.stops);
  params.colors.forEach((c, i) => set(`c${i}`, ...c));

  gl.viewport(0, 0, W, H);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  if (gl.isContextLost()) { renderer = null; return false; }
  canvas.width = W;
  canvas.height = H;
  canvas.getContext('2d').drawImage(r.canvas, 0, 0);

  // Release the scratch buffers right away instead of waiting for GC.
  src.width = src.height = 0;
  r.canvas.width = r.canvas.height = 1;
  return true;
}

// Renders run one at a time, a frame apart, so several overlays never stall the same frame.
// setTimeout rather than rAF so queued renders still finish in a background tab.
const queue = [];
let draining = false;
function schedule(job) {
  queue.push(job);
  if (draining) return;
  draining = true;
  const next = () => {
    const j = queue.shift();
    if (!j) { draining = false; return; }
    j();
    setTimeout(next, 16);
  };
  setTimeout(next, 0);
}

export function PointCloud({ src, box, imgRect, params = SCAN_PARAMS, className = '', style }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    let alive = true;
    let tries = 0;
    const draw = () => loadImage(src).then((img) => schedule(() => {
      if (!alive) return;
      // Retry a couple of times if the canvas wasn't laid out yet or the context was lost.
      if (!render(canvas, img, box, imgRect, params) && ++tries < 4) setTimeout(draw, 300);
    }));
    // Draw only when the overlay's section is within ~2 screens. The section is observed
    // rather than the canvas, because clip-path reveals hide the canvas itself.
    const target = canvas.closest('section') || canvas.parentElement;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); draw(); }
    }, { rootMargin: '200% 0px 200% 0px' });
    io.observe(target);
    return () => { alive = false; io.disconnect(); };
  }, [src]);
  return html`<canvas ref=${ref} className=${`pointcloud ${className}`} style=${style} aria-hidden="true" />`;
}
