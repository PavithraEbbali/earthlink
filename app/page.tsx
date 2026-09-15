import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Header, { TopDisclosureBar } from '@/components/Header';
import Hero from '@/components/Hero';
import PlanSection from '@/components/PlanSection';
import { AddOns, Comparison, HowItWorks, TrustStrip, WhyUs } from '@/components/Sections';
import StickyCallBar from '@/components/StickyCallBar';
import { SERVICE_SECTIONS } from '@/lib/content';

/**
 * Page order is fixed:
 *   disclosure → header → hero → service lines → comparison → add-ons
 *   → why → how → FAQ → footer
 *
 * Service lines render straight from SERVICE_SECTIONS, so their order and
 * membership are a data decision. Cable, bundles, TV, mobile and home phone
 * have no section because EarthLink sells none of them to residential
 * customers — there is nothing for the order line to sell.
 *
 * FAQ is the final content section; nothing follows it but the footer.
 */
export default function Page() {
  return (
    <>
      <TopDisclosureBar />
      <Header />

      <main>
        <Hero />
        <TrustStrip />

        {SERVICE_SECTIONS.map((section) => (
          <PlanSection key={section.id} section={section} />
        ))}

        <Comparison />
        <AddOns />
        <WhyUs />
        <HowItWorks />
        <Faq />
      </main>

      <Footer />
      <StickyCallBar />
    </>
  );
}
