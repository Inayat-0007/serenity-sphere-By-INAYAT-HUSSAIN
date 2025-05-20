import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  ageGroup: text("age_group").notNull(),
  preferredMood: text("preferred_mood"),
});

export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  volume: integer("volume").notNull().default(70),
  animationSpeed: integer("animation_speed").notNull().default(50),
  brightness: integer("brightness").notNull().default(60),
  voiceEnabled: boolean("voice_enabled").notNull().default(true),
});

export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  visualPath: text("visual_path").notNull(),
  soundPath: text("sound_path").notNull(),
  voicePrompt: text("voice_prompt").notNull(),
  icon: text("icon").notNull(),
});

export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  suggestedMood: text("suggested_mood"),
  timestamp: text("timestamp").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  ageGroup: true,
  preferredMood: true,
});

export const insertPreferenceSchema = createInsertSchema(preferences).pick({
  userId: true,
  volume: true,
  animationSpeed: true,
  brightness: true,
  voiceEnabled: true,
});

export const insertMoodSchema = createInsertSchema(moods);

export const insertAiConversationSchema = createInsertSchema(aiConversations).pick({
  userId: true,
  sessionId: true,
  userMessage: true,
  aiResponse: true,
  suggestedMood: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPreference = z.infer<typeof insertPreferenceSchema>;
export type Preference = typeof preferences.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Mood = typeof moods.$inferSelect;
export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;
export type AiConversation = typeof aiConversations.$inferSelect;

export const ageGroups = ["Child", "Kid", "Adult", "Mature"] as const;
export const moodNames = [
  "Tired", 
  "Chill", 
  "Happy", 
  "Anxious", 
  "Focused", 
  "Stressed", 
  "Playful", 
  "Calm"
] as const;

export type AgeGroup = typeof ageGroups[number];
export type MoodName = typeof moodNames[number];
