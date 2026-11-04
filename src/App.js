import React, { useEffect, useState } from 'react';
import { html, ScrollTrigger, syncUnit } from './lib.js';
import {
  Header, Intro, Smartbadge, Spatialview, EasyToScale, RetailBrand,
  AugmentedWorkforce, Privacy, Outro, VideoOverlay,
} from './sections.js';

export function App() {
  const [videoOpen, setVideoOpen] = useState(false);
  // Remount on width changes so line splits and pinned timelines are rebuilt for the new layout.
  const [layoutKey, setLayoutKey] = useState(0);

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
  }, [layoutKey]);

  return html`
    <${React.Fragment}>
      <${Header} key=${`h${layoutKey}`} />
      <main key=${layoutKey}>
        <${Intro} onPlay=${() => setVideoOpen(true)} />
        <${Smartbadge} />
        <${Spatialview} />
        <div className="scale-retail">
          <${EasyToScale} />
          <${RetailBrand} />
        </div>
        <${AugmentedWorkforce} />
        <${Privacy} />
        <${Outro} />
      </main>
      <${VideoOverlay} open=${videoOpen} onClose=${() => setVideoOpen(false)} />
    <//>`;
}
