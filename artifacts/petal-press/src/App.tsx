import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GardenProvider } from "@/context/GardenContext";
import { DemoGardenProvider } from "@/context/DemoGardenProvider";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Landing = lazy(() => import("@/pages/Landing"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Home = lazy(() => import("@/pages/Home"));
const EntryCard = lazy(() => import("@/pages/EntryCard"));
const CaptureFlow = lazy(() => import("@/pages/CaptureFlow"));
const BouquetView = lazy(() => import("@/pages/BouquetView"));
const Welcome = lazy(() => import("@/pages/Welcome"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#F5EFD8" }}>
      <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24" style={{ color: "#c5d07d" }}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) setLocation("/signin");
  }, [user, authLoading, setLocation]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#F5EFD8" }}>
        <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24" style={{ color: "#c5d07d" }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Welcome} />
        <Route path="/app" component={Landing} />
        <Route path="/signin" component={SignIn} />
        <Route path="/waitlist" component={Welcome} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/demo">
          {() => <DemoGardenProvider><Home hideCapture /></DemoGardenProvider>}
        </Route>
        <Route path="/garden">
          {() => <ProtectedRoute><Home /></ProtectedRoute>}
        </Route>
        <Route path="/flower/:id">
          {() => <ProtectedRoute><EntryCard /></ProtectedRoute>}
        </Route>
        <Route path="/capture">
          {() => <ProtectedRoute><CaptureFlow /></ProtectedRoute>}
        </Route>
        <Route path="/bouquet">
          {() => <ProtectedRoute><BouquetView /></ProtectedRoute>}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <GardenProvider>
              <div className="min-h-screen bg-muted/40 flex justify-center">
                <div
                  className="relative w-full bg-background min-h-screen"
                  style={{ maxWidth: 430 }}
                  id="mobile-shell"
                >
                  <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}>
                    <Router />
                  </WouterRouter>
                </div>
              </div>
            </GardenProvider>
          </AuthProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
      <Analytics />
    </ErrorBoundary>
  );
}

export default App;
