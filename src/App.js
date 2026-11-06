import React, { useEffect, useLayoutEffect, useState } from 'react';
import { html, ScrollTrigger, syncUnit } from './lib.js';
import {
  Header, Intro, Smartbadge, Spatialview, EasyToScale, RetailBrand,
  AugmentedWorkforce, Privacy, Testimonials, Cta, Footer, VideoOverlay,
} from './sections.js';
import { CareersHero, JobBoard } from './careers.js';
import { ContactOverlay } from './contact.js';

// Hash routes so the prototype runs from any static server: #/ is the homepage, #/careers the careers page.
const routeOf = () => (location.hash.startsWith('#/careers') ? 'careers' : 'home');

export function App() {
  const [route, setRoute] = useState(routeOf);
  const [videoOpen, setVideoOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  // Remount on width changes so line splits and pinned timelines are rebuilt for the new layout.
  const [layoutKey, setLayoutKey] = useState(0);

  useEffect(() => {
    const onHash = () => setRoute(routeOf());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    setContactOpen(false);
  }, [route]);

  useEffect(() => {
    let lastW = document.documentElement.clientWidth;
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const w = document.documentElement.clientWidth;
        if (w === lastW) return ScrollTrigger.refresh();
        lastW = w;
        syncUnit();
        setLayoutKey((k) => k + 1);
      }, 250);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    // Images change pinned section geometry once decoded.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [layoutKey, route]);

  const openContact = (e) => { e?.preventDefault(); setContactOpen(true); };
  const key = `${route}-${layoutKey}`;

  return html`
    <${React.Fragment}>
      <${Header} key=${`h${key}`} page=${route} onContact=${openContact} />
      <main key=${key} className=${`page page--${route}`}>
        ${route === 'careers'
          ? html`
            <${CareersHero} />
            <${JobBoard} />
            <${Footer} />`
          : html`
            <${Intro} onPlay=${() => setVideoOpen(true)} onContact=${openContact} />
            <${Smartbadge} />
            <${Spatialview} />
            <div className="scale-retail">
              <${EasyToScale} />
              <${RetailBrand} />
            </div>
            <${AugmentedWorkforce} />
            <${Privacy} />
            <${Testimonials} />
            <${Cta} onContact=${openContact} />`}
      </main>
      <${VideoOverlay} open=${videoOpen} onClose=${() => setVideoOpen(false)} />
      <${ContactOverlay} open=${contactOpen} onClose=${() => setContactOpen(false)} />
    <//>`;
}
