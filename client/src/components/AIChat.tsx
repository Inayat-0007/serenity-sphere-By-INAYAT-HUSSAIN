import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAiChat } from "@/hooks/use-ai-chat";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useUserContext } from "@/context/UserContext";

interface Message {
  sender: 'user' | 'ai';
  content: string | React.ReactNode;
}

export default function AIChat() {
  const [, setLocation] = useLocation();
  const { sessionId } = useUserContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'ai', 
      content: "Hi there! I'm here to help you find the perfect relaxation experience. How are you feeling today?" 
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { sendMessage, isLoading, suggestedMoods } = useAiChat();
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', content: message }]);
    
    // Send message to AI
    const userMessage = message;
    setMessage("");
    
    try {
      // Process the message with AI
      await sendMessage(userMessage, sessionId);
      
      // AI response will be handled via the suggestedMoods state from the hook
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          content: "I'm having trouble processing your request. Please try again." 
        }
      ]);
    }
  };
  
  // When suggested moods are updated, add them to the chat
  useEffect(() => {
    if (suggestedMoods.aiResponse && !isLoading && suggestedMoods.moods.length > 0) {
      const moodOptions = (
        <div className="mt-4 space-y-4">
          {suggestedMoods.moods.map((mood) => (
            <div 
              key={mood.id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => setLocation(`/experience/${mood.name.toLowerCase()}`)}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <i className={`fas fa-${mood.icon || 'circle'} text-primary`}></i>
                </div>
                <h3 className="text-lg font-heading font-medium text-foreground">{mood.name}</h3>
              </div>
              <p className="text-sm text-foreground/70">{mood.description}</p>
            </div>
          ))}
        </div>
      );
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          content: (
            <>
              <p className="text-foreground">{suggestedMoods.aiResponse}</p>
              {moodOptions}
              <p className="mt-4 text-foreground">Which one resonates with you more?</p>
            </>
          )
        }
      ]);
    } else if (suggestedMoods.aiResponse && !isLoading) {
      // Handle case when there are no mood suggestions
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          content: (
            <>
              <p className="text-foreground">{suggestedMoods.aiResponse}</p>
              <p className="mt-4 text-foreground">Feel free to tell me more about how you're feeling.</p>
            </>
          )
        }
      ]);
    }
  }, [suggestedMoods, isLoading, setLocation]);
  
  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleBackToMoods = () => {
    const moodSelection = document.getElementById("mood-selection");
    if (moodSelection) {
      moodSelection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section id="ai-chat" className="py-16 px-6 md:px-12">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-heading font-medium text-foreground">Confused? Let's Talk</h2>
            <p className="text-foreground/80">Our AI will help you find the perfect mood experience.</p>
          </div>
          <Button
            id="back-to-moods-from-chat"
            variant="ghost"
            onClick={handleBackToMoods}
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to Moods
          </Button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="chat-container space-y-6 max-h-[400px] overflow-y-auto mb-6">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`${msg.sender === 'ai' ? 'ai-message flex' : 'user-message flex justify-end'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fas fa-robot text-primary"></i>
                    </div>
                  )}
                  
                  <div 
                    className={`${
                      msg.sender === 'ai' 
                        ? 'bg-secondary/30 rounded-2xl rounded-tl-none' 
                        : 'bg-accent/10 rounded-2xl rounded-tr-none'
                    } p-4 max-w-[80%]`}
                  >
                    {msg.content}
                  </div>
                  
                  {msg.sender === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center ml-3 flex-shrink-0">
                      <i className="fas fa-user text-accent"></i>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-secondary/30 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground"
                  placeholder="Type your message here..."
                  disabled={isLoading}
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white p-0 min-w-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                </Button>
              </div>
              <p className="text-xs text-foreground/60 mt-2 text-center">Powered by Hugging Face Inference API</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
