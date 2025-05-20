import { Button } from "@/components/ui/button";

export default function Support() {
  return (
    <section id="contact" className="py-16 px-6 md:px-12 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground mb-4">24/7 Support Access</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            We're here to help you on your journey to mindfulness and relaxation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <i className="fas fa-headset text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-heading font-medium text-foreground mb-3">24/7 Support Access</h3>
            <p className="text-foreground/80 mb-4">
              Reach our dedicated wellness support team anytime for personalized guidance and assistance.
            </p>
            <Button variant="link" className="text-accent hover:text-accent/80 p-0 h-auto">
              <span>Contact Support</span>
              <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <i className="fas fa-users text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-heading font-medium text-foreground mb-3">Engage with Our Wellness Community</h3>
            <p className="text-foreground/80 mb-4">
              Connect with like-minded members to share journeys, encouragement, and wellness tips.
            </p>
            <Button variant="link" className="text-accent hover:text-accent/80 p-0 h-auto">
              <span>Join Community</span>
              <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <i className="fas fa-book-open text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-heading font-medium text-foreground mb-3">Exclusive Mindfulness Resources</h3>
            <p className="text-foreground/80 mb-4">
              Discover curated articles, expert advice, and practical tips to enhance your mindful living.
            </p>
            <Button variant="link" className="text-accent hover:text-accent/80 p-0 h-auto">
              <span>Explore Resources</span>
              <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-heading font-medium text-foreground mb-4">Follow SerenitySphere Online</h3>
          <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
            Stay inspired with updates, events, and community stories on our social media channels.
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.linkedin.com/in/inayat-hussain-105a8834b/" 
              className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
