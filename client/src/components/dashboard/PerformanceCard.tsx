import { formatCurrency, formatPercentage } from "@/lib/utils";

interface PerformanceItem {
  period: string;
  value: number;
  percentage: number;
}

interface PerformanceCardProps {
  performanceData: PerformanceItem[];
}

export default function PerformanceCard({ performanceData }: PerformanceCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">Performance</h3>
      
      <div className="space-y-4">
        {performanceData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.period}</p>
              <div className={`flex items-center ${item.percentage >= 0 ? "text-secondary" : "text-negative"} text-sm`}>
                <i className={`fas fa-caret-${item.percentage >= 0 ? "up" : "down"} mr-1`}></i>
                <span>
                  {formatCurrency(Math.abs(item.value))} ({Math.abs(item.percentage).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div 
                className={`${item.percentage >= 0 ? "bg-secondary" : "bg-negative"} h-1 rounded-full`} 
                style={{ width: `${Math.min(Math.abs(item.percentage), 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <button className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-sm">
          Manage Portfolio
        </button>
      </div>
    </div>
  );
}
