import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AgeSelection from "@/components/AgeSelection";
import MoodSelection from "@/components/MoodSelection";
import AIChat from "@/components/AIChat";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Support from "@/components/Support";
import Footer from "@/components/Footer";
import { useUserContext } from "@/context/UserContext";
import { getTimeOfDay, suggestMood } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Home() {
  const { ageGroup, selectedMood, setSelectedMood } = useUserContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Auto-selection after inactivity
  useEffect(() => {
    let inactivityTimer: number;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      
      // Set a timer for 4 minutes of inactivity
      inactivityTimer = window.setTimeout(() => {
        // Only auto-select if the user has already chosen an age group but not a mood
        if (ageGroup && !selectedMood) {
          const timeOfDay = getTimeOfDay();
          const suggestedMoodName = suggestMood(timeOfDay, ageGroup);
          
          // Show toast notification
          toast({
            title: "We noticed you've been inactive",
            description: `We've selected a ${suggestedMoodName.toLowerCase()} experience that might suit this time of day.`,
            duration: 5000,
          });
          
          // Set the mood and navigate to the experience
          setSelectedMood(suggestedMoodName);
          setLocation(`/experience/${suggestedMoodName.toLowerCase()}`);
        }
      }, 4 * 60 * 1000); // 4 minutes
    };
    
    // Events that reset the timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Add event listeners for each event type
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });
    
    // Initial timer setup
    resetTimer();
    
    // Cleanup event listeners on unmount
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [ageGroup, selectedMood, toast, setSelectedMood, setLocation]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <AgeSelection />
        <MoodSelection />
        <AIChat />
        <Features />
        <Testimonials />
        <Newsletter />
        <Support />
      </main>
      <Footer />
    </div>
  );
}
