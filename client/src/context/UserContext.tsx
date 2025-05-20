import { createContext, useState, useContext, ReactNode } from "react";
import { AgeGroup, MoodName } from "@shared/schema";

interface UserContextProps {
  ageGroup: AgeGroup | null;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  selectedMood: MoodName | null;
  setSelectedMood: (mood: MoodName) => void;
  showAgeSelection: boolean;
  setShowAgeSelection: (show: boolean) => void;
  showMoodSelection: boolean;
  setShowMoodSelection: (show: boolean) => void;
  sessionId: string | null;
  setSessionId: (sessionId: string) => void;
}

const UserContext = createContext<UserContextProps>({
  ageGroup: null,
  setAgeGroup: () => {},
  selectedMood: null,
  setSelectedMood: () => {},
  showAgeSelection: true,
  setShowAgeSelection: () => {},
  showMoodSelection: false,
  setShowMoodSelection: () => {},
  sessionId: null,
  setSessionId: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Check if there's a saved age group in localStorage
  const savedAgeGroup = localStorage.getItem("ageGroup");
  const initialAgeGroup = savedAgeGroup && ["Child", "Kid", "Adult", "Mature"].includes(savedAgeGroup)
    ? savedAgeGroup as AgeGroup
    : null;
    
  // Check if there's a saved favorite mood in localStorage
  const savedMood = localStorage.getItem("favoriteMood");
  const initialMood = savedMood && ["Tired", "Chill", "Happy", "Anxious", "Focused", "Stressed", "Playful", "Calm"].includes(savedMood)
    ? savedMood as MoodName
    : null;
  
  const [ageGroup, setAgeGroupState] = useState<AgeGroup | null>(initialAgeGroup);
  const [selectedMood, setSelectedMoodState] = useState<MoodName | null>(initialMood);
  const [showAgeSelection, setShowAgeSelection] = useState<boolean>(true);
  const [showMoodSelection, setShowMoodSelection] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const setAgeGroup = (age: AgeGroup) => {
    setAgeGroupState(age);
    localStorage.setItem("ageGroup", age);
    // After selecting an age, show mood selection
    setShowMoodSelection(true);
  };
  
  const setSelectedMood = (mood: MoodName) => {
    setSelectedMoodState(mood);
  };
  
  return (
    <UserContext.Provider
      value={{
        ageGroup,
        setAgeGroup,
        selectedMood,
        setSelectedMood,
        showAgeSelection,
        setShowAgeSelection,
        showMoodSelection,
        setShowMoodSelection,
        sessionId,
        setSessionId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
