import { createRoot } from 'react-dom/client';
import { html, syncUnit } from './lib.js';
import { App } from './App.js';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
syncUnit();

// Load the brand fonts before rendering so SplitText measures the final line breaks.
const fonts = ['400 16px "NHG Text"', '500 16px "NHG Text"'].map((f) => document.fonts.load(f));
Promise.all(fonts).catch(() => {}).then(() => document.fonts.ready).then(() => {
  createRoot(document.getElementById('root')).render(html`<${App} />`);
});
