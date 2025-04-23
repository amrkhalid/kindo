import { Navigate, useLocation } from 'react-router-dom';
import { APP } from '@/constants/app';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  // For now, we'll consider the user always authenticated
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to={APP.ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 