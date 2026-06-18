import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import CareTypes from "@/components/CareTypes";
import FamiliesSection from "@/components/FamiliesSection";
import ProfessionalsSection from "@/components/ProfessionalsSection";
import SafetySection from "@/components/SafetySection";
import IncludedInValue from "@/components/IncludedInValue";
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
        <IncludedInValue />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
