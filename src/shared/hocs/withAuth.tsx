import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import type { ComponentType } from 'react';

export function withAuth<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function AuthGuard(props: P): React.ReactElement | null {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Component {...props} />;
  };
}