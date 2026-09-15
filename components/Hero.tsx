'use client';

import { useState, type FormEvent } from 'react';
import { HERO, HERO_IMAGE, SERVICE_SECTIONS } from '@/lib/content';
import { cta } from '@/lib/site';
import PriceLockup from './PriceLockup';
import { CallButton, CheckIcon, Picture } from './ui';

/**
 * Availability check, front end only.
 *
 * It deliberately returns no verdict. There is no serviceability database
 * behind this site, so claiming a ZIP is covered would be an invented result.
 * What it does instead is real: it captures the ZIP, states what is genuinely
 * true — coverage differs street by street and is confirmed on the call — and
 * routes the visitor to the order line.
 *
 * It sits on a solid white card: with no scrim over the photograph, a
 * translucent panel would leave the label and input competing with whatever
 * happens to be behind them.
 */
function AvailabilityCheck() {
  const [zip, setZip] = useState('');
  const [checked, setChecked] = useState<string | null>(null);
  const [error, setError] = useState('');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = zip.trim();
    if (!/^\d{5}$/.test(clean)) {
      setError('Enter a 5-digit ZIP code.');
      setChecked(null);
      return;
    }
    setError('');
    setChecked(clean);
  }

  return (
    <div className="mt-7 w-full max-w-md rounded-xl bg-white p-4 shadow-lift sm:p-5">
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="zip" className="block text-[0.82rem] font-semibold text-charcoal">
          See which services reach your address
        </label>

        <div className="mt-2.5 flex gap-2">
          <input
            id="zip"
            name="zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="ZIP code"
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/\D/g, ''));
              if (error) setError('');
            }}
            aria-describedby={error ? 'zip-error' : undefined}
            aria-invalid={error ? true : undefined}
            className={`min-h-[48px] w-full flex-1 rounded-lg border bg-white px-4 text-[16px] text-ink placeholder:text-charcoal-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-500 ${
              error ? 'border-orange-600' : 'border-surface-line'
            }`}
          />
          <button
            type="submit"
            className="min-h-[48px] shrink-0 rounded-lg bg-orange-500 px-5 text-[0.92rem] font-bold text-white transition-colors duration-200 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Check
          </button>
        </div>
      </form>

      {error && (
        <p id="zip-error" role="alert" className="mt-2 text-[0.8rem] font-semibold text-orange-800">
          {error}
        </p>
      )}

      {checked && !error && (
        <div className="mt-3 rounded-lg border border-surface-line bg-surface-soft p-3.5">
          <p className="text-[0.85rem] leading-relaxed text-charcoal">
            Coverage in <span className="font-bold text-ink">{checked}</span> varies by street.
            Fiber, Wireless 5G Home and Satellite each reach different addresses within the same
            ZIP — an agent can confirm which are live at yours and what each costs there.
          </p>
          <CallButton label={cta.order} size="sm" className="mt-3 w-full" />
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const fiber = SERVICE_SECTIONS.find((s) => s.serviceLine === 'fiber');

  return (
    <section id="top" className="relative overflow-hidden bg-navy-900">
      {/*
        The photograph runs clean — no scrim, no wash, no gradient over it. It
        is the page's LCP element, so it loads eagerly at high priority while
        every image below the fold stays lazy.
      */}
      <Picture
        image={HERO_IMAGE}
        priority
        className="pointer-events-none absolute inset-0 block select-none"
        imgClassName="h-full w-full object-cover"
        sizes="100vw"
      />

      <div className="relative mx-auto max-w-container px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-rise">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
              {HERO.eyebrow}
            </p>

            {/* Lines are joined with real spaces so textContent never fuses words. */}
            <h1 className="mt-4 font-display text-[2.4rem] font-extrabold leading-[1.08] tracking-[-0.025em] text-white sm:text-5xl lg:text-[3.4rem]">
              {HERO.headlineLines.map((line, i) => (
                <span key={line}>
                  <span className="block">{line}</span>
                  {i < HERO.headlineLines.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>

            {/* Held to the darker left side of the photograph: with no scrim,
                a wider measure runs the line-ends into the lamplit mid-frame. */}
            <p className="mt-5 max-w-md text-base leading-relaxed text-white sm:text-[1.05rem]">
              {HERO.subline}
            </p>

            {/* Sits directly under the paragraph, ahead of the trust chips. */}
            <AvailabilityCheck />

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {HERO.trustChips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy-900/80 px-3.5 py-1.5 text-[0.8rem] font-medium text-white"
                >
                  <span className="text-orange-400">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          {fiber && typeof fiber.startingAt === 'number' && (
            <div className="lg:justify-self-end">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lift sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-orange-800">
                  EarthLink Fiber — starting at
                </p>
                <PriceLockup
                  price={fiber.startingAt}
                  cents={fiber.startingAtCents}
                  qualifier={fiber.startingAtQualifier}
                  stepUp={fiber.startingAtStepUp}
                  size="hero"
                />
                <a
                  href="#fiber"
                  className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-orange-800 underline underline-offset-4 hover:text-orange-900"
                >
                  See all fiber plans
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
