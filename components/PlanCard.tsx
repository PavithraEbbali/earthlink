import { ctaLabel, speedLabel, type PlanItem } from '@/lib/content';
import PriceLockup from './PriceLockup';
import { CallButton, CheckIcon } from './ui';

/**
 * One plan card. Everything it shows comes from the PlanItem object — the card
 * itself holds no plan name, speed, price or feature text.
 */
export default function PlanCard({ plan }: { plan: PlanItem }) {
  const hasPrice = typeof plan.price === 'number';

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-lift sm:p-7 ${
        plan.isPopular ? 'border-orange-400 ring-1 ring-orange-400' : 'border-surface-line'
      }`}
    >
      {plan.isPopular && (
        <span className="absolute -top-3 left-6 rounded-full bg-orange-500 px-3 py-1 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-white">
          Most chosen
        </span>
      )}

      {/* Speed is the card's identifier; price remains the dominant figure where one exists. */}
      <p className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
        {speedLabel(plan)}
      </p>
      <h3 className="mt-1 text-sm font-semibold text-charcoal">{plan.name}</h3>

      {plan.speedUp && (
        <p className="mt-1 text-xs text-charcoal-light">
          Upload and download both up to {speedLabel(plan)}
        </p>
      )}

      <div className="mt-4 min-h-[76px]">
        {hasPrice ? (
          <PriceLockup
            price={plan.price as number}
            cents={plan.cents}
            qualifier={plan.promoQualifier}
          />
        ) : (
          <p className="text-sm leading-relaxed text-charcoal">
            EarthLink sets the rate for this tier by service address.
            <span className="mt-1 block font-semibold text-ink">
              Call for pricing at your address.
            </span>
          </p>
        )}
      </div>

      <ul className="mt-5 flex-1 space-y-2.5 border-t border-surface-line pt-5">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-charcoal">
            <span className="mt-0.5 shrink-0 text-orange-500">
              <CheckIcon />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-1.5 border-t border-surface-line pt-4 text-xs text-charcoal-light">
        {plan.dataPolicy && (
          <div className="flex justify-between gap-3">
            <dt>Data</dt>
            <dd className="text-right font-medium text-charcoal">{plan.dataPolicy}</dd>
          </div>
        )}
        {plan.contractTerm && (
          <div className="flex justify-between gap-3">
            <dt>Contract</dt>
            <dd className="text-right font-medium text-charcoal">{plan.contractTerm}</dd>
          </div>
        )}
        {plan.installation && (
          <div className="flex justify-between gap-3">
            <dt>Installation</dt>
            <dd className="text-right font-medium text-charcoal">{plan.installation}</dd>
          </div>
        )}
      </dl>

      <CallButton label={ctaLabel(plan)} className="mt-6 w-full" />
    </article>
  );
}
