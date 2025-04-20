
import {
  users, type User, type InsertUser,
  cryptocurrencies, type Cryptocurrency, type InsertCryptocurrency,
  predictions, type Prediction, type InsertPrediction,
  portfolios, type Portfolio, type InsertPortfolio,
  discussions, type Discussion, type InsertDiscussion,
  resources, type Resource, type InsertResource,
  marketStats, type MarketStats, type InsertMarketStats
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import axios from 'axios';

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Cryptocurrency operations
  getCryptocurrency(id: number): Promise<Cryptocurrency | undefined>;
  getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined>;
  getAllCryptocurrencies(): Promise<Cryptocurrency[]>;
  createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency>;
  updateCryptocurrency(id: number, crypto: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined>;

  // Prediction operations
  getPrediction(id: number): Promise<Prediction | undefined>;
  getPredictionsByCryptocurrency(cryptocurrencyId: number): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;

  // Portfolio operations
  getPortfolioByUser(userId: number): Promise<Portfolio[]>;
  addToPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<boolean>;

  // Discussion operations
  getDiscussion(id: number): Promise<Discussion | undefined>;
  getAllDiscussions(): Promise<Discussion[]>;
  getHotDiscussions(): Promise<Discussion[]>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;

  // Resource operations
  getResource(id: number): Promise<Resource | undefined>;
  getAllResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Market stats operations
  getLatestMarketStats(): Promise<MarketStats | undefined>;
  createMarketStats(stats: InsertMarketStats): Promise<MarketStats>;
}

export class DatabaseStorage implements IStorage {
  // Existing method implementations...
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCryptocurrency(id: number): Promise<Cryptocurrency | undefined> {
    const [crypto] = await db.select().from(cryptocurrencies).where(eq(cryptocurrencies.id, id));
    return crypto || undefined;
  }

  async getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined> {
    const [crypto] = await db.select().from(cryptocurrencies).where(eq(cryptocurrencies.symbol, symbol));
    return crypto || undefined;
  }

  async getAllCryptocurrencies(): Promise<Cryptocurrency[]> {
    return db.select().from(cryptocurrencies);
  }

  async createCryptocurrency(insertCrypto: InsertCryptocurrency): Promise<Cryptocurrency> {
    const [crypto] = await db
      .insert(cryptocurrencies)
      .values(insertCrypto)
      .returning();
    return crypto;
  }

  async updateCryptocurrency(id: number, crypto: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined> {
    const [updatedCrypto] = await db
      .update(cryptocurrencies)
      .set({ ...crypto, updatedAt: new Date() })
      .where(eq(cryptocurrencies.id, id))
      .returning();
    return updatedCrypto || undefined;
  }

  async getPrediction(id: number): Promise<Prediction | undefined> {
    const [prediction] = await db.select().from(predictions).where(eq(predictions.id, id));
    return prediction || undefined;
  }

  async getPredictionsByCryptocurrency(cryptocurrencyId: number): Promise<Prediction[]> {
    return db.select().from(predictions).where(eq(predictions.cryptocurrencyId, cryptocurrencyId));
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const [prediction] = await db
      .insert(predictions)
      .values(insertPrediction)
      .returning();
    return prediction;
  }

  async getPortfolioByUser(userId: number): Promise<Portfolio[]> {
    return db.select().from(portfolios).where(eq(portfolios.userId, userId));
  }

  async addToPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const [portfolio] = await db
      .insert(portfolios)
      .values(insertPortfolio)
      .returning();
    return portfolio;
  }

  async updatePortfolio(id: number, portfolioUpdate: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const [updatedPortfolio] = await db
      .update(portfolios)
      .set(portfolioUpdate)
      .where(eq(portfolios.id, id))
      .returning();
    return updatedPortfolio || undefined;
  }

  async deletePortfolio(id: number): Promise<boolean> {
    await db.delete(portfolios).where(eq(portfolios.id, id));
    return true;
  }

  async getDiscussion(id: number): Promise<Discussion | undefined> {
    const [discussion] = await db.select().from(discussions).where(eq(discussions.id, id));
    return discussion || undefined;
  }

  async getAllDiscussions(): Promise<Discussion[]> {
    return db.select().from(discussions);
  }

  async getHotDiscussions(): Promise<Discussion[]> {
    return db.select().from(discussions).where(eq(discussions.isHot, true));
  }

  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const [discussion] = await db
      .insert(discussions)
      .values(insertDiscussion)
      .returning();
    return discussion;
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values(insertResource)
      .returning();
    return resource;
  }

  async getLatestMarketStats(): Promise<MarketStats | undefined> {
    const [stats] = await db
      .select()
      .from(marketStats)
      .orderBy(sql`${marketStats.timestamp} DESC`)
      .limit(1);
    return stats || undefined;
  }

  async createMarketStats(insertStats: InsertMarketStats): Promise<MarketStats> {
    const [stats] = await db
      .insert(marketStats)
      .values(insertStats)
      .returning();
    return stats;
  }
}

async function fetchCryptoData(id: string): Promise<InsertCryptocurrency> {
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
  const data = response.data;
  return {
    symbol: data.symbol.toUpperCase(),
    name: data.name,
    currentPrice: data.market_data.current_price.usd,
    marketCap: data.market_data.market_cap.usd,
    volume24h: data.market_data.total_volume.usd,
    priceChange24h: data.market_data.price_change_24h,
    priceChangePercentage24h: data.market_data.price_change_percentage_24h,
    logoUrl: data.image.small
  };
}

async function initializeDatabase() {
  const existingCryptos = await db.select().from(cryptocurrencies);
  if (existingCryptos.length > 0) {
    console.log("Database already contains data, skipping initialization");
    return;
  }

  console.log("Initializing database with real-time data...");

  const storage = new DatabaseStorage();

  try {
    // Fetch real-time data
    const btc = await fetchCryptoData('bitcoin');
    const eth = await fetchCryptoData('ethereum');
    const sol = await fetchCryptoData('solana');

    const btcCrypto = await storage.createCryptocurrency(btc);
    const ethCrypto = await storage.createCryptocurrency(eth);
    const solCrypto = await storage.createCryptocurrency(sol);

    // Sample predictions
    await storage.createPrediction({
      cryptocurrencyId: btcCrypto.id,
      predictedPrice: btc.currentPrice * 1.05, // Simple 5% increase prediction
      timeframe: "7d",
      confidence: 78,
      accuracy: 92,
      predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await storage.createPrediction({
      cryptocurrencyId: ethCrypto.id,
      predictedPrice: eth.currentPrice * 1.03,
      timeframe: "7d",
      confidence: 82,
      accuracy: 88,
      predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await storage.createPrediction({
      cryptocurrencyId: solCrypto.id,
      predictedPrice: sol.currentPrice * 1.04,
      timeframe: "7d",
      confidence: 65,
      accuracy: 76,
      predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Sample user
    const user = await storage.createUser({
      username: "alexmorgan",
      password: "hashed_password",
      email: "alex@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
      plan: "Pro Member"
    });

    // Market stats from real data
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

    // Sample discussions
    const discussion1 = await storage.createDiscussion({
      userId: user.id,
      title: "Bitcoin halving impact predictions",
      content: "The upcoming Bitcoin halving is expected to reduce mining rewards by 50%. What are your predictions on price impact?",
      tags: ["bitcoin", "halving", "price", "prediction"]
    });

    const discussion2 = await storage.createDiscussion({
      userId: user.id,
      title: "Ethereum's new upgrade implications",
      content: "With the recent Ethereum update, what changes can we expect in gas fees and transaction speeds?",
      tags: ["ethereum", "upgrade", "gas", "transaction"]
    });

    const discussion3 = await storage.createDiscussion({
      userId: user.id,
      title: "AI prediction accuracy discussion",
      content: "Let's analyze how accurate the AI predictions have been over the last 3 months. I've compiled some data...",
      tags: ["AI", "prediction", "accuracy", "analysis"]
    });

    // Update discussion properties
    await db.update(discussions)
      .set({
        upvotes: 126,
        commentCount: 48,
        isHot: true
      })
      .where(eq(discussions.id, discussion1.id));

    await db.update(discussions)
      .set({
        upvotes: 87,
        commentCount: 32,
        isTrending: true
      })
      .where(eq(discussions.id, discussion2.id));

    await db.update(discussions)
      .set({
        upvotes: 53,
        commentCount: 24
      })
      .where(eq(discussions.id, discussion3.id));

    // Sample educational resources
    await storage.createResource({
      title: "Crypto Basics: Understanding Blockchain",
      description: "A beginner-friendly introduction to blockchain technology.",
      type: "video",
      duration: "12 min video",
      url: "/learn/crypto-basics",
      rating: 4.5,
      iconType: "video",
      level: "beginner"
    });

    await storage.createResource({
      title: "Technical Analysis Fundamentals",
      description: "Learn how to read charts and identify patterns for better trading decisions.",
      type: "course",
      duration: "5-part course",
      url: "/learn/technical-analysis",
      rating: 4.0,
      iconType: "book",
      level: "intermediate"
    });

    await storage.createResource({
      title: "Crypto Tax Guide 2023",
      description: "Everything you need to know about cryptocurrency taxation in the current year.",
      type: "guide",
      duration: "PDF Guide",
      url: "/learn/crypto-tax-guide",
      rating: 5.0,
      iconType: "file-alt",
      level: "intermediate"
    });

    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Create and export storage instance
export const storage = new DatabaseStorage();

// Initialize database with sample data
initializeDatabase().catch(err => {
  console.error("Error initializing database:", err);
});
