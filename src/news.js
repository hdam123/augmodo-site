import { useEffect, useRef, useState } from 'react';
import { html, gsap } from './lib.js';
import { A, Cta } from './sections.js';
import { Page, PageHero } from './blocks.js';

/* ─────────────── News (content from augmodo.com/news, 9 Nov 2026) ───────────────
   Each story links out to the original coverage or release. Images were saved from the live
   page into assets/news; `logo` marks the ones that are a publication's logo, not a photo. */

const NEWS = [
  { type: 'Press', date: '2026-10-07', img: '01.jpg', url: 'https://www.adammendler.com/ai-in-the-workplace/',
    title: 'AI in the Workplace: How Work Is Changing',
    dek: 'Ross Finman joins business leaders on the AI trends to watch: AI arriving on the frontline as a physical object, clipped to a shirt or built into glasses.' },
  { type: 'Press', date: '2026-09-16', img: '02.jpg', url: 'https://www.augmodo.com/augmodo-unveils-owl-mini-owl-pro',
    title: 'Augmodo Unveils Wearable Owl Mini and Owl Pro: Shrinking Physical AI Into Smallest, Smartest Smartbadge™ Ever Built',
    dek: 'Six hardware generations developed in 24 months, shaped by workers who wear it. Augmodo is making jobs easier with smarter, lighter Smartbadge™: Physical AI moving at software speed.' },
  { type: 'News', date: '2026-07-13', img: '03.jpg', url: 'https://www.augmodo.com/augmodo-secures-21m-to-scale-ai-assistants-for-the-physical-workforce-beyond-retail-at-a-350m-valuation',
    title: 'Augmodo Secures $21M to Scale AI Assistants for the Physical Workforce Beyond Retail at a $350M Valuation' },
  { type: 'News', date: '2025-09-16', img: '04.jpg', url: 'https://www.augmodo.com/augmodo-dunnhumby-release',
    title: 'Augmodo + dunnhumby Forecast How Spatial AI Will Revolutionize Retail' },
  { type: 'News', date: '2025-04-01', img: '05.jpg', url: 'https://retailtechinnovationhub.com/home/2025/3/31/augmodo-snags-chemist-warehouse-partnership-hires-simon-morriss-as-commercial-director-for-apac',
    title: 'Augmodo & Chemist Warehouse launch $18M partnership' },
  { type: 'News', date: '2025-01-06', img: '07.png', logo: true, url: 'https://retailtechinnovationhub.com/home/2025/1/4/including-agency-72-and-shopai-rtih-presents-12-retail-technology-startups-to-watch-out-for-in-2025',
    title: 'Augmodo selected as top retail tech start-up to watch for 2025' },
  { type: 'News', date: '2024-12-31', img: '06.jpg', url: 'https://www.supermarketperimeter.com/articles/12157-augmented-reality-enhancing-employees-putting-consumers-first',
    title: 'Augmented Reality, Enhancing Employees and Putting Consumers First' },
  { type: 'News', date: '2024-12-20', img: '08.jpg', url: 'https://progressivegrocer.com/smartbadge-now-boosts-grocery-e-comm-profitability',
    title: 'Augmodo and Mercatus Introduce New Tech to Increase Profitability of Grocery eCommerce' },
  { type: 'News', date: '2024-12-11', img: '09.jpg', url: 'https://entrepreneurloop.com/chemist-warehouse-launches-pilot-with-augmodo-providing-store-associates-with-spatial-ai-assistants/',
    title: 'Chemist Warehouse Launches Pilot With Augmodo' },
  { type: 'News', date: '2024-10-17', img: '10.jpg', url: 'https://retailtechinnovationhub.com/home/2024/10/15/retail-technology-startup-stories-interview-ross-finman-founder-and-ceo-at-augmodo',
    title: 'Retail Technology Startup Stories Interview: Ross Finman, Founder and CEO at Augmodo' },
  { type: 'News', date: '2024-10-08', img: '11.jpg', url: 'https://coresight.com/research/groceryshop-2024-shark-reef-startup-pitch-recap/',
    title: 'Groceryshop 2024 “Shark Reef” Startup Pitch Competition: 12 Innovators, Two Winners' },
  { type: 'News', date: '2024-10-07', img: '12.png', logo: true, url: 'https://progressivegrocer.com/could-ai-powered-employee-badges-become-game-changer',
    title: 'Could AI-Powered Employee Badges Become a Game Changer?' },
  { type: 'News', date: '2024-10-02', img: '13.png', logo: true, url: 'https://www.geekwire.com/2024/inventory-tracking-startup-augmodo-raises-5-3m-to-monitor-store-shelves-via-wearable-tech/',
    title: 'Inventory tracking startup Augmodo raises $5.3M to monitor store shelves via wearable tech' },
  { type: 'News', date: '2024-08-20', img: '14.png', logo: true, url: 'https://www.supermarketnews.com/grocery-technology/augmented-reality-company-augmodo-wins-fmi-techpitch-competition',
    title: 'Augmented Reality Company Augmodo Wins FMI TechPitch Competition',
    dek: 'Supermarket News sat down with CEO Ross Finman to talk about the win, as well as the future of augmented reality in grocery' },
  { type: 'Press', date: '2024-02-21', img: '13.png', logo: true, url: 'https://www.geekwire.com/2024/former-niantic-leaders-spatial-computing-startup-aims-to-help-retailers-track-shelf-inventory/',
    title: 'Former Niantic Leader’s Spatial computing startup aims to help retailers track shelf inventory' },
];

const fmt = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

function Thumb({ item, className }) {
  return html`
    <div className=${`news-img${item.logo ? ' news-img--logo' : ''}${className ? ` ${className}` : ''}`}>
      <img src=${A(`news/${item.img}`)} alt="" loading="lazy" />
    </div>`;
}

const Meta = ({ item }) => html`<p className="news-meta"><span>${item.type}</span><span>${fmt(item.date)}</span></p>`;

export function News({ onContact }) {
  const [type, setType] = useState('All');
  const [query, setQuery] = useState('');
  const list = useRef(null);
  const [featured, ...rest] = NEWS;

  const q = query.trim().toLowerCase();
  const shown = rest.filter((n) => (type === 'All' || n.type === type) && (!q || `${n.title} ${n.dek || ''}`.toLowerCase().includes(q)));

  // Cards rise in whenever the filter or search changes the list.
  const listKey = shown.map((n) => n.url).join();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    gsap.fromTo(list.current.querySelectorAll('.news-card'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' });
  }, [listKey]);

  return html`
    <${Page}>
      <${PageHero} eyebrow="News" title="News and Announcements" />

      <a className="news-featured" href=${featured.url} target="_blank" rel="noopener">
        <${Thumb} item=${featured} className="news-featured-img" />
        <div className="news-featured-copy" data-fade>
          <p className="eyebrow">Latest</p>
          <${Meta} item=${featured} />
          <h2 className="h-display news-featured-title">${featured.title}</h2>
          <p className="body news-dek">${featured.dek}</p>
          <span className="text-link">Read more<img src=${A('arrow.svg')} alt="" /></span>
        </div>
      </a>

      <section className="news-list" id="all-news">
        <div className="news-tools" data-fade>
          <div className="news-types" role="tablist" aria-label="Filter by type">
            ${['All', 'Press', 'News'].map((t) => html`
              <button key=${t} role="tab" aria-selected=${type === t} className=${type === t ? 'on' : ''} onClick=${() => setType(t)}>${t}</button>`)}
          </div>
          <label className="field news-search">
            <span className="sr-only">Search news</span>
            <input type="search" placeholder="Search" value=${query} onInput=${(e) => setQuery(e.target.value)} />
          </label>
        </div>

        <div className="news-grid" ref=${list}>
          ${shown.map((n) => html`
            <a className="news-card" key=${n.url + n.date} href=${n.url} target="_blank" rel="noopener" data-fade>
              <${Thumb} item=${n} />
              <${Meta} item=${n} />
              <h3 className="news-title">${n.title}</h3>
              ${n.dek && html`<p className="news-dek">${n.dek}</p>`}
              <span className="text-link">Read more<img src=${A('arrow.svg')} alt="" /></span>
            </a>`)}
        </div>
        ${!shown.length && html`
          <p className="jobs-status">Nothing matches that search. <button className="link" onClick=${() => { setQuery(''); setType('All'); }}>Show all news</button></p>`}
      </section>

      <${Cta} onContact=${onContact} />
    <//>`;
}
