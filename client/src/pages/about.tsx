import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeveloperProfile from "@/components/DeveloperProfile";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function About() {
  const { scrollY } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-16 px-6 md:py-20">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                About SerenitySphere
              </h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl text-foreground/80 mb-8">
                  SerenitySphere is a digital oasis designed to provide personalized relaxation and mindfulness 
                  experiences tailored to your unique needs and preferences.
                </p>
                
                <h2 className="text-2xl font-heading font-semibold text-foreground mt-12 mb-4">Our Mission</h2>
                <p>
                  In today's fast-paced world, finding moments of tranquility is more important than ever. 
                  SerenitySphere was created with the mission to make mindfulness accessible to everyone, 
                  regardless of age or experience level. We believe that personalized relaxation experiences 
                  can significantly improve mental wellbeing and help people navigate daily stresses with greater ease.
                </p>
                
                <h2 className="text-2xl font-heading font-semibold text-foreground mt-12 mb-4">Key Features</h2>
                <ul>
                  <li>
                    <strong>Personalized Experiences:</strong> Content tailored to different age groups and moods
                  </li>
                  <li>
                    <strong>Immersive 3D Visualizations:</strong> Dynamic visual experiences that respond to your interactions
                  </li>
                  <li>
                    <strong>Adaptive Audio:</strong> Calming soundscapes that complement your chosen mood
                  </li>
                  <li>
                    <strong>AI-Assisted Guidance:</strong> Intelligent chat assistant to help you find what works best for you
                  </li>
                  <li>
                    <strong>Voice Prompts:</strong> Gentle guided instructions to enhance your relaxation journey
                  </li>
                </ul>
                
                <h2 className="text-2xl font-heading font-semibold text-foreground mt-12 mb-4">How It Works</h2>
                <p>
                  SerenitySphere begins by understanding your age group and current emotional state. 
                  Using this information, our platform creates a tailored experience combining visual, audio, 
                  and interactive elements designed to help you achieve your desired mindfulness goals.
                </p>
                <p>
                  Whether you're feeling anxious and need calming, tired and seeking gentle relaxation, or 
                  simply want to enhance your focus, SerenitySphere adapts to meet your needs in the moment.
                </p>
                
                <h2 className="text-2xl font-heading font-semibold text-foreground mt-12 mb-4">The Technology</h2>
                <p>
                  Built using modern web technologies, SerenitySphere leverages the power of React for the 
                  user interface, Three.js for immersive 3D visualizations, and Howler.js for seamless audio experiences. 
                  The responsive design ensures that your relaxation journey remains uninterrupted whether you're on desktop or mobile.
                </p>
                
                <div 
                  className="parallax-element my-16 p-6 bg-primary/5 rounded-lg border border-primary/20 shadow-lg"
                  style={{
                    transform: `translateY(${scrollY * 0.05}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  <p className="italic text-center text-lg text-foreground/70">
                    "SerenitySphere was born from the belief that technology should serve our wellbeing, 
                    creating spaces of digital calm in our increasingly connected lives."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Developer Profile Section */}
        <DeveloperProfile />
        
      </main>
      <Footer />
    </div>
  );
}