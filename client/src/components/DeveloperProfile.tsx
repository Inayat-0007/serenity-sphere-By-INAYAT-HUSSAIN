import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from './ErrorBoundary';
import { Card } from '@/components/ui/card';
import { FaLinkedin, FaGithub, FaLaptopCode } from 'react-icons/fa';
import * as THREE from 'three';

export default function DeveloperProfile() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number>(0);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [contactVisible, setContactVisible] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    try {
      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      cameraRef.current = camera;
      
      // Create renderer
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      
      // Create particles
      const particleCount = 1000;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        // Position particles in a sphere
        const radius = 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        // Add some variation in colors - blue/teal gradient
        colors[i] = 0.1 + Math.random() * 0.2; // R
        colors[i + 1] = 0.5 + Math.random() * 0.5; // G
        colors[i + 2] = 0.8 + Math.random() * 0.2; // B
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });
      
      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
      particlesRef.current = particleSystem;
      
      // Handle mouse movement
      const handleMouseMove = (event: MouseEvent) => {
        // Calculate normalized device coordinates
        const rect = canvas.getBoundingClientRect();
        mousePosition.current.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
        mousePosition.current.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      
      // Handle window resize
      const handleResize = () => {
        if (!camera || !renderer || !canvas) return;
        
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Animation loop
      const animate = () => {
        try {
          if (!particleSystem || !renderer || !scene || !camera) return;
          
          // Rotate the particle system
          particleSystem.rotation.x += 0.001;
          particleSystem.rotation.y += 0.002;
          
          // Make particles react to mouse movement
          particleSystem.rotation.x += mousePosition.current.y * 0.001;
          particleSystem.rotation.y += mousePosition.current.x * 0.001;
          
          // Render
          renderer.render(scene, camera);
          
          // Continue animation loop
          frameIdRef.current = requestAnimationFrame(animate);
        } catch (error) {
          console.error("Animation error:", error);
        }
      };
      
      animate();
      
      // Cleanup function
      return () => {
        cancelAnimationFrame(frameIdRef.current);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        
        if (particlesRef.current) {
          if (particlesRef.current.geometry) {
            particlesRef.current.geometry.dispose();
          }
          if (particlesRef.current.material) {
            (particlesRef.current.material as THREE.Material).dispose();
          }
        }
        
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    } catch (error) {
      console.error("Failed to initialize 3D scene:", error);
    }
  }, []);

  return (
    <div id="developer" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Meet the Developer
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 md:order-2">
            <ErrorBoundary>
              <div className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/20 to-teal-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-900 h-[300px] md:h-[400px]">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full cursor-pointer"
                />
              </div>
              <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                ✨ Move your mouse over the visualization to interact ✨
              </p>
            </ErrorBoundary>
          </div>
          
          <div className="w-full md:w-1/2 md:order-1">
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-teal-500"></div>
              
              <h3 className="text-2xl font-bold mb-3">Mohammad Inayat Hussain</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Full-stack developer with a passion for creating immersive digital experiences. Specializing in React, 
                Three.js, and interactive web applications that blend creativity with functionality.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <span className="w-24 text-sm font-medium text-gray-500 dark:text-gray-400">Experience:</span>
                  <span className="text-gray-700 dark:text-gray-300">5+ years</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-sm font-medium text-gray-500 dark:text-gray-400">Focus Areas:</span>
                  <span className="text-gray-700 dark:text-gray-300">Interactive 3D, WebGL, UI/UX Design</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-sm font-medium text-gray-500 dark:text-gray-400">Location:</span>
                  <span className="text-gray-700 dark:text-gray-300">Bengaluru, India</span>
                </div>
              </div>
              
              {!contactVisible ? (
                <Button 
                  className="w-full" 
                  onClick={() => setContactVisible(true)}
                >
                  Connect with Inayat
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3 flex-wrap">
                    <a 
                      href="https://www.linkedin.com/in/inayat-hussain-105a8834b/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                    >
                      <FaLinkedin className="text-lg" /> LinkedIn
                    </a>
                    <a 
                      href="https://github.com/Inayat-0007" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white text-sm hover:bg-gray-900 transition-colors"
                    >
                      <FaGithub className="text-lg" /> GitHub
                    </a>
                    <a 
                      href="https://inayat-portfolio.netlify.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-teal-600 text-white text-sm hover:bg-teal-700 transition-colors"
                    >
                      <FaLaptopCode className="text-lg" /> Portfolio
                    </a>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setContactVisible(false)}
                  >
                    Hide Contact Info
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}