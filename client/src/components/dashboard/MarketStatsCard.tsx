import { formatCurrency, formatPercentage, formatCompactNumber } from "@/lib/utils";
import MiniChart from "./MiniChart";

interface MarketStatsCardProps {
  title: string;
  value: number;
  change: number;
  format: "currency" | "percentage" | "index";
  chartColor: "green" | "red" | "orange" | "gradient";
  label?: string;
}

export default function MarketStatsCard({
  title,
  value,
  change,
  format,
  chartColor,
  label
}: MarketStatsCardProps) {
  const formatValue = () => {
    if (format === "currency") {
      return formatCompactNumber(value);
    } else if (format === "percentage") {
      return `${value.toFixed(1)}%`;
    } else if (format === "index") {
      return `${value} - ${label}`;
    }
    return value.toString();
  };

  const formattedValue = formatValue();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-mono font-semibold">{formattedValue}</p>
        </div>
        <div className={`flex items-center ${change >= 0 ? "text-secondary" : "text-negative"}`}>
          <i className={`fas fa-caret-${change >= 0 ? "up" : "down"} mr-1`}></i>
          <span>
            {format === "index" ? Math.abs(change) : formatPercentage(change)}
          </span>
        </div>
      </div>
      
      {/* Mini Chart */}
      <div className={`mt-2 h-10 w-full rounded overflow-hidden`}>
        <MiniChart
          type={chartColor}
          change={change}
        />
      </div>
    </div>
  );
}
