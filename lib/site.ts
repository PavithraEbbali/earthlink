/**
 * Client constants for the site. Every component reads the entity name, phone
 * number and agreement noun from here — nothing is hardcoded in JSX.
 *
 * NOTE: brand name, legal entity, logo and phone number are carried over from the
 * existing build unchanged, per explicit instruction.
 */

export const site = {
  /** Registered legal entity that operates this site. */
  entityLegalName: 'Skyline Connect LLC',
  /** How the entity is described in relation to the carrier. Matches the signed agreement. */
  agreementNoun: 'Retailer',
  agreementNounLower: 'retailer',

  /** The carrier whose services are sold here. */
  carrier: 'EarthLink',

  /** Order line. */
  phoneDisplay: '(855) 555-0100',
  phoneE164: '+18555550100',

  /** Agent availability. Must match ad scheduling and actual staffing. */
  hours: 'Mon–Sun, 8am–10pm ET',

  email: 'hello@skyline-connect.example',

  /** Canonical production host. Never a carrier domain. */
  url: 'https://www.example-earthlink-retailer.com',

  /**
   * Google Ads conversion tag. Left empty deliberately — no placeholder ID ships.
   * Set both values and the consent + call-conversion tracking activates itself;
   * while empty, no tag is emitted at all.
   */
  gtagId: '',
  callConversionLabel: '',
} as const;

/** Standard CTA labels. The raw phone number is only used in the header and footer. */
export const cta = {
  order: 'Call to order',
  pricing: 'Call for pricing',
} as const;

/** Trademark attribution lines rendered in the footer. */
export const trademarks = [
  'EarthLink and the EarthLink logo are trademarks of EarthLink, LLC, used under retailer authorization for the purpose of identifying the services offered.',
  'Viasat is a trademark of Viasat, Inc. EarthLink Satellite service is powered by Viasat.',
  'All other marks are the property of their respective owners.',
] as const;
