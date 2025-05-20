import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Experience from "@/pages/experience";
import About from "@/pages/about";
import { useEffect } from "react";
import { useUserContext } from "./context/UserContext";

function Router() {
  const { setSessionId } = useUserContext();

  useEffect(() => {
    // Generate a session ID for this visit if none exists
    const existingSessionId = localStorage.getItem("sessionId");
    if (!existingSessionId) {
      const newSessionId = crypto.randomUUID();
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    } else {
      setSessionId(existingSessionId);
    }
  }, [setSessionId]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/experience/:mood" component={Experience} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
