import type { ServiceSection } from '@/lib/content';
import PlanCard from './PlanCard';
import PriceLockup from './PriceLockup';
import Reveal from './Reveal';
import { Picture, SectionHeading } from './ui';

/**
 * Renders one service line end to end from its data object: heading, the
 * published "starting at" rate, every plan card, and the section fine print.
 * Adding or removing a service line is a data change, not a layout change.
 *
 * A section can present its photograph two ways, set by `imageMode`:
 *   'beside'     — paired with the rate card in a two-column band (default)
 *   'background' — filling the section behind the content
 */
export default function PlanSection({ section }: { section: ServiceSection }) {
  const asBackground = section.imageMode === 'background' && Boolean(section.image);

  const count = section.plans.length;
  const grid =
    count >= 4
      ? 'sm:grid-cols-2 xl:grid-cols-4'
      : count === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : count === 2
          ? 'sm:grid-cols-2'
          : 'max-w-xl mx-auto';

  return (
    <section
      id={section.id}
      className={`relative scroll-mt-28 border-t border-surface-line py-16 sm:py-20 ${
        asBackground ? 'overflow-hidden' : 'bg-surface-soft'
      }`}
    >
      {asBackground && section.image && (
        <>
          <Picture
            image={section.image}
            className="pointer-events-none absolute inset-0 block select-none"
            imgClassName="h-full w-full object-cover"
            sizes="100vw"
          />
          {/*
            This photograph is bright and high-key — a blown-out window on one
            side, pale wood on the other. The section's body copy is dark, so it
            needs a light wash to hold contrast. Without it the heading lands on
            near-white pixels and stops being readable.
          */}
          <div aria-hidden="true" className="absolute inset-0 bg-white/82" />
        </>
      )}

      <div className="relative mx-auto max-w-container px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            intro={section.intro}
          />
        </Reveal>

        {typeof section.startingAt === 'number' && (
          <Reveal delay={60}>
            {/* The published rate is the section's anchor. */}
            <div
              className={
                asBackground
                  ? 'mx-auto mt-10 max-w-lg'
                  : 'mt-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]'
              }
            >
              {!asBackground && section.image && (
                <Picture
                  image={section.image}
                  className="block overflow-hidden rounded-2xl"
                  /* h-auto, never h-full: an img sized from its parent while the
                     parent is sized from the img collapses to zero height. */
                  imgClassName="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 640px"
                />
              )}

              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lift ring-2 ring-orange-500">
                <div
                  aria-hidden="true"
                  className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
                />
                <div className="flex h-full flex-col justify-center px-6 py-8 text-center sm:px-8">
                  <span className="mx-auto inline-flex items-center rounded-full bg-orange-100 px-4 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-orange-800">
                    {section.eyebrow} — starting at
                  </span>
                  <div className="mt-4 flex justify-center">
                    <PriceLockup
                      price={section.startingAt}
                      cents={section.startingAtCents}
                      qualifier={section.startingAtQualifier}
                      stepUp={section.startingAtStepUp}
                      size="hero"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <div className={`mt-10 grid grid-cols-1 gap-6 ${grid}`}>
          {section.plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 70}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-xs leading-relaxed text-charcoal-light">
          {section.disclaimer}
        </p>
      </div>
    </section>
  );
}
