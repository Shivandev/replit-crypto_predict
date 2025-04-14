import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User accounts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  plan: text("plan").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

// Cryptocurrencies
export const cryptocurrencies = pgTable("cryptocurrencies", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  currentPrice: doublePrecision("current_price"),
  marketCap: doublePrecision("market_cap"),
  volume24h: doublePrecision("volume_24h"),
  priceChange24h: doublePrecision("price_change_24h"),
  priceChangePercentage24h: doublePrecision("price_change_percentage_24h"),
  logoUrl: text("logo_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertCryptocurrencySchema = createInsertSchema(cryptocurrencies).omit({
  id: true,
  updatedAt: true
});

// Price predictions
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  cryptocurrencyId: integer("cryptocurrency_id").notNull(),
  predictedPrice: doublePrecision("predicted_price").notNull(),
  timeframe: text("timeframe").notNull(), // e.g. "7d", "30d", "1y"
  confidence: doublePrecision("confidence").notNull(), // 0-100%
  accuracy: doublePrecision("accuracy"), // historical accuracy percentage
  createdAt: timestamp("created_at").defaultNow().notNull(),
  predictedForDate: timestamp("predicted_for_date").notNull()
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true
});

// User portfolios
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cryptocurrencyId: integer("cryptocurrency_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  purchasePrice: doublePrecision("purchase_price").notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull()
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true
});

// Community discussions
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  upvotes: integer("upvotes").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  isHot: boolean("is_hot").default(false).notNull(),
  isTrending: boolean("is_trending").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  upvotes: true,
  commentCount: true,
  isHot: true,
  isTrending: true,
  createdAt: true
});

// Educational resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "video", "article", "course", etc.
  duration: text("duration"),
  url: text("url").notNull(),
  rating: doublePrecision("rating"),
  ratingCount: integer("rating_count").default(0),
  iconType: text("icon_type").notNull(), // "video", "book", "file", etc.
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  ratingCount: true,
  createdAt: true
});

// Market stats
export const marketStats = pgTable("market_stats", {
  id: serial("id").primaryKey(),
  totalMarketCap: doublePrecision("total_market_cap"),
  totalVolume24h: doublePrecision("total_volume_24h"),
  btcDominance: doublePrecision("btc_dominance"),
  fearGreedIndex: integer("fear_greed_index"),
  fearGreedLabel: text("fear_greed_label"),
  marketCapChange24h: doublePrecision("market_cap_change_24h"),
  volumeChange24h: doublePrecision("volume_change_24h"),
  btcDominanceChange24h: doublePrecision("btc_dominance_change_24h"),
  fearGreedIndexChange24h: integer("fear_greed_index_change_24h"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const insertMarketStatsSchema = createInsertSchema(marketStats).omit({
  id: true,
  timestamp: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCryptocurrency = z.infer<typeof insertCryptocurrencySchema>;
export type Cryptocurrency = typeof cryptocurrencies.$inferSelect;

export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;

export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;

export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Discussion = typeof discussions.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertMarketStats = z.infer<typeof insertMarketStatsSchema>;
export type MarketStats = typeof marketStats.$inferSelect;
