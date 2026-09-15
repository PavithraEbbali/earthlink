import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { FAQS, SERVICE_SECTIONS } from '@/lib/content';
import { site } from '@/lib/site';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.carrier}® Fiber, 5G Home & Satellite Internet Plans | Independent Authorized ${site.agreementNoun}`,
  description: `Order ${site.carrier} Fiber, Wireless 5G Home Internet and Satellite through an independent authorized ${site.agreementNounLower}. Fiber from $24.95/mo intro, 5G Home from $59.95/mo, Satellite from $49.95/mo. Call ${site.phoneDisplay}.`,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.entityLegalName,
    title: `${site.carrier}® Internet Plans | Independent Authorized ${site.agreementNoun}`,
    description: `Fiber, Wireless 5G Home Internet and Satellite from ${site.carrier}, ordered through an independent authorized ${site.agreementNounLower}.`,
    images: ['/assets/img/og-card.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.carrier}® Internet Plans | Independent Authorized ${site.agreementNoun}`,
    description: `Fiber, Wireless 5G Home Internet and Satellite, ordered by phone.`,
    images: ['/assets/img/og-card.jpg'],
  },
  icons: { icon: '/assets/img/favicon.svg' },
  manifest: '/site.webmanifest',
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: '#0f151d' };

/**
 * Structured data.
 *
 * Organization is the OPERATING ENTITY, never the carrier — the carrier appears
 * only as `brand`. There is no LocalBusiness node: this is a phone order line
 * with no premises, and asserting one would be fabricated. Offers carry only the
 * "starting at" rates EarthLink actually publishes.
 */
function JsonLd() {
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.entityLegalName,
      legalName: site.entityLegalName,
      url: site.url,
      email: site.email,
      telephone: site.phoneE164,
      disambiguatingDescription: `Independent authorized ${site.agreementNounLower} of ${site.carrier} services`,
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: `${site.entityLegalName} — Authorized ${site.carrier} ${site.agreementNoun}`,
      publisher: { '@id': `${site.url}/#organization` },
      inLanguage: 'en-US',
    },
    ...SERVICE_SECTIONS.map((s) => ({
      '@type': 'Service',
      '@id': `${site.url}/#${s.id}`,
      name: s.heading,
      serviceType: s.eyebrow,
      brand: { '@type': 'Brand', name: site.carrier },
      provider: { '@id': `${site.url}/#organization` },
      areaServed: { '@type': 'Country', name: 'United States' },
      ...(typeof s.startingAt === 'number'
        ? {
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              lowPrice: Number(`${s.startingAt}${s.startingAtCents ?? ''}`),
              availability: 'https://schema.org/InStock',
            },
          }
        : {}),
    })),
    {
      '@type': 'FAQPage',
      '@id': `${site.url}/#faq`,
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}

/**
 * Consent + call-conversion tracking.
 *
 * US-only posture: granted by default, with Global Privacy Control honoured
 * automatically and a stored opt-out respected. The conversion event fires on
 * every [data-call-cta] anchor, which is every tel: link on the site.
 * Emits nothing at all until a real tag ID is configured in site.ts.
 */
function Analytics() {
  if (!site.gtagId) return null;

  const boot = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
var optedOut=navigator.globalPrivacyControl===true;
try{optedOut=optedOut||localStorage.getItem('cpra_optout')==='1';}catch(e){}
var s=optedOut?'denied':'granted';
gtag('consent','default',{ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s});
gtag('js',new Date());gtag('config','${site.gtagId}');
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[data-call-cta]');
  if(a)gtag('event','conversion',{send_to:'${site.gtagId}/${site.callConversionLabel}'});
});`;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.gtagId}`} />
      <script dangerouslySetInnerHTML={{ __html: boot }} />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        {/* Marks JS as available before paint, so reveal states never flash without it. */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js');` }}
        />
        <JsonLd />
        <Analytics />
      </head>
      <body>{children}</body>
    </html>
  );
}
