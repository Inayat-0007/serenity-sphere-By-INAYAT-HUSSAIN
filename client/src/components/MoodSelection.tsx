import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MOODS } from "@/lib/constants";
import { useUserContext } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export default function MoodSelection() {
  const { ageGroup, selectedMood, setSelectedMood } = useUserContext();
  const [, setLocation] = useLocation();
  const moodSectionRef = useRef<HTMLElement>(null);
  
  // Scroll to AI chat when "Confused? Let's Talk" button is clicked
  const scrollToAiChat = () => {
    const aiChat = document.getElementById("ai-chat");
    if (aiChat) {
      aiChat.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  // Handle mood selection
  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    // Navigate to the experience page
    setLocation(`/experience/${mood.toLowerCase()}`);
  };
  
  return (
    <section id="mood-selection" ref={moodSectionRef} className="py-16 px-6 md:px-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-heading font-medium text-foreground text-center mb-4">How are you feeling today?</h2>
        <p className="text-center text-foreground/80 max-w-2xl mx-auto mb-10">
          Select your current mood, and we'll create a personalized experience to match.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(MOODS).map(([key, data]) => (
            <div 
              key={key}
              className="mood-card bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer smooth-transition"
              onClick={() => handleMoodSelection(key)}
            >
              <div className="h-40 bg-primary/20 overflow-hidden">
                <img 
                  src={data.image}
                  alt={`${data.title} mood visualization`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <i className={`fas fa-${data.icon} text-primary`}></i>
                  </div>
                  <h3 className="text-xl font-heading font-medium text-foreground">{data.title}</h3>
                </div>
                <p className="text-sm text-foreground/70">{data.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-secondary/30 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                <i className="fas fa-question text-accent text-3xl"></i>
              </div>
            </div>
            <div className="md:w-3/4 md:pl-6 text-center md:text-left">
              <h3 className="text-2xl font-heading font-medium text-foreground mb-2">Confused? Let's Talk</h3>
              <p className="text-foreground/80 mb-4">Not sure which mood fits you? Our AI can help you discover the perfect relaxation experience.</p>
              <Button 
                onClick={scrollToAiChat}
                className="bg-accent hover:bg-accent/90 text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
              >
                <i className="fas fa-comment-dots mr-2"></i> Chat with AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
