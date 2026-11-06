import React from 'react';
import htm from 'htm';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const html = htm.bind(React.createElement);
export { gsap, ScrollTrigger, SplitText };

// Layout is authored in Figma pixels on a 1440-wide frame; 1 design px = 1 "u".
export const DESIGN_W = 1440;
export const MOBILE_BP = 768;
export const isDesktop = () => document.documentElement.clientWidth >= MOBILE_BP;
export const u = () => document.documentElement.clientWidth / DESIGN_W;
export const U = (n) => `calc(var(--u) * ${n})`;

export function syncUnit() {
  // A page opened in a hidden tab can report 0 width; keep the stylesheet's 100vw / 1440 until it's real.
  if (!document.documentElement.clientWidth) return document.documentElement.style.removeProperty('--u');
  document.documentElement.style.setProperty('--u', `${u()}px`);
}

// Staggered line reveal used for every heading/paragraph in the storyboard.
// Each line is clipped by a mask; .line-mask (styles.css) extends that clip past the line box
// so descenders (g, y, p) aren't cut at tight line-heights.
export function splitLines(el) {
  if (!el) return [];
  const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
  split.masks.forEach((m) => m.classList.add('line-mask'));
  return split.lines;
}

// 140% clears the extended mask so hidden lines leave no sliver showing.
export const LINE_IN = { yPercent: 140, ease: 'power3.out', stagger: 0.12 };
