/**
 * Generates every icon from one glyph definition, so they can't drift apart:
 *   src/app/icon.svg            favicon (modern browsers)
 *   src/app/favicon.ico         legacy favicon (16/32/48, PNG-embedded)
 *   src/app/apple-icon.png      iOS home screen (full-bleed; iOS applies its own mask)
 *   public/icon-192.png         web app manifest
 *   public/icon-512.png         web app manifest
 *   public/icon-maskable-512.png  full-bleed, glyph inside the safe zone, for adaptive-icon masks
 *
 * The mark is the logo's `$` (teal on the header navy). Drawn as paths, not text, so it needs no font.
 *
 *   node scripts/generate-icons.mjs        (set PLAYWRIGHT_CHROMIUM_PATH to reuse an existing Chromium)
 */
import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const NAVY = '#07101f';
const TEAL = '#38e0d3';

// 64×64 design space. An S-curve with two short ticks: the `$`.
const GLYPH = `
  <path d="M41.5 23.5C41.5 17.5 22.5 17 22.5 26C22.5 35 41.5 29 41.5 38C41.5 47 22.5 46.5 22.5 40.5"
        fill="none" stroke="${TEAL}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M32 11.5V19M32 45V52.5" fill="none" stroke="${TEAL}" stroke-width="5.5" stroke-linecap="round"/>`;

/** `scale` pulls the glyph toward the centre; `radius` rounds the tile (0 = full-bleed). */
function svg({ radius = 14, scale = 1 } = {}) {
  const offset = 32 - 32 * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="${radius}" fill="${NAVY}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})">${GLYPH}
  </g>
</svg>`;
}

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined });
const page = await browser.newPage();

async function png(markup, size, { transparent = false } = {}) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${markup}`,
  );
  return page.screenshot({ type: 'png', omitBackground: transparent, clip: { x: 0, y: 0, width: size, height: size } });
}

// Favicon SVG (also the source the rounded PNGs are drawn from).
writeFileSync('src/app/icon.svg', `${svg()}\n`);
writeFileSync('public/icon-192.png', await png(svg(), 192, { transparent: true }));
writeFileSync('public/icon-512.png', await png(svg(), 512, { transparent: true }));
writeFileSync('public/icon-maskable-512.png', await png(svg({ radius: 0, scale: 0.8 }), 512));
writeFileSync('src/app/apple-icon.png', await png(svg({ radius: 0 }), 180));

// ICO container with PNG payloads (supported by every browser that still asks for /favicon.ico).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(svg(), s, { transparent: true })));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const entry = 6 + 16 * i;
  header.writeUInt8(s, entry); // width
  header.writeUInt8(s, entry + 1); // height
  header.writeUInt16LE(1, entry + 4); // colour planes
  header.writeUInt16LE(32, entry + 6); // bits per pixel
  header.writeUInt32LE(images[i].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images[i].length;
});
writeFileSync('src/app/favicon.ico', Buffer.concat([header, ...images]));

await browser.close();
console.log('icons written');
