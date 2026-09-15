'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/site';
import { CallLink, Logo, PhoneIcon, RetailerTag } from './ui';

const NAV = [
  { href: '#fiber', label: 'Fiber' },
  { href: '#wireless-5g', label: '5G Home' },
  { href: '#satellite', label: 'Satellite' },
  { href: '#compare', label: 'Compare' },
  { href: '#why', label: 'Why us' },
  { href: '#faq', label: 'FAQ' },
];

/**
 * Persistent, non-dismissable disclosure. Neutral dark ground — never the
 * carrier's brand colour — so it reads as a notice rather than as branding.
 */
export function TopDisclosureBar() {
  return (
    <div className="bg-charcoal-dark text-white">
      <div className="mx-auto flex max-w-container flex-col items-center justify-center gap-x-3 gap-y-0.5 px-4 py-2 text-center text-[0.76rem] leading-snug sm:flex-row sm:px-6 sm:text-[0.8rem]">
        <span>
          Independent Authorized {site.agreementNoun} of {site.carrier}
          <span className="text-white/60"> — not {site.carrier}, LLC.</span>
        </span>
        {/* -my-2 keeps the bar compact while py-2 widens the actual hit area. */}
        <CallLink
          className="-my-2 inline-flex items-center py-2 font-semibold text-orange-300 underline-offset-2 hover:underline"
          ariaLabel={`Call to order — ${site.phoneDisplay}`}
        >
          Call to order: {site.phoneDisplay}
        </CallLink>
      </div>
    </div>
  );
}

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow duration-200 ${
        stuck ? 'border-surface-line shadow-card' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-container items-center gap-4 px-4 py-3 sm:px-6">
        <a
          href="#top"
          className="flex min-h-[44px] shrink-0 items-center"
          aria-label={`${site.carrier} Authorized ${site.agreementNoun} — home`}
        >
          <Logo className="h-auto w-[112px] sm:w-[140px]" />
          <RetailerTag />
        </a>

        <nav aria-label="Primary" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.92rem] font-medium text-charcoal transition-colors duration-150 hover:text-orange-600"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/*
          The call path is never hidden behind the menu button. From 400px up the
          number itself is the button text; on the narrowest phones the button goes
          icon-only so the row still fits, and the number stays visible as text in
          the disclosure bar above and the sticky call bar below.
        */}
        <CallLink
          ariaLabel={`Call to order — ${site.phoneDisplay}`}
          className="ml-auto inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full bg-orange-500 px-3 py-2.5 text-[0.85rem] font-bold text-white transition-colors duration-200 hover:bg-orange-600 min-[400px]:px-4 sm:px-5 sm:text-[0.95rem] lg:ml-6"
        >
          <PhoneIcon />
          <span className="hidden min-[400px]:inline">{site.phoneDisplay}</span>
        </CallLink>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-surface-line text-charcoal lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary mobile"
        hidden={!open}
        className="border-t border-surface-line bg-white lg:hidden"
      >
        <ul className="mx-auto max-w-container px-4 py-2 sm:px-6">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-surface-line py-3 text-[0.95rem] font-medium text-charcoal last:border-0"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
