import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPreferenceSchema, 
  moodNames,
  insertAiConversationSchema
} from "@shared/schema";
import { nanoid } from "nanoid";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize moods
  await storage.initializeMoods();
  
  // API Routes
  app.get("/api/moods", async (_req: Request, res: Response) => {
    try {
      const moods = await storage.getAllMoods();
      res.json(moods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch moods" });
    }
  });

  app.get("/api/moods/:name", async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      const mood = await storage.getMoodByName(name);
      
      if (!mood) {
        return res.status(404).json({ message: "Mood not found" });
      }
      
      res.json(mood);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userResult = insertUserSchema.safeParse(req.body);
      
      if (!userResult.success) {
        return res.status(400).json({ message: "Invalid user data", errors: userResult.error.format() });
      }
      
      const existingUser = await storage.getUserByUsername(userResult.data.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userResult.data);
      
      // Create default preferences for the user
      const defaultPreferences = {
        userId: user.id,
        volume: 70,
        animationSpeed: 50,
        brightness: 60,
        voiceEnabled: true
      };
      
      const preferences = await storage.createPreference(defaultPreferences);
      
      res.status(201).json({ user, preferences });
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id/preferred-mood", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { mood } = req.body;
      
      if (!mood || !moodNames.includes(mood)) {
        return res.status(400).json({ message: "Invalid mood" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUserPreferredMood(userId, mood);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update preferred mood" });
    }
  });

  app.get("/api/users/:id/preferences", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const preferences = await storage.getPreference(userId);
      
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.put("/api/preferences/:id", async (req: Request, res: Response) => {
    try {
      const preferencesId = parseInt(req.params.id);
      const preferencesResult = insertPreferenceSchema.partial().safeParse(req.body);
      
      if (!preferencesResult.success) {
        return res.status(400).json({ message: "Invalid preferences data", errors: preferencesResult.error.format() });
      }
      
      const updatedPreferences = await storage.updatePreference(preferencesId, preferencesResult.data);
      
      if (!updatedPreferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      
      res.json(updatedPreferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  app.post("/api/ai/chat", async (req: Request, res: Response) => {
    try {
      const { message, sessionId, userId } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Invalid message" });
      }
      
      if (!sessionId || typeof sessionId !== "string") {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      // Use Hugging Face Inference API to analyze the message
      // Note: In a real implementation, this would use a proper API key from env vars
      const apiKey = process.env.HUGGING_FACE_API_KEY || "";
      
      // Simulated AI response since we don't have an actual API key
      let aiResponse;
      let suggestedMoods = [];
      
      // Simple keyword matching to simulate AI mood analysis
      const messageLower = message.toLowerCase();
      if (messageLower.includes("tired") || messageLower.includes("exhausted") || messageLower.includes("sleep")) {
        suggestedMoods.push("Tired");
      } 
      if (messageLower.includes("stress") || messageLower.includes("overwhelm") || messageLower.includes("pressure")) {
        suggestedMoods.push("Stressed");
      }
      if (messageLower.includes("anxious") || messageLower.includes("worry") || messageLower.includes("nervous")) {
        suggestedMoods.push("Anxious");
      }
      if (messageLower.includes("happy") || messageLower.includes("joy") || messageLower.includes("excited")) {
        suggestedMoods.push("Happy");
      }
      if (messageLower.includes("focus") || messageLower.includes("concentrate") || messageLower.includes("attention")) {
        suggestedMoods.push("Focused");
      }
      if (messageLower.includes("relax") || messageLower.includes("chill") || messageLower.includes("unwind")) {
        suggestedMoods.push("Chill");
      }
      if (messageLower.includes("play") || messageLower.includes("fun") || messageLower.includes("light")) {
        suggestedMoods.push("Playful");
      }
      if (messageLower.includes("calm") || messageLower.includes("peace") || messageLower.includes("tranquil")) {
        suggestedMoods.push("Calm");
      }
      
      // If no keywords matched, suggest default moods
      if (suggestedMoods.length === 0) {
        suggestedMoods = ["Calm", "Chill"];
      }
      
      // If we have more than 2 suggestions, just keep the top 2
      if (suggestedMoods.length > 2) {
        suggestedMoods = suggestedMoods.slice(0, 2);
      }
      
      // Get mood details for the suggested moods
      const moodDetails = [];
      for (const moodName of suggestedMoods) {
        const mood = await storage.getMoodByName(moodName);
        if (mood) {
          moodDetails.push(mood);
        }
      }
      
      // Construct AI response
      aiResponse = {
        message: `Based on what you've shared, I think you might benefit from our ${suggestedMoods.join(" or ")} experience.`,
        suggestedMoods: moodDetails
      };
      
      // Store the conversation
      const timestamp = new Date().toISOString();
      const conversationData = {
        userId: userId || null,
        sessionId,
        userMessage: message,
        aiResponse: JSON.stringify(aiResponse),
        suggestedMood: suggestedMoods[0],
        timestamp
      };
      
      const parsedConversation = insertAiConversationSchema.safeParse(conversationData);
      
      if (parsedConversation.success) {
        await storage.createAiConversation(parsedConversation.data);
      }
      
      res.json(aiResponse);
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ message: "Failed to process AI chat" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
