import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptocurrencies, fetchPredictions } from "@/lib/apiClient";
import PredictionCard from "@/components/dashboard/PredictionCard";
import PriceChart from "@/components/dashboard/PriceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AIPredictionsPage() {
  // Update the page title
  useEffect(() => {
    document.title = "AI Predictions | Cryptedict";
  }, []);
  
  const [selectedCrypto, setSelectedCrypto] = useState<number>(1); // Default to Bitcoin
  const [timeframe, setTimeframe] = useState<string>("7d"); // Default to 7 days
  
  // Fetch cryptocurrencies
  const { data: cryptocurrencies, isLoading: isLoadingCryptos } = useQuery({
    queryKey: ['/api/cryptocurrencies'],
    queryFn: fetchCryptocurrencies
  });
  
  // Fetch predictions for selected cryptocurrency
  const { data: predictions, isLoading: isLoadingPredictions } = useQuery({
    queryKey: ['/api/predictions/cryptocurrency', selectedCrypto],
    queryFn: () => fetchPredictions(selectedCrypto),
    enabled: !!selectedCrypto
  });
  
  // Get the selected cryptocurrency object
  const selectedCryptocurrency = cryptocurrencies?.find(crypto => crypto.id === selectedCrypto);
  
  // Get prediction for the selected timeframe
  const selectedPrediction = predictions?.find(pred => pred.timeframe === timeframe);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Predictions</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Cryptocurrency</h2>
            
            <div className="mb-6">
              <label htmlFor="crypto-select" className="block text-sm font-medium mb-2">
                Cryptocurrency
              </label>
              <Select 
                onValueChange={(value) => setSelectedCrypto(Number(value))}
                defaultValue={selectedCrypto.toString()}
              >
                <SelectTrigger id="crypto-select" className="w-full">
                  <SelectValue placeholder="Select Cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {!isLoadingCryptos && cryptocurrencies?.map((crypto) => (
                    <SelectItem key={crypto.id} value={crypto.id.toString()}>
                      {crypto.name} ({crypto.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Prediction Timeframe
              </label>
              <Tabs defaultValue={timeframe} onValueChange={setTimeframe} className="w-full">
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="24h">24h</TabsTrigger>
                  <TabsTrigger value="7d">7d</TabsTrigger>
                  <TabsTrigger value="30d">30d</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="90d">90d</TabsTrigger>
                  <TabsTrigger value="1y">1y</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {selectedCryptocurrency && selectedPrediction && (
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Prediction Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Our AI model analyzes historical price movements, trading volumes, market sentiment, and on-chain metrics
                  to generate these predictions.
                </p>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Model Confidence</span>
                  <span className="text-sm font-medium">{selectedPrediction.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${selectedPrediction.confidence}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Historical Accuracy</span>
                  <span className="text-sm font-medium">{selectedPrediction.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${selectedPrediction.accuracy}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Price Prediction</h2>
            {selectedCryptocurrency && selectedPrediction ? (
              <PredictionCard
                cryptocurrency={selectedCryptocurrency.name}
                symbol={selectedCryptocurrency.symbol}
                iconType={selectedCryptocurrency.symbol.toLowerCase()}
                currentPrice={selectedCryptocurrency.currentPrice}
                priceChangePercentage={selectedCryptocurrency.priceChangePercentage24h}
                predictedPrice={selectedPrediction.predictedPrice}
                timeframe={selectedPrediction.timeframe}
                confidence={selectedPrediction.confidence}
                accuracy={selectedPrediction.accuracy}
              />
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Loading prediction data...</p>
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
            <PriceChart 
              cryptocurrency={selectedCryptocurrency} 
              timeframe={timeframe} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Prediction Methodology</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Cryptedict's AI predictions are generated using advanced machine learning models trained on historical cryptocurrency data.
            Our system analyzes multiple factors including:
          </p>
          <ul>
            <li><strong>Historical Price Data:</strong> Patterns and trends in past price movements</li>
            <li><strong>Market Sentiment:</strong> Analysis of social media and news coverage</li>
            <li><strong>Trading Volume:</strong> Changes in trading activity and liquidity</li>
            <li><strong>On-chain Metrics:</strong> Network activity, transaction volumes, and wallet distributions</li>
            <li><strong>Market Correlations:</strong> Relationships between different cryptocurrencies and traditional markets</li>
          </ul>
          <p>
            While our AI models strive for accuracy, cryptocurrency markets are highly volatile and unpredictable.
            These predictions should be used as one of many tools in your investment research, not as financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
