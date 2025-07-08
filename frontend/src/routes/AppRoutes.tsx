import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { PrivateRoute } from '../components/PrivateRoute/PrivateRoute';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import NotFound from '../pages/NotFound';

// Páginas do Organizador
import Dashboard from '../pages/Organizer/Dashboard';
import EventDetails from '../pages/Organizer/EventDetails';

// Páginas do Participante
import AvailableEvents from '../pages/Participant/AvailableEvents';
import MyEvents from '../pages/Participant/MyEvents';
import ParticipantEventDetails from '../pages/Participant/EventDetails';
import Certificates from '../pages/Participant/Certificates';
import { UserRole } from '../types/event';


const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rota raiz - redireciona baseado no papel do usuário */}
      <Route 
        path="/" 
        element={
          user ? (
            user.papel === 'organizador' ? <Navigate to="/organizador" /> :
            user.papel === 'participante' ? <Navigate to="/participante/eventos" /> :
            <Navigate to="/login" />
          ) : <Navigate to="/login" />
        } 
      />

      {/* Rotas do Organizador */}
      <Route path="/organizador" element={<PrivateRoute allowedRole={UserRole.ORGANIZER} />}>
        <Route index element={<Dashboard />} />
        <Route path="eventos/:id" element={<EventDetails />} />
      </Route>

      {/* Rotas do Participante */}
      <Route path="/participante" element={<PrivateRoute allowedRole={UserRole.PARTICIPANT} />}>
        <Route index element={<AvailableEvents />} />
        <Route path="eventos" element={<AvailableEvents />} />
        <Route path="meus-eventos" element={<MyEvents />} />
        <Route path="eventos/:id" element={<ParticipantEventDetails />} />
        <Route path="certificados" element={<Certificates />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
