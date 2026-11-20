import React, { useEffect, useLayoutEffect, useState } from 'react';
import { html, ScrollTrigger, syncUnit } from './lib.js';
import {
  Header, Intro, Smartbadge, Spatialview, EasyToScale, RetailBrand,
  AugmentedWorkforce, Privacy, Testimonials, Cta, Footer, VideoOverlay,
} from './sections.js';
import { CareersHero, JobBoard } from './careers.js';
import { ContactOverlay } from './contact.js';
import { Product, Solutions, OurStory } from './pages.js';
import { Brands, Brokers, OtherIndustries } from './solutions.js';
import { Faq } from './faq.js';
import { Blog, Article } from './blog.js';
import { News } from './news.js';

// Hash routes so the prototype runs from any static server: #/ is the homepage, #/<page>[/<slug>] the rest
// (#/blog/<article>, #/faq/<topic>, #/solutions/<audience>).
const PAGES = ['product', 'solutions', 'our-story', 'careers', 'news', 'blog', 'faq'];
const routeOf = () => {
  const [, page = '', slug = ''] = location.hash.split('/');
  return PAGES.includes(page) ? `${page}/${slug}` : 'home/';
};

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
  const [page, slug] = route.split('/');
  const key = `${route}-${layoutKey}`;
  const body = {
    product: () => html`<${Product} onContact=${openContact} />`,
    solutions: () => {
      // #/solutions on its own is For Retailers.
      const Audience = { brands: Brands, brokers: Brokers, 'other-industries': OtherIndustries }[slug] || Solutions;
      return html`<${Audience} onContact=${openContact} />`;
    },
    'our-story': () => html`<${OurStory} onContact=${openContact} />`,
    news: () => html`<${News} onContact=${openContact} />`,
    faq: () => html`<${Faq} onContact=${openContact} section=${slug} />`,
    blog: () => (slug ? html`<${Article} slug=${slug} onContact=${openContact} />` : html`<${Blog} onContact=${openContact} />`),
    careers: () => html`
      <${CareersHero} />
      <${JobBoard} />
      <${Footer} />`,
    home: () => html`
      <${Intro} onPlay=${() => setVideoOpen(true)} onContact=${openContact} />
      <${Smartbadge} />
      <${AugmentedWorkforce} />
      <${EasyToScale} />
      <div className="scale-retail">
        <${Spatialview} />
        <${RetailBrand} />
      </div>
      <${Privacy} />
      <${Testimonials} />
      <${Cta} onContact=${openContact} />`,
  }[page];

  return html`
    <${React.Fragment}>
      <${Header} key=${`h${key}`} page=${page} slug=${slug} onContact=${openContact} />
      <main key=${key} className=${`page page--${page}`}>${body()}</main>
      <${VideoOverlay} open=${videoOpen} onClose=${() => setVideoOpen(false)} />
      <${ContactOverlay} open=${contactOpen} onClose=${() => setContactOpen(false)} />
    <//>`;
}
