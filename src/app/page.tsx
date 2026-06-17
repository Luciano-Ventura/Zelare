import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import CareTypes from "@/components/CareTypes";
import FamiliesSection from "@/components/FamiliesSection";
import ProfessionalsSection from "@/components/ProfessionalsSection";
import SafetySection from "@/components/SafetySection";
import PricingSection from "@/components/PricingSection";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustSection />
        <HowItWorks />
        <CareTypes />
        <FamiliesSection />
        <ProfessionalsSection />
        <SafetySection />
        <PricingSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
