import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import Experience from "@/components/Experience";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MoodName, moodNames } from "@shared/schema";
import { useUserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";

export default function ExperiencePage() {
  const { mood } = useParams<{ mood: string }>();
  const [, setLocation] = useLocation();
  const { setSelectedMood } = useUserContext();
  
  // Validate the mood parameter
  const isValidMood = moodNames.includes(mood.charAt(0).toUpperCase() + mood.slice(1) as MoodName);
  
  useEffect(() => {
    if (isValidMood) {
      // Update the selected mood in context
      setSelectedMood(mood.charAt(0).toUpperCase() + mood.slice(1) as MoodName);
      
      // Set title based on mood
      document.title = `${mood.charAt(0).toUpperCase() + mood.slice(1)} Experience - SerenitySphere`;
    }
  }, [mood, isValidMood, setSelectedMood]);
  
  const handleBack = () => {
    setLocation("/");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {isValidMood ? (
          <Experience 
            mood={mood.charAt(0).toUpperCase() + mood.slice(1) as MoodName} 
            onBack={handleBack}
          />
        ) : (
          <div className="container mx-auto py-16 px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-medium text-foreground mb-4">Invalid Mood</h1>
            <p className="text-lg text-foreground/80 mb-8">
              The mood you've requested doesn't exist. Please select a valid mood from our selection.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6"
            >
              Return to Home
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
