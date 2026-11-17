import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { html, gsap } from './lib.js';
import { Cta } from './sections.js';
import { Page, PageHero } from './blocks.js';

/* ─────────────── FAQ (copy: "Augmodo Website Content_FAQ's") ─────────────── */

// Each answer is a list of paragraphs; a function receives { onContact } for answers with links.
const GROUPS = [
  { id: 'basics', title: 'The Basics', items: [
    ['What is Augmodo?', ['Augmodo is a Physical AI assistant for the physical workforce. We bring real-time information to 80% of the workforce that doesn’t work behind a screen. The shelves, racks, plant lines, and delivery routes that no dashboard has ever really seen. We are live with major retailers and CPG brands across several countries, mapping over a billion square feet a year.']],
    ['What is Physical AI?', ['Physical AI is artificial intelligence that perceives physical space, remembers it, and reasons about the work happening inside it. Most AI operates on information that already lives on a screen. Physical AI builds its understanding from the real world instead: what’s actually on a shelf, where a tool ended up, which rack is empty right now. The result is a live model of the space, accurate to the minute rather than to the last report. We deliver Physical AI through wearables, so the intelligence moves with the people already doing the work.']],
    ['What does Augmodo actually do?', ['Augmodo turns everyday frontline shifts into a live 3D map of physical spaces using lightweight wearable Smartbadges™. As employees walk around doing their normal jobs, the devices passively scan the environment to build a continuously updating picture of inventory, misplaced tools, and out-of-stock items, requiring zero extra effort or manual scanning from staff. That visual data feeds directly into our SpatialView™ dashboard, giving managers real-time search capabilities, automated reports, and full physical-world intelligence at a fraction of the cost of fixed cameras or robots.']],
    ['What is the Smartbadge?', ['The Smartbadge™ is a lightweight wearable, worn like a standard employee ID badge, and it’s the same length and width as one. As staff walk the floor doing their normal jobs, built-in cameras passively scan shelves and inventory in the background, so no one has to stop and manually scan anything. A small screen on top shows status at a glance (Recording, Ready, Charging).']],
    ['What is SpatialView?', ['SpatialView™ is the central dashboard where all the data gathered by the Smartbadges™ comes to life. It takes the visual data captured on the floor, runs it through computer vision, and turns it into a live 3D map of your space. Instead of guessing what’s on the shelves, managers can log in to see real-time inventory levels, spot misplaced items, and track out-of-stock products as they happen. You can zoom out for a high-level view of the entire store or drill down into specific products and timestamps and export the data whenever you need to make quick operational calls.']],
    ['What’s a Realogram?', ['A Realogram is a live, dynamic map of what your store’s shelves actually look like in real time, bridging the gap between HQ’s idealized planogram and reality on the ground. Powered by Augmodo’s spatial AI and wearable tech, it continuously captures current product locations, facings, and stock state to automatically detect misplaced inventory, flag out-of-stocks, and eliminate manual shelf audits.', html`<em>Realograms are currently in development.</em>`]],
    ['Which industries is this for?', ['We’re deepest in the largest physical workforce of retail today and expanding into warehousing, manufacturing, healthcare facilities, automotive, and field operations.']],
  ] },
  { id: 'privacy', title: 'Privacy and Worker Trust', items: [
    ['Does the Smartbadge record the person wearing it?', ['No. The Smartbadge faces out and to the side, toward shelves and products with no audio captured. The system is built to answer questions about items in a physical space, not about people.', 'The Owl Mini and Owl Pro, not yet released, add two features an associate turns on themselves. Walkie-talkie audio is live only while they hold the button, and it is never stored. The panic button is theirs to press if they feel unsafe, and it records the incident so help can respond. Only the wearer can start either one.']],
    ['What happens to a frame with a person in it?', ['People who appear in frames are blurred on device in the store before any data leaves the building, and over 99% of captured frames are discarded within minutes. What’s kept is solely the product data needed to manage inventory.', 'The one exception is the panic button on the Owl Mini and Owl Pro, not yet released. If an associate presses it because they feel unsafe, blurring lifts so the incident can be appropriately responded to.']],
    ['Can a manager see who did what?', ['No. Inventory data is shelf-level: a gap in aisle 7, not a person in aisle 7. Augmodo doesn’t link badge data to associates. To the system, ten people walking the floor once and one person walking it ten times look the same.']],
    ['Why is a store employee wearing a camera?', ['The Smartbadge is a passive inventory scanner that tracks shelf stock so employees spend less time counting products and more time helping customers. People who appear in frame are blurred on the device and the badge does not see or track shoppers.', 'The Owl Mini and Owl Pro, not yet released, also work as a walkie-talkie and include a panic button an associate can press if they feel unsafe, which records the incident so help can respond.']],
    ['What about pharmacy counters, patient records, or anything sensitive?', ['Out of scope, by design and by plan. Before a single badge is worn, we work with each customer to scope which zones, roles, and shifts are in and which are out. Prescription areas, registers and anywhere personal information is regularly in view are scoped out up front. Any frame that isn’t a product on a shelf is discarded.']],
    ['Does it record audio?', ['There’s no passive listening and no setting that turns it on in the background. On the Owl Mini and Owl Pro, rolling out in 2027, associates can use a walkie-talkie mode, which relays audio live and doesn’t store it, and a panic button they can press if they feel unsafe, which records the incident so help can respond. Only the wearer can start either one. We work with each customer to meet the recording and consent laws where they operate.']],
  ] },
  { id: 'why', title: 'Why Augmodo', items: [
    ['How does Augmodo help workers?', ['Manual shelf audits and gap counting can eat up to 14 hours a week per employee. By automating that background work, Augmodo gives those hours back to the team, letting them focus on what actually drives sales: restocking faster, assisting customers, and handling tasks that genuinely require a human touch.']],
    ['How does a badge help with stock management if inventory is already tracked in a system?', ['Because the system and the shelf disagree constantly. Inventory records say what should be there. The badge sees what is. In pilot locations, a missing item costs $4.31 per item, per day, per store, and average gap rates run around 6%. Closing that loop in real time cuts gap rates by 30% or more.']],
    ['How is Augmodo different from shelf-scanning robots and fixed cameras?', ['A fixed camera sees one angle forever, high capex, and can’t follow the work to a warehouse rack or a delivery route. A robot is one expensive machine on one loop: it sees an aisle when it gets there, not when something changes, and when it goes down the store goes dark until a service call.', 'A person already walks the whole floor, all day. Twenty Smartbadges™ means the shelves get seen continuously, and if one breaks you still have nineteen. We put the sensor where the work already is.']],
  ] },
  { id: 'hardware', title: 'Hardware and Setup', items: [
    ['Is it safe to wear all day?', ['Yes. The Smartbadge complies with FCC Class B standards, has no cellular modem, and runs on Wi-Fi. The lanyard detaches under force so it can’t snag or choke.']],
    ['How long does the battery last, and how long does it take to charge?', ['A Smartbadge runs for a full 8-to-10-hour shift on a single charge. At the end of a shift, workers place their badge in a multi-bay charging dock where it recharges while syncing data or pulling over-the-air software updates.']],
    ['How long does it take to set up?', ['Setting up a site takes minutes: plug in the charging dock, hand out the badges, and associates walk the floor as usual. There are no apps to install or physical store retrofits required.']],
    ['How does the safety feature work?', ['Owl Mini and Owl Pro include an optional panic button for associates who feel unsafe. Each associate decides whether to turn it on, and only the wearer can activate it. It can’t be started remotely or by a manager. When pressed, it turns off blurring and records audio so help can respond. Safety recordings are used only for incident response. These devices begin rolling out in 2027.']],
  ] },
  { id: 'about', title: 'About us', items: [
    ['Who is behind Augmodo?', ['Ross Finman, founder and CEO. He did his graduate work in robotics at MIT, then co-founded Escher Reality, a Y Combinator-backed AR startup acquired by Niantic Labs in 2018. There he built and led the 3D mapping team powering Pokémon GO, where he led the team in mapping the world. He started Augmodo in 2023, after driving 100 miles looking for baby formula. Every inventory system said the shelves had it. The shelves didn’t. That gap exists everywhere work happens off a screen.']],
    ['Where can I see Augmodo in the wild?', ['We are live with major retailers and CPG brands across several countries, mapping over a billion square feet a year. New partnerships get announced as they go public.']],
    ['Who do I talk to?', ({ onContact }) => [
      html`Sales & Pilot Inquiries: <a href="#/" onClick=${onContact}>Contact us</a>`,
      html`Press: <a href="mailto:press@augmodo.com">press@augmodo.com</a>`,
      html`Support and Wearer Inquiries: <a href="mailto:support@augmodo.com">support@augmodo.com</a>`,
    ]],
  ] },
];

function Item({ q, a, open, onToggle, onContact }) {
  const body = useRef(null);
  const first = useRef(true);
  // Height animates between 0 and the answer's natural height.
  useLayoutEffect(() => {
    const el = body.current;
    if (first.current) { first.current = false; gsap.set(el, { height: open ? 'auto' : 0 }); return; }
    gsap.to(el, { height: open ? 'auto' : 0, duration: 0.5, ease: 'power3.inOut' });
  }, [open]);
  const paras = typeof a === 'function' ? a({ onContact }) : a;
  return html`
    <li className=${`faq-item${open ? ' open' : ''}`}>
      <span className="row-rule" />
      <button className="faq-q" aria-expanded=${open} onClick=${onToggle}>
        <span>${q}</span><span className="faq-icon" aria-hidden="true" />
      </button>
      <div className="faq-a" ref=${body}>
        <div className="faq-a-inner">${paras.map((p, i) => html`<p key=${i}>${p}</p>`)}</div>
      </div>
    </li>`;
}

export function Faq({ onContact, section }) {
  const [open, setOpen] = useState({});
  const toggle = (k) => setOpen({ ...open, [k]: !open[k] });
  const jump = (id) => document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // #/faq/privacy (linked from "Read Trust & Privacy") lands on that group.
  useEffect(() => {
    if (!section) return;
    const t = setTimeout(() => jump(section), 350);
    return () => clearTimeout(t);
  }, [section]);

  return html`
    <${Page}>
      <${PageHero} eyebrow="FAQ" title="Your questions about Augmodo, answered" />
      <section className="faq">
        <nav className="faq-index" aria-label="FAQ topics">
          <p className="eyebrow">Topics</p>
          <ul>
            ${GROUPS.map((g) => html`<li key=${g.id}><button onClick=${() => jump(g.id)}>${g.title}</button></li>`)}
          </ul>
        </nav>
        <div className="faq-groups">
          ${GROUPS.map((g) => html`
            <div className="faq-group" id=${`faq-${g.id}`} key=${g.id}>
              <h2 className="h-display faq-title" data-lines>${g.title}</h2>
              <ul className="faq-list">
                ${g.items.map(([q, a], i) => html`
                  <${Item} key=${i} q=${q} a=${a} open=${!!open[`${g.id}${i}`]} onToggle=${() => toggle(`${g.id}${i}`)} onContact=${onContact} />`)}
              </ul>
            </div>`)}
        </div>
      </section>
      <${Cta} onContact=${onContact} title="See it on your floor." />
    <//>`;
}
