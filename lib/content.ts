/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH — all plans, pricing, promotions and disclosures.
 * ============================================================================
 *
 *  To update the site when EarthLink changes rates or promotions, edit ONLY
 *  this file. Every plan card, price lockup, comparison row, section heading
 *  and legal disclaimer regenerates from the data below. No JSX file contains
 *  a price, a speed, a plan name or a promotional term.
 *
 *  SOURCING RULE: every figure here comes from earthlink.net itself. Third-party
 *  aggregators are not an acceptable source. `source` and `observedAt` record
 *  provenance for the substantiation file; they are deliberately NOT rendered
 *  on the page.
 *
 *  PRICING REALITY: EarthLink does not publish per-tier pricing. Its plan cards
 *  show speed and a phone number only. The three published figures are the
 *  section-level "starting at" rates below. Individual tiers therefore carry no
 *  `price` and render "Call for pricing" — inventing tier rates would be bait
 *  advertising.
 */

import { cta } from './site';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ServiceLine = 'fiber' | 'wireless' | 'satellite';

export interface ImageAsset {
  /** Basename without extension; the pipeline emits both .webp and .jpg. */
  file: string;
  /** Alt text is scanned by the copy lint, same as any other copy on the page. */
  alt: string;
  width: number;
  height: number;
}

/** Hero backdrop. Decorative — it sits behind the headline, so alt is empty. */
export const HERO_IMAGE: ImageAsset = {
  file: 'hero-background',
  alt: '',
  width: 1920,
  height: 1156,
};

/** Illustration for the ordering steps. */
export const HOW_IMAGE: ImageAsset = {
  file: 'how-it-works',
  alt: 'A person seated at a kitchen table speaking on the phone, with a notepad and pen in front of them.',
  width: 1400,
  height: 843,
};

export interface PlanItem {
  id: string;
  /** Carrier's exact product name. */
  name: string;
  serviceLine: ServiceLine;
  /**
   * Download speed in Mbps. Optional: EarthLink publishes no speed figure for
   * 5G Home or Satellite, and inventing one would be a fabricated claim.
   * Where it is absent, `speedLabel` carries the carrier's own wording.
   */
  speedDown?: number;
  /** Upload speed in Mbps. Equal to speedDown on fiber (symmetrical). */
  speedUp?: number;
  /** Display override when the carrier publishes no numeric speed. */
  speedLabel?: string;
  /** Monthly price. Undefined => the card renders "Call for pricing". */
  price?: number;
  cents?: string;
  promoQualifier?: string;
  equipmentFee?: string;
  dataPolicy?: string;
  contractTerm?: string;
  installation?: string;
  features: string[];
  isPopular?: boolean;
}

export interface ServiceSection {
  id: string;
  eyebrow: string;
  heading: string;
  intro: string;
  serviceLine: ServiceLine;
  /** Published "starting at" figure for the line, if EarthLink lists one. */
  startingAt?: number;
  startingAtCents?: string;
  startingAtQualifier?: string;
  startingAtStepUp?: string;
  plans: PlanItem[];
  /** Section-level fine print. */
  disclaimer: string;
  /** Illustrative photograph for the section. */
  image?: ImageAsset;
  /**
   * 'beside'     — sits next to the published rate (default)
   * 'background' — fills the section behind the content
   */
  imageMode?: 'beside' | 'background';
  source: string;
  observedAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Shared feature sets                                                        */
/* -------------------------------------------------------------------------- */

const FIBER_COMMON = [
  'Matching upload and download speeds',
  'Unlimited data — no caps, no throttling',
  'Price-lock guarantee',
  'No credit check required',
];

/* -------------------------------------------------------------------------- */
/*  Service lines — rendered in this array order                               */
/*  Fiber → Wireless 5G Home → Satellite                                       */
/*                                                                             */
/*  Cable, bundles, TV, mobile and home phone are intentionally absent:        */
/*  EarthLink sells none of them to residential customers. Advertising a line   */
/*  the order line cannot sell is bait advertising.                            */
/* -------------------------------------------------------------------------- */

export const SERVICE_SECTIONS: ServiceSection[] = [
  {
    id: 'fiber',
    eyebrow: 'Fiber Internet',
    heading: 'EarthLink Fiber plans',
    intro:
      'A full fiber-optic path runs from the network into the property, with no coaxial segment on the final stretch. Upload and download speeds match, and data is unlimited on every tier.',
    serviceLine: 'fiber',
    startingAt: 24,
    startingAtCents: '.95',
    startingAtQualifier: 'per month for the first 2 months, for new customers',
    startingAtStepUp: 'Standard plan rate applies thereafter. Taxes, fees and equipment charges may apply.',
    image: {
      file: 'fiber-install',
      alt: 'A technician connecting a fiber-optic patch cable inside a wall-mounted junction enclosure in a home hallway.',
      width: 1100,
      height: 662,
    },
    source: 'https://www.earthlink.net/internet/fiber-internet/',
    observedAt: '2026-09-15',
    disclaimer:
      'Introductory rate applies to new customers for the first 2 months; the standard plan rate applies afterwards. Offer ends 30 September 2026 and is subject to change. Speeds quoted are maximum available rates; actual throughput varies with distance, line quality, equipment and the number of devices in use at once. Availability, pricing and speed tiers vary by service address and are confirmed by phone before any order is placed. Taxes, fees and equipment charges may apply. Fiber service may require a 12-month term agreement.',
    plans: [
      {
        id: 'fiber-100',
        name: 'EarthLink Fiber 100 Mbps',
        serviceLine: 'fiber',
        speedDown: 100,
        speedUp: 100,
        dataPolicy: 'Unlimited',
        contractTerm: 'May require a 12-month term',
        installation: 'Professional installation arranged by EarthLink',
        features: [
          'Suited to households running around five connected devices',
          'High-definition streaming on a primary screen',
          'Responsive everyday online gaming',
          'Comfortable browsing, video calls and social media',
          ...FIBER_COMMON,
        ],
      },
      {
        id: 'fiber-300',
        name: 'EarthLink Fiber 300 Mbps',
        serviceLine: 'fiber',
        speedDown: 300,
        speedUp: 300,
        dataPolicy: 'Unlimited',
        contractTerm: 'May require a 12-month term',
        installation: 'Professional installation arranged by EarthLink',
        features: [
          'Built for households with roughly a dozen connected devices',
          'Several simultaneous high-definition streams',
          'Faster transfers of large files',
          'Dependable remote work and online learning',
          ...FIBER_COMMON,
        ],
        isPopular: true,
      },
      {
        id: 'fiber-1gig',
        name: 'EarthLink Fiber 1 Gig',
        serviceLine: 'fiber',
        speedDown: 1000,
        speedUp: 1000,
        dataPolicy: 'Unlimited',
        contractTerm: 'May require a 12-month term',
        installation: 'Professional installation arranged by EarthLink',
        features: [
          'Comfortable for households running around fifteen devices',
          'Ultra-high-definition streaming across several screens at once',
          'Low-latency gaming for the whole household',
          'Rapid downloads of large files and game updates',
          ...FIBER_COMMON,
        ],
      },
      {
        id: 'fiber-5gig',
        name: 'EarthLink Fiber 5 Gig',
        serviceLine: 'fiber',
        speedDown: 5000,
        speedUp: 5000,
        dataPolicy: 'Unlimited',
        contractTerm: 'May require a 12-month term',
        installation: 'Professional installation arranged by EarthLink',
        features: [
          'Headroom for a large number of simultaneous connected devices',
          "EarthLink's fastest residential fiber tier",
          'Competition-grade gaming performance',
          'The quickest download rates EarthLink offers',
          ...FIBER_COMMON,
        ],
      },
    ],
  },

  {
    id: 'wireless-5g',
    eyebrow: 'Wireless 5G Home Internet',
    heading: 'EarthLink Wireless 5G Home Internet',
    intro:
      'Home broadband delivered over the same 5G and LTE cellular networks that serve mobile phones. The receiver arrives ready to use, so there is no technician visit and no work to the property.',
    serviceLine: 'wireless',
    startingAt: 59,
    startingAtCents: '.95',
    startingAtQualifier: 'per month, starting rate',
    startingAtStepUp: 'Taxes, fees and equipment charges may apply.',
    image: {
      file: 'wireless-5g-gateway',
      alt: 'A compact cylindrical wireless home internet receiver standing on a wooden side table beside a window.',
      width: 1100,
      height: 662,
    },
    imageMode: 'background',
    source: 'https://www.earthlink.net/internet/wireless-home-internet/',
    observedAt: '2026-09-15',
    disclaimer:
      'Starting rate shown; the rate available at a given address depends on local network coverage and is confirmed by phone. EarthLink publishes no fixed speed figure for this service — throughput depends on cellular signal strength at the property, network load and the number of devices connected. Same-day dispatch applies to orders placed before 3:00pm ET. Taxes, fees and equipment charges may apply.',
    plans: [
      {
        id: 'wireless-unlimited',
        name: 'EarthLink 5G Home Internet — Unlimited Data',
        serviceLine: 'wireless',
        speedLabel: '5G / LTE',
        dataPolicy: 'Unlimited, no throttling',
        contractTerm: 'No annual contract',
        installation: 'Self-install — plug in and activate',
        features: [
          'Unlimited monthly data with no overage charges',
          'No annual contract',
          'No credit check required',
          'Set up without a technician visit — connect the receiver and activate',
          'Same-day dispatch on orders placed before 3:00pm ET',
          'Supports multiple devices across the household',
        ],
        isPopular: true,
      },
    ],
  },

  {
    id: 'satellite',
    eyebrow: 'Satellite Internet',
    heading: 'EarthLink Satellite Internet',
    intro:
      'Satellite broadband for addresses that fixed-line networks do not reach. Service is delivered over the Viasat satellite network and requires a clear line of sight to the sky, with professional installation arranged as part of the order.',
    serviceLine: 'satellite',
    startingAt: 49,
    startingAtCents: '.95',
    startingAtQualifier: 'per month, starting rate',
    startingAtStepUp: 'Equipment, installation, taxes and fees may apply.',
    image: {
      file: 'satellite-dish',
      alt: 'A satellite internet dish mounted on the eave of a rural farmhouse, with open fields behind it.',
      width: 1100,
      height: 662,
    },
    source: 'https://www.earthlink.net/internet/satellite-internet/',
    observedAt: '2026-09-15',
    disclaimer:
      'Starting rate shown; the plans and rate available at a given address are confirmed by phone. Service is provided over the Viasat satellite network and requires professional installation of a dish with an unobstructed view of the sky. Satellite connections can slow or drop during heavy rain, storms or dense cloud cover. Satellite plans generally carry longer minimum terms than fixed-line services. Equipment, installation charges, taxes and fees may apply.',
    plans: [
      {
        id: 'satellite-standard',
        name: 'EarthLink Satellite Internet',
        serviceLine: 'satellite',
        speedLabel: 'Varies by location',
        dataPolicy: 'Plan-dependent — confirmed by phone',
        contractTerm: 'Longer minimum term typically applies',
        installation: 'Professional dish installation required',
        features: [
          'Reaches addresses where fiber, cable and 5G are unavailable',
          'Delivered over the Viasat satellite network',
          'Coverage across rural and remote areas',
          'Professional installation and alignment included in the order',
          'Plans and allowances confirmed for the address before ordering',
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Add-ons — EarthLink's own named products                                   */
/* -------------------------------------------------------------------------- */

export interface AddOn {
  id: string;
  name: string;
  description: string;
  source: string;
}

export const ADDONS: AddOn[] = [
  {
    id: 'security',
    name: 'EarthLink Security & Privacy',
    description:
      "EarthLink's suite of protection tools for the devices on the connection, covering everyday browsing and personal data.",
    source: 'https://www.earthlink.net/security-privacy/',
  },
  {
    id: 'easytech',
    name: 'EarthLink EasyTech',
    description:
      'Remote technical support for the equipment and devices in the household, handled over the phone and online rather than by a site visit.',
    source: 'https://www.earthlink.net/internet/fiber-internet/',
  },
  {
    id: 'perks',
    name: 'EarthLink Perks',
    description:
      'A member savings program included with EarthLink internet plans, offering discounts with participating retailers.',
    source: 'https://www.earthlink.net/internet/fiber-internet/',
  },
];

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

export const HERO = {
  eyebrow: 'Authorized Retailer',
  /** Visual line breaks; real spaces are preserved in textContent. */
  headlineLines: ['Fiber, 5G Home and', 'Satellite internet.'],
  subline:
    'Availability differs from one address to the next. A single call establishes which EarthLink services are live at yours, the speeds available there, and the current monthly rate for each.',
  trustChips: [
    'Unlimited data on fiber',
    'No annual contract on 5G Home',
    'No credit check',
    'Matching upload and download speeds on fiber',
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Why order here / How it works                                              */
/* -------------------------------------------------------------------------- */

export const WHY_US = [
  {
    title: 'Every EarthLink service on one call',
    body: 'Fiber, Wireless 5G Home Internet and Satellite are quoted together, so the options that actually reach the address can be compared side by side in a single conversation.',
  },
  {
    title: 'Current promotions, quoted as they stand',
    body: "Agents work from EarthLink's live offer schedule, so the rate quoted is the rate in force on the day of the call rather than a figure left over from an earlier campaign.",
  },
  {
    title: 'Address checked while on the line',
    body: 'Serviceability, the available speed tiers and the exact monthly rate are confirmed for the specific address before any order is submitted.',
  },
  {
    title: 'No obligation to order — call, compare, decide.',
    body: 'A call is a quote, not a commitment. Availability and pricing can be confirmed and considered with nothing placed on order.',
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Call the order line',
    body: `Reach a trained sales agent on ${'{{PHONE}}'}. Available ${'{{HOURS}}'}.`,
  },
  {
    step: 2,
    title: 'The address is checked',
    body: 'The agent confirms which EarthLink services reach the address, which speed tiers are available there, and the current rate for each.',
  },
  {
    step: 3,
    title: 'EarthLink completes the setup',
    body: 'Fiber and Satellite are installed by EarthLink at a scheduled appointment. Wireless 5G Home equipment ships for self-installation, dispatched the same day when ordered before 3:00pm ET.',
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Comparison grid                                                            */
/* -------------------------------------------------------------------------- */

export interface ComparisonRow {
  label: string;
  values: Record<ServiceLine, string>;
}

export const COMPARISON: ComparisonRow[] = [
  {
    label: 'Starting rate',
    values: { fiber: '$24.95/mo intro', wireless: '$59.95/mo', satellite: '$49.95/mo' },
  },
  {
    label: 'Speed',
    values: {
      fiber: '100 Mbps – 5 Gig, symmetrical',
      wireless: '5G / LTE, varies by signal',
      satellite: 'Varies by location',
    },
  },
  {
    label: 'Data allowance',
    values: { fiber: 'Unlimited, no throttling', wireless: 'Unlimited, no throttling', satellite: 'Plan-dependent' },
  },
  {
    label: 'Contract',
    values: { fiber: 'May require 12-month term', wireless: 'No annual contract', satellite: 'Longer term typically applies' },
  },
  {
    label: 'Installation',
    values: { fiber: 'Professional, by EarthLink', wireless: 'Self-install', satellite: 'Professional dish install' },
  },
  {
    label: 'Credit check',
    values: { fiber: 'Not required', wireless: 'Not required', satellite: 'Confirmed on the call' },
  },
  {
    label: 'Best suited to',
    values: {
      fiber: 'Addresses on the fiber network',
      wireless: 'Areas with strong 5G coverage',
      satellite: 'Rural and hard-to-reach addresses',
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  FAQ — mirrored exactly into FAQPage JSON-LD                                */
/* -------------------------------------------------------------------------- */

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'Which EarthLink services can reach my address?',
    a: 'That depends on the address. Fiber is available where the fiber network has been built out, Wireless 5G Home Internet where cellular coverage supports it, and Satellite almost everywhere else. Coverage is confirmed for the specific address on the call before anything is ordered.',
  },
  {
    q: 'How much does EarthLink internet cost?',
    a: 'EarthLink Fiber starts at $24.95 per month for the first two months on a new account, Wireless 5G Home Internet starts at $59.95 per month, and Satellite starts at $49.95 per month. EarthLink does not publish a separate rate for each speed tier, because pricing varies by address — the exact monthly figure is confirmed by phone.',
  },
  {
    q: 'Is there a data cap?',
    a: 'EarthLink Fiber and Wireless 5G Home Internet both carry unlimited data with no throttling and no overage charges. Satellite allowances depend on the plan selected and are confirmed on the call.',
  },
  {
    q: 'Do I need to sign a contract?',
    a: 'Wireless 5G Home Internet carries no annual contract. Fiber may require a 12-month term agreement. Satellite plans generally carry a longer minimum term. The terms that apply to a given plan are stated before the order is submitted.',
  },
  {
    q: 'How is the service installed?',
    a: 'Fiber and Satellite are installed by EarthLink at a scheduled appointment, and Satellite additionally requires a dish with a clear view of the sky. Wireless 5G Home Internet is self-installed: the receiver is plugged in and activated, with no technician visit required.',
  },
  {
    q: 'Do I need my own modem or router?',
    a: 'No. Equipment is supplied as part of the EarthLink service for each connection type. Any equipment charge that applies to a plan is stated on the call before the order is placed.',
  },
  {
    q: 'Is a credit check required?',
    a: 'EarthLink Fiber and Wireless 5G Home Internet are offered without a credit check. Any requirement attaching to a Satellite plan is confirmed during the call.',
  },
  {
    q: 'How quickly can the service be connected?',
    a: 'Wireless 5G Home Internet equipment is dispatched the same day when the order is placed before 3:00pm ET, and works as soon as it is plugged in and activated. Fiber and Satellite depend on the next available installation appointment for the area, which the agent books during the call.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Formats a speed in Mbps the way the carrier labels it. */
export function speedLabel(plan: PlanItem): string {
  if (plan.speedLabel) return plan.speedLabel;
  if (!plan.speedDown) return 'Confirmed by phone';
  return plan.speedDown >= 1000 ? `${plan.speedDown / 1000} Gig` : `${plan.speedDown} Mbps`;
}

/** The button label for a plan: priced plans order, unpriced plans ask. */
export function ctaLabel(plan: PlanItem): string {
  return typeof plan.price === 'number' ? cta.order : cta.pricing;
}

/** Plain-English price string for screen readers, generated from the same object. */
export function priceSrLabel(price: number, cents?: string): string {
  return `$${price}${cents ?? ''} per month`;
}
