import { ADDONS, COMPARISON, HOW_IMAGE, HOW_IT_WORKS, SERVICE_SECTIONS, WHY_US } from '@/lib/content';
import { cta, site } from '@/lib/site';
import Reveal from './Reveal';
import { CallButton, CheckIcon, Picture, SectionHeading } from './ui';

/* -------------------------------------------------------------------------- */
/*  Comparison grid                                                            */
/* -------------------------------------------------------------------------- */

export function Comparison() {
  const lines = SERVICE_SECTIONS;

  return (
    <section id="compare" className="scroll-mt-28 border-t border-surface-line bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Side by side"
            heading="Fiber, 5G Home and Satellite compared"
            intro="The connection type available at a given address is determined by the infrastructure built to it. The table below sets out how the three differ in speed, data allowance, contract terms and installation."
          />
        </Reveal>

        <Reveal delay={60}>
          {/* Table scrolls on its own; the page body never scrolls sideways. */}
          <div className="mt-10 overflow-x-auto rounded-2xl border border-surface-line">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparison of EarthLink Fiber, Wireless 5G Home Internet and Satellite
              </caption>
              <thead>
                <tr className="bg-surface-soft">
                  <th scope="col" className="px-5 py-4 font-semibold text-charcoal">
                    &nbsp;
                  </th>
                  {lines.map((l) => (
                    <th key={l.id} scope="col" className="px-5 py-4 font-display text-base font-extrabold text-ink">
                      {l.eyebrow}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="border-t border-surface-line">
                    <th scope="row" className="bg-surface-soft/60 px-5 py-4 font-semibold text-charcoal">
                      {row.label}
                    </th>
                    {lines.map((l) => (
                      <td key={l.id} className="px-5 py-4 text-charcoal">
                        {row.values[l.serviceLine]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="mx-auto mt-6 max-w-4xl text-xs leading-relaxed text-charcoal-light">
          Speeds shown are maximum available rates and are not guaranteed; actual performance
          depends on the plan, the equipment and conditions at the address. Availability, pricing
          and speed tiers vary by service address and are confirmed by phone before an order is
          placed. Taxes, fees and equipment charges may apply.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Add-ons                                                                    */
/* -------------------------------------------------------------------------- */

export function AddOns() {
  return (
    <section id="addons" className="scroll-mt-28 border-t border-surface-line bg-surface-soft py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Add-ons"
            heading="Services that can be added to a plan"
            intro="EarthLink offers these alongside its internet plans. They can be added when the order is placed."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADDONS.map((a, i) => (
            <Reveal key={a.id} delay={i * 70}>
              <article className="h-full rounded-2xl border border-surface-line bg-white p-6 shadow-card">
                <h3 className="font-display text-lg font-extrabold text-ink">{a.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-charcoal">{a.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-9 text-center">
          <CallButton label="Ask about add-ons when you call" />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Why order here                                                             */
/* -------------------------------------------------------------------------- */

export function WhyUs() {
  return (
    <section id="why" className="scroll-mt-28 border-t border-surface-line bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Ordering through us"
            heading="Ordering through an authorized retailer"
            intro="EarthLink provides and supports the service under its own subscriber agreement. This order line operates independently of EarthLink and submits new residential orders on your behalf."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {WHY_US.map((w, i) => (
            <Reveal key={w.title} delay={i * 70}>
              <article className="h-full rounded-2xl border border-surface-line bg-surface-soft p-6 sm:p-7">
                <h3 className="font-display text-lg font-extrabold text-ink">{w.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-charcoal">{w.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  How it works                                                               */
/* -------------------------------------------------------------------------- */

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-28 bg-navy-900 py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            heading="Three steps to getting connected"
            tone="dark"
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <Reveal>
            <Picture
              image={HOW_IMAGE}
              className="block overflow-hidden rounded-2xl"
              imgClassName="h-auto w-full"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </Reveal>

          <ol className="space-y-4">
            {HOW_IT_WORKS.map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <li className="flex list-none gap-4 rounded-2xl border border-white/12 bg-white/[0.05] p-5 sm:p-6">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 font-display text-lg font-extrabold text-white">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-white">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                      {s.body.replace('{{PHONE}}', site.phoneDisplay).replace('{{HOURS}}', site.hours)}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <CallButton label={cta.order} size="lg" />
          <p className="text-sm text-white/60">Agents available {site.hours}</p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trust strip                                                                */
/* -------------------------------------------------------------------------- */

export function TrustStrip() {
  const items = [
    'Unlimited data on Fiber and 5G Home',
    'No credit check on Fiber and 5G Home',
    'No annual contract on 5G Home',
    'Price-lock guarantee on Fiber',
  ];

  return (
    <section className="border-b border-surface-line bg-white py-6">
      <ul className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 sm:px-6">
        {items.map((t) => (
          <li key={t} className="inline-flex items-center gap-2 text-sm font-medium text-charcoal">
            <span className="text-orange-500">
              <CheckIcon />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
