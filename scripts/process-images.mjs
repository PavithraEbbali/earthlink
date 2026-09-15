#!/usr/bin/env node
/**
 * Image pipeline: source PNGs -> cropped, resized, compressed WebP + JPG.
 *
 * Two things happen here beyond compression:
 *
 *  1. The generator stamps a small sparkle watermark into the bottom-right
 *     corner of every frame. `cropRight` trims it off. Nothing else in these
 *     compositions lives in that corner, so the crop costs no subject matter.
 *
 *  2. Sources are ~8.5MB PNGs at 2816x1536. Shipping those would destroy the
 *     LCP budget, so each is resized to the largest size it is actually
 *     displayed at and encoded twice: WebP for browsers that take it, JPG as
 *     the fallback.
 *
 * Run: node scripts/process-images.mjs
 */

import sharp from 'sharp';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Full-size generator output. Kept OUT of public/ so it is never deployed. */
const SRC_DIR = join(process.cwd(), 'source-images');
/** Web-ready derivatives that actually ship. */
const DIR = join(process.cwd(), 'public', 'assets', 'img');

/** Fraction of width trimmed from the right edge to drop the generator watermark. */
const CROP_RIGHT = 0.13;
/** Small bottom trim for margin, in case the mark sits slightly higher in a frame. */
const CROP_BOTTOM = 0.04;

const TARGETS = [
  { src: 'hero-background.png', out: 'hero-background', width: 1920, quality: 70 },
  { src: 'fiber-install.png', out: 'fiber-install', width: 1100, quality: 74 },
  { src: 'wireless-5g-gateway.png', out: 'wireless-5g-gateway', width: 1100, quality: 74 },
  { src: 'satellite-dish.png', out: 'satellite-dish', width: 1100, quality: 74 },
  { src: 'how-it-works.png', out: 'how-it-works', width: 1400, quality: 74 },
];

const mb = (n) => (n / 1048576).toFixed(2) + 'MB';
const kb = (n) => Math.round(n / 1024) + 'KB';

let totalIn = 0;
let totalOut = 0;
const manifest = [];

for (const t of TARGETS) {
  const srcPath = join(SRC_DIR, t.src);
  if (!existsSync(srcPath)) {
    console.error(`  MISSING: ${t.src}`);
    continue;
  }

  const inBytes = statSync(srcPath).size;
  totalIn += inBytes;

  const img = sharp(srcPath);
  const meta = await img.metadata();

  const cropW = Math.round(meta.width * (1 - CROP_RIGHT));
  const cropH = Math.round(meta.height * (1 - CROP_BOTTOM));

  const base = sharp(srcPath).extract({ left: 0, top: 0, width: cropW, height: cropH });

  const outH = Math.round((cropH / cropW) * t.width);

  const webpPath = join(DIR, `${t.out}.webp`);
  const jpgPath = join(DIR, `${t.out}.jpg`);

  await base
    .clone()
    .resize(t.width, outH, { fit: 'cover' })
    .webp({ quality: t.quality, effort: 6 })
    .toFile(webpPath);

  await base
    .clone()
    .resize(t.width, outH, { fit: 'cover' })
    .jpeg({ quality: t.quality + 4, mozjpeg: true, progressive: true })
    .toFile(jpgPath);

  const wBytes = statSync(webpPath).size;
  const jBytes = statSync(jpgPath).size;
  totalOut += wBytes;

  manifest.push({ name: t.out, width: t.width, height: outH });

  console.log(
    `  ${t.out.padEnd(22)} ${meta.width}x${meta.height} ${mb(inBytes).padStart(8)}` +
      `  ->  ${t.width}x${outH}  webp ${kb(wBytes).padStart(6)}  jpg ${kb(jBytes).padStart(6)}`,
  );
}

/* Social share card: the hero frame re-cropped to the 1.91:1 ratio OG expects. */
const heroSrc = join(SRC_DIR, 'hero-background.png');
if (existsSync(heroSrc)) {
  const m = await sharp(heroSrc).metadata();
  const ogPath = join(DIR, 'og-card.jpg');
  await sharp(heroSrc)
    .extract({
      left: 0,
      top: 0,
      width: Math.round(m.width * (1 - CROP_RIGHT)),
      height: Math.round(m.height * (1 - CROP_BOTTOM)),
    })
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(ogPath);
  console.log(`  ${'og-card'.padEnd(22)} social share card  ->  1200x630  jpg ${kb(statSync(ogPath).size).padStart(6)}`);
}

console.log(`\n  source total ${mb(totalIn)}  ->  shipped (webp) ${mb(totalOut)}`);
console.log('\n  Intrinsic sizes for the markup (prevents layout shift):');
for (const m of manifest) {
  console.log(`    ${m.name.padEnd(22)} width={${m.width}} height={${m.height}}`);
}
