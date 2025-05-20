import React, { useEffect, useState, useRef } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import * as THREE from 'three';
import { Canvas } from '@/components/ui/canvas';

// Decorative 3D elements that respond to scrolling
export function ScrollDecorations() {
  const { scrollY, scrollProgress, scrollDirection, getAnimationValues, isMobile } = useScrollAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [objects, setObjects] = useState<THREE.Object3D[]>([]);
  const frameIdRef = useRef<number | null>(null);
  
  // Animation constants based on device
  const particleCount = isMobile ? 30 : 50;
  const rotationSpeed = isMobile ? 0.3 : 1;
  
  // Initialize the 3D scene
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Setup
    const newScene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    
    const newRenderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    
    newRenderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    newRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Set transparent background
    newRenderer.setClearColor(0x000000, 0);
    
    // Position camera
    newCamera.position.z = 5;
    newCamera.position.y = 0;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    newScene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);
    
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    
    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !newCamera || !newRenderer) return;
      
      newCamera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      // Clean up
      objects.forEach(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      
      if (newRenderer) {
        newRenderer.dispose();
      }
    };
  }, [objects]);
  
  // Create decorative 3D objects
  useEffect(() => {
    if (!scene) return;
    
    // Clean up previous objects
    objects.forEach(obj => {
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    
    const newObjects: THREE.Object3D[] = [];
    
    // Create particles
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    // Color palette
    const colors = [
      new THREE.Color("#D2C4B0"),
      new THREE.Color("#BF9270"),
      new THREE.Color("#A99D8A"),
      new THREE.Color("#E8E0D5")
    ];
    
    // Create different geometric shapes
    const shapes = [];
    
    // Create floating geometric elements
    for (let i = 0; i < 12; i++) {
      let geometry;
      // Different shapes for visual interest
      switch (i % 4) {
        case 0:
          geometry = new THREE.IcosahedronGeometry(isMobile ? 0.15 : 0.2, 0);
          break;
        case 1:
          geometry = new THREE.OctahedronGeometry(isMobile ? 0.18 : 0.25, 0);
          break;
        case 2:
          geometry = new THREE.TetrahedronGeometry(isMobile ? 0.15 : 0.22, 0);
          break;
        default:
          geometry = new THREE.TorusGeometry(isMobile ? 0.12 : 0.18, 0.05, 16, 16);
      }
      
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.85,
        metalness: 0.2,
        roughness: 0.7
      });
      
      const shape = new THREE.Mesh(geometry, material);
      
      // Position randomly in space
      shape.position.x = (Math.random() - 0.5) * (isMobile ? 5 : 8);
      shape.position.y = (Math.random() - 0.5) * (isMobile ? 5 : 8);
      shape.position.z = (Math.random() - 0.5) * 3 - 2;
      
      // Store initial position for animation
      shape.userData.initialX = shape.position.x;
      shape.userData.initialY = shape.position.y;
      shape.userData.initialZ = shape.position.z;
      
      // Random rotation speed
      shape.userData.rotationSpeedX = (Math.random() - 0.5) * 0.01 * rotationSpeed;
      shape.userData.rotationSpeedY = (Math.random() - 0.5) * 0.01 * rotationSpeed;
      shape.userData.rotationSpeedZ = (Math.random() - 0.5) * 0.01 * rotationSpeed;
      
      // Random movement speed
      shape.userData.movementSpeed = Math.random() * 0.01 + 0.005;
      shape.userData.amplitude = Math.random() * 0.5 + 0.5;
      shape.userData.phaseOffset = Math.random() * Math.PI * 2;
      
      scene.add(shape);
      newObjects.push(shape);
    }
    
    setObjects(newObjects);
  }, [scene, particleCount, isMobile, rotationSpeed]);
  
  // Animation loop with scroll effects
  useEffect(() => {
    if (!scene || !camera || !renderer || objects.length === 0) return;
    
    // Precalculate animation values to prevent recreation on each frame
    const heroAnimationConfig = { 
      startOffset: 0, 
      endOffset: 0.3, 
      mobileMultiplier: 0.5 
    };
    
    const midPageAnimationConfig = { 
      startOffset: 0.3, 
      endOffset: 0.7,
      mobileMultiplier: 0.6
    };
    
    const bottomAnimationConfig = { 
      startOffset: 0.7, 
      endOffset: 1,
      reverse: true,
      mobileMultiplier: 0.6
    };
    
    let lastScrollY = scrollY;
    let lastScrollDirection = scrollDirection;
    let lastScrollProgress = scrollProgress;
    
    const animate = () => {
      // Get animation values based on scroll - only when needed
      const heroAnimation = getAnimationValues(heroAnimationConfig);
      const midPageAnimation = getAnimationValues(midPageAnimationConfig);
      const bottomAnimation = getAnimationValues(bottomAnimationConfig);
      
      // Apply different animations based on scroll position
      objects.forEach((obj, index) => {
        // Rotate continuously
        obj.rotation.x += obj.userData.rotationSpeedX;
        obj.rotation.y += obj.userData.rotationSpeedY;
        obj.rotation.z += obj.userData.rotationSpeedZ;
        
        // Get base position
        const baseX = obj.userData.initialX;
        const baseY = obj.userData.initialY;
        const baseZ = obj.userData.initialZ;
        
        // Time-based animations
        const now = Date.now() * 0.001;
        const sine = Math.sin(now + obj.userData.phaseOffset);
        const cosine = Math.cos(now + obj.userData.phaseOffset);
        
        // Different behavior based on scroll section
        if (index % 3 === 0) {
          // Top section objects react to hero scrolling
          obj.position.x = baseX + sine * obj.userData.amplitude;
          obj.position.y = baseY - heroAnimation.value * 5; // Move down as user scrolls down
          
          // Fade out
          if (obj.material && !Array.isArray(obj.material)) {
            obj.material.opacity = 0.85 * (1 - heroAnimation.value);
          }
        } else if (index % 3 === 1) {
          // Middle section objects
          obj.position.y = baseY + cosine * obj.userData.amplitude;
          
          // Move horizontally based on scroll
          const direction = index % 2 === 0 ? 1 : -1;
          obj.position.x = baseX + direction * midPageAnimation.value * 3;
          
          // Scale up and down
          const scale = 1 + midPageAnimation.value * 0.5;
          obj.scale.set(scale, scale, scale);
          
          if (obj.material && !Array.isArray(obj.material)) {
            obj.material.opacity = 0.5 + midPageAnimation.value * 0.5;
          }
        } else {
          // Bottom section objects
          obj.position.z = baseZ + bottomAnimation.value * 3; // Move toward camera
          
          // Spin faster when in view
          obj.rotation.x += obj.userData.rotationSpeedX * (1 + bottomAnimation.value * 2);
          obj.rotation.y += obj.userData.rotationSpeedY * (1 + bottomAnimation.value * 2);
          
          if (obj.material && !Array.isArray(obj.material)) {
            obj.material.opacity = 0.3 + bottomAnimation.value * 0.7;
          }
        }
        
        // Additional scroll direction effect - only apply when direction changes
        if (lastScrollDirection !== scrollDirection) {
          if (scrollDirection === 'up') {
            obj.position.y += 0.01; // Subtle upward movement when scrolling up
          } else if (scrollDirection === 'down') {
            obj.position.y -= 0.01; // Subtle downward movement when scrolling down
          }
          
          lastScrollDirection = scrollDirection;
        }
      });
      
      // Camera movement based on scroll - only update when scroll position changes
      if (camera && lastScrollProgress !== scrollProgress) {
        camera.position.y = (scrollProgress - 0.5) * 0.5;
        camera.lookAt(scene.position);
        lastScrollProgress = scrollProgress;
      }
      
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    frameIdRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [scene, camera, renderer, objects]);
  
  return (
    <div className="scroll-decorations fixed inset-0 pointer-events-none z-0 opacity-60">
      <Canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

// Individual animated elements that respond to scroll
export function ScrollElement({ 
  children, 
  animation = 'fade', 
  delay = 0,
  startOffset = 0.1,
  endOffset = 0.3,
  reverse = false,
  className = ''
}: {
  children: React.ReactNode,
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'rotate',
  delay?: number,
  startOffset?: number,
  endOffset?: number,
  reverse?: boolean,
  className?: string
}) {
  const { getAnimationValues } = useScrollAnimation();
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: reverse ? 1 : 0,
    transform: getInitialTransform(animation),
    transition: `opacity 0.5s ease, transform 0.5s ease`,
    transitionDelay: `${delay}s`
  });
  const elementRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  
  // Get initial transform based on animation type
  function getInitialTransform(animation: string): string {
    switch (animation) {
      case 'slide-up': return 'translateY(40px)';
      case 'slide-left': return 'translateX(40px)';
      case 'slide-right': return 'translateX(-40px)';
      case 'scale': return 'scale(0.8)';
      case 'rotate': return 'rotate(-5deg)';
      default: return 'none';
    }
  }
  
  // Get transformed style based on animation progress
  function getTransformedStyle(progress: number, animation: string): React.CSSProperties {
    // Calculate the effective progress based on reverse flag
    const effectiveProgress = reverse ? 1 - progress : progress;
    
    const baseStyle: React.CSSProperties = {
      opacity: reverse ? 1 - effectiveProgress : effectiveProgress,
      transition: `opacity 0.5s ease, transform 0.5s ease`,
      transitionDelay: `${delay}s`
    };
    
    // Apply transform based on animation type and progress
    switch (animation) {
      case 'slide-up':
        baseStyle.transform = `translateY(${40 * (1 - effectiveProgress)}px)`;
        break;
      case 'slide-left':
        baseStyle.transform = `translateX(${40 * (1 - effectiveProgress)}px)`;
        break;
      case 'slide-right':
        baseStyle.transform = `translateX(${-40 * (1 - effectiveProgress)}px)`;
        break;
      case 'scale':
        baseStyle.transform = `scale(${0.8 + (0.2 * effectiveProgress)})`;
        break;
      case 'rotate':
        baseStyle.transform = `rotate(${-5 * (1 - effectiveProgress)}deg)`;
        break;
    }
    
    return baseStyle;
  }
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Mark as visible once it's been seen
        if (entries[0].isIntersecting) {
          visibleRef.current = true;
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(elementRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current || !visibleRef.current) return;
      
      // Get animation values based on scroll position
      const { progress } = getAnimationValues({
        startOffset,
        endOffset,
        reverse
      });
      
      // Update style based on scroll progress
      setStyle(getTransformedStyle(progress, animation));
    };
    
    // Initial calculation
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [animation, delay, startOffset, endOffset, reverse, getAnimationValues]);
  
  return (
    <div ref={elementRef} style={style} className={className}>
      {children}
    </div>
  );
}

// Parallax section that moves at different speeds when scrolling
export function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
  direction = 'vertical'
}: {
  children: React.ReactNode,
  speed?: number,
  className?: string,
  direction?: 'vertical' | 'horizontal'
}) {
  const { scrollY } = useScrollAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(sectionRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (!inView) return;
    
    const calculateOffset = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate how far the section is from the center of the viewport
      const sectionCenter = rect.top + scrollPosition + rect.height / 2;
      const viewportCenter = scrollPosition + windowHeight / 2;
      const distanceFromCenter = sectionCenter - viewportCenter;
      
      // Calculate parallax offset
      setOffset(distanceFromCenter * speed * -0.1);
    };
    
    calculateOffset();
    
    window.addEventListener('scroll', calculateOffset, { passive: true });
    window.addEventListener('resize', calculateOffset, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', calculateOffset);
      window.removeEventListener('resize', calculateOffset);
    };
  }, [inView, speed, scrollY]);
  
  const parallaxStyle: React.CSSProperties = {
    transform: direction === 'vertical' 
      ? `translateY(${offset}px)` 
      : `translateX(${offset}px)`,
    transition: 'transform 0.1s ease-out'
  };
  
  return (
    <div ref={sectionRef} className={`parallax-section ${className}`} style={parallaxStyle}>
      {children}
    </div>
  );
}

// Container for floating elements that move on scroll
export function FloatingElements({
  count = 5,
  colors = ['#D2C4B0', '#BF9270', '#A99D8A', '#E8E0D5'],
  className = ''
}: {
  count?: number,
  colors?: string[],
  className?: string
}) {
  const { scrollProgress, scrollDirection } = useScrollAnimation();
  const isMobile = useIsMobile();
  
  // Generate floating elements
  const elements = Array.from({ length: count }, (_, i) => {
    const size = Math.random() * (isMobile ? 40 : 80) + 20; // Size in pixels
    const initialLeft = Math.random() * 100; // % position
    const initialTop = Math.random() * 100; // % position
    const speed = Math.random() * 2 + 1;
    const delay = Math.random() * 2;
    const color = colors[i % colors.length];
    const shape = i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'triangle';
    
    return { size, initialLeft, initialTop, speed, delay, color, shape, id: i };
  });
  
  return (
    <div className={`floating-elements fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elements.map((el) => (
        <FloatingElement 
          key={el.id}
          size={el.size}
          initialLeft={el.initialLeft}
          initialTop={el.initialTop}
          speed={el.speed}
          delay={el.delay}
          color={el.color}
          shape={el.shape}
          scrollProgress={scrollProgress}
          scrollDirection={scrollDirection}
        />
      ))}
    </div>
  );
}

// Individual floating element
function FloatingElement({
  size,
  initialLeft,
  initialTop,
  speed,
  delay,
  color,
  shape,
  scrollProgress,
  scrollDirection
}: {
  size: number,
  initialLeft: number,
  initialTop: number,
  speed: number,
  delay: number,
  color: string,
  shape: 'circle' | 'square' | 'triangle',
  scrollProgress: number,
  scrollDirection: 'up' | 'down' | null
}) {
  const [position, setPosition] = useState({
    left: initialLeft,
    top: initialTop,
    rotation: Math.random() * 360
  });
  
  useEffect(() => {
    // Update position based on scroll
    const newLeft = initialLeft + Math.sin(scrollProgress * Math.PI * 2 + delay) * speed * 10;
    const newTop = initialTop + Math.cos(scrollProgress * Math.PI * 2 + delay) * speed * 5;
    const newRotation = position.rotation + speed * (scrollDirection === 'up' ? -1 : 1);
    
    setPosition({
      left: newLeft,
      top: newTop,
      rotation: newRotation
    });
  }, [scrollProgress, scrollDirection, initialLeft, initialTop, speed, delay, position.rotation]);
  
  const style: React.CSSProperties = {
    position: 'absolute',
    width: `${size}px`,
    height: shape !== 'triangle' ? `${size}px` : `${size * 0.866}px`,
    left: `${position.left}%`,
    top: `${position.top}%`,
    backgroundColor: shape !== 'triangle' ? color : 'transparent',
    borderRadius: shape === 'circle' ? '50%' : '0',
    opacity: 0.15,
    transform: `rotate(${position.rotation}deg)`,
    transition: 'transform 0.5s ease-out, left 0.5s ease-out, top 0.5s ease-out',
    zIndex: -1
  };
  
  // Create triangle shape
  const triangleStyle = shape === 'triangle' ? {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeft: `${size / 2}px solid transparent`,
    borderRight: `${size / 2}px solid transparent`,
    borderBottom: `${size * 0.866}px solid ${color}`,
  } : {};
  
  return (
    <div style={{ ...style, ...triangleStyle }} />
  );
}

// Helper hook for checking mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return isMobile;
}