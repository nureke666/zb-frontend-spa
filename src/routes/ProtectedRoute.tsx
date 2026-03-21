import { Box, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { UserRole } from '../types/user.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isSessionChecked, user } = useAppSelector(
    (state) => state.auth,
  );

  if (!isSessionChecked) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F7FA',
        }}
      >
        <CircularProgress sx={{ color: '#1A2B56' }} />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
