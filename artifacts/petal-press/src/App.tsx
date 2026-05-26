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
const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/garden" component={Home} />
      <Route path="/flower/:id" component={EntryCard} />
      <Route path="/capture" component={CaptureFlow} />
      <Route path="/bouquet" component={BouquetView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GardenProvider>
          {/* Full-screen background */}
          <div className="min-h-screen bg-muted/40 flex justify-center">
            {/* Mobile shell — constrains all content to phone width */}
            <div
              className="relative w-full bg-background min-h-screen"
              style={{ maxWidth: 430 }}
              id="mobile-shell"
            >
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
            </div>
          </div>
        </GardenProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
