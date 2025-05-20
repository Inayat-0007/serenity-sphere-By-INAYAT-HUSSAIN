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
      throw error;
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
