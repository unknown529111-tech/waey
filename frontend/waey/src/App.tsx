import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
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
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
      <AuthProvider>
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/design-agency" element={<DesignAgency />} />
              <Route path="/health" element={<Health />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/environment" element={<Environment />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/daily" element={<Navigate to="/dashboard" replace />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/education" element={<Education />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/WGMVRFGCARXq1$" element={<Admin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
