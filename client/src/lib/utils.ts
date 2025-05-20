import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a string to capitalize first letter and make rest lowercase
 */
export function formatString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Gets the current time of day (morning, afternoon, evening, night)
 */
export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/**
 * Suggests a mood based on time of day and age group
 */
export function suggestMood(
  timeOfDay: "morning" | "afternoon" | "evening" | "night",
  ageGroup: string
): string {
  if (timeOfDay === "morning") {
    return ageGroup === "Child" || ageGroup === "Kid" ? "Happy" : "Focused";
  } else if (timeOfDay === "afternoon") {
    return ageGroup === "Child" || ageGroup === "Kid" ? "Playful" : "Chill";
  } else if (timeOfDay === "evening") {
    return "Calm";
  } else {
    return "Tired";
  }
}

/**
 * Delays execution for a specified time
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a unique ID for elements
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Safely parses JSON with a fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    return fallback;
  }
}
