import { Outlet, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '../../auth/useAuth';
  import { UserRole } from '../../types/event';

interface PrivateRouteProps {
  allowedRole?: UserRole;
}

export function PrivateRoute({ allowedRole }: PrivateRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1rem',
          color: 'grey.500',
        }}
      >
        Carregando...
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user) {
      const isOrganizer = user.papel === UserRole.ORGANIZER;
    const isParticipant = user.papel === UserRole.PARTICIPANT;
    
    if (allowedRole === UserRole.ORGANIZER && !isOrganizer) {
      return <Navigate to="/participante/eventos" replace />;
    } else if (allowedRole === UserRole.PARTICIPANT && !isParticipant) {
      return <Navigate to="/organizador" replace />;
    }
  }

  return <Outlet />;
}
