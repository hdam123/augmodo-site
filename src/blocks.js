import React, { useEffect, useRef, useState } from 'react';
import { html, gsap, splitLines, LINE_IN } from './lib.js';
import { A, useScene } from './sections.js';

/* ─────────────── Building blocks for the content pages ───────────────
   None of these pages are in Figma yet, so they reuse the homepage and careers system:
   60px margins, a 670 | 650 two-column grid, 48px display headings, 24px medium list rows
   on white rules, the violet quote band and the closing CTA with the legal row. */

// Scroll reveals for a whole page: [data-lines] headings rise line by line, [data-fade] blocks
// fade up, .row-rule rules draw in and .band images drift for a light parallax.
export function useReveal(ref) {
  useScene(ref, ({ q }) => {
    const on = (trigger, start = 'top 88%') => ({ trigger, start, toggleActions: 'play none none reverse' });
    q('[data-lines]').forEach((el) => gsap.from(splitLines(el), { ...LINE_IN, duration: 0.9, scrollTrigger: on(el) }));
    q('[data-fade]').forEach((el) => gsap.from(el, { autoAlpha: 0, y: 24, duration: 0.8, ease: 'power3.out', scrollTrigger: on(el, 'top 92%') }));
    q('.row-rule').forEach((el) => gsap.from(el, { scaleX: 0, transformOrigin: 'left', duration: 0.9, ease: 'power3.inOut', scrollTrigger: on(el, 'top 92%') }));
    q('.band img').forEach((img) => gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    }));
  });
}

// Wraps a page so its reveals are set up once on mount.
export function Page({ children }) {
  const ref = useRef(null);
  useReveal(ref);
  return html`<div className="pg" ref=${ref}>${children}</div>`;
}

export function PageHero({ eyebrow, title, sub, children }) {
  return html`
    <section className="pg-hero">
      ${eyebrow && html`<p className="eyebrow" data-fade>${eyebrow}</p>`}
      <h1 className="h-display pg-title" data-lines>${title}</h1>
      ${sub && html`<p className="body pg-sub" data-lines>${sub}</p>`}
      ${children && html`<div className="pg-actions" data-fade>${children}</div>`}
    </section>`;
}

// Full-bleed photo strip, as on the careers page.
export function Band({ src, alt = '', pos = '50% 50%', tall }) {
  return html`
    <div className=${`band${tall ? ' band--tall' : ''}`}>
      <img src=${A(src)} alt=${alt} style=${{ objectPosition: pos }} />
    </div>`;
}

// Two-column section: label and heading on the left, content in the 650 column on the right.
export function Split({ label, title, tone, id, aside, children }) {
  return html`
    <section className=${`split${tone ? ` split--${tone}` : ''}`} id=${id}>
      <div className="split-head">
        ${label && html`<p className="eyebrow" data-fade>${label}</p>`}
        ${title && html`<h2 className="h-display split-title" data-lines>${title}</h2>`}
        ${aside}
      </div>
      <div className="split-body">${children}</div>
    </section>`;
}

export const Prose = ({ children, lead }) => html`<div className=${`prose${lead ? ' prose--lead' : ''}`} data-fade>${children}</div>`;

// Ruled list rows: [title, text?, tag?]. `numbered` prefixes 01, 02, …
export function Rows({ items, numbered, compact }) {
  return html`
    <ul className=${`rows${compact ? ' rows--compact' : ''}`}>
      ${items.map(([title, text, tag], i) => html`
        <li key=${i} className=${tag === 'Augmodo' ? 'row--hi' : ''}>
          <span className="row-rule" />
          <div className="row" data-fade>
            <span className="row-title">
              ${numbered && html`<span className="row-num">${String(i + 1).padStart(2, '0')}</span>`}
              ${title}
            </span>
            ${text && html`<span className="row-text">${text}</span>`}
            ${tag && tag !== 'Augmodo' && html`<span className="row-tag">${tag}</span>`}
          </div>
        </li>`)}
    </ul>`;
}

// Big figures with a caption: [value, caption].
export function Stats({ items }) {
  return html`
    <div className="stats">
      ${items.map(([value, text], i) => html`
        <div className="stat" key=${i} data-fade>
          <span className="stat-value">${value}</span>
          <span className="stat-text">${text}</span>
        </div>`)}
    </div>`;
}

// Violet testimonial band. With more than one quote it cycles, with dots to pick one.
export function Quotes({ title = 'What our partners are saying.', items }) {
  const [i, setI] = useState(0);
  const ref = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setTimeout(() => setI((i + 1) % items.length), 8000);
    return () => clearTimeout(t);
  }, [i]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    gsap.fromTo(ref.current.querySelectorAll('.quote > *'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
  }, [i]);

  const [quote, who] = items[i];
  return html`
    <section className="quotes" ref=${ref}>
      <h2 className="h-display" data-lines>${title}</h2>
      <div>
        <figure className="quote quote--flow" data-fade>
          <blockquote>“${quote}”</blockquote>
          <figcaption>${who}</figcaption>
        </figure>
        ${items.length > 1 && html`
          <div className="dots" role="tablist" aria-label="Testimonials">
            ${items.map((_, n) => html`
              <button key=${n} role="tab" aria-selected=${n === i} aria-label=${`Quote ${n + 1}`} className=${n === i ? 'on' : ''} onClick=${() => setI(n)} />`)}
          </div>`}
      </div>
    </section>`;
}

// Text link with the Figma arrow, for in-page links such as "Read Trust & Privacy".
export const TextLink = ({ href, children, onClick }) => html`
  <a className="text-link" href=${href} onClick=${onClick}>${children}<img src=${A('arrow.svg')} alt="" /></a>`;
