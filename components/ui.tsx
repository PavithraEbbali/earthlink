import type { ReactNode } from 'react';
import type { ImageAsset } from '@/lib/content';
import { site } from '@/lib/site';

/* -------------------------------------------------------------------------- */
/*  Phone icon                                                                 */
/* -------------------------------------------------------------------------- */

export function PhoneIcon({ className = 'h-[1.05em] w-[1.05em]' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Call links                                                                 */
/*                                                                             */
/*  Every tel: anchor on the site is produced here, so every one of them        */
/*  carries data-call-cta and the E.164 href without exception.                 */
/* -------------------------------------------------------------------------- */

type CallProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function CallLink({ children, className = '', ariaLabel }: CallProps) {
  return (
    <a
      href={`tel:${site.phoneE164}`}
      data-call-cta
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}

/** Solid orange call button. Label is passed in — never the raw number, except in header/footer. */
export function CallButton({
  label,
  className = '',
  size = 'md',
}: {
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizing =
    size === 'lg'
      ? 'px-7 py-4 text-base'
      : size === 'sm'
        ? 'px-4 py-2.5 text-sm'
        : 'px-5 py-3 text-[0.95rem]';

  return (
    <CallLink
      ariaLabel={`${label} — ${site.phoneDisplay}`}
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-orange-500 font-semibold text-white shadow-card transition-colors duration-200 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${sizing} ${className}`}
    >
      <PhoneIcon />
      {label}
    </CallLink>
  );
}

/* -------------------------------------------------------------------------- */
/*  Brand lockup — carried over from the existing build unchanged              */
/* -------------------------------------------------------------------------- */

export function Logo({
  wordmarkColor = '#53555a',
  className = 'h-9 w-auto',
}: {
  wordmarkColor?: string;
  className?: string;
}) {
  return (
    /* viewBox is trimmed to the artwork. The original 232-unit box carried ~64
       units of empty space past the end of the wordmark, which rendered as a
       dead gap before the retailer tag once the logo was given a fixed width. */
    <svg className={className} viewBox="0 0 172 40" role="img" aria-label="EarthLink">
      <g fill="none" stroke="#f58b21" strokeWidth="3.4" strokeLinecap="round">
        <ellipse cx="20" cy="20" rx="17" ry="8.5" transform="rotate(-24 20 20)" />
      </g>
      <circle cx="31.5" cy="12" r="4.4" fill="#f58b21" />
      <text
        x="46"
        y="28"
        fontFamily="Montserrat, sans-serif"
        fontSize="24"
        fontWeight="800"
        letterSpacing="-0.5"
        fill={wordmarkColor}
      >
        EarthLink
      </text>
    </svg>
  );
}

/** The "Authorized / Retailer" tag locked beside the wordmark. */
export function RetailerTag({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <span
      className={`ml-3 hidden border-l pl-3 leading-[1.1] sm:block ${
        tone === 'dark' ? 'border-white/25' : 'border-surface-line'
      }`}
    >
      <b
        className={`block text-[0.75rem] font-bold uppercase tracking-[0.06em] ${
          tone === 'dark' ? 'text-white' : 'text-charcoal'
        }`}
      >
        Authorized
      </b>
      <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-orange-500">
        Retailer
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Images                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Serves WebP with a JPG fallback. Intrinsic width/height are always set so the
 * browser reserves the space before the file arrives and nothing shifts as the
 * page loads.
 *
 * `priority` marks the one image above the fold: it loads eagerly and is
 * decoded synchronously. Everything else is lazy.
 */
export function Picture({
  image,
  className = '',
  imgClassName = '',
  priority = false,
  sizes,
}: {
  image: ImageAsset;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const base = `/assets/img/${image.file}`;

  return (
    <picture className={className}>
      <source srcSet={`${base}.webp`} type="image/webp" sizes={sizes} />
      <img
        src={`${base}.jpg`}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        className={imgClassName}
      />
    </picture>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section scaffolding                                                        */
/* -------------------------------------------------------------------------- */

/**
 * tone:
 *   'light'   — dark text on a plain light section
 *   'dark'    — light text on a dark section
 *   'onImage' — dark text over a photograph. Body copy darkens to full ink and
 *               gains weight, because a photo's local brightness varies far more
 *               than a flat fill and mid-grey stops being legible over the bright
 *               patches even when the average contrast looks acceptable.
 */
export function SectionHeading({
  eyebrow,
  heading,
  intro,
  tone = 'light',
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  tone?: 'light' | 'dark' | 'onImage';
}) {
  const isDark = tone === 'dark';
  return (
    <div className="mx-auto max-w-3xl text-center">
      {/* orange-800, not 600: at 12px this counts as normal text and needs 4.5:1.
          orange-600 manages only 3.10:1 on white and 2.52:1 over the 5G
          photograph. orange-800 clears the threshold in both places. */}
      <p
        className={`text-xs font-bold uppercase tracking-[0.14em] ${
          tone === 'dark' ? 'text-orange-400' : 'text-orange-800'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl ${
          tone === 'dark' ? 'text-white' : 'text-ink'
        }`}
      >
        {heading}
      </h2>
      {intro && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            isDark
              ? 'text-white/75'
              : tone === 'onImage'
                ? 'font-medium text-ink'
                : 'text-charcoal'
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
