import HomeHeader from "./HomeHeader";
import HomeHero from "./HomeHero";
import HomeContact, { NewsletterSection } from "./HomeContact";
import { AudienceSection, CategoriesSection, ProcessSection, WhySection } from "./HomeCoreSections";
import { FeesSection, LogisticsSection, RequestSection } from "./HomeOperations";
import { CommunitySection, HomeFooter, SellCta, TrustStrip } from "./HomeCommunity";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef1f5] text-[#0b1830]">
      <HomeHeader />
      <HomeHero />
      <CategoriesSection />
      <ProcessSection />
      <WhySection />
      <AudienceSection />
      <RequestSection />
      <LogisticsSection />
      <FeesSection />
      <SellCta />
      <CommunitySection />
      <NewsletterSection />
      <TrustStrip />
      <HomeContact />
      <HomeFooter />
    </main>
  );
}
