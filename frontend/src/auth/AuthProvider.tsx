import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services';
import { AuthContext, type AuthContextType } from '../contexts/AuthContext';
import { type User, type LoginRequest, type RegisterUserRequest, UserRole } from '../types/event';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há um token salvo no localStorage
    const token = localStorage.getItem('unb-events-token');
    const savedUser = localStorage.getItem('unb-events-user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('unb-events-token');
        localStorage.removeItem('unb-events-user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const credentials: LoginRequest = { email, senha: password };
      const response = await authService.login(credentials);
      
      // Salvar token e usuário
      localStorage.setItem('unb-events-token', response.access_token);
      localStorage.setItem('unb-events-user', JSON.stringify(response.usuario));
      setUser(response.usuario);
        
      // Redirecionar baseado no papel do usuário
      if (response.usuario.papel === UserRole.ORGANIZER) {
        // Organizador
        navigate('/organizador');
      } else {
        // Participante
        navigate('/participante/eventos');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('unb-events-token');
    localStorage.removeItem('unb-events-user');
    navigate('/login');
  }, [navigate]);

  const register = useCallback(async (userData: RegisterUserRequest) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      // Usar os dados retornados pela API (token e usuario)
      if (response.access_token && response.usuario) {
        localStorage.setItem('unb-events-token', response.access_token);
        localStorage.setItem('unb-events-user', JSON.stringify(response.usuario));
        setUser(response.usuario);
        // Redirecionar baseado no papel do usuário
        if (response.usuario.papel === UserRole.ORGANIZER) {
          navigate('/organizador');
        } else {
          navigate('/participante/eventos');
        }
      } else {
        throw new Error('Erro ao criar usuário');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const updateProfile = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('unb-events-user', JSON.stringify(updatedUser));
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
