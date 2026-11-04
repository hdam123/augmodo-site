# Augmodo — scroll prototype

React 18 + GSAP 3.13 (ScrollTrigger, SplitText), built from the Figma file
`Augmodo_Website` (Landing Page `49:1691`, Scroll Animation Board `49:3030`).

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

- `src/sections.js`: every section and its ScrollTrigger timeline, in storyboard order
- `src/pointcloud.js`: WebGL port of Figma's "Point cloud" shader (the purple scan effect)
- `styles.css`: layout and type, with a mobile block at the bottom
- `src/assets/`: images and SVGs exported from Figma

## Placeholders

- Video: the thumbnail is the Figma "Video" frame (store photo, point-cloud scan on the left
  half). The play button opens a "coming soon" overlay (`VideoOverlay` in `sections.js`).
- Retail / Brand: on desktop the section holds in place with the city above it and flips to
  BRAND halfway through the hold; the toggle is also clickable.
- Testimonials 2 and 3 are placeholder quotes (`QUOTES` in `sections.js`).
- Fonts: Neue Haas Grotesk Text Pro 55/65 ships in `fonts/` and is used for all body
  text. Headings use Display Pro 45 Light in Figma, which isn't included; they use
  Text Pro 55 Roman at regular weight instead, which reads closer to the design than
  Helvetica Neue Light. To switch to Display Pro, add its files to `fonts/` with an
  `@font-face` rule and put it first in `--f-display` (styles.css).
