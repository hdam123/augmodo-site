import { useEffect, useState } from 'react';
import { html } from './lib.js';
import { A, Cta } from './sections.js';
import { Page, PageHero, Band, TextLink } from './blocks.js';
import { Thumb } from './thumb.js';

/* ─────────────── Blog (copy: "Augmodo Website Content_Blog") ───────────────
   Article 2 (Augmodo vs. Manual Audits, RFID, Fixed Cameras, and Robots) is marked [HOLD]
   in the doc, so it isn't published here. Blocks: ['lead'|'h'|'p', text], ['ol'|'ul', items]
   where an item is text or [bold, rest], ['table', head, rows], ['faq', [[q, a]]], ['calc'].
   `th` is the list-card thumbnail treatment (src/thumb.js); `hero` gives the article page its own photo
   so the card and the article never show the same image. */

const ABOUT = 'Augmodo builds Physical AI assistants for the physical workforce. A passive Smartbadge™ turns ordinary movement into a live 3D map of what’s happening on the floor, giving a new hire the situational awareness of a two-year veteran. Augmodo sees the work, not the worker. Today Augmodo maps more than 186 million square feet every month across some of the largest retailers and CPG brands in the world.';

export const ARTICLES = [
  {
    slug: 'what-is-physical-ai',
    tag: 'Physical AI',
    title: 'What Is Physical AI?',
    dek: 'Physical AI is AI that perceives physical space and reasons about the work inside it. Learn how Physical AI for the physical workforce works.',
    image: 'video-thumb-lanyard.jpg', pos: '50% 38%', th: { kind: 'split' }, hero: 'photos/article-warehouse-team.jpg',
    blocks: [
      ['lead', 'AI assistants for the physical workforce.'],
      ['h', 'What is Physical AI?'],
      ['p', 'Physical AI is artificial intelligence that perceives physical space, remembers it, and reasons about the work happening inside it.'],
      ['p', 'Most AI works on information that already lives on a screen. Physical AI builds its understanding from the real world: what is on a shelf, where a tool ended up, which rack is empty right now. The result is a live model of the space that stays current between reports. Augmodo delivers Physical AI through wearables, so the intelligence moves with the people already doing the work.'],
      ['h', 'How is Physical AI different from AI on a screen?'],
      ['table', ['', 'AI on a screen', 'Physical AI'], [
        ['What it works from', 'Text, images, and data that already exist digitally', 'What is physically present in a space'],
        ['Where it works', 'Inside software', 'On shelves, racks, plant floors, and delivery routes'],
        ['Who it serves most', 'People at desks', 'The physical workforce'],
        ['The question it answers', 'What does the record say?', 'What is there right now?'],
      ]],
      ['h', 'Who is the physical workforce?'],
      ['p', 'The physical workforce is everyone whose job happens off a screen: retail frontline workers, warehouse teams, plant operators, drivers, and field reps. About 80% of the workforce does not work behind a screen. Most AI to date has been built for the other 20%.'],
      ['h', 'What problem does Physical AI solve?'],
      ['p', 'Processes tell you what should be happening. Physical AI sees what is happening. The distance between the two is a system of record drifting away from physical reality.'],
      ['p', 'In a store, that gap is a lost sale. In a warehouse, it is a wrong shipment. In a factory, it is a wrong part.'],
      ['p', 'Augmodo’s founder, Ross Finman, saw the gap first-hand during the baby formula shortage. He drove more than 100 miles looking for formula that every inventory system said was in stock. The shelves said otherwise.'],
      ['h', 'What are the ways to build Physical AI for a workplace?'],
      ['p', 'Three approaches show up: machines that patrol, fixed infrastructure such as cameras, and wearables worn by the people already working. Robots and fixed cameras carry high capex and see one place at a time. A wearable goes where the work goes.'],
      ['p', 'Augmodo brings real-time intelligence to the physical workforce through AI that works alongside people without disrupting how they work.'],
      ['h', 'How does Physical AI work on a real shift?'],
      ['ol', [
        ['Wear it.', 'Frontline workers clip on a Smartbadge™ at the start of a shift, the same way they would wear an ID badge.'],
        ['Work as usual.', 'The Smartbadge passively captures what is around them. There is no new task, no scanning, and no app to open.'],
        ['Act on it.', 'SpatialView™ turns every shift into a live map of what is missing, what is out of place, and what needs attention now.'],
      ]],
      ['p', 'Every walkthrough adds observations, so the picture stays current. People in a frame are blurred in the store before any data leaves it, and over 99% of frames are discarded within minutes. Badges are never mapped to people, and Augmodo does not track customers. Augmodo sees the work, not the worker.'],
      ['h', 'What does Physical AI change for frontline workers?'],
      ['p', 'A new hire starts with the situational awareness of a two-year veteran. Manual shelf audits and gap counting can take up to 14 hours a week per employee. The Smartbadge™ handles that in the background, so time goes to restocking, picking online orders, and helping customers.'],
      ['p', 'Our belief is that AI should work alongside the physical workforce and make teams more capable.'],
      ['h', 'Where is Physical AI used today?'],
      ['p', 'Augmodo maps more than 186 million square feet every month, over a billion square feet a year, across some of the largest retailers and CPG brands in the world. Retail is where it runs deepest today. The same approach is expanding into warehousing, manufacturing, healthcare facilities, automotive, and field operations, because the gap between the system and the floor looks the same everywhere.'],
      ['faq', [
        ['Is Physical AI the same as robotics?', 'Robotics puts machines in a space to do or inspect work. Physical AI for the physical workforce gives the people doing the work a live picture of the space. Augmodo’s Smartbadge™ is worn by people, so it follows the work to the shelf, the dock, and the stockroom.'],
        ['Does Physical AI replace workers?', 'No. We believe AI should enable people, not replace them. The Smartbadge handles manual tasks like counting and audits in the background, so frontline workers can spend more time restocking shelves, picking orders, and helping customers. The goal is to make the people already doing the work more capable and effective.'],
        ['Does Physical AI track workers or customers?', 'Augmodo sees the work, not the worker. We do not map badges to people and Augmodo does not track customers. To the system, ten people walking the floor once and one person walking it ten times look exactly the same.'],
        ['Which industries use Physical AI?', 'Retail and CPG, warehousing, manufacturing, healthcare facilities, automotive, and field operations.'],
      ]],
    ],
  },
  {
    slug: 'cost-of-out-of-stocks',
    tag: 'Retail',
    title: 'What an Out-of-Stock Actually Costs a Store per Day',
    dek: 'Out-of-stocks cost retailers an estimated $1.2 trillion in sales worldwide. See what one missing item costs a store per day and how to close gaps faster.',
    image: 'photos/article-empty-shelves.jpg', pos: '50% 50%', th: { kind: 'figure', figure: '$4.31', caption: 'Per item, per day' },
    blocks: [
      ['lead', 'An estimated $1.2 trillion in retail sales is lost globally to out-of-stocks. The fix is seeing gaps within the same shift, while shoppers can still buy.'],
      ['h', 'What is a shelf gap, and how is it different from an out-of-stock?'],
      ['p', 'A shelf gap is an empty space where a product should be. An out-of-stock means the store has none to sell. A gap can have stock waiting in the back room, and an item can be missing from the shelf while the inventory system still says it is in stock.'],
      ['p', 'The gap rate is the share of items with a gap on the shelf at a given time.'],
      ['h', 'How big is the out-of-stock problem?'],
      ['p', 'An estimated $1.2 trillion in retail sales is lost globally to out-of-stocks. Most of it goes undetected until the damage is done.'],
      ['ul', [
        'At any given time, 8% of SKUs are out of stock.',
        '65% of planograms are out of compliance.',
        'When shoppers cannot find what they came for, 71% leave or switch brands.',
      ]],
      ['h', 'What does an out-of-stock cost a single store?'],
      ['p', 'In Augmodo pilot stores, missing items cost retailers $4.31 per item, per day, per store. Applied to the 8% of SKUs that are out of stock at any given time, here is what that means for a store:'],
      ['table', ['SKUs in the store', 'Items out of stock at 8%', 'Cost per day', 'Cost per year'], [
        ['20,000', '1,600', '$6,896', 'about $2.5 million'],
        ['30,000', '2,400', '$10,344', 'about $3.8 million'],
        ['40,000', '3,200', '$13,792', 'about $5.0 million'],
      ]],
      ['calc'],
      ['h', 'Why do gaps stay open so long?'],
      ['p', 'Handheld audits are labor intensive and capture only part of the picture. Traditional data models can take days or weeks to flag a gap. Manual shelf audits and gap counting can take up to 14 hours a week per employee, which is time frontline workers could spend restocking.'],
      ['p', 'The goal is to find and fix problems when they happen, not when sales dip.'],
      ['h', 'How do stores find gaps faster?'],
      ['ol', [
        ['Measure the gap rate as a daily number.', 'What gets measured daily gets fixed daily.'],
        ['Capture the shelf every time someone walks it.', 'Frequency is what turns a snapshot into a live picture.'],
        ['Separate fillable gaps from true out-of-stocks.', 'A fillable gap has product in the back room and a fast fix.'],
        ['Send the gap to the person who can fix it.', 'A prioritized task list beats a report that waits for review.'],
      ]],
      ['p', 'Augmodo does all four. The Smartbadge™ captures the shelf as frontline workers walk the floor, and SpatialView™ turns it into a daily, prioritized list of the gaps to fix first. A shelf truth signal catches mismatches between the inventory system and the shelf, so the right items get ordered and not only re-counted.'],
      ['h', 'What results do retailers see?'],
      ['p', 'Retailers cut gap rates by 30% or more. A head of operations at a drug retailer reported that on-shelf availability improved by 30% within a month, with deep data in days.'],
      ['p', 'Typical ROI runs 6 to 20x, led by revenue recovery that shows up in POS data.'],
      ['p', 'Online orders benefit too. Augmodo routes pickers to a secondary location when a home spot is empty, and items get restocked before an order fails.'],
    ],
  },
  {
    slug: 'cpg-in-store-execution',
    tag: 'Brands',
    title: 'How CPG Brands Verify In-Store Execution Without More Field Audits',
    dek: 'CPG brands can see shelf truth in every store, every day, without more field audits. Here is how Repbadge and SpatialView work.',
    image: 'photos/article-packaged-goods.jpg', pos: '50% 50%', th: { kind: 'halftone' }, hero: 'photos/article-drinks-shelf.jpg',
    blocks: [
      ['lead', 'Consumer Packaged Goods (CPG) brands spend millions designing the perfect retail strategy, but success ultimately hinges on one crucial factor: in-store execution.'],
      ['p', 'Traditionally, verifying whether products actually land on the shelf as planned required endless field audits, a manual, costly, and notoriously slow process. Today, CPG brands are transforming how they manage retail operations by accessing continuous, real-time “shelf truth” across every store, without adding a single extra audit to their reps’ schedules.'],
      ['p', 'Here is how Augmodo’s Repbadge and SpatialView™ make continuous execution tracking possible.'],
      ['h', 'What Is In-Store Execution (and Why Is It Hard to Verify)?'],
      ['p', 'In-store execution is the bridge between brand strategy and retail reality. It determines whether your planogram lands accurately on the sales floor—ensuring products are in stock, placed correctly, priced accurately, and backed by active promotional displays.'],
      ['p', 'Brands invest heavily in the plan; the shelf determines whether that investment pays off.'],
      ['h', 'The Hidden Cost of Poor Execution'],
      ['p', 'When execution falters, revenue drops instantly:'],
      ['ul', [
        ['$1.2 Trillion:', 'Estimated retail sales lost globally every year to out-of-stock items.'],
        ['8% of SKUs:', 'Out of stock at any given time.'],
        ['65% of Planograms:', 'Non-compliant with original brand guidelines.'],
        ['71% of Shoppers:', 'Leave the store or switch to a competitor brand when they can’t find their intended product.'],
      ]],
      ['p', 'Despite these staggering figures, most execution failures go unseen until the financial damage is already done. Traditional handheld audits capture only a tiny snapshot of store performance, sampling roughly 10% of stores, running on monthly cycles, and focusing on limited primary category locations. Brands end up relying on sparse sample data to make massive business decisions.'],
      ['h', 'What Is “Shelf Truth”?'],
      ['p', 'Shelf truth is the physical state of a retail shelf verified through direct observation. It answers three fundamental operational questions:'],
      ['ol', ['What products are currently on the shelf?', 'Where are they located?', 'Do they match the intended planogram?']],
      ['p', 'When shelf truth is captured passively every time an associate or rep walks an aisle, it becomes continuous. Instead of waiting for a quarterly review or a scheduled audit, brands receive a daily, store-by-store view of execution reality.'],
      ['h', 'How Augmodo Delivers Continuous Shelf Truth'],
      ['p', 'Augmodo transforms standard daily routines into rich, actionable shelf intelligence:'],
      ['ul', [
        ['Wearable Hardware (Repbadge):', 'Field reps clip on the Repbadge during their normal store walkthroughs. It runs all day on a single charge.'],
        ['Passive Image Capture:', 'The badge captures high-definition spatial data in the background. There are no handheld scans, extra steps, or disruptions to standard workflows.'],
        ['SpatialView™ Analytics:', 'Our AI engine processes the visual data into core retail KPIs: On-Shelf Availability (OSA), Share of Shelf (SOS), and Planogram Compliance, organized by store, SKU, and timestamp.'],
        ['Seamless Workflow Integration:', 'Real-time insights and automated task lists land directly inside the Augmodo app or route into your existing systems via API.'],
      ]],
      ['p', 'By capturing close to 100% store coverage across all primary and secondary display points, Augmodo eliminates data blind spots. When retail associates and CPG reps both wear badges, brands can identify out-of-stocks and gaps before a field rep even steps foot into the store.'],
      ['h', 'What CPG Brands Can See with Augmodo'],
      ['p', 'With continuous spatial mapping, brand managers gain complete visibility across several critical retail metrics:'],
      ['table', ['Metric / Capability', 'Operational Impact'], [
        ['Out-of-Stocks & Gaps', 'Pinpoint out-of-stocks by exact location and time of day so reps can restock faster.'],
        ['Secondary Displays', 'Verify that endcaps, promotional bins, and seasonal displays go live on schedule and stay compliant.'],
        ['Planogram Compliance', 'Measure actual shelf setups against gold-standard plans to evaluate execution ROI.'],
        ['Share of Shelf (SOS)', 'Monitor real-time brand vs. competitor shelf presence across categories and store locations.'],
        ['Distribution Verification', 'Confirm authorized SKUs are actively displayed and distinguish true inventory voids from quiet delistings.'],
        ['Smarter Rep Routing', 'Analyze time-of-day traffic patterns to optimize rep visit schedules for maximum impact.'],
      ]],
      ['h', 'Quantifiable ROI: What Brands Get Back'],
      ['p', 'Implementing continuous shelf verification yields measurable operational and financial returns:'],
      ['ul', [
        ['6x to 20x Typical ROI:', 'Driven primarily by recovered sales captured directly in POS data.'],
        ['Lifted Promotional Performance:', 'Better-executed secondary displays lead to measurable sales lifts during promotional windows.'],
        ['Data-Backed Retailer Discussions:', 'Time-stamped, location-verified shelf data gives brands concrete evidence to settle compliance and credit disputes with retailers.'],
        ['Streamlined Field Labor:', 'Reps transition away from manual auditing and back toward high-value selling and relationship building—allowing CPGs to reduce or eliminate expensive third-party audit spending.'],
      ]],
      ['h', 'What Changes for Field Reps and Brokers?'],
      ['p', html`<strong>Empowering Field Reps.</strong> Because the Repbadge handles data collection automatically, reps spend significantly less time on administrative reporting. An audit process that previously took 1 hour can be reduced to under 10 minutes, eliminating manual checklists, accelerating store visits, and allowing reps to cover more locations per day.`],
      ['p', html`<strong>Unlocking Scale for Brokers.</strong> Brokers manage complex portfolios across multiple brands and retail chains. With Repbadge technology:`],
      ['ul', [
        'Brokers can verify On-Shelf Availability upon arrival and departure, proving the tangible value of every visit.',
        'A single walk down an aisle captures spatial data for every client brand represented on those shelves, multiplying reporting efficiency across their entire client roster.',
      ]],
      ['h', 'Getting Started: A Simple 4-Step Onboarding'],
      ['ol', [
        ['Align:', 'Establish store counts, rep allocation, target product categories, and core use cases.'],
        ['Schedule:', 'Complete kickoff, provide quick rep training, and set up recurring check-ins.'],
        ['Collect:', 'Reps wear the Repbadge during standard store visits as data collection begins automatically.'],
        ['Act:', 'Key operational KPIs go live inside SpatialView within one week of initial data collection.'],
      ]],
      ['faq', [
        ['What is shelf truth?', 'Shelf truth is the physical state of a retail shelf as it exists in real time, verified by visual observation. It confirms what products are on the shelf, where they are placed, and whether they conform to planograms.'],
        ['How is Augmodo different from a traditional field audit?', 'Traditional field audits offer static snapshots of a small fraction of stores on periodic schedules. Augmodo continuously builds a live 3D understanding of the shelf from everyday walkthroughs, keeping data fresh across far more areas of the store.'],
        ['How long until a CPG brand sees actionable data?', 'Live KPIs and store insights appear in SpatialView within one week of initiating data collection.'],
        ['Does this solution work for retail brokers?', 'Yes. Brokers wear the Repbadge during routine visits. A single aisle walkthrough automatically captures and segregates shelf data for every client brand on the aisle.'],
      ]],
    ],
    cta: 'Transform Your In-Store Execution Today',
  },
];

// Reading time at ~230 words a minute, counting every string in the article's blocks.
const words = (v) => (typeof v === 'string' ? v.split(/\s+/).length : Array.isArray(v) ? v.reduce((n, x) => n + words(x), 0) : 0);
const minutes = (a) => Math.max(1, Math.round(words(a.blocks) / 230));

/* ── Index ── */

export function Blog() {
  return html`
    <${Page}>
      <${PageHero} eyebrow="Blog" title="AI assistants for the physical workforce." />
      <section className="posts">
        ${ARTICLES.map((a) => html`
          <a className="post" href=${`#/blog/${a.slug}`} key=${a.slug} data-fade>
            <${Thumb} src=${a.image} pos=${a.pos} ...${a.th} className="post-image" />
            <p className="post-meta">${a.tag} · ${minutes(a)} min read</p>
            <h2 className="post-title">${a.title}</h2>
            <p className="post-dek">${a.dek}</p>
            <span className="text-link">Read article</span>
          </a>`)}
      </section>
    <//>`;
}

/* ── Article ── */

// "Interactive calculator" noted as an idea for article 3: $4.31 per missing item, per day, at an 8% gap rate.
function Calculator() {
  const [skus, setSkus] = useState(30000);
  const out = Math.round(skus * 0.08);
  const day = out * 4.31;
  const fmt = (n, d = 0) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d });
  return html`
    <div className="calc" data-fade>
      <p className="eyebrow">Try it with your store</p>
      <label className="calc-input">
        <span>SKUs in the store</span>
        <strong>${fmt(skus)}</strong>
        <input type="range" min="5000" max="60000" step="1000" value=${skus} onInput=${(e) => setSkus(+e.target.value)} />
      </label>
      <div className="calc-out">
        <div><span>Items out of stock at 8%</span><strong>${fmt(out)}</strong></div>
        <div><span>Cost per day</span><strong>$${fmt(day)}</strong></div>
        <div><span>Cost per year</span><strong>about $${fmt(day * 365 / 1e6, 1)} million</strong></div>
      </div>
    </div>`;
}

const rich = (item) => (Array.isArray(item) ? html`<strong>${item[0]}</strong> ${item[1]}` : item);

function Block({ block: [type, a, b] }) {
  switch (type) {
    case 'lead': return html`<p className="art-lead" data-fade>${a}</p>`;
    case 'h': return html`<h2 className="art-h" data-fade>${a}</h2>`;
    case 'p': return html`<p data-fade>${a}</p>`;
    case 'ol': return html`<ol data-fade>${a.map((it, i) => html`<li key=${i}>${rich(it)}</li>`)}</ol>`;
    case 'ul': return html`<ul data-fade>${a.map((it, i) => html`<li key=${i}>${rich(it)}</li>`)}</ul>`;
    case 'calc': return html`<${Calculator} />`;
    case 'table': return html`
      <div className="art-table" data-fade>
        <table>
          <thead><tr>${a.map((h, i) => html`<th key=${i}>${h}</th>`)}</tr></thead>
          <tbody>${b.map((r, i) => html`<tr key=${i}>${r.map((c, j) => (j === 0 ? html`<th key=${j} scope="row">${c}</th>` : html`<td key=${j}>${c}</td>`))}</tr>`)}</tbody>
        </table>
      </div>`;
    case 'faq': return html`
      <div className="art-faq">
        <h2 className="art-h" data-fade>FAQ</h2>
        ${a.map(([q, ans], i) => html`<div className="art-faq-item" key=${i} data-fade><h3>${q}</h3><p>${ans}</p></div>`)}
      </div>`;
    default: return null;
  }
}

export function Article({ slug, onContact }) {
  const i = ARTICLES.findIndex((a) => a.slug === slug);
  const a = ARTICLES[i];
  useEffect(() => { document.title = a ? `${a.title} | Augmodo` : 'Augmodo'; return () => { document.title = 'Augmodo — Augment your retail workforce'; }; }, [slug]);
  if (!a) return html`<${Blog} />`;
  const next = ARTICLES[(i + 1) % ARTICLES.length];

  return html`
    <${Page}>
      <${PageHero} eyebrow=${`Blog · ${a.tag}`} title=${a.title} sub=${a.dek} />
      <${Band} src=${a.hero || a.image} alt="" pos=${a.hero ? '50% 50%' : a.pos} />
      <article className="art">
        <aside className="art-side">
          <div className="art-side-inner">
            <a className="text-link art-back" href="#/blog">All articles</a>
            <p className="eyebrow">${minutes(a)} min read</p>
          </div>
        </aside>
        <div className="art-body">
          ${a.blocks.map((b, n) => html`<${Block} key=${n} block=${b} />`)}
          <div className="art-cta" data-fade>
            <p className="art-h">${a.cta || 'See it on your floor.'}</p>
            <button className="btn" onClick=${onContact}>Book a demo</button>
          </div>
          <p className="art-about" data-fade>${ABOUT}</p>
          <a className="art-next" href=${`#/blog/${next.slug}`} data-fade>
            <span className="eyebrow">Next article</span>
            <span className="art-next-title">${next.title}</span>
            <img src=${A('arrow.svg')} alt="" />
          </a>
        </div>
      </article>
      <${Cta} onContact=${onContact} />
    <//>`;
}
