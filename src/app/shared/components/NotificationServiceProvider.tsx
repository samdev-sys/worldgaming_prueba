import React from 'react';
import { useNotificationService } from '../hooks/useNotificationService';

/**
 * Componente que conecta el servicio de notificaciones con el contexto de React
 * Debe estar dentro del NotificationProvider para funcionar correctamente
 */
const NotificationServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useNotificationService();
  return <>{children}</>;
};

export default NotificationServiceProvider;
