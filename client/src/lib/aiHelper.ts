import { apiRequest } from "./queryClient";

interface SuggestedMood {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface AiChatResponse {
  message: string;
  suggestedMoods: SuggestedMood[];
}

/**
 * Send a message to the AI chat assistant
 * @param message The user's message
 * @param sessionId The current session ID
 * @param userId Optional user ID if signed in
 */
export async function sendAiChatMessage(
  message: string,
  sessionId: string,
  userId?: number
): Promise<AiChatResponse> {
  try {
    const response = await apiRequest("POST", "/api/ai/chat", {
      message,
      sessionId,
      userId,
    });
    
    return await response.json();
  } catch (error) {
    console.error("AI chat error:", error);
    throw new Error("Failed to get AI response");
  }
}

/**
 * Analyzes text for emotion indicators
 * @param text The text to analyze
 */
export function analyzeEmotion(text: string): string[] {
  const emotions: string[] = [];
  const lowercaseText = text.toLowerCase();
  
  // Simple keyword matching
  if (
    lowercaseText.includes("tired") ||
    lowercaseText.includes("exhausted") ||
    lowercaseText.includes("sleepy")
  ) {
    emotions.push("Tired");
  }
  
  if (
    lowercaseText.includes("stress") ||
    lowercaseText.includes("overwhelm") ||
    lowercaseText.includes("pressure")
  ) {
    emotions.push("Stressed");
  }
  
  if (
    lowercaseText.includes("anxious") ||
    lowercaseText.includes("nervous") ||
    lowercaseText.includes("worry")
  ) {
    emotions.push("Anxious");
  }
  
  if (
    lowercaseText.includes("happy") ||
    lowercaseText.includes("joy") ||
    lowercaseText.includes("glad")
  ) {
    emotions.push("Happy");
  }
  
  if (
    lowercaseText.includes("focus") ||
    lowercaseText.includes("concentrate") ||
    lowercaseText.includes("attention")
  ) {
    emotions.push("Focused");
  }
  
  if (
    lowercaseText.includes("relax") ||
    lowercaseText.includes("chill") ||
    lowercaseText.includes("unwind")
  ) {
    emotions.push("Chill");
  }
  
  if (
    lowercaseText.includes("play") ||
    lowercaseText.includes("fun") ||
    lowercaseText.includes("enjoy")
  ) {
    emotions.push("Playful");
  }
  
  if (
    lowercaseText.includes("calm") ||
    lowercaseText.includes("peace") ||
    lowercaseText.includes("quiet")
  ) {
    emotions.push("Calm");
  }
  
  // Default if no emotions detected
  if (emotions.length === 0) {
    emotions.push("Calm");
  }
  
  return emotions;
}
