#!/usr/bin/env node
/**
 * Build-time copy gate.
 *
 * Scans content constants, components, metadata and alt text for phrasing that
 * creates Google Ads Misrepresentation or FTC exposure on a reseller landing
 * page — claims of a storefront or neighbourhood team when calls land in a call
 * centre, invented credentials, fabricated statistics, and unconditional
 * availability promises.
 *
 * Run: npm run lint:copy
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib'];
const SCAN_EXT = new Set(['.ts', '.tsx', '.css', '.mjs']);

/** Phrases that fail the build, grouped by the risk they create. */
const BANNED = {
  'storefront / neighbourhood voice (calls land in a call centre)': [
    'no call-center maze', 'no call center maze', 'answered by real people', 'real people',
    'a real person', 'talk to a human', 'talk to a real specialist', 'face to face',
    'face-to-face', 'in person', 'in-store', 'walk in', 'walk out', 'across the counter',
    'storefront', 'brick and mortar', 'visit us', 'stop by', 'come see us', 'our office',
    'showroom', 'local branch', 'local specialist', 'local team', 'local crew',
    'local technician', 'local experts', 'local touch', 'local advantage', 'local support',
    'locally owned', 'your neighborhood', 'neighbors', 'neighborly', 'hometown',
    'right here in town', 'same-day setup', 'same day setup', 'your own time zone',
    'no offshore', 'no phone tree', 'no ticket number', 'who picks up the phone',
    'dedicated person', 'no pressure, no runaround', 'no upsell',
  ],
  'unverifiable credentials': [
    'licensed agent', 'licensed specialist', 'licensed rep', 'family-owned', 'family owned',
    'veteran-owned', 'veteran owned', 'small business', 'us-based support', 'u.s.-based support',
    'us based agents',
  ],
  'fabricated claims': [
    'verified today', '$0 hidden fees', 'no hidden fees', 'hidden fees', '99.9%',
    'available nationwide', 'nationwide coverage', 'price for life', 'never increases',
    'best price guaranteed', 'only 3 left', 'limited spots',
  ],
  'first-person carrier voice (we are not the network operator)': [
    'our network', 'our backbone', 'our technicians', 'our installers', 'our fiber network',
    'we run a dedicated', 'our 100% fiber',
  ],
  'capability claims the page cannot honour': [
    'order online', 'checkout', 'leave your details', 'we will reach out', "we'll reach out",
  ],
  'support-routing (explicitly excluded from this build)': [
    'contact earthlink directly', 'new orders only', 'for account, billing or outage',
  ],
  'date stamps and label links (explicitly excluded from this build)': [
    'pricing observed', 'pricing as of', 'broadband facts label', 'observed on',
  ],
  'placeholders': [
    'lorem ipsum', 'your company', 'todo(client)', 'xxx-xxx-xxxx',
  ],
};

/**
 * Reported on every build but not build-failing: items the operator has chosen
 * to keep for now, which must still be resolved before the first ad dollar.
 */
const WARN = {
  'placeholder phone (555-01xx is reserved for fiction and cannot ring)': ['555-01'],
  'placeholder domain in canonical / metadata': ['example-earthlink-retailer.com'],
  'placeholder email domain': ['skyline-connect.example'],
};

/**
 * Exact full strings this spec itself mandates, exempt from the matcher above.
 * Exact-match only — editing an entry puts it back in scope. Never a hole-punch
 * for new marketing copy.
 */
const ALLOWLIST_FILE = join(ROOT, 'scripts', 'lint-allowlist.txt');
const allowlist = existsSync(ALLOWLIST_FILE)
  ? readFileSync(ALLOWLIST_FILE, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
  : [];

/** Normalise Unicode lookalikes so `US‑based` with a non-ASCII hyphen still matches. */
function normalise(s) {
  return s
    .normalize('NFKD')
    .replace(/[‐-―−]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/ /g, ' ')
    .toLowerCase();
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (SCAN_EXT.has(extname(p))) out.push(p);
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));
const violations = [];
const warnings = [];

function scan(groups, sink) {
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n');

    lines.forEach((line, i) => {
      const norm = normalise(line);

      // Skip lines carrying an allowlisted mandated string.
      if (allowlist.some((entry) => norm.includes(normalise(entry)))) return;

      for (const [category, phrases] of Object.entries(groups)) {
        for (const phrase of phrases) {
          if (norm.includes(normalise(phrase))) {
            sink.push({
              file: relative(ROOT, file),
              line: i + 1,
              phrase,
              category,
              text: line.trim().slice(0, 120),
            });
          }
        }
      }
    });
  }
}

scan(BANNED, violations);
scan(WARN, warnings);

if (warnings.length) {
  console.warn(`\n⚠ ${warnings.length} pre-launch item(s) — resolve before the first ad dollar:\n`);
  for (const w of warnings) {
    console.warn(`  ${w.file}:${w.line}  → ${w.category}`);
  }
  console.warn('');
}

if (violations.length === 0) {
  console.log(`✓ copy lint passed — ${files.length} files scanned, 0 blocking violations\n`);
  process.exit(0);
}

console.error(`✗ copy lint FAILED — ${violations.length} blocking violation(s)\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}`);
  console.error(`    banned:   "${v.phrase}"  (${v.category})`);
  console.error(`    context:  ${v.text}\n`);
}
process.exit(1);
