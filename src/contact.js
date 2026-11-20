import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { html, gsap, splitLines, LINE_IN } from './lib.js';
import { A } from './sections.js';
import { PointCloud, SCAN_PARAMS } from './pointcloud.js';

// The photo with the point-cloud texture over its right part (from SCAN_FROM across), lined up with the
// photo underneath: the overlay draws the same image at the same object-fit: cover placement.
const PHOTO = 'photos/contact-aisle.jpg';
const PHOTO_SIZE = [1800, 2400];
const SCAN_FROM = 0.42;
function ContactMedia() {
  // The panel is the window minus the 842-unit form column (see .contact-media), so its size is known
  // up front and the overlay exists when the open animation runs. Phones hide the panel.
  const size = window.innerWidth >= 768 ? [Math.round(window.innerWidth * (1 - 842 / 1440)), window.innerHeight] : null;
  let scan = null;
  if (size) {
    const [w, h] = size;
    const k = Math.max(w / PHOTO_SIZE[0], h / PHOTO_SIZE[1]);
    const dw = PHOTO_SIZE[0] * k, dh = PHOTO_SIZE[1] * k;
    const left = Math.round(w * SCAN_FROM);
    scan = html`
      <div className="contact-scan" style=${{ left: `${left}px` }}>
        <${PointCloud} src=${A(PHOTO)} box=${[w - left, h]} imgRect=${[(w - dw) / 2 - left, (h - dh) / 2, dw, dh]} params=${SCAN_PARAMS} />
      </div>`;
  }
  return html`
    <div className="contact-media" aria-hidden="true">
      <div className="contact-media-inner">
        <img src=${A(PHOTO)} alt="" />
        ${scan}
      </div>
    </div>`;
}

/* ─────────────── Book a demo: full-screen contact form (Figma "Book a Demo_02") ─────────────── */

export function ContactOverlay({ open, onClose }) {
  const ref = useRef(null);
  const [sent, setSent] = useState(false);

  useLayoutEffect(() => {
    if (!open) return;
    setSent(false);
    const root = document.documentElement;
    root.classList.add('no-scroll');
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const lines = splitLines(q('.contact-title')[0]);
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'none' })
        .fromTo(q('.contact-media'), { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' }, 0.05)
        .from(q('.contact-media-inner'), { scale: 1.08, duration: 1.4 }, 0.05) // photo and texture zoom together, so they stay aligned
        .from(q('.contact-scan'), { clipPath: 'inset(0% 0% 0% 100%)', duration: 1.1, ease: 'power2.inOut' }, 0.7)
        .from(q('.contact-label'), { autoAlpha: 0, y: 10, duration: 0.5 }, 0.2)
        .from(lines, { ...LINE_IN, duration: 0.9 }, 0.25)
        .from(q('.contact-form > *'), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.08 }, 0.5);
    }, ref);
    const t = setTimeout(() => ref.current?.querySelector('input')?.focus({ preventScroll: true }), 500);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      ctx.revert();
      root.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open) return null;

  // Prototype only: nothing is sent anywhere yet.
  const submit = (e) => { e.preventDefault(); setSent(true); };
  const grow = (e) => { e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`; };

  return html`
    <div className="contact" ref=${ref} role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <div className="contact-main">
        <img className="contact-logo" src=${A('logo-full.svg')} alt="Augmodo" />
        <p className="contact-label">Contact Us</p>
        <h2 className="h-display contact-title" id="contact-title">The future of work is augmented.<br />Let’s start with yours.</h2>
        ${sent
          ? html`
            <div className="contact-form contact-thanks">
              <p className="body">Thanks, we’ll be in touch shortly to set up your demo.</p>
              <button className="btn" onClick=${onClose}>Back to site</button>
            </div>`
          : html`
            <form className="contact-form" onSubmit=${submit}>
              <div className="contact-fields">
                <label className="field">
                  <span className="sr-only">Email</span>
                  <input type="email" name="email" required placeholder="Email" autoComplete="email" />
                </label>
                <label className="field">
                  <span className="sr-only">Message</span>
                  <textarea name="message" rows="1" placeholder="Message" onInput=${grow} />
                </label>
              </div>
              <button className="btn" type="submit">Book a demo</button>
            </form>`}
      </div>
      <${ContactMedia} />
      <button className="contact-close" onClick=${onClose} aria-label="Close">
        <span>Close</span>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.5" /></svg>
      </button>
    </div>`;
}
