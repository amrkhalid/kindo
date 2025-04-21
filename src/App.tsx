
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from 'next-themes';

// Import pages - making sure we use lowercase index
import IndexPage from "./pages/index";
import KindergartensPage from "./pages/kindergartens";
import RolesPage from "./pages/roles";
import ChildrenPage from "./pages/children";
import GroupsPage from "./pages/groups";
import FinancialPage from "./pages/financial";
import AuditLogsPage from "./pages/audit-logs";
import NotFound from "./pages/NotFound";
import NotificationsPage from "./pages/notifications";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";

// Import i18n configuration
import './i18n';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/kindergartens" element={<KindergartensPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/children" element={<ChildrenPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/financial" element={<FinancialPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
