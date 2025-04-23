import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/protected-route';
import { APP } from '@/constants/app';
import { MainLayout } from '@/components/layout/main-layout';

// Import pages
import LoginPage from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import KindergartensPage from '@/pages/kindergartens';
import ChildrenPage from '@/pages/children';
import GroupsPage from '@/pages/groups';
import PlansPage from '@/pages/plans';
import FeaturesPage from '@/pages/features';
import RolesPage from '@/pages/roles';
import FinancialPage from '@/pages/financial';
import AuditLogsPage from '@/pages/audit-logs';
import NotificationsPage from '@/pages/notifications';
import ProfilePage from '@/pages/profile';
import SettingsPage from '@/pages/settings';
import { ActivitiesPage } from '@/pages/activities';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={APP.ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to={APP.ROUTES.DASHBOARD} replace />} />
        <Route path={APP.ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={APP.ROUTES.KINDERGARTENS} element={<KindergartensPage />} />
        <Route path={APP.ROUTES.CHILDREN} element={<ChildrenPage />} />
        <Route path={APP.ROUTES.GROUPS} element={<GroupsPage />} />
        <Route path={APP.ROUTES.PLANS} element={<PlansPage />} />
        <Route path={APP.ROUTES.FEATURES} element={<FeaturesPage />} />
        <Route path={APP.ROUTES.ROLES} element={<RolesPage />} />
        <Route path={APP.ROUTES.FINANCIAL} element={<FinancialPage />} />
        <Route path={APP.ROUTES.AUDIT_LOGS} element={<AuditLogsPage />} />
        <Route path={APP.ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        <Route path={APP.ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={APP.ROUTES.SETTINGS} element={<SettingsPage />} />
        <Route path={APP.ROUTES.ACTIVITIES} element={<ActivitiesPage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={APP.ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
} 