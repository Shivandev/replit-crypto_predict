import { useEffect } from "react";
import MarketOverview from "@/components/dashboard/MarketOverview";
import AIPredictions from "@/components/dashboard/AIPredictions";
import Portfolio from "@/components/dashboard/Portfolio";
import CommunityInsights from "@/components/dashboard/CommunityInsights";

export default function Dashboard() {
  // Update the page title
  useEffect(() => {
    document.title = "Dashboard | Cryptedict";
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MarketOverview />
      <AIPredictions />
      <Portfolio />
      <CommunityInsights />
    </div>
  );
}
