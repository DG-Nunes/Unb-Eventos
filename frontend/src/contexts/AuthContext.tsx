import { createContext } from 'react';
import type { User, RegisterUserRequest } from '../types/event';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterUserRequest) => Promise<void>;
  updateProfile: (updatedUser: User) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 