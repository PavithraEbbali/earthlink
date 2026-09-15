# EarthLink — Independent Authorized Retailer

A one-page, phone-lead landing site for an independent authorized retailer of EarthLink
services. Built as a Next.js static export: no server, no database, no API routes.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:4181, hot reload
```

```bash
npm run build    # static export into out/
npm start        # serve the built export on http://localhost:4180
```

> On Windows the static server holds `out/` open, so stop it before rebuilding or
> `next build` fails with `EBUSY`. Use `npm run dev` while editing.

---

## Updating prices, plans and promotions

**Everything lives in [`lib/content.ts`](lib/content.ts).** It is the single source of
truth. Change a rate there and every plan card, price lockup, comparison row, section
heading, JSON-LD offer and legal disclaimer regenerates from it. No JSX file contains a
price, a speed, a plan name or a promotional term.

To change a rate:

```ts
// lib/content.ts
startingAt: 24,
startingAtCents: '.95',
startingAtQualifier: 'per month for the first 2 months, for new customers',
```

To add or remove a whole service line, add or remove its entry in `SERVICE_SECTIONS`.
Section order on the page follows array order.

Entity details — legal name, phone number, hours, canonical URL — live in
[`lib/site.ts`](lib/site.ts).

### Sourcing rule

Every figure comes from earthlink.net itself. Third-party aggregators are not an
acceptable source. Each section records `source` and `observedAt` for the substantiation
file; these are deliberately **not** rendered on the page.

EarthLink does not publish per-tier pricing — its own plan cards show a speed and a phone
number only. The three published figures are the section-level "starting at" rates.
Individual tiers therefore carry no `price` and render **"Call for pricing"**. Inventing
tier rates would be bait advertising.

---

## Checks

```bash
npm run lint:copy
```

Scans content, components, metadata and image alt text for phrasing that creates Google
Ads Misrepresentation or FTC exposure on a reseller landing page: claims of a storefront
or neighbourhood team when calls land in a call centre, invented credentials, fabricated
statistics, unconditional availability promises. Fails the build on a hit.

Strings this spec mandates verbatim are exempted via
[`scripts/lint-allowlist.txt`](scripts/lint-allowlist.txt) — exact match only.

Placeholders that must be resolved before the first ad dollar are reported as warnings
rather than failures.

---

## Images

Full-size originals live in `source-images/` and are **never deployed**.

```bash
node scripts/process-images.mjs
```

Crops the generator watermark from the bottom-right corner, resizes each image to the
largest size it is actually displayed at, and writes WebP plus a JPG fallback into
`public/assets/img/`. Also emits the 1200×630 social card.

Current output: **40.45 MB of source → 0.30 MB shipped.**

Every image carries intrinsic `width`/`height` so nothing shifts while loading. The hero
loads eagerly as the LCP element; everything below the fold is lazy.

---

## Deploying to Vercel

Import the repository at [vercel.com/new](https://vercel.com/new). Vercel detects Next.js
automatically and needs no configuration:

| Setting | Value |
|---|---|
| Framework | Next.js (auto-detected) |
| Build command | `next build` (default) |
| Output | handled by `output: 'export'` |
| Install command | `npm install` (default) |
| Environment variables | none required |

`next.config.js` sets `output: 'export'`, `trailingSlash: true` and
`images.unoptimized: true`, which is what makes the build a pure static bundle.

### Before going live

- [ ] Replace the placeholder phone number in `lib/site.ts` — `(855) 555-0100` is in the
      `555-01xx` range reserved for fiction and cannot ring
- [ ] Set the real canonical domain in `lib/site.ts` (`url`)
- [ ] Set a real contact email (`email`)
- [ ] Set `gtagId` and `callConversionLabel` to activate consent and call-conversion
      tracking — nothing is emitted while they are empty
- [ ] Re-verify pricing against earthlink.net; the `$24.95` fiber promotion had an
      advertised end date of 30 September 2026

`npm run lint:copy` reports the first four on every run.

---

## What this site sells

EarthLink's residential line-up is **Fiber, Wireless 5G Home Internet and Satellite**.
There are no cable, bundle, TV, mobile or home-phone sections because EarthLink sells none
of those to residential customers — advertising a line the order line cannot sell is bait
advertising.

## Structure

```
app/          layout (metadata, JSON-LD, tracking), page composition, global CSS
components/   presentational components; none contain plan data
lib/          content.ts (all copy and pricing) and site.ts (entity constants)
public/       static assets, legal pages, shipped images
scripts/      copy lint and the image pipeline
source-images/ full-size originals, not deployed
legacy/       the pre-rewrite static build, kept for reference
```
