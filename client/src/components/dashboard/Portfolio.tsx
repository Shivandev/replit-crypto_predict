import { useQuery } from "@tanstack/react-query";
import PortfolioSummary from "./PortfolioSummary";
import AssetDistribution from "./AssetDistribution";
import PerformanceCard from "./PerformanceCard";
import { calculatePortfolioDistribution } from "@/lib/utils";
import { type Portfolio } from "@shared/schema";

export default function Portfolio() {
  // Assuming user ID 1 for demo
  const userId = 1;
  
  // Fetch user's portfolio
  const { data: portfolios, isLoading } = useQuery<Portfolio[]>({
    queryKey: [`/api/portfolios/user/${userId}`],
  });
  
  // Calculate distribution data
  const distributionData = calculatePortfolioDistribution(portfolios || []);
  
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-6">Your Portfolio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Portfolio Summary Card */}
            <PortfolioSummary
              totalValue={12458.34}
              changePercentage={4.2}
              portfolioHistory={[]} // This would be populated with actual data
            />
            
            {/* Portfolio Distribution Card */}
            <AssetDistribution
              distributionData={distributionData}
            />
            
            {/* Performance Card */}
            <PerformanceCard
              performanceData={[
                { period: "Today", value: 124.56, percentage: 1.2 },
                { period: "This Week", value: 478.90, percentage: 4.1 },
                { period: "This Month", value: -256.32, percentage: -2.1 },
                { period: "All Time", value: 5782.40, percentage: 87.2 }
              ]}
            />
          </>
        )}
      </div>
    </section>
  );
}
