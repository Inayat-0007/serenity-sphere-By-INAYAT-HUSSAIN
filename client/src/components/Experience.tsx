import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MOODS } from "@/lib/constants";
import { useLocation } from "wouter";
import audioController, { speechController } from "@/lib/audioController";
import { ThreeDScene } from "./ThreeDScene";
import { useToast } from "@/hooks/use-toast";
import { MoodName } from "@shared/schema";
import { getAudioForMood } from "@/lib/soundData";

interface ExperienceProps {
  mood: MoodName;
  onBack?: () => void;
}

export default function Experience({ mood, onBack }: ExperienceProps) {
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [brightness, setBrightness] = useState(60);
  const { toast } = useToast();
  
  const visualRef = useRef<HTMLVideoElement>(null);
  
  const moodData = MOODS[mood];
  
  // Set up audio and visuals
  useEffect(() => {
    if (!moodData) return;
    
    try {
      // Use embedded audio data for reliable playback
      const audioData = getAudioForMood(mood);
      
      // Load background audio using Howler
      audioController.loadBackgroundSound(audioData);
      
      // Start playing automatically
      audioController.playBackgroundSound();
      setIsPlaying(true);
      
      // Set initial volume
      audioController.setVolume(volume / 100);
      
      // Use speech synthesis for voice prompts if available
      setTimeout(() => {
        if (window.speechSynthesis) {
          const welcomeMessage = moodData.voicePrompt || `Welcome to your ${moodData.title} experience. Take a deep breath and relax.`;
          const utterance = new SpeechSynthesisUtterance(welcomeMessage);
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
        }
      }, 1500);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
    
    // Cleanup on unmount
    return () => {
      try {
        audioController.cleanup();
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch (error) {
        console.error("Audio cleanup error:", error);
      }
    };
  }, [moodData, mood, volume]);
  
  // Update volume when slider changes
  useEffect(() => {
    audioController.setVolume(volume / 100);
  }, [volume]);
  
  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      audioController.pauseBackgroundSound();
    } else {
      audioController.playBackgroundSound();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Set up a timer to track playback position
  useEffect(() => {
    let timer: number;
    
    if (isPlaying) {
      // Update every 250ms
      timer = window.setInterval(() => {
        // Since Howler doesn't provide a way to get exact position,
        // we'll simulate it with our own timer (simplified)
        if (audioController.getBackgroundPlayingState()) {
          setCurrentTime(prev => {
            // Increment time
            const newTime = prev + 0.25;
            
            // Loop back if we reach duration
            if (newTime >= duration && duration > 0) {
              return 0;
            }
            
            return newTime;
          });
        }
      }, 250);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, duration]);
  
  // Set a default duration for background sounds (typically looping ambience)
  useEffect(() => {
    // Set a default duration based on the mood (most ambient sounds are 2-5 minutes)
    const defaultDuration = 180; // 3 minutes as default
    setDuration(defaultDuration);
  }, [mood]);
  
  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    audioController.setVolume(newVolume[0] / 100);
  };
  
  // Play voice prompt
  const playVoicePrompt = () => {
    // Try to use the audio controller first (Howler.js)
    if (moodData.voicePrompt) {
      audioController.playVoicePrompt();
    } else if (speechController.isSupported()) {
      // Fall back to speech synthesis if no voice prompt is available
      speechController.speak(moodData.voicePrompt || "Breathe deeply and relax.", 0.9, 1);
    } else {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support the speech synthesis feature.",
        variant: "destructive"
      });
    }
  };
  
  // Handle going back to mood selection
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setLocation("/");
      
      // Scroll to mood selection after navigation
      setTimeout(() => {
        const moodSelection = document.getElementById("mood-selection");
        if (moodSelection) {
          moodSelection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };
  
  // Save as favorite
  const saveAsFavorite = () => {
    localStorage.setItem("favoriteMood", mood);
    toast({
      title: "Saved as favorite",
      description: `${moodData.title} has been saved as your favorite mood.`,
      variant: "default"
    });
  };
  
  if (!moodData) {
    return (
      <div className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-heading font-medium text-foreground mb-4">Mood not found</h2>
        <p className="text-foreground/80 mb-8">The selected mood could not be found.</p>
        <Button onClick={() => setLocation("/")} className="bg-accent hover:bg-accent/90 text-white">
          Return to Home
        </Button>
      </div>
    );
  }
  
  return (
    <section className="py-16 px-6 md:px-12 bg-secondary/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-heading font-medium text-foreground">Your {moodData.title} Experience</h2>
            <p className="text-foreground/80">{moodData.description}</p>
          </div>
          <Button
            id="back-to-moods"
            variant="ghost"
            onClick={handleBack}
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i> Change Mood
          </Button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 bg-primary/10 h-[400px] relative">
            {/* 3D Scene or Video */}
            <ThreeDScene mood={mood} animationSpeed={animationSpeed / 100} brightness={brightness / 100} />
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <div className="mb-6">
                  <h3 className="text-xl font-heading font-medium text-foreground mb-2">Audio Experience</h3>
                  <p className="text-foreground/70 text-sm mb-4">Soothing sounds to accompany your visual experience</p>
                  
                  <div className="audio-player bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white p-0 min-w-0"
                      >
                        <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
                      </Button>
                      
                      <div className="w-full mx-4">
                        <div className="h-2 bg-white rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full" 
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-foreground/60">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          className="text-foreground/70 hover:text-accent transition-colors mr-4 p-2 h-auto"
                          onClick={() => handleVolumeChange([volume === 0 ? 70 : 0])}
                        >
                          <i className={`fas fa-volume-${volume === 0 ? 'mute' : 'up'}`}></i>
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-foreground/70 hover:text-accent transition-colors p-2 h-auto"
                          onClick={() => {
                            // Reset playback
                            audioController.stopBackgroundSound();
                            setTimeout(() => {
                              audioController.playBackgroundSound();
                              setIsPlaying(true);
                              setCurrentTime(0);
                            }, 100);
                          }}
                        >
                          <i className="fas fa-redo"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Audio is handled by Howler.js */}
                </div>
                
                <div className="voice-prompt p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fas fa-volume-up text-primary text-sm"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Voice Prompt</h4>
                      <p className="text-foreground/70 text-sm italic">&quot;{moodData.voicePrompt}&quot;</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="ml-auto text-foreground/50 hover:text-accent transition-colors p-2 h-auto"
                      onClick={playVoicePrompt}
                    >
                      <i className="fas fa-play-circle"></i>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <h3 className="text-xl font-heading font-medium text-foreground mb-3">Settings</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Volume</label>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Animation Speed</label>
                  <Slider
                    value={[animationSpeed]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAnimationSpeed(value[0])}
                    className="w-full"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Brightness</label>
                  <Slider
                    value={[brightness]}
                    min={20}
                    max={100}
                    step={1}
                    onValueChange={(value) => setBrightness(value[0])}
                    className="w-full"
                  />
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={saveAsFavorite}
                    className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
                  >
                    <i className="fas fa-save mr-2"></i> Save as Favorite
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
