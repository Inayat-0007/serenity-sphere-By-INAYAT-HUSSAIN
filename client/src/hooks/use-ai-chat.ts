import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Mood } from "@shared/schema";

interface AiChatResponse {
  message: string;
  suggestedMoods: Mood[];
}

export function useAiChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMoods, setSuggestedMoods] = useState<{
    aiResponse: string;
    moods: Mood[];
  }>({
    aiResponse: "",
    moods: [],
  });
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string, sessionId: string | null, userId?: number) => {
    if (!message || !sessionId) {
      setError("Message or session ID is missing");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message,
        sessionId,
        userId,
      });

      const data: AiChatResponse = await response.json();

      setSuggestedMoods({
        aiResponse: data.message,
        moods: data.suggestedMoods,
      });

      return data;
    } catch (error) {
      console.error("Error in AI chat:", error);
      setError(error instanceof Error ? error.message : "Failed to get AI response");
      
      // Provide fallback responses based on common keywords in the user message
      const lowercaseMessage = message.toLowerCase();
      let fallbackResponse = "I'm sorry, I'm having trouble connecting right now. Let me suggest some experiences that might help you.";
      let fallbackMoods = [];
      
      if (lowercaseMessage.includes("stress") || lowercaseMessage.includes("anxious") || lowercaseMessage.includes("worried")) {
        fallbackResponse = "I understand you might be feeling stressed. Here are some calming experiences that could help you relax.";
        fallbackMoods = [
          { id: 1, name: "Calm", description: "A gentle experience to help quiet your mind and reduce stress", icon: "water" },
          { id: 2, name: "Focused", description: "Clear your thoughts and find your center with this mindful experience", icon: "brain" }
        ];
      } else if (lowercaseMessage.includes("happy") || lowercaseMessage.includes("joy") || lowercaseMessage.includes("good")) {
        fallbackResponse = "That's wonderful! Here are some experiences to enhance your positive mood.";
        fallbackMoods = [
          { id: 3, name: "Happy", description: "Amplify your joyful feelings with this uplifting experience", icon: "smile" },
          { id: 4, name: "Playful", description: "A fun, energetic experience to match your positive energy", icon: "gamepad" }
        ];
      } else if (lowercaseMessage.includes("sad") || lowercaseMessage.includes("down") || lowercaseMessage.includes("depressed")) {
        fallbackResponse = "I'm sorry you're feeling this way. These experiences might help lift your spirits.";
        fallbackMoods = [
          { id: 5, name: "Chill", description: "A gentle, uplifting experience to help improve your mood", icon: "cloud" },
          { id: 6, name: "Happy", description: "Designed to gradually shift your mood toward more positive feelings", icon: "sun" }
        ];
      } else if (lowercaseMessage.includes("tired") || lowercaseMessage.includes("exhausted") || lowercaseMessage.includes("sleep")) {
        fallbackResponse = "Sounds like you could use some rest. These experiences might help you unwind.";
        fallbackMoods = [
          { id: 7, name: "Tired", description: "A soothing experience to help you relax and prepare for rest", icon: "moon" },
          { id: 8, name: "Calm", description: "Gentle sounds and visuals to help quiet an active mind", icon: "star" }
        ];
      } else {
        // Default fallback options
        fallbackMoods = [
          { id: 1, name: "Calm", description: "A peaceful experience to help you find tranquility", icon: "leaf" },
          { id: 2, name: "Happy", description: "An uplifting experience to brighten your mood", icon: "sun" },
          { id: 3, name: "Focused", description: "Help you concentrate and clear your mind", icon: "bullseye" },
          { id: 4, name: "Tired", description: "A gentle experience to help you rest and recover", icon: "moon" }
        ];
      }
      
      setSuggestedMoods({
        aiResponse: fallbackResponse,
        moods: fallbackMoods,
      });
      
      return {
        message: fallbackResponse,
        suggestedMoods: fallbackMoods
      };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSuggestedMoods({
      aiResponse: "",
      moods: [],
    });
    setError(null);
  };

  return {
    sendMessage,
    isLoading,
    suggestedMoods,
    error,
    reset,
  };
}
