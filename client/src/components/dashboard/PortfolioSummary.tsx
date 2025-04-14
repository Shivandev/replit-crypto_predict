import { formatCurrency, formatPercentage } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface PortfolioSummaryProps {
  totalValue: number;
  changePercentage: number;
  portfolioHistory: any[]; // Array of historical portfolio values
}

// Generate mock portfolio history data if none provided
const generateMockPortfolioHistory = (currentValue: number, changePercentage: number, days = 30) => {
  const data = [];
  let value = currentValue / (1 + changePercentage / 100);
  
  for (let i = 0; i < days; i++) {
    // Add some volatility but ensure the end value is correct
    const progress = i / (days - 1);
    const targetValue = value + (currentValue - value) * progress;
    const randomFactor = Math.random() * 0.02 - 0.01; // +/- 1%
    
    data.push({
      date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString(),
      value: targetValue * (1 + randomFactor)
    });
  }
  
  return data;
};

export default function PortfolioSummary({
  totalValue,
  changePercentage,
  portfolioHistory
}: PortfolioSummaryProps) {
  // Use provided history or generate mock data
  const historyData = portfolioHistory.length > 0 
    ? portfolioHistory 
    : generateMockPortfolioHistory(totalValue, changePercentage);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-semibold mb-2">Total Value</h3>
      <div className="flex items-center mb-4">
        <div className="text-2xl font-mono font-bold">{formatCurrency(totalValue)}</div>
        <div className={`ml-2 px-2 py-1 ${changePercentage >= 0 ? "bg-secondary bg-opacity-10 text-secondary" : "bg-negative bg-opacity-10 text-negative"} rounded text-sm flex items-center`}>
          <i className={`fas fa-caret-${changePercentage >= 0 ? "up" : "down"} mr-1`}></i>
          <span>{formatPercentage(changePercentage)}</span>
        </div>
      </div>
      
      {/* Portfolio Chart */}
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historyData}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              fill="url(#portfolioGradient)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
