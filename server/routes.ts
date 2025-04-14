import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCryptocurrencySchema,
  insertPredictionSchema,
  insertPortfolioSchema,
  insertDiscussionSchema,
  insertResourceSchema,
  insertMarketStatsSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Health check route
  apiRouter.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // User routes
  apiRouter.post("/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  });

  // Cryptocurrency routes
  apiRouter.get("/cryptocurrencies", async (_req: Request, res: Response) => {
    const cryptocurrencies = await storage.getAllCryptocurrencies();
    res.json(cryptocurrencies);
  });

  apiRouter.get("/cryptocurrencies/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid cryptocurrency ID" });
    }
    
    const cryptocurrency = await storage.getCryptocurrency(id);
    if (!cryptocurrency) {
      return res.status(404).json({ message: "Cryptocurrency not found" });
    }
    
    res.json(cryptocurrency);
  });

  apiRouter.post("/cryptocurrencies", async (req: Request, res: Response) => {
    try {
      const cryptoData = insertCryptocurrencySchema.parse(req.body);
      const crypto = await storage.createCryptocurrency(cryptoData);
      res.status(201).json(crypto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid cryptocurrency data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create cryptocurrency" });
      }
    }
  });

  // Prediction routes
  apiRouter.get("/predictions/cryptocurrency/:cryptoId", async (req: Request, res: Response) => {
    const cryptoId = parseInt(req.params.cryptoId);
    if (isNaN(cryptoId)) {
      return res.status(400).json({ message: "Invalid cryptocurrency ID" });
    }
    
    const predictions = await storage.getPredictionsByCryptocurrency(cryptoId);
    res.json(predictions);
  });

  apiRouter.post("/predictions", async (req: Request, res: Response) => {
    try {
      const predictionData = insertPredictionSchema.parse(req.body);
      const prediction = await storage.createPrediction(predictionData);
      res.status(201).json(prediction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid prediction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create prediction" });
      }
    }
  });

  // Portfolio routes
  apiRouter.get("/portfolios/user/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const portfolios = await storage.getPortfolioByUser(userId);
    res.json(portfolios);
  });

  apiRouter.post("/portfolios", async (req: Request, res: Response) => {
    try {
      const portfolioData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.addToPortfolio(portfolioData);
      res.status(201).json(portfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid portfolio data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create portfolio entry" });
      }
    }
  });

  // Discussion routes
  apiRouter.get("/discussions", async (_req: Request, res: Response) => {
    const discussions = await storage.getAllDiscussions();
    res.json(discussions);
  });

  apiRouter.get("/discussions/hot", async (_req: Request, res: Response) => {
    const discussions = await storage.getHotDiscussions();
    res.json(discussions);
  });

  apiRouter.post("/discussions", async (req: Request, res: Response) => {
    try {
      const discussionData = insertDiscussionSchema.parse(req.body);
      const discussion = await storage.createDiscussion(discussionData);
      res.status(201).json(discussion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid discussion data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create discussion" });
      }
    }
  });

  // Resource routes
  apiRouter.get("/resources", async (_req: Request, res: Response) => {
    const resources = await storage.getAllResources();
    res.json(resources);
  });

  apiRouter.post("/resources", async (req: Request, res: Response) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create resource" });
      }
    }
  });

  // Market stats routes
  apiRouter.get("/market-stats", async (_req: Request, res: Response) => {
    const stats = await storage.getLatestMarketStats();
    if (!stats) {
      return res.status(404).json({ message: "Market stats not found" });
    }
    
    res.json(stats);
  });

  apiRouter.post("/market-stats", async (req: Request, res: Response) => {
    try {
      const statsData = insertMarketStatsSchema.parse(req.body);
      const stats = await storage.createMarketStats(statsData);
      res.status(201).json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid market stats data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create market stats" });
      }
    }
  });

  // Mount the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
