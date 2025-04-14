import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import AIPredictionsPage from "./pages/AIPredictionsPage";
import PortfolioPage from "./pages/PortfolioPage";
import CommunityPage from "./pages/CommunityPage";
import LearnPage from "./pages/LearnPage";
import AlertsPage from "./pages/AlertsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/predictions" component={AIPredictionsPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/learn" component={LearnPage} />
      <Route path="/alerts" component={AlertsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
