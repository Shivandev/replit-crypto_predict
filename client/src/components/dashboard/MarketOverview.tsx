import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MarketStatsCard from "./MarketStatsCard";
import PriceChart from "./PriceChart";
import { type MarketStats, type Cryptocurrency } from "@shared/schema";

const timeframeOptions = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
  { label: "ALL", value: "all" }
];

export default function MarketOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1d");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");

  // Fetch market stats
  const { data: marketStats, isLoading: isLoadingStats } = useQuery<MarketStats>({
    queryKey: ["/api/market-stats"],
  });

  // Fetch cryptocurrencies
  const { data: cryptocurrencies, isLoading: isLoadingCryptos } = useQuery<Cryptocurrency[]>({
    queryKey: ["/api/cryptocurrencies"],
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  });

  // Get the selected cryptocurrency
  const selectedCryptocurrency = cryptocurrencies?.find(crypto => crypto.symbol === selectedCrypto);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Market Overview</h2>
        <div className="flex space-x-2">
          {timeframeOptions.map(option => (
            <button
              key={option.value}
              className={`${
                selectedTimeframe === option.value
                  ? "bg-primary text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              } px-3 py-1 rounded-md text-sm font-medium`}
              onClick={() => setSelectedTimeframe(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Market Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {isLoadingStats ? (
          // Loading skeleton
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2"></div>
            </div>
          ))
        ) : marketStats ? (
          <>
            <MarketStatsCard
              title="Total Market Cap"
              value={marketStats.totalMarketCap}
              change={marketStats.marketCapChange24h}
              format="currency"
              chartColor="green"
            />
            <MarketStatsCard
              title="24h Volume"
              value={marketStats.totalVolume24h}
              change={marketStats.volumeChange24h}
              format="currency"
              chartColor="red"
            />
            <MarketStatsCard
              title="BTC Dominance"
              value={marketStats.btcDominance}
              change={marketStats.btcDominanceChange24h}
              format="percentage"
              chartColor="orange"
            />
            <MarketStatsCard
              title="Fear & Greed Index"
              value={marketStats.fearGreedIndex ?? 0}
              label={marketStats.fearGreedLabel ?? ''}
              change={marketStats.fearGreedIndexChange24h ?? 0}
              format="index"
              chartColor="gradient"
            />
          </>
        ) : (
          <div className="col-span-4 text-center py-4">Failed to load market stats</div>
        )}
      </div>

      {/* Main Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <select
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
              >
                {isLoadingCryptos ? (
                  <option>Loading...</option>
                ) : cryptocurrencies ? (
                  cryptocurrencies.map(crypto => (
                    <option key={crypto.id} value={crypto.symbol}>
                      {crypto.name} ({crypto.symbol})
                    </option>
                  ))
                ) : (
                  <option>Failed to load cryptocurrencies</option>
                )}
              </select>
            </div>

            {selectedCryptocurrency && (
              <div className="flex items-center">
                <span className="text-2xl font-mono font-bold">
                  ${selectedCryptocurrency.currentPrice?.toLocaleString()}
                </span>
                <div 
                  className={`ml-2 px-2 py-1 ${
                    selectedCryptocurrency.priceChangePercentage24h >= 0
                      ? "bg-secondary bg-opacity-10 text-secondary"
                      : "bg-negative bg-opacity-10 text-negative"
                  } rounded flex items-center`}
                >
                  <i className={`fas fa-caret-${selectedCryptocurrency.priceChangePercentage24h >= 0 ? "up" : "down"} mr-1`}></i>
                  <span>{Math.abs(selectedCryptocurrency.priceChangePercentage24h)}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              Price
            </button>
            <button className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              Volume
            </button>
            <button className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              <i className="fas fa-chart-line mr-1"></i>Indicators
            </button>
          </div>
        </div>

        {/* Price Chart */}
        <PriceChart 
          cryptocurrency={selectedCryptocurrency} 
          timeframe={selectedTimeframe} 
        />
      </div>
    </section>
  );
}