import React from "react";
import HeroSection from "../components/home/HeroSection";
import TrustBar from "../components/home/TrustBar";
import HowItWorks from "../components/home/HowItWorks";
import RolePaths from "../components/home/RolePaths";
import FeatureCards from "../components/home/FeatureCards";
import WhyTalentTurbo from "../components/home/WhyTalentTurbo";
import Testimonials from "../components/home/Testimonials";
import FAQSection from "../components/home/FAQSection";
import FinalCTA from "../components/home/FinalCTA";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <RolePaths />
      <FeatureCards />
      <WhyTalentTurbo />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}