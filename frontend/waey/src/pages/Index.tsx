import HeroSection from "@/components/HeroSection";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    trackEvent("page_view", { page: "home" });
  }, []);

  return (
    <div className="relative">
      <HeroSection />
    </div>
  );
};

export default Index;
