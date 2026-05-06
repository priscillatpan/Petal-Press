import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GardenProvider } from "@/context/GardenContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EntryCard from "@/pages/EntryCard";
import CaptureFlow from "@/pages/CaptureFlow";
import BouquetView from "@/pages/BouquetView";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="w-full max-w-[430px] mx-auto min-h-[100dvh] bg-background relative shadow-2xl">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/flower/:id" component={EntryCard} />
        <Route path="/capture" component={CaptureFlow} />
        <Route path="/bouquet" component={BouquetView} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GardenProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
            <div className="min-h-screen bg-muted/30 flex justify-center w-full">
              <Router />
            </div>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </GardenProvider>
    </QueryClientProvider>
  );
}

export default App;
