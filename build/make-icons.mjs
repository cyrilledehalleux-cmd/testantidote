// Génère les icônes PNG de l'application à partir d'un dessin SVG (à lancer une seule fois :
// node build/make-icons.mjs). Utilise le navigateur Chromium de Playwright.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'app', 'icons');
fs.mkdirSync(OUT, { recursive: true });

// Fiole stylisée avec une croix : « antidote ». pad = marge (icône « maskable » : zone sûre 80 %).
const svg = (pad, rounded) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="#0f4c5c"/>
  <g transform="translate(${pad} ${pad}) scale(${(512 - 2 * pad) / 512})">
    <rect x="196" y="70" width="120" height="44" rx="12" fill="#ffffff"/>
    <path d="M214 114 h84 v70 l70 120 a84 84 0 0 1 -72 128 h-80 a84 84 0 0 1 -72 -128 l70 -120 z" fill="#ffffff"/>
    <path d="M178 318 h156 l20 34 a52 52 0 0 1 -46 76 h-104 a52 52 0 0 1 -46 -76 z" fill="#7cc6d6"/>
    <rect x="240" y="300" width="32" height="104" rx="6" fill="#0f4c5c"/>
    <rect x="204" y="336" width="104" height="32" rx="6" fill="#0f4c5c"/>
  </g>
</svg>`;

const targets = [
  ['icon-192.png', 192, 0, true],
  ['icon-512.png', 512, 0, true],
  ['icon-maskable-512.png', 512, 72, false],
  ['apple-touch-icon.png', 180, 24, false],
];
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const [name, size, pad, rounded] of targets) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg(pad, rounded).replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: path.join(OUT, name), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  console.log('  app/icons/' + name);
}
fs.writeFileSync(path.join(OUT, 'icon.svg'), svg(0, true).trim() + '\n');
await browser.close();
