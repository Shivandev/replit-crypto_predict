import axios from 'axios';
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import {
  users, type User, type InsertUser,
  cryptocurrencies, type Cryptocurrency, type InsertCryptocurrency,
  predictions, type Prediction, type InsertPrediction,
  portfolios, type Portfolio, type InsertPortfolio,
  discussions, type Discussion, type InsertDiscussion,
  resources, type Resource, type InsertResource,
  marketStats, type MarketStats, type InsertMarketStats
} from "@shared/schema";

interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCryptocurrency(id: number): Promise<Cryptocurrency | undefined>;
  getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined>;
  getAllCryptocurrencies(): Promise<Cryptocurrency[]>;
  createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency>;
  updateCryptocurrency(id: number, crypto: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  getPredictionsByCryptocurrency(cryptocurrencyId: number): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPortfolioByUser(userId: number): Promise<Portfolio[]>;
  addToPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<boolean>;
  getDiscussion(id: number): Promise<Discussion | undefined>;
  getAllDiscussions(): Promise<Discussion[]>;
  getHotDiscussions(): Promise<Discussion[]>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  getResource(id: number): Promise<Resource | undefined>;
  getAllResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  getLatestMarketStats(): Promise<MarketStats | undefined>;
  createMarketStats(stats: InsertMarketStats): Promise<MarketStats>;
}

class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getCryptocurrency(id: number): Promise<Cryptocurrency | undefined> {
    const [crypto] = await db.select().from(cryptocurrencies).where(eq(cryptocurrencies.id, id));
    return crypto;
  }

  async getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined> {
    const [crypto] = await db.select().from(cryptocurrencies).where(eq(cryptocurrencies.symbol, symbol));
    return crypto;
  }

  async getAllCryptocurrencies(): Promise<Cryptocurrency[]> {
    return db.select().from(cryptocurrencies).orderBy(sql`${cryptocurrencies.updatedAt} DESC`);
  }

  async createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency> {
    const [newCrypto] = await db.insert(cryptocurrencies).values(crypto).returning();
    return newCrypto;
  }

  async updateCryptocurrency(id: number, crypto: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined> {
    const [updatedCrypto] = await db
      .update(cryptocurrencies)
      .set({ ...crypto, updatedAt: new Date() })
      .where(eq(cryptocurrencies.id, id))
      .returning();
    return updatedCrypto;
  }

  async getPrediction(id: number): Promise<Prediction | undefined> {
    const [prediction] = await db.select().from(predictions).where(eq(predictions.id, id));
    return prediction;
  }

  async getPredictionsByCryptocurrency(cryptocurrencyId: number): Promise<Prediction[]> {
    return db.select().from(predictions).where(eq(predictions.cryptocurrencyId, cryptocurrencyId));
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const [newPrediction] = await db.insert(predictions).values(prediction).returning();
    return newPrediction;
  }

  async getPortfolioByUser(userId: number): Promise<Portfolio[]> {
    return db.select().from(portfolios).where(eq(portfolios.userId, userId));
  }

  async addToPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const [newPortfolio] = await db.insert(portfolios).values(portfolio).returning();
    return newPortfolio;
  }

  async updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const [updatedPortfolio] = await db
      .update(portfolios)
      .set(portfolio)
      .where(eq(portfolios.id, id))
      .returning();
    return updatedPortfolio;
  }

  async deletePortfolio(id: number): Promise<boolean> {
    await db.delete(portfolios).where(eq(portfolios.id, id));
    return true;
  }

  async getDiscussion(id: number): Promise<Discussion | undefined> {
    const [discussion] = await db.select().from(discussions).where(eq(discussions.id, id));
    return discussion;
  }

  async getAllDiscussions(): Promise<Discussion[]> {
    return db.select().from(discussions);
  }

  async getHotDiscussions(): Promise<Discussion[]> {
    return db.select().from(discussions).where(eq(discussions.isHot, true));
  }

  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const [newDiscussion] = await db.insert(discussions).values(discussion).returning();
    return newDiscussion;
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async getLatestMarketStats(): Promise<MarketStats | undefined> {
    const [stats] = await db
      .select()
      .from(marketStats)
      .orderBy(sql`${marketStats.timestamp} DESC`)
      .limit(1);
    return stats;
  }

  async createMarketStats(stats: InsertMarketStats): Promise<MarketStats> {
    const [newStats] = await db.insert(marketStats).values(stats).returning();
    return newStats;
  }
}

async function initializeDatabase() {
  const existingCryptos = await db.select().from(cryptocurrencies);
  if (existingCryptos.length > 0) {
    console.log("Database already contains data, skipping initialization");
    return;
  }

  console.log("Initializing database with real-time data...");
  const storage = new DatabaseStorage();

  // Updated cryptocurrency prices (as per the new values)
  const btc: InsertCryptocurrency = {
    symbol: "BTC",
    name: "Bitcoin",
    currentPrice: 84481.91, // Real-time Bitcoin price
    marketCap: 856945000000, // Market cap can remain static or can be fetched from the API if needed
    volume24h: 48700000000, // 24-hour volume (you can update it dynamically)
    priceChange24h: -589.45, // Real-time 24h price change
    priceChangePercentage24h: -0.69, // Real-time 24h price change percentage
    logoUrl: "bitcoin.svg"
  };

  const eth: InsertCryptocurrency = {
    symbol: "ETH",
    name: "Ethereum",
    currentPrice: 1580, // Updated Ethereum price
    marketCap: 282240000000,
    volume24h: 18500000000,
    priceChange24h: 86.16,
    priceChangePercentage24h: 3.8,
    logoUrl: "ethereum.svg"
  };

  const sol: InsertCryptocurrency = {
    symbol: "SOL",
    name: "Solana",
    currentPrice: 136.44, // Updated Solana price
    marketCap: 42840000000,
    volume24h: 3250000000,
    priceChange24h: -1.18,
    priceChangePercentage24h: -1.2,
    logoUrl: "solana.svg"
  };

  // Insert cryptocurrencies into the storage
  const btcCrypto = await storage.createCryptocurrency(btc);
  const ethCrypto = await storage.createCryptocurrency(eth);
  const solCrypto = await storage.createCryptocurrency(sol);

  // Sample predictions
  await storage.createPrediction({
    cryptocurrencyId: btcCrypto.id,
    predictedPrice: 46023.15,
    timeframe: "7d",
    confidence: 78,
    accuracy: 92,
    predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  await storage.createPrediction({
    cryptocurrencyId: ethCrypto.id,
    predictedPrice: 2439.25,
    timeframe: "7d",
    confidence: 82,
    accuracy: 88,
    predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  await storage.createPrediction({
    cryptocurrencyId: solCrypto.id,
    predictedPrice: 136.18,
    timeframe: "7d",
    confidence: 65,
    accuracy: 76,
    predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  const user = await storage.createUser({
    username: "AHKEL",
    password: "hashed_password",
    email: "shivan@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
    plan: "VIP Member"
  });

  await storage.createMarketStats({
    totalMarketCap: btc.marketCap + eth.marketCap + sol.marketCap,
    totalVolume24h: btc.volume24h + eth.volume24h + sol.volume24h,
    btcDominance: (btc.marketCap / (btc.marketCap + eth.marketCap + sol.marketCap)) * 100,
    fearGreedIndex: 65,
    fearGreedLabel: "Greed",
    marketCapChange24h: 2.4,
    volumeChange24h: -1.2,
    btcDominanceChange24h: 0.3,
    fearGreedIndexChange24h: 5
  });

  console.log("Database initialization complete!");
}

export const storage = new DatabaseStorage();
initializeDatabase().catch(err => {
  console.error("Error initializing database:", err);
});
