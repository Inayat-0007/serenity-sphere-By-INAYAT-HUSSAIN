import { Howl } from 'howler';

class AudioController {
  private backgroundSound: Howl | null = null;
  private voicePrompt: Howl | null = null;
  private volume: number = 0.7;
  private isBackgroundPlaying: boolean = false;
  private isVoicePlaying: boolean = false;

  /**
   * Load and play background sound
   * @param soundUrl URL of the sound to play
   * @param loop Whether to loop the sound
   */
  loadBackgroundSound(soundUrl: string, loop: boolean = true): void {
    // Stop any currently playing sound
    this.stopBackgroundSound();
    
    // Create new sound
    this.backgroundSound = new Howl({
      src: [soundUrl],
      volume: this.volume,
      loop: loop,
      html5: true,
      onload: () => {
        console.log('Background sound loaded');
      },
      onloaderror: (id, error) => {
        console.error('Error loading background sound:', error);
      }
    });
  }
  
  /**
   * Load voice prompt
   * @param promptUrl URL of the voice prompt
   */
  loadVoicePrompt(promptUrl: string): void {
    // Stop any currently playing prompt
    this.stopVoicePrompt();
    
    // Create new voice prompt
    this.voicePrompt = new Howl({
      src: [promptUrl],
      volume: this.volume,
      html5: true,
      onload: () => {
        console.log('Voice prompt loaded');
      },
      onloaderror: (id, error) => {
        console.error('Error loading voice prompt:', error);
      }
    });
  }
  
  /**
   * Play background sound
   */
  playBackgroundSound(): void {
    if (this.backgroundSound && !this.isBackgroundPlaying) {
      this.backgroundSound.play();
      this.isBackgroundPlaying = true;
    }
  }
  
  /**
   * Play voice prompt
   */
  playVoicePrompt(): void {
    if (this.voicePrompt && !this.isVoicePlaying) {
      this.voicePrompt.play();
      this.isVoicePlaying = true;
      
      // Set flag to false when done playing
      this.voicePrompt.once('end', () => {
        this.isVoicePlaying = false;
      });
    }
  }
  
  /**
   * Stop background sound
   */
  stopBackgroundSound(): void {
    if (this.backgroundSound) {
      this.backgroundSound.stop();
      this.isBackgroundPlaying = false;
    }
  }
  
  /**
   * Stop voice prompt
   */
  stopVoicePrompt(): void {
    if (this.voicePrompt) {
      this.voicePrompt.stop();
      this.isVoicePlaying = false;
    }
  }
  
  /**
   * Pause background sound
   */
  pauseBackgroundSound(): void {
    if (this.backgroundSound && this.isBackgroundPlaying) {
      this.backgroundSound.pause();
      this.isBackgroundPlaying = false;
    }
  }
  
  /**
   * Set volume for all sounds
   * @param volume Volume level (0-1)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.backgroundSound) {
      this.backgroundSound.volume(this.volume);
    }
    
    if (this.voicePrompt) {
      this.voicePrompt.volume(this.volume);
    }
  }
  
  /**
   * Get current background sound playing state
   */
  getBackgroundPlayingState(): boolean {
    return this.isBackgroundPlaying;
  }
  
  /**
   * Get current voice prompt playing state
   */
  getVoicePlayingState(): boolean {
    return this.isVoicePlaying;
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stopBackgroundSound();
    this.stopVoicePrompt();
    this.backgroundSound = null;
    this.voicePrompt = null;
  }
}

// Create a singleton instance
const audioController = new AudioController();
export default audioController;

// Web Speech API for voice navigation
export class SpeechController {
  private synth: SpeechSynthesis;
  
  constructor() {
    this.synth = window.speechSynthesis;
  }
  
  /**
   * Speak text using Web Speech API
   * @param text Text to speak
   * @param rate Speech rate (0.1-2)
   * @param pitch Speech pitch (0-2)
   */
  speak(text: string, rate: number = 1, pitch: number = 1): void {
    if (!this.synth) return;
    
    // Cancel any ongoing speech
    this.stop();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Use a gentle voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Google UK English Female')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Speak
    this.synth.speak(utterance);
  }
  
  /**
   * Stop speaking
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
  
  /**
   * Check if speech synthesis is supported
   */
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

export const speechController = new SpeechController();
