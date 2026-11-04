import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { html, gsap, ScrollTrigger, splitLines, LINE_IN, u, U, MOBILE_BP } from './lib.js';
import { PointCloud, SCAN_PARAMS, PRIVACY_PARAMS } from './pointcloud.js';

const A = (f) => new URL(`./assets/${f}`, import.meta.url).href;
const DESKTOP = `(min-width: ${MOBILE_BP}px)`;
const MOBILE = `(max-width: ${MOBILE_BP - 1}px)`;
const vh = () => window.innerHeight;

// Runs `build` inside a gsap.context + matchMedia scoped to `ref`, cleaned up on unmount.
function useScene(ref, build) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const one = (s) => q(s)[0];
      const mm = gsap.matchMedia();
      build({ q, one, mm });
    }, ref);
    return () => ctx.revert();
  }, []);
}

// Simple scroll-in reveal used on mobile and for non-pinned blocks.
function revealOnEnter(trigger, targets, start = 'top 80%') {
  return gsap.from(targets, {
    ...LINE_IN, duration: 0.9,
    scrollTrigger: { trigger, start, toggleActions: 'play none none reverse' },
  });
}

/* ───────────────────────── Header ───────────────────────── */

export function Header() {
  return html`
    <header className="site-header">
      <a className="logo" href="#top" aria-label="Augmodo home">
        <img className="logo-icon logo-icon--purple" src=${A('logo-icon-wordmark.svg')} alt="" />
        <img className="logo-icon logo-icon--white" src=${A('logo-icon-small.svg')} alt="" />
        <span className="logo-word">Augmodo</span>
      </a>
      <nav className="nav">
        <a href="#top">Our Story</a><a href="#top">Careers</a><a href="#top">News</a><a href="#footer">Contact Us</a>
      </nav>
    </header>`;
}

/* ─────────────── 1–3 · Hero → video takes over ─────────────── */

export function Intro({ onPlay }) {
  const ref = useRef(null);
  useScene(ref, ({ q, one, mm }) => {
    const lines = [...splitLines(one('.hero-title')), ...splitLines(one('.hero-sub'))];
    gsap.from(lines, { ...LINE_IN, duration: 1.1, stagger: 0.09, delay: 0.15 });
    gsap.from(one('.hero-btn'), { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power3.out', delay: 0.55 });

    const logo = {
      purple: document.querySelector('.logo-icon--purple'),
      white: document.querySelector('.logo-icon--white'),
      word: document.querySelector('.logo-word'),
    };

    mm.add(DESKTOP, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current, start: 'top top', end: () => `+=${vh() * 1.1}`,
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
      tl.fromTo(one('.video'), { y: () => 479 * u() }, { y: 0, ease: 'none', duration: 1 })
        // thumbnail sits inside the 60px page margins, then opens to full screen as it rises
        .fromTo(one('.video'),
          { clipPath: () => `inset(0px ${60 * u()}px 0px ${60 * u()}px)` },
          { clipPath: 'inset(0px 0px 0px 0px)', ease: 'power1.inOut', duration: 1 }, 0)
        .to(one('.hero-copy'), { autoAlpha: 0, ease: 'none', duration: 0.55 }, 0.05)
        .to(logo.word, { autoAlpha: 0, x: -12, duration: 0.25 }, 0.7)
        .to(logo.purple, { autoAlpha: 0, duration: 0.25 }, 0.7)
        .to(logo.white, { autoAlpha: 1, duration: 0.25 }, 0.7)
        .to({}, { duration: 0.3 });
    });
    mm.add(MOBILE, () => {
      ScrollTrigger.create({
        trigger: one('.video'), start: 'top 30%',
        onEnter: () => gsap.to([logo.word, logo.purple], { autoAlpha: 0, duration: 0.3 }) && gsap.to(logo.white, { autoAlpha: 1 }),
        onLeaveBack: () => gsap.to([logo.word, logo.purple], { autoAlpha: 1, duration: 0.3 }) && gsap.to(logo.white, { autoAlpha: 0 }),
      });
    });
  });

  return html`
    <section className="intro" id="top" ref=${ref}>
      <div className="hero-copy">
        <h1 className="hero-title">Augment your retail<br />workforce</h1>
        <p className="hero-sub">Track every product in every store in real-time with Augmodo Spatial AI</p>
        <a className="hero-btn" href="#footer">Book a demo</a>
      </div>
      <div className="video">
        <div className="video-frame" role="img" aria-label="Grocery produce aisle, half shown as an Augmodo spatial scan">
          <div className="vf-photo"><img src=${A('store.jpg')} alt="" /></div>
          <div className="vf-scan">
            <${PointCloud} src=${A('store.jpg')} box=${[983.956, 1079.722]} imgRect=${[-943.02, -0.86, 1926.59, 1079.722]} params=${SCAN_PARAMS} />
          </div>
        </div>
        <button className="play" onClick=${onPlay} aria-label="Play video">
          <img src=${A('play.svg')} alt="" />
        </button>
      </div>
    </section>`;
}

/* ─────────────── 4–6 · Smartbadge: zoom + focus pull ─────────────── */

export function Smartbadge() {
  const ref = useRef(null);
  useScene(ref, ({ one, mm }) => {
    const title = one('.badge-title');
    const titleLines = splitLines(title);
    const paraLines = splitLines(one('.badge-para'));
    const media = one('.badge-media');

    // Storyboard frames 4–7 drop the nav links while the pale photo is under them.
    const nav = document.querySelector('.nav');
    const showNav = (on) => gsap.to(nav, { autoAlpha: on ? 1 : 0, duration: 0.3, overwrite: true });
    gsap.set(nav, { clearProps: 'opacity,visibility' }); // after a remount, start visible
    ScrollTrigger.create({
      trigger: ref.current, start: 'top 60%', end: 'bottom top+=60',
      onToggle: (self) => showNav(!self.isActive),
    });

    mm.add(DESKTOP, () => {
      // Title starts bottom-left (frame 5: y=654 of 800) then moves to top-left (frame 6: y=108).
      const titleStartY = () => vh() - 50 * u() - title.offsetHeight - 108 * u();
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: ref.current, start: 'top top', end: () => `+=${vh() * 2.6}`,
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
      // Image states straight from Figma: landing → frame 5 → frame 6.
      tl.fromTo(media,
        { x: () => -240 * u(), y: () => -356 * u(), scale: 1 },
        { x: () => -517 * u(), y: () => -490 * u(), scale: 2290 / 1954, duration: 1.1 }, 0)
        .fromTo(title, { y: titleStartY }, { y: titleStartY, duration: 0.01 }, 0)
        .from(titleLines, { ...LINE_IN, duration: 0.6 }, 0.25)
        .to(title, { y: 0, duration: 0.9 }, 1.3)
        .to(media, { x: () => -1155 * u(), y: () => -888 * u(), scale: 3284 / 1954, duration: 1.3 }, 1.3)
        .to(one('.text-scrim'), { autoAlpha: 1, duration: 0.9, ease: 'none' }, 1.4)
        .from(paraLines, { ...LINE_IN, duration: 0.6 }, 1.9)
        .to({}, { duration: 0.35 });
    });
    mm.add(MOBILE, () => {
      revealOnEnter(ref.current, [...titleLines, ...paraLines], 'top 40%');
    });
  });

  return html`
    <section className="badge panel" ref=${ref}>
      <div className="badge-media">
        <img src=${A('badge.jpg')} alt="Store associate wearing the Augmodo Smartbadge" />
      </div>
      <div className="text-scrim" aria-hidden="true" />
      <h2 className="h-display badge-title">100% Passive<br />Smartbadge</h2>
      <p className="body badge-para">Empower your greatest asset, your people, with no operational changes, while being 100x cheaper hardware than competing solutions.</p>
    </section>`;
}

/* ─────────────── 7–10 · Real-time Spatialview ─────────────── */

const PIES = [
  { top: 29.37, svg: 'pie1.svg', label: ['Out of Stock', '5.4%'] },
  { top: 176.2, svg: 'pie2.svg', label: ['Low Stock', '37.5%'] },
  { top: 323.04, svg: 'pie3.svg', label: ['Pricing Compliance', '83%'] },
];

export function Spatialview() {
  const ref = useRef(null);
  useScene(ref, ({ q, one, mm }) => {
    const titleLines = splitLines(one('.sv-title'));
    const paraLines = splitLines(one('.sv-para'));
    const screen = one('.screen');

    mm.add(DESKTOP, () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: ref.current, start: 'top top', end: () => `+=${vh() * 3}`,
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
      tl.from(titleLines, { ...LINE_IN, duration: 0.6 }, 0.1)
        .from(paraLines, { ...LINE_IN, duration: 0.6 }, 0.8)
        // frame 9: slides up from below at full size (top 371) …
        // background softens only as the card arrives, so the text and card stay legible
        .fromTo(one('.spatial-bg'), { filter: 'blur(0px)' }, { filter: () => `blur(${12 * u()}px)`, duration: 1.1, ease: 'none' }, 0.8)
        .to(one('.text-scrim'), { autoAlpha: 1, duration: 1.1, ease: 'none' }, 0.8)
        .fromTo(screen, { y: () => vh() - 304 * u(), scale: 1 }, { y: () => 67 * u(), scale: 1, duration: 1.1, ease: 'power2.out' }, 0.8)
        // frame 10: settles smaller and centred (655.5 × 368 at top 304)
        .to(screen, { y: 0, scale: 655.5 / 874, duration: 0.9 }, 2.0)
        .from(q('.pie'), { scale: 0, autoAlpha: 0, duration: 0.45, stagger: 0.18, ease: 'back.out(2)' }, 2.75)
        .to({}, { duration: 0.4 });
    });
    mm.add(MOBILE, () => {
      revealOnEnter(ref.current, [...titleLines, ...paraLines], 'top 40%');
      gsap.from(screen, { y: 120, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: screen, start: 'top 90%' } });
      gsap.from(q('.pie'), { scale: 0, autoAlpha: 0, stagger: 0.15, ease: 'back.out(2)', scrollTrigger: { trigger: screen, start: 'top 60%' } });
    });
  });

  return html`
    <section className="spatial panel" ref=${ref}>
      <div className="spatial-bg"><img src=${A('store.jpg')} alt="" /></div>
      <div className="text-scrim" aria-hidden="true" />
      <div className="copy-block">
        <h2 className="h-display sv-title">Real-time<br />Spatialview™</h2>
        <p className="body sv-para">Pour your morning coffee, open your laptop, and check any store’s conditions in real time. With store level Realograms™ you can find and fix problems when they happen, not when sales dip.</p>
      </div>
      <div className="screen">
        <div className="screen-scan">
          <${PointCloud} src=${A('store.jpg')} box=${[874, 491]} imgRect=${[-2.27, -0.2, 876.1, 491]} params=${SCAN_PARAMS} />
        </div>
        ${PIES.map((p) => html`
          <div className="pie" key=${p.svg} style=${{ top: U(p.top) }}>
            <div className="pie-chart"><img src=${A(p.svg)} alt="" /></div>
            <p className="pie-label">${p.label[0]}<br />${p.label[1]}</p>
          </div>`)}
      </div>
    </section>`;
}

/* ─────────────── 11–14 · Easy To Scale ─────────────── */

// Positions + purple fill widths from the Feature_03 frame.
const PINS = [
  { x: 668, y: 224, fill: 60 }, { x: 912, y: 101, fill: 15 }, { x: 195, y: 358, fill: 25 },
  { x: 1232, y: 385, fill: 15 }, { x: 411, y: 488, fill: 75 }, { x: 1041, y: 601, fill: 50 },
];

export function EasyToScale() {
  const ref = useRef(null);
  useScene(ref, ({ q, one, mm }) => {
    const lines = [...splitLines(one('.ets-title')), ...splitLines(one('.ets-para'))];

    mm.add(DESKTOP, () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: ref.current, start: 'top top', end: () => `+=${vh() * 2.6}`,
          // The .scale-retail wrapper is pinned later for the Retail/Brand hold, and a pinned
          // element carries a transform that would trap this pin's position: fixed. Reparenting
          // to <body> while pinned keeps it fixed to the screen.
          pin: true, pinReparent: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
      tl.from(lines, { ...LINE_IN, duration: 0.6 }, 0.1)
        .from(q('.pin-line'), { scaleY: 0, duration: 0.6, stagger: 0.12 }, 0.8)
        .from(q('.pin-track'), { scaleX: 0, duration: 0.35, stagger: 0.12 }, 1.25)
        .from(q('.pin-label'), { autoAlpha: 0, y: () => 6 * u(), duration: 0.35, stagger: 0.12 }, 1.4)
        .from(q('.pin-fill'), { width: 0, duration: 0.6, stagger: 0.12, ease: 'power2.inOut' }, 2.2)
        .to({}, { duration: 0.4 });
    });
    mm.add(MOBILE, () => {
      revealOnEnter(ref.current, lines, 'top 40%');
      gsap.from(q('.pin-line'), { scaleY: 0, stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 30%' } });
    });
  });

  return html`
    <section className="scale panel" ref=${ref}>
      <div className="scale-bg"><img src=${A('city.jpg')} alt="City skyline" /></div>
      <div className="copy-block">
        <h2 className="h-display ets-title">Easy To Scale</h2>
        <p className="body ets-para">Low capex, 100% passive for associates, ${'<30'} minutes to set up new stores, and built in redundancy.</p>
      </div>
      ${PINS.map((p, i) => html`
        <div className="pin" key=${i} style=${{ left: U(p.x), top: U(p.y), '--px': p.x / 14.4, '--py': p.y / 8.1 }}>
          <span className="pin-line" />
          <span className="pin-label">Inventory</span>
          <span className="pin-track"><span className="pin-fill" style=${{ width: U(p.fill) }} /></span>
        </div>`)}
    </section>`;
}

/* ─────────────── 15–16 · Retail / Brand ─────────────── */

const FEATURES = {
  retail: ['Track out of stocks', 'Optimize store associate time', 'Improve compliance', 'Build automation', 'Provide DSD notifications', 'Optimize supply chain'],
  brand: ['On-shelf availability', 'Planogram compliance', 'Promotion compliance', 'Competitor benchmarks', 'Improved field rep routing', 'DSD notifications'],
};

export function RetailBrand() {
  const ref = useRef(null);
  const [mode, setMode] = useState('retail');
  const first = useRef(true);

  useScene(ref, ({ q, one, mm }) => {
    const lines = [...splitLines(one('.rb-title')), ...splitLines(one('.rb-para'))];
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%', toggleActions: 'play none none reverse' } });
    tl.from(q('.toggle-row'), { autoAlpha: 0, y: 10, duration: 0.5 })
      .from(lines, { ...LINE_IN, duration: 0.9 }, 0.1)
      .from(q('.rb-rule'), { scaleX: 0, transformOrigin: 'left', duration: 0.8, stagger: 0.07, ease: 'power3.inOut' }, 0.1)
      .from(q('.rb-text'), { yPercent: 140, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, 0.3);

    // Frames 15 → 16: hold with the city still above (pin the city + section wrapper once the
    // section's bottom meets the screen's) and flip to BRAND halfway. Clicks still work; scroll
    // only sets the mode when it crosses the midpoint.
    mm.add(DESKTOP, () => {
      let side = 'retail';
      ScrollTrigger.create({
        trigger: ref.current.parentElement, start: 'bottom bottom', end: () => `+=${vh() * 1.1}`,
        pin: true, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = self.progress >= 0.45 ? 'brand' : 'retail';
          if (next !== side) { side = next; setMode(next); }
        },
      });
    });
  });

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    gsap.fromTo(ref.current.querySelectorAll('.rb-text'), { yPercent: 140 }, { yPercent: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' });
  }, [mode]);

  const toggle = (m) => () => setMode(m);
  return html`
    <section className="retail" ref=${ref}>
      <div className="toggle-row" role="tablist" aria-label="Audience">
        <button role="tab" aria-selected=${mode === 'retail'} className=${mode === 'retail' ? 'on' : ''} onClick=${toggle('retail')}>RETAIL</button>
        <button className=${`switch switch--${mode}`} aria-label="Switch audience" onClick=${toggle(mode === 'retail' ? 'brand' : 'retail')}>
          <span className="switch-track" /><span className="switch-knob" />
        </button>
        <button role="tab" aria-selected=${mode === 'brand'} className=${mode === 'brand' ? 'on' : ''} onClick=${toggle('brand')}>BRAND</button>
      </div>
      <h2 className="h-display rb-title">Real-time Data and Trends</h2>
      <p className="body rb-para">Empower your greatest asset, your people, with no operational changes, while being 100x cheaper hardware than competing solutions.</p>
      <ul className="rb-list">
        ${FEATURES[mode].map((f, i) => html`
          <li key=${i}><span className="rb-rule" /><span className="rb-mask"><span className="rb-text">${f}</span></span></li>`)}
      </ul>
    </section>`;
}

/* ─────────────── 17–20 · Principle cards ─────────────── */

function usePrinciple(ref, revealTween) {
  useScene(ref, ({ q, one, mm }) => {
    const titleLines = splitLines(one('.pr-title'));
    const paraLines = splitLines(one('.pr-para'));
    revealOnEnter(ref.current, titleLines, 'top 70%');

    mm.add(DESKTOP, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current, start: 'top top', end: () => `+=${vh() * 1.2}`,
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
      tl.from(paraLines, { ...LINE_IN, duration: 0.6 }, 0.05);
      revealTween(tl, one('.pr-reveal'), 0.2);
      tl.to({}, { duration: 0.3 });
    });
    mm.add(MOBILE, () => {
      revealOnEnter(ref.current, paraLines, 'top 60%');
      const tl = gsap.timeline({ scrollTrigger: { trigger: one('.pr-media'), start: 'top 70%', end: 'bottom 60%', scrub: 1 } });
      revealTween(tl, one('.pr-reveal'), 0);
    });
  });
}

export function AugmentedWorkforce() {
  const ref = useRef(null);
  // Frame 17 → 18: scan overlay widens from x=287 to x=100 inside the image.
  usePrinciple(ref, (tl, el, at) => tl.fromTo(el,
    { clipPath: () => `inset(0px 0px 0px ${287 * u()}px)` },
    { clipPath: () => `inset(0px 0px 0px ${100 * u()}px)`, duration: 0.9, ease: 'power2.inOut' }, at));

  return html`
    <section className="principle principle--one" ref=${ref}>
      <h2 className="h-display pr-title">Augmented Workforce™</h2>
      <p className="body pr-para">Technology should enhance, not replace, your workforce. Reduce tedious audits, simplify ecommerce picking, provide security, and enhance the value of associate’s roles with a passive Smartbadge.</p>
      <div className="pr-media">
        <div className="aw-photo"><img src=${A('store.jpg')} alt="Grocery produce aisle" /></div>
        <div className="pr-reveal aw-scan">
          <${PointCloud} src=${A('store.jpg')} box=${[650, 680]} imgRect=${[-346, -35.6, 1338, 750]} params=${SCAN_PARAMS} />
        </div>
      </div>
    </section>`;
}

export function Privacy() {
  const ref = useRef(null);
  usePrinciple(ref, (tl, el, at) => tl.fromTo(el,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' }, at));

  return html`
    <section className="principle principle--two" ref=${ref}>
      <h2 className="h-display pr-title">World Leading Privacy</h2>
      <p className="body pr-para">Augmodo’s core value is to enable people, not track them. We run state of the art privacy filtering on premise to ensure that only shelf data is processed. We do not track customers.</p>
      <div className="pr-media">
        <img className="pv-photo" src=${A('privacy.jpg')} alt="Busy supermarket from above" />
        <div className="pr-reveal pv-scan">
          <${PointCloud} src=${A('privacy.jpg')} box=${[531, 346]} imgRect=${[-34, -311, 680, 680]} params=${PRIVACY_PARAMS} />
        </div>
      </div>
    </section>`;
}

/* ─────────────── 21–22 · Testimonials + footer ─────────────── */

const QUOTES = [
  {
    text: '“Augmodo was quick to set up and impressive in the speed to value. Within days I had deep data resulting in both micro and macro insights. Within a month our on-shelf availability improved by 30% and it continues to improve!”',
    who: 'Head of Operations, Drug Retailer',
  },
  {
    text: '“Our field reps used to find out about planogram issues weeks late. Now we see every shelf in real time and fix problems the same day they happen.”',
    who: 'Placeholder quote · VP Retail Execution, CPG Brand',
  },
  {
    text: '“Setup took less than thirty minutes per store and our associates didn’t change a thing about how they work. The data just started flowing.”',
    who: 'Placeholder quote · Director of Store Operations, Grocery Chain',
  },
];

export function Outro() {
  const ref = useRef(null);
  const stRef = useRef(null);
  const [active, setActive] = useState(0);
  const [sent, setSent] = useState(false);

  useScene(ref, ({ q, one, mm }) => {
    const quotes = q('.quote');
    gsap.set(quotes.slice(1), { autoAlpha: 0, y: 30 });
    revealOnEnter(one('.testimonials'), splitLines(one('.t-title')), 'top 80%');

    const build = (pinned) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinned ? ref.current : one('.testimonials'),
          start: pinned ? 'bottom bottom' : 'top 40%',
          end: () => `+=${vh() * (pinned ? 2 : 1.2)}`,
          pin: pinned, scrub: 1, invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 2.999))),
        },
      });
      stRef.current = tl.scrollTrigger;
      quotes.slice(1).forEach((qEl, i) => {
        tl.to(quotes[i], { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power2.in' }, i + 0.6)
          .to(qEl, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, i + 0.85);
      });
      tl.to({}, { duration: 0.6 });
    };
    mm.add(DESKTOP, () => build(true));
    mm.add(MOBILE, () => build(false));
  });

  const goTo = (i) => () => {
    const st = stRef.current;
    if (!st) return;
    window.scrollTo({ top: st.start + (st.end - st.start) * ((i + 0.5) / 3), behavior: 'smooth' });
  };

  return html`
    <div className="outro" ref=${ref}>
      <section className="testimonials">
        <h2 className="h-display t-title">What our partners are<br />saying about us.</h2>
        <div className="quotes">
          ${QUOTES.map((qt, i) => html`
            <figure className="quote" key=${i} aria-hidden=${active !== i}>
              <blockquote>${qt.text}</blockquote>
              <figcaption>${qt.who}</figcaption>
            </figure>`)}
        </div>
        <div className="dots" role="tablist" aria-label="Testimonials">
          ${QUOTES.map((_, i) => html`<button key=${i} className=${i === active ? 'on' : ''} aria-label=${`Testimonial ${i + 1}`} onClick=${goTo(i)} />`)}
        </div>
      </section>
      <footer className="footer" id="footer">
        <h2 className="h-display">Stay up to date with the<br />latest from Augmodo</h2>
        <form className="signup" onSubmit=${(e) => { e.preventDefault(); setSent(true); }}>
          ${sent
            ? html`<p className="signup-thanks">Thanks, you’re on the list.</p>`
            : html`<input type="email" required placeholder="EMAIL" aria-label="Email address" />
                   <button type="submit" aria-label="Subscribe"><img src=${A('arrow.svg')} alt="" /></button>`}
        </form>
        <div className="legal">
          <span>© 2026 Augmodo</span>
          <span className="legal-links"><a href="#footer">Privacy Policy</a><a href="#footer">Terms Of Use</a></span>
        </div>
      </footer>
    </div>`;
}

/* ─────────────── Video placeholder overlay ─────────────── */

export function VideoOverlay({ open, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 });
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  if (!open) return null;
  return html`
    <div className="video-overlay" ref=${ref} role="dialog" aria-modal="true" aria-label="Video" onClick=${onClose}>
      <div className="video-overlay-box" onClick=${(e) => e.stopPropagation()}>
        <img src=${A('play.svg')} alt="" />
        <p>Video coming soon</p>
        <span>Drop the final film in here once it’s ready.</span>
        <button onClick=${onClose}>Close</button>
      </div>
    </div>`;
}
