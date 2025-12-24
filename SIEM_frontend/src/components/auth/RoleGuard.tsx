import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/stores/hooks';
import { normalizeRole } from '@/lib/auth-utils';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  fallbackPath?: string;
}

export default function RoleGuard({ 
  children,
  allowedRoles = [],
  fallbackPath = '/unauthorized'
}: RoleGuardProps) {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);
  const normalizedRole = normalizeRole(role);
  const allowedNormalizedRoles = allowedRoles
    .map((r) => normalizeRole(r))
    .filter((r): r is string => Boolean(r));
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // localStorage.setItem('post_login_redirect', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedNormalizedRoles.length > 0 && normalizedRole && !allowedNormalizedRoles.includes(normalizedRole)) {
    return <Navigate to={fallbackPath} replace />;
  }


  return <>{children}</>;
}


