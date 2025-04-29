import { HeroSection } from "./HeroSection.tsx";
import { FeaturesSection } from "./FeaturesSection.tsx";
import { CTASection } from "./CTASection.tsx";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
