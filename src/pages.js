import { html } from './lib.js';
import { Cta } from './sections.js';
import { Page, PageHero, Band, Split, Prose, Rows, Stats, Quotes, TextLink } from './blocks.js';

/* ─────────────── Product (copy: "Augmodo Website Content_Product") ─────────────── */

const QUOTES = [
  ['Augmodo was quick to set up and impressive in the speed to value. Within days I had deep data resulting in both micro and macro insights. Within a month our on-shelf availability improved by 30% and it continues to improve!', 'Head of Operations, Drug Retailer'],
  ['We can see where the gaps are, whether stock is in store to fill them, and what sales we’re missing – by store, category, brand, state, even POG type. We can be incredibly precise.', 'Commercial Sales Lead, Leading Global FMCG Supplier'],
  ['The biggest shift is speed and confidence. We’ve moved from historical averages and outdated images to live, store-specific insight we can act on the same day.', 'National Account Team, Health & Beauty Supplier'],
  ['We’re no longer reacting to gaps – we’re preventing them before they occur, especially around NPD launches, key consumption periods and weekend trade. All with one goal: driving sales.', 'Demand Planning Supplier Lead'],
];

export function Product({ onContact }) {
  return html`
    <${Page}>
      <${PageHero}
        eyebrow="Product"
        title="See what’s really happening on your floor."
        sub="The Smartbadge™ captures the shelf while your team works. SpatialView™ turns it into a live picture of every store, so teams know exactly where to act.">
        <button className="btn" onClick=${onContact}>Book a demo</button>
      <//>
      <${Band} src="badge.jpg" alt="Store associate wearing the Augmodo Smartbadge" pos="60% 45%" />

      <${Split} title="How it works">
        <${Rows} numbered items=${[
          ['Wear it.', 'Associates clip on a Smartbadge at the start of a shift, the same way they’d wear an ID badge.'],
          ['Work as usual.', 'As people move through the store, the badge passively captures what’s on the shelf. No new task, no scanning, no app to open.'],
          ['Act on it.', 'SpatialView turns every shift into a live map of what’s missing, what’s out of place and what needs attention now.'],
        ]} />
        <${Prose}><p>Setup takes less than 20 minutes per store. Plug in the charging dock, hand out the badges and walk the floor. No retrofit, no new infrastructure.</p><//>
      <//>

      <${Split} tone="alt" title="Smartbadge™">
        <${Stats} items=${[['6', 'Hardware generations in 24 months, each shaped by the associates who wear it.']]} />
        <${Prose} lead><p>The Smartbadge is worn like a standard ID badge. Its cameras face out toward shelves and products, and it runs a full 8 to 10 hour shift on one charge. At the end of the day it goes back in the dock to charge and sync.</p><//>
        <${Rows} items=${[
          ['Owl Mini', 'Our lightest badge yet, at 120g. Triple-camera spatial vision, full-shift battery and an associate-activated panic button.', 'Rolling out 2027'],
          ['Owl Pro', 'An all-in-one badge for facility-wide operations. Always-readable e-ink display, built-in associate-activated walkie-talkie and panic button, and up to 15 hours of battery.', 'Rolling out 2027'],
          ['Repbadge', 'For brand field teams. The badge does the reporting, so reps get through more stores with less paperwork.'],
        ]} />
      <//>

      <${Split} label="SpatialView™" title="Every store, in real time, from your laptop.">
        <${Prose} lead><p>SpatialView gives everyone a clear view of what’s actually happening on the shelf, without waiting on week-old reports. The Smartbadge data can be accessed through APIs to fit your existing system to improve operations and increase ROI.</p><//>
        <${Rows} items=${[
          ['Store associates', 'A daily, prioritized list of the gaps to fix first.'],
          ['Store leadership', 'Real-time shelf health, lost sales estimates and aisle coverage.'],
          ['Corporate leadership', 'Which stores need attention, with category insights and planogram reset analytics.'],
          ['Brands', 'Share of shelf, gap timelines and competitive benchmarking.'],
        ]} />
      <//>

      <${Band} src="store-aisles.jpg" alt="Supermarket aisles seen from above" pos="50% 50%" />

      <${Split} tone="alt" title="Capabilities">
        <${Rows} items=${[
          ['Out of Stock', 'Spot empty shelves as they happen and send the fix to the right person. Retailers cut gap rates by 30% or more.'],
          ['Planogram & Promotion Compliance', 'Compare what’s on the shelf to the plan and the promo, and close the gap before it costs sales.'],
          ['Share of Shelf & Competitor Benchmarks', 'See how much space your products hold, how you stack up in the aisle and whether your strategy was executed.'],
          ['DSD & Inventory', 'Know what’s actually on the shelf, not just what the system says should be there, with DSD notifications when it’s time to restock.'],
          ['Smarter Field Visits', 'Route field reps to the stores that need them most, so every visit counts.'],
        ]} />
      <//>

      <${Split} title="Less time counting, more time selling">
        <${Stats} items=${[['14 hrs', 'A week per employee can go to manual shelf audits and gap counting.']]} />
        <${Prose} lead><p>Manual shelf audits and gap counting can take up to 14 hours a week per employee. The Smartbadge handles that in the background, so teams spend their time restocking, picking online orders and helping customers.</p><//>
      <//>

      <${Quotes} items=${QUOTES} />

      <${Split} label="Data & Integrations" title="Your data, wherever you work.">
        <${Prose} lead><p>SpatialView is one place your data lands, not the only one. Teams can drill into any store, product or timestamp and export it in a few clicks. Augmodo APIs let you pull the same data into your own systems, so it shows up wherever your teams already work.</p><//>
      <//>

      <${Split} tone="alt" label="Why a badge" title="Coverage that moves with the work.">
        <${Prose} lead>
          <p>A fixed camera sees one angle and stays put. A robot covers one aisle at a time, and when it goes down, the store goes dark until a service call.</p>
          <p>Your team already walks the whole floor, every shift. Twenty badges means shelves are seen all day, with redundancy built in: if one goes down, the other nineteen keep going. No hardware in the aisle, low capex, and it follows the work from the shelf to the stockroom.</p>
        <//>
      <//>

      <${Split} label="Built for trust" title="It sees the work, not the worker.">
        <${Prose} lead><p>People in a frame are blurred in the store before any data leaves it, and over 99% of frames are discarded within minutes. Badges are never mapped to people, and we do not track customers. Audio is captured only when an associate presses a panic button.</p><//>
        <div data-fade><${TextLink} href="#/faq/privacy">Read Trust & Privacy<//></div>
      <//>

      <${Cta} onContact=${onContact} title="See it on your floor." label="Contact Us" />
    <//>`;
}

/* ─────────────── Solutions · For Retailers (copy: "…_Solutions") ─────────────── */

export function Solutions({ onContact }) {
  return html`
    <${Page}>
      <${PageHero}
        eyebrow="For Retailers"
        title="Track every product in every store in real-time"
        sub="Augmodo gives your teams real-time shelf intelligence without changing how they work. Associates wear the Smartbadge™, and SpatialView™ shows HQ, store managers and associates exactly where to act.">
        <button className="btn" onClick=${onContact}>Book a demo</button>
      <//>
      <${Band} src="photos/retail-aisle.jpg" alt="Long, brightly lit supermarket aisle" pos="50% 55%" />

      <${Split} label="The problem" title="Every empty shelf is a silent tax on revenue.">
        <${Stats} items=${[
          ['$1.2T', 'In retail sales lost globally to out-of-stocks.'],
          ['8%', 'Of SKUs are out of stock at any given time.'],
          ['65%', 'Of planograms are out of compliance.'],
          ['71%', 'Of shoppers leave or switch brands when they can’t find what they came for.'],
        ]} />
        <${Prose}>
          <p>Most of it goes undetected until the damage is done. Handheld audits are labor intensive and capture only part of the picture. Shelf cameras and robots are high cost, high maintenance and disruptive to store operations.</p>
        <//>
      <//>

      <${Split} tone="alt" label="The solution" title="Real-time intelligence without changing how people work.">
        <${Prose} lead>
          <p>As associates move through the store, the Smartbadge passively captures shelf conditions and feeds SpatialView, which turns video into insights and tasks. It runs all day on one charge, sets up in about 20 minutes, and delivers through the app or API into the systems you already use.</p>
          <p>One badge does more than one job: shelf intelligence, walkie-talkie and safety, so every device delivers more ROI.</p>
        <//>
      <//>

      <${Split} label="Why a wearable" title="More places. More often. No extra task.">
        <${Prose} lead><p>Associates already move through the places fixed infrastructure struggles to see, from high and low shelves to coolers and produce. Augmodo turns that movement into continuous intelligence.</p><//>
        <${Rows} items=${[
          ['Handheld devices', 'Labor intensive, with infrequent and incomplete capture.'],
          ['Robots', 'High capex, with periodic coverage and a single point of failure.'],
          ['Fixed cameras', 'High capex, with a fixed perspective and limited coverage.'],
          ['Augmodo', 'Low capex, high frequency and distributed by design, with 100% passive capture.', 'Augmodo'],
        ]} />
      <//>

      <${Band} src="photos/retail-checkout.jpg" alt="Associate working a supermarket checkout" pos="50% 45%" />

      <${Split} tone="alt" title="Built for every level of your business">
        <${Rows} items=${[
          ['Store Operations', 'See which stores need attention and what to tell them, without a store visit. Chain-wide shelf health, compliance and coverage give you one picture across every location, so you can set priorities, hold execution to standard and see the ROI store by store.'],
          ['Merchandising', 'See how every category is really performing on the shelf. Out-of-stock patterns, planogram and promotion compliance and real space-to-sales data show what’s working, what’s slipping and what to change at the next reset, with data you can share with your supplier partners.'],
          ['E-commerce', 'Pick from shelves you can trust. Real-time on-shelf availability tells pickers what’s actually there, routes them to secondary locations when a home spot is empty and flags restocks before an order fails. The result is fewer substitutions, fewer cancellations and faster, more efficient picking.'],
          ['In-store', 'See real-time shelf health, lost sales estimates and aisle coverage, so the team goes where it matters first and more sales stay in the store. Rollout adds no work: grab a badge, wear it, work as usual. It sees the shelf, never the person. Associates get a clear, prioritized list of what to fix first, and the Smartbadge handles shelf audits and gap counting in the background, so associates can focus on restocking and helping customers.'],
        ]} />
      <//>

      <${Split} title="What you can do">
        <${Rows} compact items=${[
          ['Out-of-stock detection', 'Empty facings flagged as they happen and routed to the right associate.'],
          ['Smart gap replenishment', 'Fix the gaps with the biggest shelf impact first.'],
          ['Shelf truth signal', 'Catch mismatches between inventory systems and the shelf, so the right items get ordered, not just re-counted.'],
          ['Planogram compliance', 'Drift caught in hours, not at the next quarterly reset.'],
          ['Promotion compliance', 'Visual proof that endcaps went live, stayed stocked and stayed compliant.'],
          ['Ecomm pick assist', 'Route pickers to secondary locations when a home spot is empty, and restock items before an order fails.'],
          ['Supplier visibility', 'A remote view for corporate and CPG partners, no store visit needed.'],
        ]} />
      <//>

      <${Split} tone="alt" title="6 to 20x typical ROI">
        <${Stats} items=${[['30%+', 'Reduction in gap rates for retailers.']]} />
        <${Rows} compact items=${[
          ['Revenue recovery', 'The largest single driver, measurable in POS data. Retailers cut gap rates by 30% or more.'],
          ['Labor productivity', 'Hours shift from manual audits to higher-value work.'],
          ['Supplier trade funds', 'Incremental sales and fewer compliance disputes.'],
          ['Data monetization', 'Shared shelf data with suppliers offsets total program cost.'],
          ['Audit cost avoidance', 'Third-party audit spend reduced or eliminated.'],
        ]} />
      <//>

      <${Split} label="Private by design" title="It sees the work, not the worker.">
        <${Prose} lead><p>Augmodo is built to understand environments, products and tasks, not people. People in a frame are blurred in the store before any data leaves it, badges are never mapped to people, and we do not track customers.</p><//>
        <div data-fade><${TextLink} href="#/faq/privacy">Read Trust & Privacy<//></div>
      <//>

      <${Cta} onContact=${onContact} title="See it on your floor." />
    <//>`;
}

/* ─────────────── About · Our Story (copy: "…_About:Our Story") ─────────────── */

export function OurStory({ onContact }) {
  return html`
    <${Page}>
      <${PageHero}
        eyebrow="Our Story"
        title="Physical AI for the physical workforce."
        sub="Augmodo brings real-time intelligence through wearable AI that enables people without disrupting how they work.">
        <button className="btn" onClick=${onContact}>Book a demo</button>
        <a className="btn btn--ghost" href="#/careers">Join the team</a>
      <//>
      <${Band} src="photos/story-city.jpg" alt="City lights at night from above" pos="50% 50%" />

      <${Split} title="The gap">
        <${Stats} items=${[['100+ miles', 'Driven looking for baby formula every inventory system said was in stock.']]} />
        <${Prose} lead>
          <p>Out-of-stocks, misplaced inventory and blind spots on the floor cost enterprises billions every year. It happens anywhere the system of record and physical reality drift apart: a shelf, a warehouse rack, a truck, a plant line.</p>
          <p>Augmodo enables the retail associates, warehouse teams and field reps who run the physical side of every major enterprise, and who have never had the real-time intelligence that already transformed desk-based work.</p>
          <p>The insight came from a simple problem. During the nationwide baby formula shortage, Ross Finman drove more than 100 miles looking for formula that every inventory system said was in stock. The shelves said otherwise. Ross had spent his career teaching machines to understand physical space, through robotics research at MIT and the company he built and sold to Niantic. He saw that the gap between what the screen says and what’s physically true exists everywhere work happens off a screen.</p>
        <//>
      <//>

      <${Split} tone="alt" title="How we close it">
        <${Stats} items=${[['186M', 'Square feet mapped every month across some of the largest retailers and CPG brands in the world.']]} />
        <${Prose} lead>
          <p>Augmodo closes that gap with a passive, wearable Smartbadge. People keep doing their job exactly as they always have: no new task, no scanning, no dedicated hardware, zero operational disruption to deploy at scale. As they move, the badge builds a live, real-time 3D map of what’s missing, what’s out of place, what needs attention now. Every walkthrough makes the system more accurate. For brand field teams, Repbadge does the reporting, so reps get through more stores with less paperwork.</p>
          <p>The data lands in SpatialView or the systems teams already use, turning every shift into actionable data that drives ROI from day one. Today Augmodo maps more than 186 million square feet every month across some of the largest retailers and CPG brands in the world.</p>
        <//>
      <//>

      <section className="statement">
        <p className="eyebrow" data-fade>What’s next</p>
        <p className="h-display statement-text" data-lines>The physical workforce is the largest, least-instrumented labor category on earth. Augmodo is building the infrastructure to enable them. The future of work is augmented.</p>
      </section>

      <${Band} src="photos/story-team.jpg" alt="Team working together around a table" pos="50% 85%" />

      <${Split} title="Join our team">
        <${Prose} lead><p>We strive to take the deepest tech and make it easy, approachable, and helpful to the >100m people working in commerce.</p><//>
        <div data-fade><a className="btn" href="#/careers">See open roles</a></div>
      <//>

      <${Split} tone="alt" title="Press">
        <${Prose} lead><p>Writing about Augmodo? Get our press kit, logos and photos.</p><//>
        <div className="pg-actions" data-fade>
          <a className="btn" href="mailto:press@augmodo.com?subject=Press%20kit%20request">Press kit</a>
          <a className="btn" href="mailto:press@augmodo.com">Email</a>
        </div>
      <//>

      <${Cta} onContact=${onContact} />
    <//>`;
}
