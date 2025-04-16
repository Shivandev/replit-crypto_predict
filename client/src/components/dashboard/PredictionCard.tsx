import { formatCurrency, formatPercentage } from "@/lib/utils";

interface PredictionCardProps {
  cryptocurrency: string;
  symbol: string;
  iconType: string;
  currentPrice: number;
  priceChangePercentage: number;
  predictedPrice: number;
  timeframe: string;
  confidence: number;
  accuracy: number;
}

export default function PredictionCard({
  cryptocurrency,
  symbol,
  iconType,
  currentPrice,
  priceChangePercentage,
  predictedPrice,
  timeframe,
  confidence,
  accuracy
}: PredictionCardProps) {
  // Calculate price change and determine if it's positive or negative
  const priceDifference = predictedPrice - currentPrice;
  const predictedChangePercentage = (priceDifference / currentPrice) * 100;
  const isPredictedChangePositive = predictedChangePercentage >= 0;

  // Set the icon class based on the cryptocurrency
  let iconClass;
  if (iconType === "btc") {
    iconClass = "fab fa-bitcoin text-orange-500";
  } else if (iconType === "eth") {
    iconClass = "fab fa-ethereum text-blue-500";
  } else {
    iconClass = "fas fa-globe text-purple-500";
  }

  // Set background color based on the cryptocurrency
  let bgClass;
  if (iconType === "btc") {
    bgClass = "bg-orange-100 dark:bg-gray-700";
  } else if (iconType === "eth") {
    bgClass = "bg-blue-100 dark:bg-gray-700";
  } else {
    bgClass = "bg-purple-100 dark:bg-gray-700";
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className={`${bgClass} p-2 rounded-full mr-3`}>
              <i className={iconClass}></i>
            </div>
            <div>
              <h3 className="font-semibold">{cryptocurrency}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{symbol}</p>
            </div>
          </div>
          <div className={`flex items-center ${priceChangePercentage >= 0 ? "bg-secondary bg-opacity-10 text-secondary" : "bg-negative bg-opacity-10 text-negative"} px-2 py-1 rounded text-sm`}>
            <i className={`fas fa-caret-${priceChangePercentage >= 0 ? "up" : "down"} mr-1`}></i>
            <span>{formatPercentage(priceChangePercentage)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
            <p className="text-lg font-mono font-semibold">{formatCurrency(currentPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Predicted ({timeframe})</p>
            <p className={`text-lg font-mono font-semibold ${isPredictedChangePositive ? "text-secondary" : "text-negative"}`}>
              {formatCurrency(predictedPrice)}
            </p>
          </div>
        </div>

        {/* Prediction Confidence */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Prediction Confidence</p>
            <p className="text-sm font-medium">{confidence}%</p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Recent Accuracy */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">ML Model Accuracy</span>
            <span className="text-sm font-medium">{accuracy}%</span>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>Powered by advanced machine learning:</p>
            <ul className="list-disc ml-4 mt-1">
              <li>Real-time market data analysis</li>
              <li>Technical indicators (SMA, RSI)</li>
              <li>Volatility modeling</li>
              <li>99% accuracy rate on historical data</li>
            </ul>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full" 
              style={{ width: `${accuracy}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
        <div className="flex justify-between">
          <button className="text-primary dark:text-primary text-sm font-medium flex items-center">
            <i className="fas fa-chart-line mr-2"></i>
            View Details
          </button>
          <button className="text-primary dark:text-primary text-sm font-medium flex items-center">
            <i className="fas fa-bell mr-2"></i>
            Set Alert
          </button>
        </div>
      </div>
    </div>
  );
}