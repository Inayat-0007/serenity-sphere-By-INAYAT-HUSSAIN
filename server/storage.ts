import { 
  users, type User, type InsertUser,
  preferences, type Preference, type InsertPreference,
  moods, type Mood, type InsertMood, 
  aiConversations, type AiConversation, type InsertAiConversation,
  moodNames, ageGroups
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferredMood(id: number, mood: string): Promise<User | undefined>;

  // Preferences operations
  getPreference(userId: number): Promise<Preference | undefined>;
  createPreference(preference: InsertPreference): Promise<Preference>;
  updatePreference(id: number, preference: Partial<InsertPreference>): Promise<Preference | undefined>;

  // Mood operations
  getMood(id: number): Promise<Mood | undefined>;
  getMoodByName(name: string): Promise<Mood | undefined>;
  getAllMoods(): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  initializeMoods(): Promise<void>;

  // AI Conversation operations
  createAiConversation(conversation: InsertAiConversation): Promise<AiConversation>;
  getAiConversationsBySession(sessionId: string): Promise<AiConversation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private preferences: Map<number, Preference>;
  private moods: Map<number, Mood>;
  private aiConversations: Map<number, AiConversation>;
  currentUserId: number;
  currentPreferenceId: number;
  currentMoodId: number;
  currentConversationId: number;

  constructor() {
    this.users = new Map();
    this.preferences = new Map();
    this.moods = new Map();
    this.aiConversations = new Map();
    this.currentUserId = 1;
    this.currentPreferenceId = 1;
    this.currentMoodId = 1;
    this.currentConversationId = 1;
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
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserPreferredMood(id: number, mood: string): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, preferredMood: mood };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Preferences operations
  async getPreference(userId: number): Promise<Preference | undefined> {
    return Array.from(this.preferences.values()).find(
      (preference) => preference.userId === userId,
    );
  }

  async createPreference(insertPreference: InsertPreference): Promise<Preference> {
    const id = this.currentPreferenceId++;
    const preference: Preference = { ...insertPreference, id };
    this.preferences.set(id, preference);
    return preference;
  }

  async updatePreference(id: number, preferenceUpdate: Partial<InsertPreference>): Promise<Preference | undefined> {
    const preference = this.preferences.get(id);
    if (!preference) return undefined;
    
    const updatedPreference = { ...preference, ...preferenceUpdate };
    this.preferences.set(id, updatedPreference);
    return updatedPreference;
  }

  // Mood operations
  async getMood(id: number): Promise<Mood | undefined> {
    return this.moods.get(id);
  }

  async getMoodByName(name: string): Promise<Mood | undefined> {
    return Array.from(this.moods.values()).find(
      (mood) => mood.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async getAllMoods(): Promise<Mood[]> {
    return Array.from(this.moods.values());
  }

  async createMood(insertMood: InsertMood): Promise<Mood> {
    const id = this.currentMoodId++;
    const mood: Mood = { ...insertMood, id };
    this.moods.set(id, mood);
    return mood;
  }

  async initializeMoods(): Promise<void> {
    const moodData: InsertMood[] = [
      {
        name: "Tired",
        description: "Gentle relaxation to help you unwind and rest.",
        visualPath: "/assets/moods/tired_visual.mp4",
        soundPath: "/assets/moods/tired_sound.mp3",
        voicePrompt: "Allow your body to relax.",
        icon: "moon",
      },
      {
        name: "Chill",
        description: "Let your worries drift away with soothing sensations.",
        visualPath: "/assets/moods/chill_visual.mp4",
        soundPath: "/assets/moods/chill_sound.mp3",
        voicePrompt: "Let your worries drift away.",
        icon: "cloud",
      },
      {
        name: "Happy",
        description: "Embrace the feeling of joy and positive energy.",
        visualPath: "/assets/moods/happy_visual.mp4",
        soundPath: "/assets/moods/happy_sound.mp3",
        voicePrompt: "Embrace the feeling of joy.",
        icon: "smile",
      },
      {
        name: "Anxious",
        description: "Find your inner stillness with calming rhythms.",
        visualPath: "/assets/moods/anxious_visual.mp4",
        soundPath: "/assets/moods/anxious_sound.mp3",
        voicePrompt: "Find your inner stillness.",
        icon: "water",
      },
      {
        name: "Focused",
        description: "Center your thoughts and enhance concentration.",
        visualPath: "/assets/moods/focused_visual.mp4",
        soundPath: "/assets/moods/focused_sound.mp3",
        voicePrompt: "Center your thoughts.",
        icon: "bullseye",
      },
      {
        name: "Stressed",
        description: "Immerse in nature's peace to release tension.",
        visualPath: "/assets/moods/stressed_visual.mp4",
        soundPath: "/assets/moods/stressed_sound.mp3",
        voicePrompt: "Imagine the peace of nature surrounding you.",
        icon: "wind",
      },
      {
        name: "Playful",
        description: "Let your imagination soar with light-hearted joy.",
        visualPath: "/assets/moods/playful_visual.mp4",
        soundPath: "/assets/moods/playful_sound.mp3",
        voicePrompt: "Let your imagination soar.",
        icon: "feather",
      },
      {
        name: "Calm",
        description: "Breathe in peace, breathe out tension.",
        visualPath: "/assets/moods/calm_visual.mp4",
        soundPath: "/assets/moods/calm_sound.mp3",
        voicePrompt: "Breathe in peace, breathe out tension.",
        icon: "star",
      },
    ];

    for (const mood of moodData) {
      await this.createMood(mood);
    }
  }

  // AI Conversation operations
  async createAiConversation(insertConversation: InsertAiConversation): Promise<AiConversation> {
    const id = this.currentConversationId++;
    const conversation: AiConversation = { ...insertConversation, id };
    this.aiConversations.set(id, conversation);
    return conversation;
  }

  async getAiConversationsBySession(sessionId: string): Promise<AiConversation[]> {
    return Array.from(this.aiConversations.values()).filter(
      (conversation) => conversation.sessionId === sessionId,
    );
  }
}

export const storage = new MemStorage();
