import React, { createContext, useContext, useState, useEffect } from 'react';
import * as segService from './service/segServices';

interface User {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  password?: string;
  telefono?: string;
  avatar?: string | null;
  ipPublica?: string;
  rol: string;
  isActive: boolean;
  isBanned: boolean;
  fechaBan?: string | null;
  motivoBan?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOAuth: (token: string, userData: User) => void;
  logout: () => void;
  register: (data: any) => Promise<any>;
  isAuthenticated: boolean;
  loading: boolean;
}

// Variable global para almacenar la función de logout
let globalLogout: (() => void) | null = null;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Llamar al servicio real de login
      const response = await segService.login({
        email: email,
        password: password
      });

      if (response.success) {
        if (response.data?.token && response.data?.user) {
          // Extraer solo los datos principales necesarios, excluyendo información sensible
          const userData: User = {
            ...response.data.user
          };

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', response.data.token);

          return true;
        } else {
          throw new Error('Respuesta de API inválida: faltan datos de usuario o token');
        }
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setLoading(true);

      const response = await segService.register(data);

      if (!response.success) {
        throw new Error(response.message || 'Error al registrar usuario');
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithOAuth = (token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('worldGaming_selectedGame');
    localStorage.removeItem('worldGaming_gamePalette');
  };

  // Registrar la función de logout globalmente para que apiService pueda usarla
  useEffect(() => {
    globalLogout = logout;
    return () => {
      globalLogout = null;
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithOAuth,
      logout,
      register,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Función para que apiService pueda hacer logout automático
export const performGlobalLogout = () => {
  if (globalLogout) {
    globalLogout();
  }
};