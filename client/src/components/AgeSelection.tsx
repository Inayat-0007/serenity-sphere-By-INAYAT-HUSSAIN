import { useUserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { AGE_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { speechController } from "@/lib/audioController";

export default function AgeSelection() {
  const { ageGroup, setAgeGroup, showAgeSelection, setShowAgeSelection } = useUserContext();
  const sectionRef = useRef<HTMLElement>(null);
  
  const handleAgeSelection = (age: string) => {
    setAgeGroup(age);
    
    // After selecting age, scroll to mood selection
    const moodSelection = document.getElementById("mood-selection");
    if (moodSelection) {
      moodSelection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const handleContinue = () => {
    if (!ageGroup) {
      // If no age is selected, speak a message
      if (speechController.isSupported()) {
        speechController.speak("Please select your age group to continue");
      }
      return;
    }
    
    // Scroll to mood selection
    const moodSelection = document.getElementById("mood-selection");
    if (moodSelection) {
      moodSelection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section 
      id="age-selection" 
      ref={sectionRef}
      className={cn(
        "py-10 px-6 md:px-12 bg-secondary/30 transition-opacity duration-500",
        !showAgeSelection && "opacity-50"
      )}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-heading font-medium text-foreground text-center mb-8">Choose Your Age Group</h2>
        <p className="text-center text-foreground/80 max-w-2xl mx-auto mb-10">
          SerenitySphere adapts to provide an experience that's just right for you, with content tailored to different age groups.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(AGE_GROUPS).map(([key, data]) => (
            <div 
              key={key}
              className={cn(
                "age-option bg-white rounded-xl shadow-sm p-6 text-center cursor-pointer smooth-transition hover:shadow-md",
                ageGroup === key && "bg-secondary/50 shadow-md"
              )}
              onClick={() => handleAgeSelection(key)}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <i className={`fas fa-${data.icon} text-primary text-2xl`}></i>
              </div>
              <h3 className="text-xl font-heading font-medium text-foreground mb-2">{data.title}</h3>
              <p className="text-sm text-foreground/70">{data.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            id="continue-to-moods" 
            onClick={handleContinue}
            className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Continue <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>
    </section>
  );
}
