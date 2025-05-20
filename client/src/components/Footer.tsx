import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white py-12 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                <i className="fas fa-spa text-background text-sm"></i>
              </div>
              <h3 className="text-xl font-heading font-medium text-foreground">
                Serenity<span className="text-accent">Sphere</span>
              </h3>
            </div>
            <p className="text-foreground/70 mb-4">
              Your digital oasis for mindful relaxation. Discover peace and focus in a hectic world.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/inayat-hussain-105a8834b/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent hover:text-accent/80 transition-colors"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-accent hover:text-accent/80 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-accent hover:text-accent/80 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-accent hover:text-accent/80 transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-foreground/70 hover:text-accent transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <a href="#about" className="text-foreground/70 hover:text-accent transition-colors">About Us</a>
              </li>
              <li>
                <a href="#features" className="text-foreground/70 hover:text-accent transition-colors">Features</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#contact" className="text-foreground/70 hover:text-accent transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent transition-colors">Community</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent transition-colors">Support</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-foreground mb-4">Developer</h4>
            <p className="text-foreground/70 mb-2">Mohammad Inayat Hussain</p>
            <div className="flex space-y-2 flex-col">
              <a 
                href="https://www.linkedin.com/in/inayat-hussain-105a8834b/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent hover:text-accent/80 transition-colors flex items-center"
              >
                <i className="fab fa-linkedin-in mr-2"></i>
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://github.com/Inayat-0007" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent hover:text-accent/80 transition-colors flex items-center"
              >
                <i className="fab fa-github mr-2"></i>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-secondary">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/70 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SerenitySphere. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-foreground/70 hover:text-accent transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-foreground/70 hover:text-accent transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-foreground/70 hover:text-accent transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
