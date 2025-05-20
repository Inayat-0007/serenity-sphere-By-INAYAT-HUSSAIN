import { useEffect, useRef, useState } from "react";
import { Canvas } from "@/components/ui/canvas";
import { MoodName } from "@shared/schema";
import { MOODS } from "@/lib/constants";
import * as THREE from "three";

interface ThreeDSceneProps {
  mood: MoodName;
  animationSpeed?: number;
  brightness?: number;
}

// Different mood scenes have different geometries and colors
const getMoodVisualSettings = (mood: MoodName) => {
  const settings = {
    geometry: "sphere",
    particleCount: 100,
    baseColor: new THREE.Color("#D2C4B0"),
    secondaryColor: new THREE.Color("#A99D8A"),
    backgroundIntensity: 0.2,
  };

  switch (mood) {
    case "Tired":
      settings.geometry = "sphere";
      settings.particleCount = 50;
      settings.baseColor = new THREE.Color("#DAD0C2");
      settings.secondaryColor = new THREE.Color("#B2A89E");
      settings.backgroundIntensity = 0.1;
      break;
    case "Chill":
      settings.geometry = "cloud";
      settings.particleCount = 75;
      settings.baseColor = new THREE.Color("#D2C4B0");
      settings.secondaryColor = new THREE.Color("#A99D8A");
      settings.backgroundIntensity = 0.2;
      break;
    case "Happy":
      settings.geometry = "flower";
      settings.particleCount = 120;
      settings.baseColor = new THREE.Color("#F0E7D8");
      settings.secondaryColor = new THREE.Color("#DDA15E");
      settings.backgroundIntensity = 0.3;
      break;
    case "Anxious":
      settings.geometry = "wave";
      settings.particleCount = 100;
      settings.baseColor = new THREE.Color("#E8E0D5");
      settings.secondaryColor = new THREE.Color("#B2A89E");
      settings.backgroundIntensity = 0.15;
      break;
    case "Focused":
      settings.geometry = "leaf";
      settings.particleCount = 30;
      settings.baseColor = new THREE.Color("#E1D6C7");
      settings.secondaryColor = new THREE.Color("#A99D8A");
      settings.backgroundIntensity = 0.25;
      break;
    case "Stressed":
      settings.geometry = "forest";
      settings.particleCount = 80;
      settings.baseColor = new THREE.Color("#E8E0D5");
      settings.secondaryColor = new THREE.Color("#6B9080");
      settings.backgroundIntensity = 0.2;
      break;
    case "Playful":
      settings.geometry = "balloon";
      settings.particleCount = 150;
      settings.baseColor = new THREE.Color("#F0E7D8");
      settings.secondaryColor = new THREE.Color("#DDA15E");
      settings.backgroundIntensity = 0.35;
      break;
    case "Calm":
      settings.geometry = "star";
      settings.particleCount = 200;
      settings.baseColor = new THREE.Color("#D2C4B0");
      settings.secondaryColor = new THREE.Color("#5F5648");
      settings.backgroundIntensity = 0.15;
      break;
    default:
      break;
  }

  return settings;
};

export function ThreeDScene({ mood, animationSpeed = 0.5, brightness = 0.6 }: ThreeDSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [particles, setParticles] = useState<THREE.Points | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Initialize the Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create scene, camera, and renderer
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
    newRenderer.setPixelRatio(window.devicePixelRatio);
    
    // Set background color based on mood (with very soft intensity)
    const { backgroundIntensity } = getMoodVisualSettings(mood);
    const bgColor = new THREE.Color("#F9F6F2");
    bgColor.multiplyScalar(brightness * backgroundIntensity);
    newScene.background = bgColor;

    // Position camera
    newCamera.position.z = 5;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, brightness);
    newScene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, brightness * 0.5);
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);

    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !newCamera || !newRenderer) return;
      
      newCamera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      // Dispose resources
      if (newRenderer) {
        newRenderer.dispose();
      }
    };
  }, [mood, brightness]);

  // Create particles based on mood
  useEffect(() => {
    if (!scene) return;

    // Remove any existing particles
    if (particles) {
      scene.remove(particles);
    }

    const { particleCount, baseColor, secondaryColor } = getMoodVisualSettings(mood);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Generate random positions, colors, and sizes
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      // Color - blend between base and secondary colors
      const mixFactor = Math.random();
      const color = new THREE.Color().lerpColors(baseColor, secondaryColor, mixFactor);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Size
      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const newParticles = new THREE.Points(geometry, material);
    scene.add(newParticles);
    setParticles(newParticles);

  }, [scene, mood]);

  // Animation loop
  useEffect(() => {
    if (!scene || !camera || !renderer || !particles) return;

    let lastTime = 0;
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      const positions = particles.geometry.attributes.position.array as Float32Array;
      
      // Apply different animations based on mood
      const { geometry } = getMoodVisualSettings(mood);
      
      for (let i = 0; i < positions.length; i += 3) {
        // Different movements based on the mood type
        switch (geometry) {
          case "sphere":
            // Slow circular motion
            positions[i] += Math.sin(time * 0.001 + i) * 0.001 * animationSpeed;
            positions[i + 1] += Math.cos(time * 0.001 + i) * 0.001 * animationSpeed;
            break;
          case "cloud":
            // Gentle drifting
            positions[i] += Math.sin(time * 0.0005 + i * 0.1) * 0.002 * animationSpeed;
            positions[i + 1] += Math.cos(time * 0.0005 + i * 0.05) * 0.001 * animationSpeed;
            break;
          case "flower":
            // Blooming effect
            const angle = (i / positions.length) * Math.PI * 2;
            const radius = 2 + Math.sin(time * 0.001 * animationSpeed) * 0.5;
            positions[i] = Math.cos(angle + time * 0.0005 * animationSpeed) * radius * 0.5;
            positions[i + 1] = Math.sin(angle + time * 0.0005 * animationSpeed) * radius * 0.5;
            break;
          case "wave":
            // Wave-like motion
            positions[i + 1] = Math.sin((positions[i] + time * 0.001 * animationSpeed) * 0.5) * 1.5;
            break;
          case "leaf":
            // Gentle falling
            positions[i + 1] -= 0.005 * animationSpeed;
            positions[i] += Math.sin(time * 0.001 + i) * 0.001 * animationSpeed;
            // Reset if out of bounds
            if (positions[i + 1] < -5) positions[i + 1] = 5;
            break;
          case "forest":
            // Swaying trees
            positions[i] += Math.sin(time * 0.0008 + positions[i + 1]) * 0.002 * animationSpeed;
            break;
          case "balloon":
            // Playful bouncing
            positions[i] += Math.sin(time * 0.001 * animationSpeed + i) * 0.003;
            positions[i + 1] += Math.cos(time * 0.001 * animationSpeed + i) * 0.003;
            positions[i + 2] += Math.sin(time * 0.002 * animationSpeed + i) * 0.002;
            break;
          case "star":
            // Twinkling stars
            const twinkle = Math.sin(time * 0.002 + i) * 0.5 + 0.5;
            const sizeAttr = particles.geometry.attributes.size;
            sizeAttr.array[i / 3] = (Math.random() * 0.3 + 0.1) * twinkle;
            sizeAttr.needsUpdate = true;
            break;
          default:
            // Default gentle movement
            positions[i] += Math.sin(time * 0.001) * 0.001 * animationSpeed;
            positions[i + 1] += Math.cos(time * 0.001) * 0.001 * animationSpeed;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;
      
      // Rotate the entire particle system very slowly
      particles.rotation.y += 0.0003 * animationSpeed;
      
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [scene, camera, renderer, particles, mood, animationSpeed]);

  return <Canvas ref={canvasRef} />;
}
