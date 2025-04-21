import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import KindergartensPage from "./pages/kindergartens";
import RolesPage from "./pages/roles";
import ChildrenPage from "./pages/children";
import GroupsPage from "./pages/groups";
import FinancialPage from "./pages/financial";
import AuditLogsPage from "./pages/audit-logs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/kindergartens" element={<KindergartensPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/children" element={<ChildrenPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/financial" element={<FinancialPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
