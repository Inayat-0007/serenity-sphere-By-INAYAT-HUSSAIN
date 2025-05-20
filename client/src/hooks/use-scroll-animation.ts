import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from './use-mobile';

export function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Calculate maximum scroll height
    const getMaxScroll = () => {
      return document.documentElement.scrollHeight - window.innerHeight;
    };
    
    // Handle scroll event
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scroll position
      setScrollY(currentScrollY);
      
      // Calculate scroll progress (0 to 1)
      const maxScroll = getMaxScroll();
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
      setScrollProgress(progress);
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      
      // Update reference for next comparison
      lastScrollY.current = currentScrollY;
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Create animation values based on scroll position
  const getAnimationValues = (options: {
    startOffset?: number; // When animation starts (0-1)
    endOffset?: number;   // When animation ends (0-1)
    reverse?: boolean;    // Reverse the animation
    mobileMultiplier?: number; // Adjust intensity on mobile
  } = {}) => {
    const { 
      startOffset = 0, 
      endOffset = 1, 
      reverse = false,
      mobileMultiplier = 0.7
    } = options;
    
    // Calculate progress within the specified range
    let rangeProgress = 0;
    if (scrollProgress >= startOffset && scrollProgress <= endOffset) {
      rangeProgress = (scrollProgress - startOffset) / (endOffset - startOffset);
    } else if (scrollProgress > endOffset) {
      rangeProgress = 1;
    }
    
    // Apply reverse if needed
    if (reverse) {
      rangeProgress = 1 - rangeProgress;
    }
    
    // Apply mobile adjustment if on mobile
    const multiplier = isMobile ? mobileMultiplier : 1;
    
    return {
      progress: rangeProgress,
      value: rangeProgress * multiplier,
      scrollY,
      scrollDirection,
      isMobile
    };
  };
  
  return {
    scrollY,
    scrollProgress,
    scrollDirection,
    getAnimationValues,
    isMobile
  };
}