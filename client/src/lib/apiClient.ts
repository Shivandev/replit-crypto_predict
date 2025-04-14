import { apiRequest } from "./queryClient";

interface ApiOptions {
  method?: string;
  data?: unknown;
}

export async function api<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", data } = options;
  
  const res = await apiRequest(method, url, data);
  return res.json();
}

// Cryptocurrency API
export async function fetchCryptocurrencies() {
  return api<any[]>("/api/cryptocurrencies");
}

export async function fetchCryptocurrency(id: number) {
  return api<any>(`/api/cryptocurrencies/${id}`);
}

// Predictions API
export async function fetchPredictions(cryptocurrencyId: number) {
  return api<any[]>(`/api/predictions/cryptocurrency/${cryptocurrencyId}`);
}

// Market Stats API
export async function fetchMarketStats() {
  return api<any>("/api/market-stats");
}

// Portfolio API
export async function fetchUserPortfolio(userId: number) {
  return api<any[]>(`/api/portfolios/user/${userId}`);
}

// Discussions API
export async function fetchDiscussions() {
  return api<any[]>("/api/discussions");
}

export async function fetchHotDiscussions() {
  return api<any[]>("/api/discussions/hot");
}

// Resources API
export async function fetchResources() {
  return api<any[]>("/api/resources");
}
