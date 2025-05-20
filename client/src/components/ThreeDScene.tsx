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

// Enhanced mood scenes with different geometries, colors, and advanced visual effects
const getMoodVisualSettings = (mood: MoodName) => {
  const settings = {
    geometry: "sphere",
    particleCount: 1500, // Increased particle count for more stunning visuals
    baseColor: new THREE.Color("#D2C4B0"),
    secondaryColor: new THREE.Color("#A99D8A"),
    accentColor: new THREE.Color("#BF9270"),
    backgroundIntensity: 0.2,
    particleSize: 1.5,
    particleOpacity: 0.85,
    useShaderMaterial: false,
    bloomEffect: true,
    enableGlow: true,
  };

  switch (mood) {
    case "Tired":
      settings.geometry = "dreamySphere";
      settings.particleCount = 1200;
      settings.baseColor = new THREE.Color("#DAD0C2");
      settings.secondaryColor = new THREE.Color("#B2A89E");
      settings.accentColor = new THREE.Color("#9C8D80");
      settings.backgroundIntensity = 0.12;
      settings.particleOpacity = 0.8;
      settings.bloomEffect = true;
      break;
    case "Chill":
      settings.geometry = "etherealClouds";
      settings.particleCount = 1800;
      settings.baseColor = new THREE.Color("#D2C4B0");
      settings.secondaryColor = new THREE.Color("#A99D8A");
      settings.accentColor = new THREE.Color("#CDB4A2");
      settings.backgroundIntensity = 0.18;
      settings.particleSize = 2.0;
      settings.particleOpacity = 0.9;
      settings.useShaderMaterial = true;
      break;
    case "Happy":
      settings.geometry = "blossomingFlowers";
      settings.particleCount = 2200;
      settings.baseColor = new THREE.Color("#F0E7D8");
      settings.secondaryColor = new THREE.Color("#DDA15E");
      settings.accentColor = new THREE.Color("#E6B87C");
      settings.backgroundIntensity = 0.25;
      settings.particleSize = 2.2;
      settings.particleOpacity = 0.85;
      settings.enableGlow = true;
      break;
    case "Anxious":
      settings.geometry = "undulatingWaves";
      settings.particleCount = 1800;
      settings.baseColor = new THREE.Color("#E8E0D5");
      settings.secondaryColor = new THREE.Color("#B2A89E");
      settings.accentColor = new THREE.Color("#C0B8AE");
      settings.backgroundIntensity = 0.15;
      settings.particleSize = 1.8;
      settings.useShaderMaterial = true;
      break;
    case "Focused":
      settings.geometry = "crystalFormation";
      settings.particleCount = 1400;
      settings.baseColor = new THREE.Color("#E1D6C7");
      settings.secondaryColor = new THREE.Color("#A99D8A");
      settings.accentColor = new THREE.Color("#BCB09E");
      settings.backgroundIntensity = 0.22;
      settings.particleSize = 1.6;
      settings.particleOpacity = 0.92;
      settings.bloomEffect = true;
      break;
    case "Stressed":
      settings.geometry = "tranquilForest";
      settings.particleCount = 2000;
      settings.baseColor = new THREE.Color("#E8E0D5");
      settings.secondaryColor = new THREE.Color("#6B9080");
      settings.accentColor = new THREE.Color("#A4C3B2");
      settings.backgroundIntensity = 0.2;
      settings.particleSize = 1.9;
      settings.particleOpacity = 0.88;
      settings.enableGlow = true;
      break;
    case "Playful":
      settings.geometry = "floatingBalloons";
      settings.particleCount = 2500;
      settings.baseColor = new THREE.Color("#F0E7D8");
      settings.secondaryColor = new THREE.Color("#DDA15E");
      settings.accentColor = new THREE.Color("#F2CC8F");
      settings.backgroundIntensity = 0.28;
      settings.particleSize = 2.5;
      settings.particleOpacity = 0.95;
      settings.useShaderMaterial = true;
      settings.bloomEffect = true;
      break;
    case "Calm":
      settings.geometry = "cosmicStars";
      settings.particleCount = 3000;
      settings.baseColor = new THREE.Color("#D2C4B0");
      settings.secondaryColor = new THREE.Color("#5F5648");
      settings.accentColor = new THREE.Color("#8C7B6B");
      settings.backgroundIntensity = 0.12;
      settings.particleSize = 1.8;
      settings.particleOpacity = 0.9;
      settings.enableGlow = true;
      settings.bloomEffect = true;
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
  const [customObjects, setCustomObjects] = useState<THREE.Object3D[]>([]);
  const frameIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Initialize the Three.js scene with enhanced visuals
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create scene, camera, and renderer with enhanced capabilities
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
      precision: "highp", // Higher precision for better visuals
    });

    newRenderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    newRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    newRenderer.toneMapping = THREE.ACESFilmicToneMapping; // More realistic tone mapping
    newRenderer.toneMappingExposure = 1.2; // Slightly brighter exposure
    
    // Set background color based on mood with enhanced aesthetics
    const { backgroundIntensity } = getMoodVisualSettings(mood);
    const bgColor = new THREE.Color("#F9F6F2");
    bgColor.multiplyScalar(brightness * backgroundIntensity);
    newScene.background = bgColor;
    newScene.fog = new THREE.FogExp2(bgColor, 0.02); // Add subtle fog for depth

    // Position camera with a slight offset for better perspective
    newCamera.position.z = 8;
    newCamera.position.y = 0.5;
    newCamera.lookAt(0, 0, 0);

    // Enhanced lighting setup
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, brightness * 0.6);
    newScene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, brightness * 0.7);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    newScene.add(directionalLight);

    // Fill light for additional dimension
    const fillLight = new THREE.DirectionalLight(0xffeedd, brightness * 0.4);
    fillLight.position.set(-1, 0.5, -1);
    newScene.add(fillLight);

    // Rim light for edge highlights
    const rimLight = new THREE.DirectionalLight(0xffffee, brightness * 0.3);
    rimLight.position.set(0, -1, 0);
    newScene.add(rimLight);

    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);

    // Responsive design
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
      
      // Clean up resources
      customObjects.forEach(obj => {
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
  }, [mood, brightness]);

  // Create advanced particle systems and 3D objects based on mood
  useEffect(() => {
    if (!scene) return;

    // Clean up previous objects
    if (particles) {
      scene.remove(particles);
    }
    
    customObjects.forEach(obj => {
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
    
    setCustomObjects([]);
    
    const { 
      particleCount, 
      baseColor, 
      secondaryColor, 
      accentColor, 
      geometry: geoType, 
      particleSize,
      particleOpacity,
      useShaderMaterial,
      enableGlow
    } = getMoodVisualSettings(mood);

    // Create new objects based on mood geometry type
    const newCustomObjects: THREE.Object3D[] = [];
    
    // Create the main particle system with enhanced visuals
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount); // For varied animation phases
    
    // Generate particles with more complex distribution patterns based on mood
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const phi = Math.random() * Math.PI * 2; // Random angle
      const cosTheta = Math.random() * 2 - 1; // Random height
      const theta = Math.acos(cosTheta); // Convert to angle
      const radius = 5 + (Math.random() - 0.5) * 2; // Base radius with variation
      
      // Different particle distributions based on mood geometry
      switch(geoType) {
        case "dreamySphere":
          // Dreamy sphere with particles concentrated in cloud-like formations
          if (i % 3 === 0) {
            // Create cloud clusters
            const cluster = Math.floor(i / 50);
            const clusterAngle = cluster * 1.5;
            const clusterRadius = 4 + Math.sin(cluster) * 2;
            positions[i3] = Math.cos(phi + clusterAngle) * Math.sin(theta) * clusterRadius + (Math.random() - 0.5) * 2;
            positions[i3 + 1] = Math.cos(theta) * clusterRadius + (Math.random() - 0.5) * 2;
            positions[i3 + 2] = Math.sin(phi + clusterAngle) * Math.sin(theta) * clusterRadius + (Math.random() - 0.5) * 2;
          } else {
            // Random particles for the dreamy effect
            positions[i3] = (Math.random() - 0.5) * 14;
            positions[i3 + 1] = (Math.random() - 0.5) * 14;
            positions[i3 + 2] = (Math.random() - 0.5) * 14;
          }
          break;
          
        case "etherealClouds":
          // Cloud-like formations
          const cloudLayer = Math.floor(Math.random() * 5);
          const layerHeight = cloudLayer * 0.8 - 2;
          const cloudRadius = 6 + cloudLayer * 0.5;
          positions[i3] = (Math.random() - 0.5) * cloudRadius;
          positions[i3 + 1] = layerHeight + (Math.random() - 0.5) * 1.5;
          positions[i3 + 2] = (Math.random() - 0.5) * cloudRadius;
          break;
          
        case "blossomingFlowers":
          // Flower-like patterns
          if (i % 5 === 0) {
            // Flower centers
            const flowerCount = 12;
            const flowerIndex = Math.floor(i / 100) % flowerCount;
            const flowerAngle = (flowerIndex / flowerCount) * Math.PI * 2;
            const flowerRadius = 3 + flowerIndex % 3;
            positions[i3] = Math.cos(flowerAngle) * flowerRadius + (Math.random() - 0.5) * 0.5;
            positions[i3 + 1] = (Math.random() - 0.5) * 8;
            positions[i3 + 2] = Math.sin(flowerAngle) * flowerRadius + (Math.random() - 0.5) * 0.5;
          } else {
            // Petals and scattered particles
            const angle = (i / particleCount) * Math.PI * 20;
            const spiralRadius = 6 * Math.sqrt(i / particleCount);
            positions[i3] = Math.cos(angle) * spiralRadius;
            positions[i3 + 1] = (Math.random() - 0.5) * 12;
            positions[i3 + 2] = Math.sin(angle) * spiralRadius;
          }
          break;
          
        case "undulatingWaves":
          // Wave-like patterns
          const waveX = (Math.random() - 0.5) * 16;
          const waveZ = (Math.random() - 0.5) * 16;
          const waveHeight = Math.sin(waveX * 0.5) * Math.cos(waveZ * 0.3) * 2;
          positions[i3] = waveX;
          positions[i3 + 1] = waveHeight + (Math.random() - 0.5) * 1;
          positions[i3 + 2] = waveZ;
          break;
          
        case "crystalFormation":
          // Crystal lattice structure
          if (i % 3 === 0) {
            // Central crystalline formation
            const crystalLayer = Math.floor(i / 150) % 5;
            const layerAngle = crystalLayer * Math.PI / 5;
            const crystalRadius = 2 + crystalLayer * 0.8;
            positions[i3] = Math.cos(phi + layerAngle) * Math.sin(theta) * crystalRadius;
            positions[i3 + 1] = Math.cos(theta) * crystalRadius;
            positions[i3 + 2] = Math.sin(phi + layerAngle) * Math.sin(theta) * crystalRadius;
          } else {
            // Outlying particles
            positions[i3] = (Math.random() - 0.5) * 12;
            positions[i3 + 1] = (Math.random() - 0.5) * 12;
            positions[i3 + 2] = (Math.random() - 0.5) * 12;
          }
          break;
          
        case "tranquilForest":
          // Forest-like structure with trees
          if (i % 80 < 5) {
            // Tree trunks
            const treeX = (Math.floor(i / 80) % 10 - 5) * 1.5;
            const treeZ = (Math.floor(i / 800) % 10 - 5) * 1.5;
            positions[i3] = treeX + (Math.random() - 0.5) * 0.3;
            positions[i3 + 1] = (Math.random()) * 5 - 2; // Vertical trunk
            positions[i3 + 2] = treeZ + (Math.random() - 0.5) * 0.3;
          } else if (i % 80 < 30) {
            // Tree canopies
            const treeX = (Math.floor(i / 80) % 10 - 5) * 1.5;
            const treeZ = (Math.floor(i / 800) % 10 - 5) * 1.5;
            const angle = Math.random() * Math.PI * 2;
            const canopyRadius = Math.random() * 1.5;
            positions[i3] = treeX + Math.cos(angle) * canopyRadius;
            positions[i3 + 1] = 3 + Math.random() * 2; // Canopy height
            positions[i3 + 2] = treeZ + Math.sin(angle) * canopyRadius;
          } else {
            // Forest floor and atmosphere
            positions[i3] = (Math.random() - 0.5) * 16;
            positions[i3 + 1] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = (Math.random() - 0.5) * 16;
          }
          break;
          
        case "floatingBalloons":
          // Playful balloon clusters
          if (i % 100 < 80) {
            // Balloon clusters
            const clusterIndex = Math.floor(i / 100);
            const clusterX = ((clusterIndex % 5) - 2) * 3;
            const clusterY = ((Math.floor(clusterIndex / 5) % 5) - 2) * 3;
            const clusterZ = ((Math.floor(clusterIndex / 25) % 5) - 2) * 3;
            
            positions[i3] = clusterX + (Math.random() - 0.5) * 2;
            positions[i3 + 1] = clusterY + (Math.random() - 0.5) * 2;
            positions[i3 + 2] = clusterZ + (Math.random() - 0.5) * 2;
          } else {
            // Scattered particles
            positions[i3] = (Math.random() - 0.5) * 16;
            positions[i3 + 1] = (Math.random() - 0.5) * 16;
            positions[i3 + 2] = (Math.random() - 0.5) * 16;
          }
          break;
          
        case "cosmicStars":
          // Starfield with galaxies and nebulae
          if (i % 200 < 50) {
            // Galaxy spiral
            const armAngle = (i % 4) * Math.PI / 2 + Math.random() * 0.5;
            const armRadius = Math.random() * 6 + 1;
            const spiralOffset = (i / particleCount) * 20;
            positions[i3] = Math.cos(armAngle + spiralOffset) * armRadius;
            positions[i3 + 1] = (Math.random() - 0.5) * 2;
            positions[i3 + 2] = Math.sin(armAngle + spiralOffset) * armRadius;
          } else {
            // Star field
            const distance = Math.random() * 8 + 4;
            positions[i3] = Math.cos(phi) * Math.sin(theta) * distance;
            positions[i3 + 1] = Math.cos(theta) * distance;
            positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * distance;
          }
          break;
          
        default:
          // Default distribution as spherical field
          positions[i3] = Math.cos(phi) * Math.sin(theta) * radius;
          positions[i3 + 1] = Math.cos(theta) * radius;
          positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
      }
      
      // Color - enhanced blending between three color palette
      let mixFactor1 = Math.random();
      let mixFactor2 = Math.random();
      // Normalize factors to ensure proper blending
      const factorSum = mixFactor1 + mixFactor2;
      mixFactor1 /= factorSum;
      mixFactor2 /= factorSum;
      
      // Create a blended color from the three palette colors
      const colorTemp = new THREE.Color();
      colorTemp.copy(baseColor).multiplyScalar(mixFactor1)
              .add(secondaryColor.clone().multiplyScalar(mixFactor2))
              .add(accentColor.clone().multiplyScalar(1 - mixFactor1 - mixFactor2));
              
      // Apply brightness adjustment
      colorTemp.multiplyScalar(brightness);
      
      colors[i3] = colorTemp.r;
      colors[i3 + 1] = colorTemp.g;
      colors[i3 + 2] = colorTemp.b;
      
      // Size - varied based on position and mood
      const distanceFromCenter = Math.sqrt(
        positions[i3] * positions[i3] + 
        positions[i3 + 1] * positions[i3 + 1] + 
        positions[i3 + 2] * positions[i3 + 2]
      );
      
      // Size variation based on distance and random factor
      const sizeVariation = (1 - distanceFromCenter / 10) * 0.7 + Math.random() * 0.3;
      sizes[i] = Math.max(0.1, sizeVariation * particleSize);
      
      // Random phase for animation variety
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    // Create material based on mood settings
    let material: THREE.Material;
    
    if (useShaderMaterial) {
      // Advanced shader material for more complex effects
      material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          brightness: { value: brightness },
        },
        vertexShader: `
          attribute float size;
          attribute float phase;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform float pixelRatio;
          uniform float brightness;
          
          void main() {
            vColor = color * brightness;
            
            // Position animation based on mood
            vec3 pos = position;
            
            // Custom animation based on geometry type
            ${geoType === 'etherealClouds' ? `
              // Cloud-like flowing movement
              float noiseFreq = 0.2;
              float noiseAmp = 0.4;
              pos.x += sin(time * 0.1 + phase + pos.z * noiseFreq) * noiseAmp;
              pos.y += cos(time * 0.07 + phase * 2.0 + pos.x * noiseFreq) * noiseAmp * 0.5;
              pos.z += sin(time * 0.05 + phase * 1.5 + pos.y * noiseFreq) * noiseAmp * 0.7;
            ` : geoType === 'blossomingFlowers' ? `
              // Blooming flower movement
              float bloomFactor = sin(time * 0.15 + phase) * 0.5 + 0.5;
              pos *= mix(0.8, 1.1, bloomFactor);
              pos.y += sin(time * 0.1 + phase * 2.0) * 0.2;
            ` : geoType === 'floatingBalloons' ? `
              // Playful floating movement
              pos.x += sin(time * 0.1 + phase + pos.y * 0.5) * 0.3;
              pos.y += cos(time * 0.15 + phase * 2.0) * 0.15;
              pos.z += sin(time * 0.12 + phase * 1.5 + pos.x * 0.5) * 0.2;
            ` : `
              // Default smooth flowing movement
              pos.x += sin(time * 0.1 + phase) * 0.1;
              pos.y += cos(time * 0.1 + phase * 2.0) * 0.1;
              pos.z += sin(time * 0.1 + phase * 1.5) * 0.1;
            `}
            
            // Transform position
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Size attenuation for more realistic depth
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            // Circular point shape with soft edge
            float r = 0.5;
            vec2 uv = gl_PointCoord - vec2(0.5);
            float distance = length(uv);
            
            // Smooth circle with soft edges
            float alpha = 1.0 - smoothstep(r - 0.1, r, distance);
            
            // Glow effect
            float glow = exp(-2.0 * distance);
            vec3 finalColor = mix(vColor, vColor * 1.5, glow * 0.5);
            
            // Output final color
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true,
      });
    } else {
      // Standard point material with enhanced settings
      material = new THREE.PointsMaterial({
        size: particleSize * 0.1,
        vertexColors: true,
        transparent: true,
        opacity: particleOpacity,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
      });
      
      // Add texture for particles if glowing effect is enabled
      if (enableGlow) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d')!;
        
        // Create a radial gradient for a soft glow
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        (material as THREE.PointsMaterial).map = texture;
      }
    }

    const newParticles = new THREE.Points(geometry, material);
    scene.add(newParticles);
    setParticles(newParticles);
    
    // Add additional mood-specific 3D elements
    switch (geoType) {
      case "dreamySphere": {
        // Add a larger, soft central glow
        const sphereGeo = new THREE.SphereGeometry(2, 32, 32);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: baseColor,
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphere);
        newCustomObjects.push(sphere);
        break;
      }
      
      case "undulatingWaves": {
        // Add a reflective plane for the water surface
        const planeGeo = new THREE.PlaneGeometry(20, 20, 32, 32);
        const planeMat = new THREE.MeshStandardMaterial({
          color: secondaryColor,
          transparent: true,
          opacity: 0.4,
          metalness: 0.2,
          roughness: 0.1,
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -3;
        scene.add(plane);
        newCustomObjects.push(plane);
        break;
      }
      
      case "crystalFormation": {
        // Add geometric crystal formations
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 3;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          const crystalGeo = new THREE.ConeGeometry(0.8, 2, 4);
          const crystalMat = new THREE.MeshStandardMaterial({
            color: accentColor,
            transparent: true,
            opacity: 0.7,
            metalness: 0.9,
            roughness: 0.1,
          });
          
          const crystal = new THREE.Mesh(crystalGeo, crystalMat);
          crystal.position.set(x, 0, z);
          crystal.rotation.x = Math.random() * 0.3;
          crystal.rotation.z = Math.random() * 0.3;
          crystal.lookAt(0, 0, 0);
          scene.add(crystal);
          newCustomObjects.push(crystal);
        }
        break;
      }
      
      case "tranquilForest": {
        // Add stylized trees
        for (let i = 0; i < 10; i++) {
          const x = (i % 3 - 1) * 4;
          const z = (Math.floor(i / 3) - 1) * 4;
          
          // Tree trunk
          const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 3, 8);
          const trunkMat = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color('#8B4513'),
            roughness: 0.8,
          });
          const trunk = new THREE.Mesh(trunkGeo, trunkMat);
          trunk.position.set(x, 0, z);
          
          // Tree canopy
          const canopyGeo = new THREE.SphereGeometry(1, 16, 16);
          const canopyMat = new THREE.MeshStandardMaterial({ 
            color: secondaryColor,
            roughness: 0.7,
          });
          const canopy = new THREE.Mesh(canopyGeo, canopyMat);
          canopy.position.set(0, 2, 0);
          canopy.scale.set(1, 1.5, 1);
          
          trunk.add(canopy);
          scene.add(trunk);
          newCustomObjects.push(trunk);
        }
        break;
      }
      
      case "cosmicStars": {
        // Add central glowing nebula
        const nebulaGeo = new THREE.SphereGeometry(3, 32, 32);
        const nebulaMat = new THREE.MeshBasicMaterial({
          color: accentColor,
          transparent: true,
          opacity: 0.15,
          blending: THREE.AdditiveBlending,
        });
        const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
        scene.add(nebula);
        newCustomObjects.push(nebula);
        
        // Add distant star field (larger stars in the background)
        const starfieldGeo = new THREE.BufferGeometry();
        const starCount = 500;
        const starPositions = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
          const i3 = i * 3;
          const angle = Math.random() * Math.PI * 2;
          const height = Math.random() * Math.PI - Math.PI/2;
          const distance = 40 + Math.random() * 60;
          
          starPositions[i3] = Math.cos(angle) * Math.cos(height) * distance;
          starPositions[i3 + 1] = Math.sin(height) * distance;
          starPositions[i3 + 2] = Math.sin(angle) * Math.cos(height) * distance;
          
          starSizes[i] = Math.random() * 3 + 1;
        }
        
        starfieldGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starfieldGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
        
        const starfieldMat = new THREE.PointsMaterial({
          size: 0.2,
          color: 0xffffff,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: false,
        });
        
        const starfield = new THREE.Points(starfieldGeo, starfieldMat);
        scene.add(starfield);
        newCustomObjects.push(starfield);
        break;
      }
    }
    
    setCustomObjects(newCustomObjects);

  }, [scene, mood, brightness]);

  // Enhanced animation loop with advanced effects
  useEffect(() => {
    if (!scene || !camera || !renderer || !particles) return;

    let lastTime = 0;
    const moodSettings = getMoodVisualSettings(mood);
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      timeRef.current = time * 0.001; // Convert to seconds for easier calculations
      
      // Update shader uniforms if using shader material
      if (moodSettings.useShaderMaterial && particles.material instanceof THREE.ShaderMaterial) {
        particles.material.uniforms.time.value = timeRef.current;
      }
      
      const positions = particles.geometry.attributes.position.array as Float32Array;
      const sizes = particles.geometry.attributes.size.array as Float32Array;
      const phases = particles.geometry.attributes.phase?.array as Float32Array;
      
      // Apply different animations based on mood with enhanced effects
      const { geometry: geoType } = moodSettings;
      
      for (let i = 0; i < positions.length; i += 3) {
        const index = i / 3;
        const phaseOffset = phases ? phases[index] : Math.random() * Math.PI * 2;
        
        // Different movements based on the mood type - enhanced animations
        switch (geoType) {
          case "dreamySphere": {
            // Dreamy pulsating sphere with gentle undulations
            const particleDistance = Math.sqrt(
              positions[i] * positions[i] + 
              positions[i + 1] * positions[i + 1] + 
              positions[i + 2] * positions[i + 2]
            );
            
            // Gentle breathing effect
            const breathingFactor = Math.sin(timeRef.current * 0.2 + phaseOffset) * 0.1 + 1;
            
            // Only apply to particles within the main sphere
            if (particleDistance < 7) {
              // Normalize current position
              const nx = positions[i] / particleDistance;
              const ny = positions[i + 1] / particleDistance;
              const nz = positions[i + 2] / particleDistance;
              
              // Calculate new distance with breathing
              const newDist = particleDistance * breathingFactor;
              
              // Apply subtle rotation and breathing
              const rotAngle = timeRef.current * 0.1 * animationSpeed;
              const cosa = Math.cos(rotAngle);
              const sina = Math.sin(rotAngle);
              
              // Apply position updates
              positions[i] = (nx * cosa - nz * sina) * newDist + Math.sin(timeRef.current * 0.3 + phaseOffset) * 0.1;
              positions[i + 1] = ny * newDist + Math.sin(timeRef.current * 0.2 + phaseOffset) * 0.1;
              positions[i + 2] = (nx * sina + nz * cosa) * newDist + Math.cos(timeRef.current * 0.3 + phaseOffset) * 0.1;
            } else {
              // Subtle movement for outer particles
              positions[i] += Math.sin(timeRef.current * 0.2 + phaseOffset) * 0.01 * animationSpeed;
              positions[i + 1] += Math.cos(timeRef.current * 0.3 + phaseOffset) * 0.01 * animationSpeed;
              positions[i + 2] += Math.sin(timeRef.current * 0.25 + phaseOffset) * 0.01 * animationSpeed;
            }
            
            // Pulsate size
            if (sizes) {
              sizes[index] = (0.1 + Math.sin(timeRef.current + phaseOffset) * 0.05) * moodSettings.particleSize;
            }
            break;
          }
          
          case "etherealClouds": {
            // Cloud formations that drift and reshape
            positions[i] += Math.sin(timeRef.current * 0.1 + phaseOffset + positions[i + 2] * 0.1) * 0.01 * animationSpeed;
            positions[i + 1] += Math.cos(timeRef.current * 0.08 + phaseOffset * 1.5) * 0.005 * animationSpeed;
            positions[i + 2] += Math.sin(timeRef.current * 0.12 + phaseOffset + positions[i] * 0.1) * 0.01 * animationSpeed;
            
            // Cloud layers drift at different speeds
            const layerOffset = Math.floor((positions[i + 1] + 5) / 2);
            positions[i] += (layerOffset * 0.001) * animationSpeed;
            
            // Reset particles that drift too far
            if (Math.abs(positions[i]) > 10) positions[i] = -positions[i] * 0.8;
            if (Math.abs(positions[i + 2]) > 10) positions[i + 2] = -positions[i + 2] * 0.8;
            
            // Size variations
            if (sizes) {
              const basePulse = Math.sin(timeRef.current * 0.3 + phaseOffset) * 0.3 + 0.7;
              sizes[index] = basePulse * moodSettings.particleSize * (0.8 + Math.random() * 0.4);
            }
            break;
          }
          
          case "blossomingFlowers": {
            // Complex blooming and swaying effect
            // Calculate particle distance from origin for petals
            const distXZ = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);
            
            if (distXZ > 0.5 && distXZ < 8) {
              // This is likely a petal particle
              const angle = Math.atan2(positions[i + 2], positions[i]);
              const bloomFactor = (Math.sin(timeRef.current * 0.3 + angle * 2) * 0.15 + 1) * animationSpeed;
              
              // Blooming effect - expand and contract
              positions[i] = Math.cos(angle) * distXZ * bloomFactor;
              positions[i + 2] = Math.sin(angle) * distXZ * bloomFactor;
              
              // Gentle vertical swaying
              positions[i + 1] += Math.sin(timeRef.current * 0.2 + angle) * 0.01 * animationSpeed;
              
              // Size animations for petals
              if (sizes) {
                sizes[index] = (Math.sin(timeRef.current * 0.5 + phaseOffset) * 0.3 + 0.8) * moodSettings.particleSize;
              }
            } else {
              // Background particles - gentle drifting
              positions[i] += Math.sin(timeRef.current * 0.1 + phaseOffset) * 0.01 * animationSpeed;
              positions[i + 1] += Math.cos(timeRef.current * 0.12 + phaseOffset) * 0.01 * animationSpeed;
              positions[i + 2] += Math.sin(timeRef.current * 0.14 + phaseOffset) * 0.01 * animationSpeed;
              
              if (sizes) {
                sizes[index] = (Math.random() * 0.5 + 0.5) * moodSettings.particleSize;
              }
            }
            break;
          }
          
          case "undulatingWaves": {
            // Complex wave patterns that flow and ripple
            const time = timeRef.current * animationSpeed;
            const waveX = positions[i];
            const waveZ = positions[i + 2];
            
            // Multiple overlapping wave patterns
            const wave1 = Math.sin(waveX * 0.5 + time * 0.5) * 0.5;
            const wave2 = Math.sin(waveZ * 0.3 + time * 0.3) * 0.3;
            const wave3 = Math.sin((waveX + waveZ) * 0.2 + time * 0.7) * 0.2;
            
            // Combined wave height
            positions[i + 1] = wave1 + wave2 + wave3;
            
            // Subtle horizontal movement
            positions[i] += Math.sin(time * 0.2 + phaseOffset) * 0.01;
            positions[i + 2] += Math.cos(time * 0.2 + phaseOffset) * 0.01;
            
            // Keep within bounds
            if (Math.abs(positions[i]) > 10) positions[i] *= 0.98;
            if (Math.abs(positions[i + 2]) > 10) positions[i + 2] *= 0.98;
            
            // Size variations for waves
            if (sizes) {
              const heightFactor = Math.abs(positions[i + 1]) / 2;
              sizes[index] = (0.5 + heightFactor) * moodSettings.particleSize;
            }
            break;
          }
          
          case "crystalFormation": {
            // Crystalline formations that subtly rotate and shimmer
            const dist = Math.sqrt(
              positions[i] * positions[i] + 
              positions[i + 1] * positions[i + 1] + 
              positions[i + 2] * positions[i + 2]
            );
            
            if (dist < 5) {
              // Inner crystal structure - rotating lattice
              const angle = timeRef.current * 0.1 * animationSpeed;
              const x = positions[i];
              const z = positions[i + 2];
              
              // Rotate around y-axis
              positions[i] = x * Math.cos(angle) - z * Math.sin(angle);
              positions[i + 2] = x * Math.sin(angle) + z * Math.cos(angle);
              
              // Crystalline pulsing
              const pulseFactor = Math.sin(timeRef.current * 0.4 + dist) * 0.05 + 1;
              positions[i] *= pulseFactor;
              positions[i + 1] *= pulseFactor;
              positions[i + 2] *= pulseFactor;
            } else {
              // Outer particles - gentle orbital motion
              positions[i] += Math.sin(timeRef.current * 0.2 + phaseOffset + positions[i + 1]) * 0.01 * animationSpeed;
              positions[i + 1] += Math.cos(timeRef.current * 0.15 + phaseOffset + positions[i]) * 0.01 * animationSpeed;
              positions[i + 2] += Math.sin(timeRef.current * 0.18 + phaseOffset + positions[i + 2]) * 0.01 * animationSpeed;
            }
            
            // Size variations - crystals shimmer
            if (sizes) {
              sizes[index] = (Math.sin(timeRef.current * 2 + phaseOffset * 10) * 0.3 + 0.7) * moodSettings.particleSize;
            }
            break;
          }
          
          case "tranquilForest": {
            // Forest with swaying trees and falling leaves
            const isLeaf = positions[i + 1] > 0 && Math.abs(positions[i]) < 8 && Math.abs(positions[i + 2]) < 8;
            
            if (isLeaf) {
              // Leaves falling gently with swaying
              positions[i + 1] -= 0.01 * animationSpeed;
              positions[i] += Math.sin(timeRef.current + phaseOffset) * 0.01 * animationSpeed;
              positions[i + 2] += Math.cos(timeRef.current * 0.9 + phaseOffset) * 0.01 * animationSpeed;
              
              // Reset leaves that fall below the ground
              if (positions[i + 1] < -3) {
                positions[i + 1] = 3 + Math.random() * 2;
                positions[i] = (Math.random() - 0.5) * 16;
                positions[i + 2] = (Math.random() - 0.5) * 16;
              }
            } else {
              // Background particles and tree elements
              positions[i] += Math.sin(timeRef.current * 0.1 + phaseOffset) * 0.005 * animationSpeed;
              positions[i + 1] += Math.cos(timeRef.current * 0.12 + phaseOffset) * 0.003 * animationSpeed;
              positions[i + 2] += Math.sin(timeRef.current * 0.09 + phaseOffset) * 0.005 * animationSpeed;
            }
            
            // Size variations
            if (sizes) {
              sizes[index] = (Math.random() * 0.5 + 0.5) * moodSettings.particleSize;
            }
            break;
          }
          
          case "floatingBalloons": {
            // Playful floating balloons with gentle bobbing
            const isBalloon = index % 100 < 80;
            
            if (isBalloon) {
              // Balloon movement - floating upward with playful bobbing
              positions[i] += Math.sin(timeRef.current * 0.3 + phaseOffset) * 0.02 * animationSpeed;
              positions[i + 1] += 0.01 * animationSpeed; // Gentle upward drift
              positions[i + 2] += Math.cos(timeRef.current * 0.25 + phaseOffset) * 0.02 * animationSpeed;
              
              // Reset balloons that float too high
              if (positions[i + 1] > 8) {
                positions[i + 1] = -8;
                positions[i] = (Math.random() - 0.5) * 16;
                positions[i + 2] = (Math.random() - 0.5) * 16;
              }
              
              // Size variations for balloons - breathing effect
              if (sizes) {
                const breathe = Math.sin(timeRef.current * 0.5 + phaseOffset) * 0.2 + 1;
                sizes[index] = breathe * moodSettings.particleSize;
              }
            } else {
              // Background particles - gentle swirling
              positions[i] += Math.sin(timeRef.current * 0.1 + phaseOffset) * 0.01 * animationSpeed;
              positions[i + 1] += Math.cos(timeRef.current * 0.15 + phaseOffset) * 0.01 * animationSpeed;
              positions[i + 2] += Math.sin(timeRef.current * 0.12 + phaseOffset) * 0.01 * animationSpeed;
              
              if (sizes) {
                sizes[index] = 0.5 * moodSettings.particleSize;
              }
            }
            break;
          }
          
          case "cosmicStars": {
            // Cosmic starfield with galaxies and nebulae
            const dist = Math.sqrt(
              positions[i] * positions[i] + 
              positions[i + 1] * positions[i + 1] + 
              positions[i + 2] * positions[i + 2]
            );
            
            if (dist < 7) {
              // Galaxy center - rotating particles
              const angle = timeRef.current * 0.05 * animationSpeed;
              const radius = dist;
              const x = positions[i];
              const z = positions[i + 2];
              
              // Rotate around y-axis at varying speeds based on distance
              const rotationSpeed = 1 - radius / 10; // Faster near center
              positions[i] = x * Math.cos(angle * rotationSpeed) - z * Math.sin(angle * rotationSpeed);
              positions[i + 2] = x * Math.sin(angle * rotationSpeed) + z * Math.cos(angle * rotationSpeed);
              
              // Add vertical wobble
              positions[i + 1] += Math.sin(timeRef.current * 0.2 + dist) * 0.002 * animationSpeed;
            } else {
              // Distant stars - subtle twinkling
              positions[i] += Math.sin(timeRef.current * 0.02 + phaseOffset) * 0.001 * animationSpeed;
              positions[i + 1] += Math.cos(timeRef.current * 0.02 + phaseOffset) * 0.001 * animationSpeed;
              positions[i + 2] += Math.sin(timeRef.current * 0.02 + phaseOffset) * 0.001 * animationSpeed;
            }
            
            // Twinkling effect for stars
            if (sizes) {
              const twinkle = Math.sin(timeRef.current * 2 + phaseOffset * 10) * 0.4 + 0.6;
              sizes[index] = twinkle * moodSettings.particleSize * (dist < 7 ? 1.5 : 1);
            }
            break;
          }
          
          default: {
            // Default gentle movement
            positions[i] += Math.sin(timeRef.current * 0.1 + phaseOffset) * 0.01 * animationSpeed;
            positions[i + 1] += Math.cos(timeRef.current * 0.11 + phaseOffset) * 0.01 * animationSpeed;
            positions[i + 2] += Math.sin(timeRef.current * 0.12 + phaseOffset) * 0.01 * animationSpeed;
            
            if (sizes) {
              sizes[index] = (Math.random() * 0.5 + 0.5) * moodSettings.particleSize;
            }
          }
        }
      }

      // Update the geometry attributes
      particles.geometry.attributes.position.needsUpdate = true;
      if (particles.geometry.attributes.size) particles.geometry.attributes.size.needsUpdate = true;
      
      // Update custom objects
      customObjects.forEach((obj, i) => {
        switch (geoType) {
          case "dreamySphere": {
            if (obj instanceof THREE.Mesh) {
              // Pulsate the central glow
              const scale = Math.sin(timeRef.current * 0.2) * 0.1 + 1.1;
              obj.scale.set(scale, scale, scale);
            }
            break;
          }
          
          case "undulatingWaves": {
            if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.PlaneGeometry) {
              // Gentle undulation of water surface
              const geometry = obj.geometry;
              const positions = geometry.attributes.position.array as Float32Array;
              
              for (let i = 0; i < positions.length; i += 3) {
                const x = geometry.attributes.position.getX(i/3);
                const z = geometry.attributes.position.getZ(i/3);
                
                // Create gentle waves
                positions[i + 1] = Math.sin(x * 0.5 + timeRef.current * 0.5) * 0.2 + 
                                  Math.sin(z * 0.3 + timeRef.current * 0.3) * 0.3;
              }
              
              geometry.attributes.position.needsUpdate = true;
              geometry.computeVertexNormals();
            }
            break;
          }
          
          case "crystalFormation": {
            if (obj instanceof THREE.Mesh) {
              // Rotate and pulse the crystals
              obj.rotation.y += 0.002 * animationSpeed;
              const scale = Math.sin(timeRef.current * 0.3 + i) * 0.1 + 1;
              obj.scale.set(scale, scale, scale);
            }
            break;
          }
          
          case "tranquilForest": {
            if (obj instanceof THREE.Mesh) {
              // Sway the trees
              obj.rotation.x = Math.sin(timeRef.current * 0.1 + i) * 0.05;
              obj.rotation.z = Math.sin(timeRef.current * 0.15 + i * 2) * 0.07;
            }
            break;
          }
          
          case "cosmicStars": {
            if (i === 0 && obj instanceof THREE.Mesh) {
              // Pulsate the central nebula
              const scale = Math.sin(timeRef.current * 0.1) * 0.2 + 1.2;
              obj.scale.set(scale, scale, scale);
            } else if (i === 1 && obj instanceof THREE.Points) {
              // Rotate the distant stars
              obj.rotation.y += 0.0001 * animationSpeed;
            }
            break;
          }
        }
      });
      
      // Gently rotate camera to create a more immersive experience
      camera.position.x = Math.sin(timeRef.current * 0.05) * 1;
      camera.position.y = Math.cos(timeRef.current * 0.07) * 0.5 + 0.5;
      camera.lookAt(0, 0, 0);
      
      // Render the scene
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [scene, camera, renderer, particles, customObjects, mood, animationSpeed, brightness]);

  return <Canvas ref={canvasRef} />;
}
