import { priceSrLabel } from '@/lib/content';

interface Props {
  price: number;
  cents?: string;
  qualifier?: string;
  stepUp?: string;
  /** Visual scale. 'hero' is the page's dominant figure. */
  size?: 'hero' | 'card';
}

/**
 * The single price component used everywhere a rate appears.
 *
 * Anatomy (per spec): $ symbol, dominant integer, cents and /mo all share one
 * flex baseline — no superscripts, no vertical-align, no margin hacks. The
 * visual row is hidden from assistive tech and paired with a generated sr-only
 * string built from the same price object, so the two can never diverge.
 */
export default function PriceLockup({ price, cents, qualifier, stepUp, size = 'card' }: Props) {
  const intSize = size === 'hero' ? 'text-[3.25rem] leading-none' : 'text-[2.75rem] leading-none';

  return (
    <div className="mt-1">
      <p
        aria-hidden="true"
        className="m-0 flex items-baseline gap-[0.08em] tabular-nums text-ink"
      >
        <span className="text-[1.4rem] font-bold">$</span>
        <span className={`${intSize} font-extrabold tracking-[-0.02em]`}>{price}</span>
        {cents && <span className="text-[1.5rem] font-bold">{cents}</span>}
        <span className="ml-[0.15em] text-base font-medium text-charcoal-light">/mo</span>
      </p>

      <p className="sr-only">{priceSrLabel(price, cents)}</p>

      {qualifier && <p className="mt-1.5 text-sm text-charcoal">{qualifier}</p>}
      {stepUp && <p className="mt-0.5 text-xs leading-relaxed text-charcoal-light">{stepUp}</p>}
    </div>
  );
}
