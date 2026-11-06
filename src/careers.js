import { useEffect, useMemo, useRef, useState } from 'react';
import { html, gsap, splitLines, LINE_IN } from './lib.js';
import { A, useScene } from './sections.js';

/* ─────────────── Careers (Figma "Careers") ─────────────── */

export function CareersHero() {
  const ref = useRef(null);
  useScene(ref, ({ one }) => {
    const lines = [...splitLines(one('.hero-title')), ...splitLines(one('.careers-intro'))];
    gsap.from(lines, { ...LINE_IN, duration: 1.1, stagger: 0.06, delay: 0.15 });
    gsap.from(one('.hero-btn'), { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power3.out', delay: 0.55 });
    gsap.fromTo(one('.careers-image img'), { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: one('.careers-image'), start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  const toBoard = () => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' });

  return html`
    <section className="careers-hero" ref=${ref}>
      <h1 className="hero-title">Join the Team</h1>
      <p className="body careers-intro">We are bringing the most advanced technologies in spatial computing and applying them to the largest market in the world - physical commerce to transform the way people work and shop in the real world. We strive to take the deepest tech and make it easy, approachable, and helpful to the >100m people working in commerce.</p>
      <button className="btn hero-btn" onClick=${toBoard}>Open Positions</button>
      <div className="careers-image"><img src=${A('city.jpg')} alt="City skyline at dusk" /></div>
    </section>`;
}

/* ── Job board: Ashby's public Job Posting API, laid out in Augmodo's own design ── */

const BOARD_URL = 'https://api.ashbyhq.com/posting-api/job-board/augmodo';

// Snapshot of the live board (6 Nov 2026), shown only if the API can't be reached.
const FALLBACK = [
  {
    id: '816bc83f-8655-4a56-8c68-19e0a14b61a9', title: 'Infrastructure Engineer', department: 'Engineering',
    employmentType: 'FullTime', location: 'United Kingdom', workplaceType: 'Remote', isRemote: true,
    jobUrl: 'https://jobs.ashbyhq.com/augmodo/816bc83f-8655-4a56-8c68-19e0a14b61a9',
  },
  {
    id: '34eb5835-cc56-4f7c-a1b0-7da45b2da72d', title: 'Software Engineer, Data Intelligence', department: 'Engineering',
    employmentType: 'FullTime', location: 'United States', workplaceType: 'Remote', isRemote: true,
    jobUrl: 'https://jobs.ashbyhq.com/augmodo/34eb5835-cc56-4f7c-a1b0-7da45b2da72d',
  },
];

const EMPLOYMENT = { FullTime: 'Full time', PartTime: 'Part time', Intern: 'Internship', Contract: 'Contract', Temporary: 'Temporary' };
const WORKPLACE = { Remote: 'Remote', OnSite: 'On-site', Hybrid: 'Hybrid' };

const toRole = (j) => ({
  id: j.id,
  title: j.title.trim(),
  department: j.department || j.team || 'Other',
  type: EMPLOYMENT[j.employmentType] || j.employmentType || '',
  locations: [j.location, ...(j.secondaryLocations || []).map((l) => l.location)].filter(Boolean),
  workplace: WORKPLACE[j.workplaceType] || (j.isRemote ? 'Remote' : ''),
  url: j.jobUrl,
});

const FILTERS = [
  { key: 'department', label: 'Department', all: 'All Departments', values: (r) => [r.department] },
  { key: 'type', label: 'Employment Type', all: 'All Employment Types', values: (r) => [r.type] },
  { key: 'location', label: 'Location', all: 'All Locations', values: (r) => r.locations },
  { key: 'workplace', label: 'Location Type', all: 'All Location Types', values: (r) => [r.workplace] },
];

export function JobBoard() {
  const ref = useRef(null);
  const [roles, setRoles] = useState(null);
  const [picked, setPicked] = useState({});

  useEffect(() => {
    let alive = true;
    fetch(BOARD_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => d.jobs.filter((j) => j.isListed !== false))
      .catch(() => FALLBACK)
      .then((jobs) => alive && setRoles(jobs.map(toRole)));
    return () => { alive = false; };
  }, []);

  useScene(ref, ({ one }) => {
    // The title's count arrives after the fetch, so it's revealed whole rather than line-split
    // (SplitText would replace the text node React updates).
    gsap.from(one('.jobs-title'), {
      yPercent: 110, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
    gsap.from([one('.jobs-powered'), one('.filters')], {
      autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 70%', toggleActions: 'play none none reverse' },
    });
  });

  const options = useMemo(() => Object.fromEntries(FILTERS.map((f) => [
    f.key, [...new Set((roles || []).flatMap(f.values).filter(Boolean))].sort(),
  ])), [roles]);

  const shown = (roles || []).filter((r) => FILTERS.every((f) => !picked[f.key] || f.values(r).includes(picked[f.key])));
  const groups = [...new Set(shown.map((r) => r.department))].sort().map((d) => [d, shown.filter((r) => r.department === d)]);

  // Rows animate in whenever the list changes (first load or a filter change).
  const listKey = shown.map((r) => r.id).join();
  useEffect(() => {
    if (!roles) return;
    gsap.fromTo(ref.current.querySelectorAll('.job, .job-group-label'),
      { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' });
  }, [listKey, roles]);

  return html`
    <section className="jobs" id="positions" ref=${ref}>
      <div className="jobs-head">
        <div className="jobs-title-mask"><h2 className="h-display jobs-title">Open Positions${roles ? ` (${roles.length})` : ''}</h2></div>
        <p className="jobs-powered">Powered by Ashby</p>
      </div>
      <div className="jobs-main">
        <div className="filters">
          <p className="jobs-label">Filters</p>
          <div className="filter-grid">
            ${FILTERS.map((f) => html`
              <label className="filter" key=${f.key}>
                <span className="filter-name">${f.label}</span>
                <select value=${picked[f.key] || ''} onChange=${(e) => setPicked({ ...picked, [f.key]: e.target.value })}>
                  <option value="">${f.all}</option>
                  ${options[f.key].map((o) => html`<option key=${o} value=${o}>${o}</option>`)}
                </select>
              </label>`)}
          </div>
        </div>
        ${!roles && html`<p className="jobs-status">Loading open roles…</p>`}
        ${roles && !shown.length && html`
          <p className="jobs-status">No roles match these filters. <button className="link" onClick=${() => setPicked({})}>Clear filters</button></p>`}
        ${groups.map(([dept, list]) => html`
          <div className="job-group" key=${dept}>
            <p className="jobs-label job-group-label">${dept}</p>
            <ul className="job-list">
              ${list.map((r) => html`
                <li key=${r.id}>
                  <a className="job" href=${r.url} target="_blank" rel="noopener">
                    <span className="job-title">${r.title}</span>
                    <span className="job-meta">${[r.department, r.locations.join(' / '), r.type, r.workplace].filter(Boolean).join(' • ')}</span>
                    <img className="job-arrow" src=${A('arrow.svg')} alt="" />
                  </a>
                </li>`)}
            </ul>
          </div>`)}
      </div>
    </section>`;
}
