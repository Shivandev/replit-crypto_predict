import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import PredictionCard from "./PredictionCard";
import { type Cryptocurrency, type Prediction } from "@shared/schema";

export default function AIPredictions() {
  // Fetch cryptocurrencies
  const { data: cryptocurrencies, isLoading: isLoadingCryptos } = useQuery<Cryptocurrency[]>({
    queryKey: ["/api/cryptocurrencies"],
  });
  
  // Get predictions for each cryptocurrency
  const { data: bitcoinPredictions } = useQuery<Prediction[]>({
    queryKey: ["/api/predictions/cryptocurrency/1"],
    enabled: !!cryptocurrencies,
  });
  
  const { data: ethereumPredictions } = useQuery<Prediction[]>({
    queryKey: ["/api/predictions/cryptocurrency/2"],
    enabled: !!cryptocurrencies,
  });
  
  const { data: solanaPredictions } = useQuery<Prediction[]>({
    queryKey: ["/api/predictions/cryptocurrency/3"],
    enabled: !!cryptocurrencies,
  });
  
  // Create prediction data with cryptocurrency info
  const createPredictionData = (crypto?: Cryptocurrency, prediction?: Prediction) => {
    if (!crypto || !prediction) return null;
    
    return {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      iconType: crypto.symbol.toLowerCase(),
      currentPrice: crypto.currentPrice || 0,
      priceChangePercentage: crypto.priceChangePercentage24h || 0,
      predictedPrice: prediction.predictedPrice,
      timeframe: prediction.timeframe,
      confidence: prediction.confidence,
      accuracy: prediction.accuracy || 0
    };
  };

  // Get predictions with crypto data
  const btcPrediction = createPredictionData(
    cryptocurrencies?.find(c => c.symbol === "BTC"),
    bitcoinPredictions?.[0]
  );
  
  const ethPrediction = createPredictionData(
    cryptocurrencies?.find(c => c.symbol === "ETH"),
    ethereumPredictions?.[0]
  );
  
  const solPrediction = createPredictionData(
    cryptocurrencies?.find(c => c.symbol === "SOL"),
    solanaPredictions?.[0]
  );
  
  const predictions = [btcPrediction, ethPrediction, solPrediction].filter(Boolean);
  
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-6">AI Price Predictions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoadingCryptos ? (
          // Loading skeleton
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-pulse">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full mr-3 h-10 w-10"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : predictions.length > 0 ? (
          predictions.map(prediction => (
            <PredictionCard 
              key={prediction?.id}
              cryptocurrency={prediction?.name || ""}
              symbol={prediction?.symbol || ""}
              iconType={prediction?.iconType || ""}
              currentPrice={prediction?.currentPrice || 0}
              priceChangePercentage={prediction?.priceChangePercentage || 0}
              predictedPrice={prediction?.predictedPrice || 0}
              timeframe={prediction?.timeframe || "7d"}
              confidence={prediction?.confidence || 0}
              accuracy={prediction?.accuracy || 0}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-4">No prediction data available</div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <Link href="/predictions">
          <a className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-sm flex items-center mx-auto">
            <i className="fas fa-robot mr-2"></i>
            View All AI Predictions
          </a>
        </Link>
      </div>
    </section>
  );
}
