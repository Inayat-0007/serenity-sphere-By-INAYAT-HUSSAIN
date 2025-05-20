import { useEffect, useState, useRef } from "react";
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
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// Simple animated elements
function AnimatedElement({ 
  children, 
  animation = 'fade', 
  delay = 0,
  className = '' 
}: {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-right' | 'scale' | 'rotate';
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Define styles based on animation type
  let animationCSS = {};
  if (!isVisible) {
    switch (animation) {
      case 'fade':
        animationCSS = { opacity: 0 };
        break;
      case 'slide-up':
        animationCSS = { opacity: 0, transform: 'translateY(40px)' };
        break;
      case 'slide-right':
        animationCSS = { opacity: 0, transform: 'translateX(-40px)' };
        break;
      case 'scale':
        animationCSS = { opacity: 0, transform: 'scale(0.9)' };
        break;
      case 'rotate':
        animationCSS = { opacity: 0, transform: 'rotate(-5deg)' };
        break;
    }
  }
  
  return (
    <div 
      ref={elementRef}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        ...animationCSS,
        transitionDelay: `${delay}s`,
        ...(isVisible ? { opacity: 1, transform: 'none' } : {})
      }}
    >
      {children}
    </div>
  );
}

// Parallax element that moves at different speed when scrolling
function ParallaxElement({ 
  children, 
  speed = 0.2,
  className = ''
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const { scrollY } = useScrollAnimation();
  const [transform, setTransform] = useState('translateY(0)');
  
  useEffect(() => {
    // Calculate parallax offset based on scroll position
    const offset = scrollY * speed;
    setTransform(`translateY(${offset}px)`);
  }, [scrollY, speed]);
  
  return (
    <div 
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  );
}

// Decorative animated background elements
function BackgroundElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
      {/* Generate some decorative shapes */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 100 + 50;
        const isCircle = i % 2 === 0;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const color = [
          '#D2C4B0', '#BF9270', '#A99D8A', '#E8E0D5'
        ][i % 4];
        
        return (
          <div 
            key={i}
            className={`absolute ${isCircle ? 'rounded-full' : 'rounded-md'} opacity-20`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              transform: `rotate(${i * 10}deg)`,
              transition: 'transform 3s ease-out, top 3s ease-out',
              animationName: `float-${i % 3}`,
              animationDuration: `${20 + i}s`,
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
              animationTimingFunction: 'ease-in-out'
            }}
          />
        );
      })}
      
      {/* Add some animation keyframes */}
      <style jsx>{`
        @keyframes float-0 {
          0% { transform: translateY(0) rotate(0); }
          100% { transform: translateY(-50px) rotate(5deg); }
        }
        @keyframes float-1 {
          0% { transform: translateY(0) rotate(0); }
          100% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-2 {
          0% { transform: translateY(0) rotate(0); }
          100% { transform: translateY(-70px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}

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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Background decorative elements */}
      <BackgroundElements />
      
      <Header />
      <main>
        {/* Hero section with fade animation */}
        <AnimatedElement animation="fade">
          <Hero />
        </AnimatedElement>
        
        {/* Age selection with slide-up animation */}
        <AnimatedElement animation="slide-up" delay={0.2}>
          <AgeSelection />
        </AnimatedElement>
        
        {/* Mood selection with parallax effect */}
        <ParallaxElement speed={-0.1}>
          <AnimatedElement animation="fade" delay={0.3}>
            <MoodSelection />
          </AnimatedElement>
        </ParallaxElement>
        
        {/* AI Chat with slide-in effect */}
        <AnimatedElement animation="slide-right" delay={0.4}>
          <AIChat />
        </AnimatedElement>
        
        {/* Features with fade animation */}
        <AnimatedElement animation="fade" delay={0.2}>
          <Features />
        </AnimatedElement>
        
        {/* Testimonials with scale animation */}
        <ParallaxElement speed={0.1}>
          <AnimatedElement animation="scale" delay={0.3}>
            <Testimonials />
          </AnimatedElement>
        </ParallaxElement>
        
        {/* Newsletter with fade animation */}
        <AnimatedElement animation="fade" delay={0.3}>
          <Newsletter />
        </AnimatedElement>
        
        {/* Support section with rotation animation */}
        <AnimatedElement animation="rotate" delay={0.2}>
          <Support />
        </AnimatedElement>
      </main>
      <Footer />
    </div>
  );
}
