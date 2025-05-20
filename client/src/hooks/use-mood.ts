import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mood, MoodName } from "@shared/schema";
import { MOODS } from "@/lib/constants";
import { queryClient } from "@/lib/queryClient";

export function useMoods() {
  return useQuery({
    queryKey: ["/api/moods"],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMood(moodName: MoodName) {
  return useQuery({
    queryKey: [`/api/moods/${moodName.toLowerCase()}`],
    staleTime: 10 * 60 * 1000, // 10 minutes
    // If the API call fails, fall back to the local constants
    onError: () => {
      return MOODS[moodName];
    },
  });
}

export function useUpdateUserPreferredMood(userId: number) {
  return useMutation({
    mutationFn: async (mood: MoodName) => {
      const response = await apiRequest("PUT", `/api/users/${userId}/preferred-mood`, {
        mood,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
    },
  });
}

export function useUpdatePreferences(preferencesId: number) {
  return useMutation({
    mutationFn: async (preferences: {
      volume?: number;
      animationSpeed?: number;
      brightness?: number;
      voiceEnabled?: boolean;
    }) => {
      const response = await apiRequest("PUT", `/api/preferences/${preferencesId}`, preferences);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/preferences/${preferencesId}`] });
    },
  });
}

// Utility function to get local mood data if API request fails
export function getLocalMoodData(moodName: MoodName): Partial<Mood> {
  const moodData = MOODS[moodName];
  return {
    name: moodName,
    description: moodData.description,
    icon: moodData.icon,
    visualPath: moodData.visualUrl,
    soundPath: moodData.audioUrl,
    voicePrompt: moodData.voicePrompt,
  };
}
