import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import type { Role } from '../../features/auth/context/AuthContext';

export function RoleRoute({ role }: { role: Role }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}