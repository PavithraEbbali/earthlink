import { FAQS } from '@/lib/content';
import { cta, site } from '@/lib/site';
import Reveal from './Reveal';
import { CallButton, SectionHeading } from './ui';

/**
 * FAQ is the last content section on the page — nothing follows it but the
 * footer. Answers are always present in the DOM rather than injected on open,
 * so crawlers and answer engines read the same text a visitor does, and each
 * answer opens with the direct answer to the question asked.
 */
export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-28 border-t border-surface-line bg-surface-soft py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Questions" heading="Good to know before you call" />
        </Reveal>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-surface-line overflow-hidden rounded-2xl border border-surface-line bg-white">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink marker:hidden hover:bg-surface-soft sm:px-6 sm:py-5">
                <span>{f.q}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-orange-500 transition-transform duration-200 group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-charcoal sm:px-6 sm:pb-6">
                {f.a}
              </div>
            </details>
          ))}
        </div>

        {/* Closing call card lives inside the FAQ section. */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center sm:p-7">
          <p className="font-display text-lg font-extrabold text-ink">Still deciding?</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-charcoal">
            An agent can confirm which EarthLink services reach your address and what each costs
            there, with nothing placed on order.
          </p>
          <div className="mt-5 flex flex-col items-center gap-2">
            <CallButton label={cta.order} size="lg" />
            <p className="text-xs text-charcoal-light">Agents available {site.hours}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
