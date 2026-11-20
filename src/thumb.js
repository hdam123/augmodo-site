import { useEffect, useRef } from 'react';
import { html } from './lib.js';
import { A } from './sections.js';

/* ─────────────── Thumbnails in the visual-identity language ───────────────
   Figma "Augmodo Visual Identity (Internal)", node 562:54: 427 × 270 tiles built from a 6px violet
   pixel-dot grid. Four kinds:
     photo    the plain photo, no grid
     split    photo with its left 136/427 turned into the violet grid
     halftone the whole photo as the grid, with an optional big white figure
     figure   white tile (or `dark`), big violet figure, caption, dot band along the bottom
     logo     white tile, the logo in full colour, a violet-grid store photo down the left (`side`) */

const COLS = 71;                       // 427 / 6: one cell per 6px of the Figma tile
const SPLIT = 136 / 427;               // width of the violet strip on split tiles
const BAND = 64 / 270;                 // height of the dot band
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// Size a canvas to its box at device resolution; returns the 2D context and cell size in device px.
function fit(canvas, cols) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(r.width * dpr);
  canvas.height = Math.round(r.height * dpr);
  return { ctx: canvas.getContext('2d'), cell: canvas.width / cols };
}

// The photo as the violet grid. Brightness (stretched to the photo's own range) picks a two-tone cell:
// a ground that runs dark → violet → pale violet, with a lighter square inset in it, which gives the
// Figma tiles' dot texture over a mostly violet field.
const GROUND = [[21, 20, 43], [113, 109, 255], [193, 194, 255]];
const DOT = [[95, 91, 255], [193, 194, 255], [255, 255, 255]];
const ramp = (stops, t) => (t < 0.5 ? mix(stops[0], stops[1], t * 2) : mix(stops[1], stops[2], (t - 0.5) * 2));

function drawGrid(canvas, img, { pos = '50% 50%', cols = COLS, fullWidth }) {
  const { ctx, cell } = fit(canvas, cols);
  if (!canvas.width || !canvas.height) return; // not laid out yet; the ResizeObserver calls again
  const rows = Math.ceil(canvas.height / cell);
  // Sample the image as `object-fit: cover` would place it across the full tile, then keep our slice.
  const tileW = fullWidth ? fullWidth * (canvas.width / canvas.getBoundingClientRect().width) : canvas.width;
  const tileCols = Math.max(cols, Math.round(tileW / cell));
  const s = document.createElement('canvas');
  s.width = tileCols; s.height = rows;
  const sx = s.getContext('2d', { willReadFrequently: true });
  const [px, py] = pos.split(' ').map((p) => parseFloat(p) / 100);
  const scale = Math.max(tileCols / img.naturalWidth, rows / img.naturalHeight);
  const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
  sx.drawImage(img, (tileCols - w) * px, (rows - h) * py, w, h);
  const data = sx.getImageData(0, 0, tileCols, rows).data;
  const lum = new Float32Array(tileCols * rows);
  for (let i = 0; i < lum.length; i++) lum[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
  const sorted = Float32Array.from(lum).sort();
  const lo = sorted[Math.floor(sorted.length * 0.03)], hi = sorted[Math.floor(sorted.length * 0.97)];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const t = Math.min(1, Math.max(0, (lum[y * tileCols + x] - lo) / ((hi - lo) || 1)));
      const L = 0.08 + 0.84 * t; // keep off pure black and pure white so every cell stays violet
      const x0 = Math.round(x * cell), y0 = Math.round(y * cell);
      const x1 = Math.round((x + 1) * cell), y1 = Math.round((y + 1) * cell);
      ctx.fillStyle = rgb(ramp(GROUND, L));
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      const size = (x1 - x0) * 0.5, inset = ((x1 - x0) - size) / 2;
      ctx.fillStyle = rgb(ramp(DOT, L));
      ctx.fillRect(Math.round(x0 + inset), Math.round(y0 + inset), Math.round(size), Math.round(size));
    }
  }
}

// Dot band: squares that grow and strengthen towards the bottom edge.
function drawBand(canvas) {
  const { ctx, cell } = fit(canvas, COLS);
  if (!canvas.width || !canvas.height) return;
  const rows = Math.round(canvas.height / cell);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    const t = (y + 1) / rows;
    const sq = cell * (0.2 + 0.8 * t), inset = (cell - sq) / 2;
    ctx.fillStyle = rgb([123, 120, 255], 0.12 + 0.88 * t * t);
    for (let x = 0; x < COLS; x++) ctx.fillRect(Math.round(x * cell + inset), Math.round(y * cell + inset), Math.round(sq), Math.round(sq));
  }
}

// Redraw whenever the tile changes size (and once its image has loaded).
function useCanvas(draw, src) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let img;
    const run = () => (!src || (img && img.complete && img.naturalWidth)) && draw(canvas, img);
    if (src) { img = new Image(); img.onload = run; img.src = src; }
    const ro = new ResizeObserver(run);
    ro.observe(canvas);
    run();
    return () => ro.disconnect();
  }, [src]);
  return ref;
}

const Grid = ({ src, pos, className, cols, split }) => {
  const ref = useCanvas((c, img) => drawGrid(c, img, { pos, cols, fullWidth: split ? c.parentElement.getBoundingClientRect().width : 0 }), src);
  return html`<canvas className=${className} ref=${ref} aria-hidden="true" />`;
};

const Band = () => {
  const ref = useCanvas((c) => drawBand(c));
  return html`<canvas className="th-band" ref=${ref} aria-hidden="true" />`;
};

export function Thumb({ kind = 'split', src, pos = '50% 50%', figure, caption, logo, side, dark, className = '', alt = '' }) {
  const cls = `th th--${kind}${className ? ` ${className}` : ''}`;
  if (kind === 'photo') {
    return html`<div className=${cls}><img className="th-photo" src=${A(src)} alt=${alt} loading="lazy" style=${{ objectPosition: pos }} /></div>`;
  }
  if (kind === 'split') {
    return html`
      <div className=${cls}>
        <img className="th-photo" src=${A(src)} alt=${alt} loading="lazy" style=${{ objectPosition: pos }} />
        <${Grid} className="th-grid th-grid--split" src=${A(src)} pos=${pos} cols=${Math.round(COLS * SPLIT)} split />
      </div>`;
  }
  if (kind === 'halftone') {
    return html`
      <div className=${cls}>
        <${Grid} className="th-grid" src=${A(src)} pos=${pos} />
        ${figure && html`<span className="th-figure">${figure}</span>`}
      </div>`;
  }
  if (kind === 'figure') {
    return html`
      <div className=${`${cls}${dark ? ' th--dark' : ''}`}>
        <span className="th-figure">${figure}</span>
        ${caption && html`<span className="th-caption">${caption}</span>`}
        <${Band} />
      </div>`;
  }
  return html`
    <div className=${`${cls}${side ? ' th--side' : ''}`}>
      ${side && html`<${Grid} className="th-grid th-grid--split" src=${A(side)} pos="50% 50%" cols=${Math.round(COLS * SPLIT)} split />`}
      <img className="th-logo" src=${A(logo)} alt=${alt} loading="lazy" />
      ${!side && html`<${Band} />`}
    </div>`;
}
