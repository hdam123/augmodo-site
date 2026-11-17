# Augmodo — scroll prototype

React 18 + GSAP 3.13 (ScrollTrigger, SplitText), built from the Figma file
`Augmodo_Website`, Section 1 (`281:260`): Landing Page `281:2`, Careers `281:188`,
Book a Demo_02 `281:149`. Motion follows the Scroll Animation Board `49:3030`.

## Pages

- `#/` homepage. Every "Book a demo" button and the Contact Us link open the full-screen
  contact form (`src/contact.js`). Esc or Close dismisses it. The form isn't connected to
  anything yet; submitting shows a thank-you message.
- `#/careers` careers page, linked from Careers in the nav. Open roles load live from Ashby's
  public Job Posting API (`api.ashbyhq.com/posting-api/job-board/augmodo`) and render in the
  Figma layout, with working filters. Each role opens its Ashby page in a new tab. If the API
  can't be reached, a snapshot of the 2 current roles is shown (`FALLBACK` in `src/careers.js`).
- `#/product`, `#/solutions` (For Retailers), `#/our-story`, `#/blog`, `#/blog/<slug>` and `#/faq`
  use the copy from the "Augmodo Website Content" PDFs. They aren't in Figma yet, so they're built
  from the homepage and careers system (`src/blocks.js`): 60px margins, the 670 | 650 grid,
  ruled list rows, the violet quote band and the closing CTA with the legal row.
- `#/news` rebuilds augmodo.com/news (as of 9 Nov 2026) in the new design: the latest story featured,
  then every story as a card with All / Press / News filters and search. Stories link out to the
  original coverage. Images were saved from the live page into `src/assets/news/`; to add a story,
  add an entry to `NEWS` in `src/news.js`.
- Blog: article 2 (vs. audits, RFID, cameras, robots) is marked [HOLD] in the doc and isn't
  published. Article 3 includes the out-of-stock cost calculator the doc suggested.
- FAQ: `#/faq/<topic>` (basics, privacy, why, hardware, about) opens on that topic. "Read Trust &
  Privacy" and the Privacy Policy link point at `#/faq/privacy`. Terms Of Use still leads home.
- On phones the nav sits behind a Menu button.

## Run

No install needed. Start the server and open http://localhost:5173:

    python3 serve.py

`serve.py` is a plain Python static server that turns off browser caching, so
edits always show on a normal refresh. Pass another port if 5173 is busy:
`python3 serve.py 8080`.

React, GSAP and htm load from jsDelivr via the import map in `index.html`, so an
internet connection is needed. The layout is authored on the 1440 px Figma grid.
Every value is Figma px × `--u` (viewport width / 1440).

## Files

- `src/App.js`: hash routing between the pages, and the contact form state
- `src/sections.js`: header, homepage sections and footer, each with its ScrollTrigger timeline
- `src/careers.js`: careers hero and the custom Ashby job board
- `src/contact.js`: the Book a demo contact form
- `src/blocks.js`: shared sections for the content pages (hero, photo band, two-column split, rows, stats, quotes)
- `src/pages.js`: Product, Solutions and Our Story
- `src/blog.js`: blog index, articles and the cost calculator
- `src/faq.js`: FAQ with topic index and accordion
- `src/news.js`: News page
- `src/pointcloud.js`: WebGL port of Figma's "Point cloud" shader (the purple scan effect)
- `styles.css`: layout and type, with a mobile block at the bottom
- `src/assets/`: images and SVGs exported from Figma

## Placeholders

- Video: the thumbnail is the Figma "Video" image (associate putting on the Smartbadge).
  The play button opens a "coming soon" overlay (`VideoOverlay` in `sections.js`).
- Retail / Brand: on desktop the section holds in place with the city above it and flips to
  BRAND halfway through the hold; the toggle is also clickable.
- Testimonials 2 and 3 are placeholder quotes (`QUOTES` in `sections.js`).
- Fonts: Neue Haas Grotesk Text Pro 55/65 ships in `fonts/` and is used for all body
  text. Headings use Display Pro 45 Light in Figma, which isn't included; they use
  Text Pro 55 Roman at regular weight instead, which reads closer to the design than
  Helvetica Neue Light. To switch to Display Pro, add its files to `fonts/` with an
  `@font-face` rule and put it first in `--f-display` (styles.css).
