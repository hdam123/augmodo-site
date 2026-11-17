import { html } from './lib.js';
import { Cta } from './sections.js';
import { Page, PageHero, Band, Split, Prose, Rows, Stats, TextLink } from './blocks.js';

/* ─────────────── Solutions · the three pages beside For Retailers ───────────────
   Copy: "Augmodo Website Content" doc, tabs For Brands / For Brokers / For Other Industries.
   Same blocks and rhythm as For Retailers (pages.js): hero, photo band, alternating splits, CTA. */

export function Brands({ onContact }) {
  return html`
    <${Page}>
      <${PageHero}
        eyebrow="For Brands"
        title="Shelf truth, in every store, every day."
        sub="Augmodo shows you what’s actually happening to your products in store, continuously, not quarterly.">
        <button className="btn" onClick=${onContact}>Book a demo</button>
      <//>
      <${Band} src="store-aisles.jpg" alt="Supermarket aisles seen from above" pos="50% 50%" />

      <${Split} label="The problem" title="Most shelf leakage goes unseen until the damage is done.">
        <${Stats} items=${[
          ['$1.2T', 'In retail sales lost globally to out-of-stocks.'],
          ['8%', 'Of SKUs are out of stock at any given time.'],
          ['65%', 'Of planograms are out of compliance.'],
          ['71%', 'Of shoppers leave or switch brands when they can’t find your product.'],
        ]} />
        <${Prose}>
          <p>Handheld audits are slow and capture only part of the picture. Shelf cameras and robots are expensive, high maintenance and disruptive to store operations. Brands end up making decisions on a sample.</p>
        <//>
      <//>

      <${Split} tone="alt" label="How it works" title="Repbadge + SpatialView">
        <${Rows} items=${[
          ['Repbadge', 'Worn by your field reps. It passively captures the shelf while they do their normal work in store, with no extra steps, and runs all day on one charge.'],
          ['SpatialView', 'Turns that capture into the KPIs you already manage: on-shelf availability, share of shelf and compliance. Insights and tasks arrive in the app or through API into the systems your team already uses.'],
        ]} />
        <${Rows} items=${[
          ['Traditional shelf intelligence', 'Samples about 10% of stores, captures monthly and covers a few categories at the primary location.'],
          ['Augmodo', 'Captures close to 100% coverage at high frequency, across all categories and every point of disruption in the store. That’s directional insight plus display compliance, before and after visit measurement, supply chain optimization and real-time action.', 'Augmodo'],
        ]} />
      <//>

      <${Split} title="What you can see">
        <${Rows} items=${[
          ['Out-of-stocks and gaps', 'See what’s missing from the shelf and what’s there, by location and time of day, so reps close gaps faster.'],
          ['Secondary displays', 'Confirm displays and endcaps went live, stayed stocked and stayed compliant, including how home and secondary locations perform together.'],
          ['Planogram compliance', 'Compare the actual shelf to the plan and understand what gold-standard execution is worth.'],
          ['Share of shelf', 'See your space by category, brand and store, and how it compares to the competition.'],
          ['Distribution verification', 'Confirm authorized items are actually on shelf and tell true voids from quiet delists.'],
          ['Smarter routing', 'Time-of-day and day-of-week data shows which stores need a visit and when, so routing moves from static to dynamic.'],
        ]} />
      <//>

      <${Band} src="city.jpg" alt="City skyline at dusk" pos="50% 40%" />

      <${Split} tone="alt" title="6 to 20x typical ROI">
        <${Rows} compact items=${[
          ['Recovered sales', 'Closing out-of-stocks faster is the largest single driver, and it shows up in POS data.'],
          ['Display lift', 'Better-executed secondary displays drive incremental sales.'],
          ['Rep productivity', 'Hours shift from manual audits to selling and merchandising.'],
          ['Fewer disputes', 'Timestamped, location-level shelf data settles compliance questions with retailers.'],
          ['Lower audit spend', 'Third-party audits can be reduced or replaced.'],
        ]} />
      <//>

      <${Split} title="Better together with retailers">
        <${Prose} lead>
          <p>When retail associates and brand reps both wear badges, the picture is complete. Retailers see shelf execution and display data they can’t generate on their own. Brands see gap timing and location before a rep walks in. Neither side can build that view alone.</p>
        <//>
      <//>

      <${Split} tone="alt" title="Built for your reps">
        <${Prose} lead>
          <p>The Repbadge does the reporting, so reps spend less time on paperwork and more time selling. An average 1-hour audit can be cut down to less than 10 minutes. No manual audits, faster store visits and more stores per day.</p>
        <//>
      <//>

      <${Split} title="It’s easy to get started">
        <${Rows} numbered items=${[
          ['Align', 'Store count, rep count, categories and key use cases.'],
          ['Schedule', 'Kickoff, field rep training and weekly check-ins.'],
          ['Collect', 'Reps wear badges while they work as normal, and data starts flowing.'],
          ['Act', 'Key KPIs are live in SpatialView one week after data collection begins.'],
        ]} />
      <//>

      <${Split} tone="alt" title="Built for trust">
        <${Prose} lead><p>Only shelf data is processed. We do not track associates, reps or customers.</p><//>
        <div data-fade><${TextLink} href="#/faq/privacy">Read Trust & Privacy<//></div>
      <//>

      <${Cta} onContact=${onContact} title="See your shelf, in every store." />
    <//>`;
}

export function Brokers({ onContact }) {
  return html`
    <${Page}>
      <${PageHero}
        eyebrow="For Brokers"
        title="Every visit, verified."
        sub="Your business is serving your CPG clients. Augmodo turns the work your reps already do into continuous, store-level evidence, so every visit is faster, every hour counts and every client sees the proof.">
        <button className="btn" onClick=${onContact}>Book a demo</button>
      <//>
      <${Band} src="badge.jpg" alt="The Augmodo Smartbadge" pos="50% 50%" />

      <${Split} title="The challenge">
        <${Prose} lead>
          <p>Brokers are measured on how much ground their reps cover, how well they can prove the work got done, and ultimately, whether their clients’ sales go up. Manual photos, checklists and reports slow every visit, and what clients get back is a snapshot, not the full picture of what’s happening on their shelves.</p>
          <p>Augmodo’s Repbadge allows for faster store visits, more stores per day and no manual audits.</p>
        <//>
      <//>

      <${Split} tone="alt" title="How it works">
        <${Rows} numbered items=${[
          ['Capture', 'Your rep walks the store wearing the Repbadge. It captures hands-free, replacing manual photos and checklists.'],
          ['Encrypt', 'Everything is encrypted on the device the moment it’s captured.'],
          ['Filter', 'Frames without audit content are discarded, and anyone incidentally in a remaining frame is masked.'],
          ['Deliver', 'Compliance findings and frame-level evidence arrive in FieldRep or through API.'],
        ]} />
      <//>

      <${Split} title="Efficiency">
        <${Rows} items=${[
          ['More stores, less paperwork.', 'No more manual photos or checklists. The badge captures as reps work, so they spend their time merchandising, talking with store managers and building incremental displays.'],
          ['Walk in knowing the gaps.', 'Where retailers share store data, reps see which gaps to close before they arrive, so the visit goes to fixing, not searching.'],
          ['Route smarter.', 'Time-of-day and day-of-week shelf data shows which stores need a visit and when, so routes move from static to dynamic.'],
        ]} />
      <//>

      <${Band} src="store-aisles.jpg" alt="Supermarket aisles seen from above" pos="50% 60%" />

      <${Split} tone="alt" title="Effectiveness">
        <${Rows} items=${[
          ['Do the highest-impact work first.', 'Every visit starts with a prioritized view of what will move sales most in that store, so reps spend their time where it counts.'],
          ['Know every visit moved the needle.', 'On-shelf availability on arrival and on departure shows the impact of each stop, store by store.'],
          ['Resets and audits, done right.', 'Capture store conditions in the background and compare the shelf to the planogram without a separate audit pass.'],
        ]} />
      <//>

      <${Split} title="Proving compliance">
        <${Rows} items=${[
          ['Show clients the shelf, not just the report.', 'Frame-level, timestamped evidence of promotions, displays, resets and completed work gives every brand you represent continuous proof of execution.'],
          ['Every client, kept separate.', 'Each client’s audit data sits in its own workspace, and clients own their data and outputs.'],
        ]} />
      <//>

      <${Cta} onContact=${onContact} title="Deliver more for every client." />
    <//>`;
}

export function OtherIndustries({ onContact }) {
  return html`
    <${Page}>
      <${PageHero}
        eyebrow="For Other Industries"
        title="Wherever work happens off a screen."
        sub="Smartbadge intelligence works anywhere people do physical work, from the retail shelf to the warehouse rack to the factory floor.">
        <button className="btn" onClick=${onContact}>Partner with us</button>
      <//>
      <${Band} src="city.jpg" alt="City skyline at dusk" pos="50% 40%" />

      <${Split} title="The same gap, everywhere">
        <${Prose} lead>
          <p>Every physical operation runs on a system of record that drifts from reality. In a store, that gap is a lost sale. In a warehouse, it’s a wrong shipment. In a factory, it’s a wrong part. The higher the stakes, the more it’s worth to close.</p>
          <p>The Smartbadge sees the work as it happens and closes that gap in real time, whatever the site looks like.</p>
        <//>
      <//>

      <${Split} tone="alt" label="Warehouse & Logistics" title="Know what’s on every rack, not just what the system says.">
        <${Prose} lead>
          <p>Workers already walk the aisles, docks and staging areas all day. The Smartbadge turns that movement into a live picture of what’s where, so misplaced inventory and empty locations surface before they become missed shipments.</p>
        <//>
      <//>

      <${Split} label="Manufacturing" title="The right part, in the right place, every shift.">
        <${Prose} lead>
          <p>From line-side inventory to tool cribs, the Smartbadge captures what’s actually on the floor as teams work. Supervisors see what needs attention now, without adding a single task to the line.</p>
        <//>
      <//>

      <${Band} src="badge.jpg" alt="The Augmodo Smartbadge" pos="50% 50%" />

      <${Split} tone="alt" title="More physical workplaces">
        <${Prose} lead>
          <p>Hospitals, field operations, facility maintenance and more. If your team works on its feet, the Smartbadge gives you a live view of the space and what needs attention next.</p>
        <//>
      <//>

      <${Split} title="Built the same way, everywhere">
        <${Rows} items=${[
          ['Frictionless', 'People keep working exactly as they do today. No new task, no scanning, no retrofit.'],
          ['High frequency', 'Every shift updates the picture, so you see what’s happening now, not at the next audit.'],
          ['Low capex', 'No fixed cameras or machines to install. Hand out badges, plug in a dock and go.'],
        ]} />
      <//>

      <${Cta} onContact=${onContact} title="Bring Augmodo to your operation." label="Partner with us" />
    <//>`;
}
