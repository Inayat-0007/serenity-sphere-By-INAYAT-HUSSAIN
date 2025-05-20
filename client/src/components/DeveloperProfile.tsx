import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DeveloperProfile() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);
  const isMobile = useIsMobile();
  const [hoverCard, setHoverCard] = useState<string | null>(null);

  // Developer information
  const developerInfo = {
    name: "Mohammad Inayat Hussain",
    title: "MERN Stack Developer",
    subtitle: "Problem-Solver & Agile Decision Maker",
    location: "Hyderabad, Telangana, India",
    email: "inayatinayat552000@gmail.com",
    phone: "+91 8595260860",
    skills: [
      "JavaScript", "React", "Node.js", "MongoDB", "Express.js",
      "Python", "GenAI", "HTML/CSS", "AWS"
    ],
    interests: ["Artificial Intelligence", "LLMs", "Web3"],
    socials: [
      { name: "GitHub", url: "https://github.com/Inayat-0007", icon: "github" },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/inayat-hussain-105a8834b/", icon: "linkedin" },
      { name: "Portfolio", url: "https://inayat-portfolio.netlify.app/", icon: "globe" }
    ],
    about: "As an emerging MERN stack developer, I excel at creating robust, scalable web applications using MongoDB, Express.js, React, and Node.js. My passion for technology extends to Artificial Intelligence, where I explore its potential to enhance user experiences and address complex challenges. Additionally, my Python skills enable me to streamline processes through effective scripting and automation, adding versatility to my expertise. Hands-on projects have refined my ability to adapt, troubleshoot, and deliver industry-standard solutions."
  };

  // Setup the 3D scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize the scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      70,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    rendererRef.current = renderer;

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create network-like nodes representing skills
    const nodes: THREE.Mesh[] = [];
    const lines: THREE.Line[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);

    // Create materials with different colors
    const nodeMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xfcd34d }), // Yellow
      new THREE.MeshStandardMaterial({ color: 0xfb923c }), // Orange
      new THREE.MeshStandardMaterial({ color: 0xf87171 })  // Red
    ];

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.3,
    });

    // Place nodes in a network formation
    const nodeCount = 15; // Number of nodes
    const positions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Create more interesting positions (not just random)
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      
      // Calculate positions on a sphere for a more organized look
      let x = 2.5 * Math.sin(phi) * Math.cos(theta);
      let y = 2.5 * Math.sin(phi) * Math.sin(theta);
      let z = 2.5 * Math.cos(phi);

      // Add some randomness
      x += (Math.random() - 0.5) * 0.3;
      y += (Math.random() - 0.5) * 0.3;
      z += (Math.random() - 0.5) * 0.3;

      // Store position
      positions.push(new THREE.Vector3(x, y, z));

      // Create node
      const nodeMaterial = nodeMaterials[i % nodeMaterials.length].clone();
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(x, y, z);
      scene.add(node);
      nodes.push(node);

      // Randomly connect nodes with lines
      for (let j = 0; j < i; j++) {
        // Only connect some nodes (30% chance)
        if (Math.random() > 0.7) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, z),
            positions[j]
          ]);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
          lines.push(line);
        }
      }
    }

    nodesRef.current = nodes;
    linesRef.current = lines;

    // Set up resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);
    
    // Start animation
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Slowly rotate the entire scene
      nodesRef.current.forEach((node, i) => {
        // Different rotation speeds and directions for more organic movement
        const speed = 0.002 * (1 + (i % 3) * 0.2);
        const radius = node.position.length();
        const theta = Math.atan2(node.position.x, node.position.z) + speed;
        
        node.position.x = radius * Math.sin(theta);
        node.position.z = radius * Math.cos(theta);

        // Make nodes pulse
        const scale = 1 + 0.1 * Math.sin(time * 0.003 + i);
        node.scale.set(scale, scale, scale);
      });

      // Update connecting lines
      linesRef.current.forEach((line, i) => {
        // Update line positions to follow nodes
        if (i < nodesRef.current.length - 1) {
          const positions = line.geometry.attributes.position.array as Float32Array;
          
          // Update line endpoints to match connected nodes
          positions[0] = nodesRef.current[i].position.x;
          positions[1] = nodesRef.current[i].position.y;
          positions[2] = nodesRef.current[i].position.z;
          
          positions[3] = nodesRef.current[i+1].position.x;
          positions[4] = nodesRef.current[i+1].position.y;
          positions[5] = nodesRef.current[i+1].position.z;
          
          line.geometry.attributes.position.needsUpdate = true;
        }
      });

      // Slowly rotate entire scene for a dynamic effect
      sceneRef.current.rotation.y += 0.001;
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    let time = 0;
    const updateTime = () => {
      time += 16; // Approximately 60fps
      frameIdRef.current = requestAnimationFrame(updateTime);
    };
    
    frameIdRef.current = requestAnimationFrame(updateTime);
    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      // Clean up resources
      nodesRef.current.forEach(node => {
        node.geometry.dispose();
        (node.material as THREE.Material).dispose();
      });
      
      linesRef.current.forEach(line => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <section className="py-16 px-6 bg-black text-white relative overflow-hidden" id="developer">
      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl font-bold mb-2 text-center text-amber-400">About The Developer</h2>
        <p className="text-center text-gray-400 mb-12">The mind behind SerenitySphere</p>
        
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* 3D Network Background */}
          <div 
            ref={containerRef} 
            className="w-full lg:w-1/2 h-[300px] lg:h-[500px] relative rounded-xl overflow-hidden"
          >
            <canvas ref={canvasRef} className="absolute inset-0" />
            
            {/* Developer image overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative bg-black bg-opacity-50 p-4 rounded-full border-2 border-amber-400 w-40 h-40 lg:w-64 lg:h-64 overflow-hidden">
                <img 
                  src="https://github.com/Inayat-0007.png" 
                  alt="Mohammad Inayat Hussain"
                  className="w-full h-full object-cover rounded-full" 
                />
                
                {/* Highlight ring animation */}
                <div className="absolute inset-0 border-4 border-amber-400 rounded-full animate-pulse opacity-30"></div>
              </div>
            </div>
          </div>
          
          {/* Developer info */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">{developerInfo.name}</h3>
              <p className="text-xl text-amber-400 mb-1">{developerInfo.title}</p>
              <p className="text-gray-400">{developerInfo.subtitle}</p>
              <p className="text-gray-500 mt-2">{developerInfo.location}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed">{developerInfo.about}</p>
            </div>
            
            {/* Technology skills */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-amber-400 mb-3">Technologies & Skills</h4>
              <div className="flex flex-wrap gap-2">
                {developerInfo.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Interest areas */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-amber-400 mb-3">Interest Areas</h4>
              <div className="flex flex-wrap gap-2">
                {developerInfo.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-900 border border-amber-500/30 rounded-full text-sm text-amber-300"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Social links */}
            <div className="flex gap-4">
              {developerInfo.socials.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full
                    transition-all duration-300 hover:scale-110
                    ${hoverCard === social.name ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400'}
                  `}
                  onMouseEnter={() => setHoverCard(social.name)}
                  onMouseLeave={() => setHoverCard(null)}
                >
                  <i className={`fas fa-${social.icon}`}></i>
                </a>
              ))}
              
              <Button 
                variant="outline" 
                className="ml-auto border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black"
                onClick={() => window.open(`mailto:${developerInfo.email}`)}
              >
                Get In Touch
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background gradient effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent z-0"></div>
    </section>
  );
}