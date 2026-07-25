import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, FutureFlags } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initOfflineSync } from "@/lib/offlineQueue";
import Layout from "./components/Layout";
import Index from "./pages/Index.tsx";

const DesignAgency = lazy(() => import("./pages/DesignAgency.tsx"));
const Health = lazy(() => import("./pages/Health.tsx"));
const Finance = lazy(() => import("./pages/Finance.tsx"));
const Environment = lazy(() => import("./pages/Environment.tsx"));
const Assistant = lazy(() => import("./pages/Assistant.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Insights = lazy(() => import("./pages/Insights.tsx"));
const Recipes = lazy(() => import("./pages/Recipes.tsx"));
const Education = lazy(() => import("./pages/Education.tsx"));
const Quiz = lazy(() => import("./pages/Quiz.tsx"));
const Plans = lazy(() => import("./pages/Plans.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <PageLoader />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ErrorBoundary><Index /></ErrorBoundary>} />
        <Route path="/design-agency" element={<ErrorBoundary><DesignAgency /></ErrorBoundary>} />
        <Route path="/health" element={<ErrorBoundary><Health /></ErrorBoundary>} />
        <Route path="/finance" element={<ErrorBoundary><Finance /></ErrorBoundary>} />
        <Route path="/environment" element={<ErrorBoundary><Environment /></ErrorBoundary>} />
        <Route path="/assistant" element={<ErrorBoundary><Assistant /></ErrorBoundary>} />
        <Route path="/recipes" element={<ErrorBoundary><Recipes /></ErrorBoundary>} />
        <Route path="/education" element={<ErrorBoundary><Education /></ErrorBoundary>} />
        <Route path="/quiz" element={<ErrorBoundary><Quiz /></ErrorBoundary>} />
        <Route path="/plans" element={<ErrorBoundary><Plans /></ErrorBoundary>} />
        <Route path="/privacy" element={<ErrorBoundary><Privacy /></ErrorBoundary>} />
        <Route path="/terms" element={<ErrorBoundary><Terms /></ErrorBoundary>} />
        <Route path="/admin" element={<ErrorBoundary><Admin /></ErrorBoundary>} />
        <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="/daily" element={<Navigate to="/dashboard" replace />} />
        <Route path="/insights" element={<ErrorBoundary><Insights /></ErrorBoundary>} />
      </Route>
      <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
    </Routes>
  );
}

const futureFlags: FutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const App = () => {
  useEffect(() => {
    const cleanup = initOfflineSync();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter future={futureFlags}>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <AppRoutes />
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
      <Sonner
        position="bottom-right"
        theme="system"
        className="toaster-group"
        toastOptions={{ className: "bg-card text-card-foreground" }}
      />
    </QueryClientProvider>
  );
};

export default App;