import { SERVICE_SECTIONS } from '@/lib/content';
import { site, trademarks } from '@/lib/site';
import { CallLink, Logo, PhoneIcon } from './ui';

const LEGAL = [
  { href: '/legal/privacy.html', label: 'Privacy & Data Protection' },
  { href: '/legal/disclaimer.html', label: 'Disclaimer' },
  { href: '/legal/cookies.html', label: 'Cookies Policy' },
  { href: '/legal/tcpa.html', label: 'TCPA Policy' },
  { href: '/legal/trademarks.html', label: 'Trademarks' },
  { href: '/legal/marketing.html', label: 'Marketing Policy' },
  { href: '/legal/service-fulfillment.html', label: 'Service Fulfillment' },
  { href: '/legal/pci-dss.html', label: 'PCI DSS' },
];

const LEARN = [
  { href: '#compare', label: 'Compare connection types' },
  { href: '#addons', label: 'Add-ons and extras' },
  { href: '#how', label: 'How ordering works' },
  { href: '#why', label: 'Ordering through a retailer' },
  { href: '#faq', label: 'Frequently asked questions' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white" aria-label="Site footer">
      <div className="mx-auto max-w-container px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + retailer description */}
          <div className="lg:pr-6">
            <Logo wordmarkColor="#ffffff" className="h-8 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {site.entityLegalName} is an independent authorized {site.agreementNounLower} of{' '}
              {site.carrier} services, taking new residential orders for Fiber, Wireless 5G Home
              Internet and Satellite.
            </p>
            <CallLink
              ariaLabel={`Call to order — ${site.phoneDisplay}`}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-[0.95rem] font-bold text-white transition-colors duration-200 hover:bg-orange-600"
            >
              <PhoneIcon />
              {site.phoneDisplay}
            </CallLink>
          </div>

          {/* Shop */}
          <nav aria-label="Services">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.1em] text-white">
              Services
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-white/70 transition-colors hover:text-orange-300">
                    {s.eyebrow}
                  </a>
                </li>
              ))}
              <li>
                <a href="#top" className="text-sm text-white/70 transition-colors hover:text-orange-300">
                  Check availability
                </a>
              </li>
            </ul>
          </nav>

          {/* Learn */}
          <nav aria-label="Learn">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.1em] text-white">
              Learn
            </h2>
            <ul className="mt-4 space-y-2.5">
              {LEARN.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-white/70 transition-colors hover:text-orange-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.1em] text-white">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <span className="block text-white/50">Order line</span>
                <CallLink className="font-semibold text-white hover:text-orange-300">
                  {site.phoneDisplay}
                </CallLink>
              </li>
              <li>
                <span className="block text-white/50">Hours</span>
                {site.hours}
              </li>
              <li>
                <span className="block text-white/50">Email</span>
                <a href={`mailto:${site.email}`} className="hover:text-orange-300">
                  {site.email}
                </a>
              </li>
              <li>
                <span className="block text-white/50">Entity</span>
                {site.entityLegalName}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal surface */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-4 py-10 sm:px-6">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL.map((l) => (
              <a key={l.href} href={l.href} className="text-xs text-white/60 underline-offset-4 transition-colors hover:text-orange-300 hover:underline">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 space-y-3 text-xs leading-relaxed text-white/55">
            <p>
              <strong className="text-white/80">Authorized Retailer Disclosure.</strong>{' '}
              {site.entityLegalName} is an independent authorized {site.agreementNounLower} of{' '}
              {site.carrier} services. {site.entityLegalName} is not {site.carrier}, LLC and does
              not own the {site.carrier} trademarks. Service is provided by {site.carrier} under
              its own subscriber agreement, and all orders are subject to {site.carrier}&rsquo;s
              terms, pricing and availability at the service address.
            </p>
            <p>
              <strong className="text-white/80">Trademarks.</strong>{' '}
              {trademarks.join(' ')}
            </p>
            <p>
              <strong className="text-white/80">Offer details.</strong> Prices, speeds, data
              allowances and availability vary by address and are subject to change without
              notice. Advertised speeds are maximum available rates and are not guaranteed; actual
              performance depends on the plan, equipment and network conditions. Taxes, fees and
              equipment charges may apply. Fiber and Satellite plans may require a minimum term
              agreement.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <span>
              &copy; {year} {site.entityLegalName}. All rights reserved.
            </span>
            <span>
              Authorized {site.carrier}&reg; {site.agreementNoun}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
