import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GardenProvider } from "@/context/GardenContext";
import Home from "@/pages/Home";
import EntryCard from "@/pages/EntryCard";
import CaptureFlow from "@/pages/CaptureFlow";
import BouquetView from "@/pages/BouquetView";
import Welcome from "@/pages/Welcome";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

const queryClient = new QueryClient();

function GateToWelcome({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const seen = localStorage.getItem("petal-press-seen");
    if (!seen) {
      setLocation("/welcome");
    }
  }, [setLocation]);

  return <>{children}</>;
}

function Router() {
  return (
    <GateToWelcome>
      <Switch>
        <Route path="/welcome" component={Welcome} />
        <Route path="/" component={Home} />
        <Route path="/flower/:id" component={EntryCard} />
        <Route path="/capture" component={CaptureFlow} />
        <Route path="/bouquet" component={BouquetView} />
        <Route component={NotFound} />
      </Switch>
    </GateToWelcome>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GardenProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </GardenProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
