import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatHistoryProvider } from "@/hooks/use-chat-history";
import { MotivationalSplash } from "@/components/motivational-splash";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { FeedbackButton } from "@/components/feedback-button";
import { OfflineBanner } from "@/components/offline-banner";
import { ErrorBoundary } from "@/components/error-boundary";
import NotFound from "@/pages/not-found";
import ChatPage from "@/pages/chat";
import QuizPage from "@/pages/quiz";
import ExamPage from "@/pages/exam";
import AdminPage from "@/pages/admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AppRoutes() {
  const [location] = useLocation();
  const isAdmin = location === "/admin";
  return (
    <>
      {/* Announcement: visible on all pages EXCEPT the admin panel */}
      {!isAdmin && <AnnouncementBanner />}
      <Switch>
        <Route path="/" component={ChatPage} />
        <Route path="/quiz" component={QuizPage} />
        <Route path="/exam" component={ExamPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
      {/* Floating feedback — hidden on chat page (feedback lives in the + menu there) */}
      {location !== "/" && !isAdmin && <FeedbackButton />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ChatHistoryProvider>
            <MotivationalSplash />
            <OfflineBanner />
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppRoutes />
            </WouterRouter>
            <Toaster />
          </ChatHistoryProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
