import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationService } from '../services/navigationService';

interface NavigationProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que inicializa el navigationService con la función navigate de React Router
 */
const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializar el navigationService con la función navigate
    navigationService.setNavigate(navigate);
  }, [navigate]);

  return <>{children}</>;
};

export default NavigationProvider;
