import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/UserContext";
import { Link } from "wouter";

export default function Hero() {
  const { ageGroup, setShowAgeSelection } = useUserContext();
  
  const handleStartJourney = () => {
    if (!ageGroup) {
      setShowAgeSelection(true);
      // Scroll to age selection
      const ageSelection = document.getElementById("age-selection");
      if (ageSelection) {
        ageSelection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If age is already selected, scroll to mood selection
      const moodSelection = document.getElementById("mood-selection");
      if (moodSelection) {
        moodSelection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  
  return (
    <section className="py-12 md:py-20 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-foreground leading-tight mb-6">
              Your Digital Oasis for Mindful Relaxation
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-xl">
              Experience personalized relaxation and focus with gentle animations, soothing sounds, and calming visuals tailored to your mood.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleStartJourney}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <i className="fas fa-play mr-2"></i> Start Your Journey
              </Button>
              <Button 
                variant="outline"
                className="border border-accent hover:bg-accent/10 text-accent font-medium py-3 px-6 rounded-lg transition-colors"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <i className="fas fa-info-circle mr-2"></i> Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Person meditating peacefully in natural setting" 
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 max-w-xs hidden md:block">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mr-3">
                  <i className="fas fa-check text-success"></i>
                </div>
                <p className="font-medium text-foreground">AI-Powered Guidance</p>
              </div>
              <p className="text-sm text-foreground/70">Personalized support to help you navigate life's ups and downs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
