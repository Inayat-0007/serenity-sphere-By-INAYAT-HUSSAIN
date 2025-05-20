import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-background py-4 px-6 md:px-12 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
            <i className="fas fa-spa text-background text-lg"></i>
          </div>
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-heading font-medium text-foreground cursor-pointer">
              Serenity<span className="text-accent">Sphere</span>
            </h1>
          </Link>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link href="/">
                <a className={`text-foreground hover:text-accent transition-colors ${location === "/" ? "text-accent" : ""}`}>
                  Home
                </a>
              </Link>
            </li>
            <li>
              <a href="#about" className="text-foreground hover:text-accent transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#features" className="text-foreground hover:text-accent transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#contact" className="text-foreground hover:text-accent transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-heading font-medium text-foreground">
                  Menu
                </h2>
                <Button variant="ghost" size="icon" onClick={closeMenu}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <nav className="space-y-6">
                <Link href="/" onClick={closeMenu}>
                  <a className={`block text-lg font-medium text-foreground hover:text-accent transition-colors ${location === "/" ? "text-accent" : ""}`}>
                    Home
                  </a>
                </Link>
                <a 
                  href="#about" 
                  className="block text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={closeMenu}
                >
                  About
                </a>
                <a 
                  href="#features" 
                  className="block text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={closeMenu}
                >
                  Features
                </a>
                <a 
                  href="#contact" 
                  className="block text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={closeMenu}
                >
                  Contact
                </a>
              </nav>
              
              <div className="mt-auto pt-6 border-t border-border">
                <div className="space-y-4">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <i className="fas fa-play mr-2"></i> Start Your Journey
                  </Button>
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                    <i className="fas fa-info-circle mr-2"></i> Learn More
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
