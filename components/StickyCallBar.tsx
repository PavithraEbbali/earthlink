import { cta, site } from '@/lib/site';
import { CallLink, PhoneIcon } from './ui';

/**
 * Always-visible call path on phones. Not scroll-gated: the first in-flow call
 * button sits well below the fold on a narrow viewport, so gating it would
 * leave the top of the page with no reachable CTA.
 */
export default function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-orange-600 bg-orange-500 pb-[env(safe-area-inset-bottom)] md:hidden">
      <CallLink
        ariaLabel={`${cta.order} — ${site.phoneDisplay}`}
        className="flex min-h-[56px] w-full items-center justify-center gap-2.5 px-4 text-[1rem] font-bold text-white"
      >
        <PhoneIcon className="h-5 w-5" />
        {cta.order} · {site.phoneDisplay}
      </CallLink>
    </div>
  );
}
