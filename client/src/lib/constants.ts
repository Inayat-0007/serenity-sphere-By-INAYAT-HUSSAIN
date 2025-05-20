import { MoodName, AgeGroup } from "@shared/schema";

export const MOODS: Record<MoodName, {
  title: string;
  description: string;
  icon: string;
  image: string;
  visualUrl: string;
  audioUrl: string;
  voicePrompt: string;
}> = {
  "Tired": {
    title: "Tired",
    description: "Gentle relaxation to help you unwind and rest.",
    icon: "moon",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop",
    visualUrl: "https://player.vimeo.com/external/454681659.sd.mp4?s=c01126df3f3adb2c52c8b82a6f283dcd17e8de56&profile_id=164&oauth2_token_id=57447761",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_1fb29c1397.mp3",
    voicePrompt: "Allow your body to relax. Feel the tension melt away as you drift into tranquility."
  },
  "Chill": {
    title: "Chill",
    description: "Let your worries drift away with soothing sensations.",
    icon: "cloud",
    image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop",
    visualUrl: "https://player.vimeo.com/external/386433661.sd.mp4?s=de43faed0ac5196c3f6333088ada6b403b861b69&profile_id=164&oauth2_token_id=57447761",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_428d1f5860.mp3",
    voicePrompt: "Let your worries drift away like clouds in a gentle breeze. Feel the calm spreading through your body."
  },
  "Happy": {
    title: "Happy",
    description: "Embrace the feeling of joy and positive energy.",
    icon: "smile",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop",
    visualUrl: "https://player.vimeo.com/external/314181352.sd.mp4?s=d96fdf7cfd5bb09dee3e25d28d614e72d2a8e5d2&profile_id=164&oauth2_token_id=57447761",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/13/audio_ccf97ad22b.mp3",
    voicePrompt: "Embrace the feeling of joy. Feel positivity flowing through you, bringing light to every part of your being."
  },
  "Anxious": {
    title: "Anxious",
    description: "Find your inner stillness with calming rhythms.",
    icon: "water",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop",
    visualUrl: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4992bcc0996守hcd4e2c16a6d&profile_id=165&oauth2_token_id=57447761",
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_8cb749dc4c.mp3",
    voicePrompt: "Find your inner stillness. With each breath, feel your anxiety slowly dissolving into calmness."
  },
  "Focused": {
    title: "Focused",
    description: "Center your thoughts and enhance concentration.",
    icon: "bullseye",
    image: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop",
    visualUrl: "https://player.vimeo.com/external/370845105.sd.mp4?s=82fd8e1872aea9e941f8655568967c0edbf14391&profile_id=164&oauth2_token_id=57447761",
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/11/01/audio_16bc369401.mp3",
    voicePrompt: "Center your thoughts. Let your mind become clear and focused, like a perfectly still pond."
  },
  "Stressed": {
    title: "Stressed",
    description: "Immerse in nature's peace to release tension.",
    icon: "wind",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop",
    visualUrl: "https://player.vimeo.com/external/330812810.sd.mp4?s=188d1c987ae27e0037d0726ccc576a585518b3d1&profile_id=164&oauth2_token_id=57447761",
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/04/07/audio_f8feb23275.mp3",
    voicePrompt: "Imagine the peace of nature surrounding you. Feel the stress melting away with each gentle breath."
  },
  "Playful": {
    title: "Playful",
    description: "Let your imagination soar with light-hearted joy.",
    icon: "feather",
    image: "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop",
    visualUrl: "https://player.vimeo.com/external/367410744.sd.mp4?s=75ecbfed25ab83f1c604d990d6e644a529068e3a&profile_id=164&oauth2_token_id=57447761",
    audioUrl: "https://cdn.pixabay.com/download/audio/2020/11/10/audio_cb46f2b816.mp3",
    voicePrompt: "Let your imagination soar. Embrace the lightness of being and enjoy this moment of playful energy."
  },
  "Calm": {
    title: "Calm",
    description: "Breathe in peace, breathe out tension.",
    icon: "star",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop",
    visualUrl: "https://player.vimeo.com/external/480853564.sd.mp4?s=ebe8f3dbfc1bef4f2d9f4ea305d4f3fec9d4d17f&profile_id=164&oauth2_token_id=57447761",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_361904d625.mp3",
    voicePrompt: "Breathe in peace, breathe out tension. Feel a wave of calm washing over you, bringing harmony to your mind and body."
  }
};

export const AGE_GROUPS: Record<AgeGroup, {
  title: string;
  icon: string;
  description: string;
}> = {
  "Child": {
    title: "Child",
    icon: "child",
    description: "Playful and gentle experiences designed for young minds."
  },
  "Kid": {
    title: "Kid",
    icon: "user",
    description: "Engaging content that nurtures focus and creativity."
  },
  "Adult": {
    title: "Adult",
    icon: "user-tie",
    description: "Balanced relaxation for everyday stress relief."
  },
  "Mature": {
    title: "Mature",
    icon: "user-friends",
    description: "Serene experiences focused on wellness and reflection."
  }
};

export const TESTIMONIALS = [
  {
    quote: "Connect with serenity through tailored experiences. SerenitySphere helps me unwind after stressful workdays.",
    author: "Find Your Calm",
    role: "Adult User"
  },
  {
    quote: "Let SerenitySphere guide your journey to balance. I use it daily to center myself and prepare for challenges.",
    author: "Recharge & Rejuvenate",
    role: "Mature User"
  },
  {
    quote: "Immerse yourself in a calming oasis anytime, anywhere. I love how it helps my kids wind down before bedtime.",
    author: "Explore Tranquility",
    role: "Parent User"
  }
];
