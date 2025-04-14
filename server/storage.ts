import {
  users, type User, type InsertUser,
  cryptocurrencies, type Cryptocurrency, type InsertCryptocurrency,
  predictions, type Prediction, type InsertPrediction,
  portfolios, type Portfolio, type InsertPortfolio,
  discussions, type Discussion, type InsertDiscussion,
  resources, type Resource, type InsertResource,
  marketStats, type MarketStats, type InsertMarketStats
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cryptocurrencies: Map<number, Cryptocurrency>;
  private predictions: Map<number, Prediction>;
  private portfolios: Map<number, Portfolio>;
  private discussions: Map<number, Discussion>;
  private resources: Map<number, Resource>;
  private marketStats: Map<number, MarketStats>;
  
  private userIdCounter: number;
  private cryptoIdCounter: number;
  private predictionIdCounter: number;
  private portfolioIdCounter: number;
  private discussionIdCounter: number;
  private resourceIdCounter: number;
  private marketStatsIdCounter: number;

  constructor() {
    this.users = new Map();
    this.cryptocurrencies = new Map();
    this.predictions = new Map();
    this.portfolios = new Map();
    this.discussions = new Map();
    this.resources = new Map();
    this.marketStats = new Map();
    
    this.userIdCounter = 1;
    this.cryptoIdCounter = 1;
    this.predictionIdCounter = 1;
    this.portfolioIdCounter = 1;
    this.discussionIdCounter = 1;
    this.resourceIdCounter = 1;
    this.marketStatsIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Sample cryptocurrencies
    const btc: InsertCryptocurrency = {
      symbol: "BTC",
      name: "Bitcoin",
      currentPrice: 43758.24,
      marketCap: 856945000000,
      volume24h: 48700000000,
      priceChange24h: 894.75,
      priceChangePercentage24h: 2.4,
      logoUrl: "bitcoin.svg"
    };
    const eth: InsertCryptocurrency = {
      symbol: "ETH",
      name: "Ethereum",
      currentPrice: 2349.88,
      marketCap: 282240000000,
      volume24h: 18500000000,
      priceChange24h: 86.16,
      priceChangePercentage24h: 3.8,
      logoUrl: "ethereum.svg"
    };
    const sol: InsertCryptocurrency = {
      symbol: "SOL",
      name: "Solana",
      currentPrice: 97.34,
      marketCap: 42840000000,
      volume24h: 3250000000,
      priceChange24h: -1.18,
      priceChangePercentage24h: -1.2,
      logoUrl: "solana.svg"
    };
    
    this.createCryptocurrency(btc);
    this.createCryptocurrency(eth);
    this.createCryptocurrency(sol);
    
    // Sample predictions
    this.createPrediction({
      cryptocurrencyId: 1, // BTC
      predictedPrice: 46023.15,
      timeframe: "7d",
      confidence: 78,
      accuracy: 92,
      predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    this.createPrediction({
      cryptocurrencyId: 2, // ETH
      predictedPrice: 2439.25,
      timeframe: "7d",
      confidence: 82,
      accuracy: 88,
      predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    this.createPrediction({
      cryptocurrencyId: 3, // SOL
      predictedPrice: 96.18,
      timeframe: "7d",
      confidence: 65,
      accuracy: 76,
      predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    // Sample user
    this.createUser({
      username: "alexmorgan",
      password: "hashed_password", // In a real app, this would be hashed
      email: "alex@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
      plan: "Pro Member"
    });
    
    // Sample market stats
    this.createMarketStats({
      totalMarketCap: 1240000000000,
      totalVolume24h: 48700000000,
      btcDominance: 42.8,
      fearGreedIndex: 65,
      fearGreedLabel: "Greed",
      marketCapChange24h: 2.4,
      volumeChange24h: -1.2,
      btcDominanceChange24h: 0.3,
      fearGreedIndexChange24h: 5
    });
    
    // Sample discussions
    this.createDiscussion({
      userId: 1,
      title: "Bitcoin halving impact predictions",
      content: "The upcoming Bitcoin halving is expected to reduce mining rewards by 50%. What are your predictions on price impact?",
      tags: ["bitcoin", "halving", "price", "prediction"]
    });
    
    this.createDiscussion({
      userId: 1,
      title: "Ethereum's new upgrade implications",
      content: "With the recent Ethereum update, what changes can we expect in gas fees and transaction speeds?",
      tags: ["ethereum", "upgrade", "gas", "transaction"]
    });
    
    this.createDiscussion({
      userId: 1,
      title: "AI prediction accuracy discussion",
      content: "Let's analyze how accurate the AI predictions have been over the last 3 months. I've compiled some data...",
      tags: ["AI", "prediction", "accuracy", "analysis"]
    });
    
    // Update discussion properties
    const discussion1 = this.discussions.get(1);
    if (discussion1) {
      discussion1.upvotes = 126;
      discussion1.commentCount = 48;
      discussion1.isHot = true;
    }
    
    const discussion2 = this.discussions.get(2);
    if (discussion2) {
      discussion2.upvotes = 87;
      discussion2.commentCount = 32;
      discussion2.isTrending = true;
    }
    
    const discussion3 = this.discussions.get(3);
    if (discussion3) {
      discussion3.upvotes = 53;
      discussion3.commentCount = 24;
    }
    
    // Sample educational resources
    this.createResource({
      title: "Crypto Basics: Understanding Blockchain",
      description: "A beginner-friendly introduction to blockchain technology.",
      type: "video",
      duration: "12 min video",
      url: "/learn/crypto-basics",
      rating: 4.5,
      ratingCount: 432,
      iconType: "video"
    });
    
    this.createResource({
      title: "Technical Analysis Fundamentals",
      description: "Learn how to read charts and identify patterns for better trading decisions.",
      type: "course",
      duration: "5-part course",
      url: "/learn/technical-analysis",
      rating: 4.0,
      ratingCount: 287,
      iconType: "book"
    });
    
    this.createResource({
      title: "Crypto Tax Guide 2023",
      description: "Everything you need to know about cryptocurrency taxation in the current year.",
      type: "guide",
      duration: "PDF Guide",
      url: "/learn/crypto-tax-guide",
      rating: 5.0,
      ratingCount: 156,
      iconType: "file-alt"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Cryptocurrency operations
  async getCryptocurrency(id: number): Promise<Cryptocurrency | undefined> {
    return this.cryptocurrencies.get(id);
  }

  async getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined> {
    return Array.from(this.cryptocurrencies.values()).find(
      (crypto) => crypto.symbol === symbol,
    );
  }

  async getAllCryptocurrencies(): Promise<Cryptocurrency[]> {
    return Array.from(this.cryptocurrencies.values());
  }

  async createCryptocurrency(insertCrypto: InsertCryptocurrency): Promise<Cryptocurrency> {
    const id = this.cryptoIdCounter++;
    const updatedAt = new Date();
    const crypto: Cryptocurrency = { ...insertCrypto, id, updatedAt };
    this.cryptocurrencies.set(id, crypto);
    return crypto;
  }

  async updateCryptocurrency(id: number, crypto: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined> {
    const existingCrypto = this.cryptocurrencies.get(id);
    if (!existingCrypto) return undefined;
    
    const updatedCrypto: Cryptocurrency = {
      ...existingCrypto,
      ...crypto,
      updatedAt: new Date()
    };
    
    this.cryptocurrencies.set(id, updatedCrypto);
    return updatedCrypto;
  }

  // Prediction operations
  async getPrediction(id: number): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async getPredictionsByCryptocurrency(cryptocurrencyId: number): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).filter(
      (prediction) => prediction.cryptocurrencyId === cryptocurrencyId,
    );
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = this.predictionIdCounter++;
    const createdAt = new Date();
    const prediction: Prediction = { ...insertPrediction, id, createdAt };
    this.predictions.set(id, prediction);
    return prediction;
  }

  // Portfolio operations
  async getPortfolioByUser(userId: number): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(
      (portfolio) => portfolio.userId === userId,
    );
  }

  async addToPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = this.portfolioIdCounter++;
    const portfolio: Portfolio = { ...insertPortfolio, id };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: number, portfolioUpdate: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const existingPortfolio = this.portfolios.get(id);
    if (!existingPortfolio) return undefined;
    
    const updatedPortfolio: Portfolio = {
      ...existingPortfolio,
      ...portfolioUpdate
    };
    
    this.portfolios.set(id, updatedPortfolio);
    return updatedPortfolio;
  }

  async deletePortfolio(id: number): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  // Discussion operations
  async getDiscussion(id: number): Promise<Discussion | undefined> {
    return this.discussions.get(id);
  }

  async getAllDiscussions(): Promise<Discussion[]> {
    return Array.from(this.discussions.values());
  }

  async getHotDiscussions(): Promise<Discussion[]> {
    return Array.from(this.discussions.values())
      .filter(discussion => discussion.isHot || discussion.isTrending)
      .sort((a, b) => b.upvotes - a.upvotes);
  }

  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const id = this.discussionIdCounter++;
    const createdAt = new Date();
    const discussion: Discussion = {
      ...insertDiscussion,
      id,
      upvotes: 0,
      commentCount: 0,
      isHot: false,
      isTrending: false,
      createdAt
    };
    this.discussions.set(id, discussion);
    return discussion;
  }

  // Resource operations
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const createdAt = new Date();
    const resource: Resource = {
      ...insertResource,
      id,
      ratingCount: 0,
      createdAt
    };
    this.resources.set(id, resource);
    return resource;
  }

  // Market stats operations
  async getLatestMarketStats(): Promise<MarketStats | undefined> {
    // Get the most recent entry based on timestamp
    const allStats = Array.from(this.marketStats.values());
    if (allStats.length === 0) return undefined;
    
    return allStats.reduce((latest, current) => {
      return latest.timestamp > current.timestamp ? latest : current;
    });
  }

  async createMarketStats(insertStats: InsertMarketStats): Promise<MarketStats> {
    const id = this.marketStatsIdCounter++;
    const timestamp = new Date();
    const stats: MarketStats = { ...insertStats, id, timestamp };
    this.marketStats.set(id, stats);
    return stats;
  }
}

export const storage = new MemStorage();
