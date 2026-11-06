import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { html, gsap, splitLines, LINE_IN } from './lib.js';
import { A } from './sections.js';

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
        .from(q('.contact-media img'), { scale: 1.08, duration: 1.4 }, 0.05)
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
      <div className="contact-media" aria-hidden="true"><img src=${A('contact.jpg')} alt="" /></div>
      <button className="contact-close" onClick=${onClose} aria-label="Close">
        <span>Close</span>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.5" /></svg>
      </button>
    </div>`;
}
