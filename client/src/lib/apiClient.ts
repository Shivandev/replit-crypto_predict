
import axios from 'axios';
import { apiRequest } from "./queryClient";

interface ApiOptions {
  method?: string;
  data?: unknown;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function api<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", data } = options;
  const res = await apiRequest(method, url, data);
  return res.json();
}

async function fetchCoinGeckoPrice(coinId: string) {
  const response = await axios.get(`${COINGECKO_API}/simple/price`, {
    params: {
      ids: coinId,
      vs_currencies: 'usd',
      include_24hr_change: true,
    }
  });
  return response.data;
}

// Cryptocurrency API with real-time data
export async function fetchCryptocurrencies() {
  const btcData = await fetchCoinGeckoPrice('bitcoin');
  const ethData = await fetchCoinGeckoPrice('ethereum');
  const solData = await fetchCoinGeckoPrice('solana');
  
  return [
    {
      id: 1,
      symbol: 'BTC',
      name: 'Bitcoin',
      currentPrice: btcData.bitcoin.usd,
      priceChangePercentage24h: btcData.bitcoin.usd_24h_change
    },
    {
      id: 2,
      symbol: 'ETH',
      name: 'Ethereum',
      currentPrice: ethData.ethereum.usd,
      priceChangePercentage24h: ethData.ethereum.usd_24h_change
    },
    {
      id: 3,
      symbol: 'SOL',
      name: 'Solana',
      currentPrice: solData.solana.usd,
      priceChangePercentage24h: solData.solana.usd_24h_change
    }
  ];
}

export async function fetchCryptocurrency(id: number) {
  const cryptos = await fetchCryptocurrencies();
  return cryptos.find(c => c.id === id);
}

// Predictions API
export async function fetchPredictions(cryptocurrencyId: number) {
  const crypto = await fetchCryptocurrency(cryptocurrencyId);
  if (!crypto) return [];
  
  // Simple prediction logic based on current price and trend
  const timeframes = ['24h', '7d', '30d', '90d', '1y'];
  const volatility = 0.02; // 2% daily volatility assumption
  
  return timeframes.map(timeframe => {
    const days = timeframe === '24h' ? 1 : 
                 timeframe === '7d' ? 7 :
                 timeframe === '30d' ? 30 :
                 timeframe === '90d' ? 90 : 365;
                 
    const trend = crypto.priceChangePercentage24h > 0 ? 1 : -1;
    const predictedChange = trend * Math.sqrt(days) * volatility;
    const predictedPrice = crypto.currentPrice * (1 + predictedChange);
    
    return {
      id: cryptocurrencyId,
      cryptocurrencyId: cryptocurrencyId,
      timeframe: timeframe,
      predictedPrice: predictedPrice,
      confidence: 70 + (30 / days), // Higher confidence for shorter timeframes
      accuracy: 75,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
}

// Keep existing functions
export async function fetchMarketStats() {
  return api<any>("/api/market-stats");
}

export async function fetchUserPortfolio(userId: number) {
  return api<any[]>(`/api/portfolios/user/${userId}`);
}

export async function fetchDiscussions() {
  return api<any[]>("/api/discussions");
}

export async function fetchHotDiscussions() {
  return api<any[]>("/api/discussions/hot");
}

export async function fetchResources() {
  return api<any[]>("/api/resources");
}
