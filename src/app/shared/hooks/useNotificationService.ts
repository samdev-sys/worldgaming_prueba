import { useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useNotification } from '../contexts';

/**
 * Hook para conectar el servicio de notificaciones con el contexto de React
 * Permite que servicios como apiService puedan mostrar notificaciones
 */
export const useNotificationService = () => {
  const { addNotification } = useNotification();

  useEffect(() => {
    // Suscribirse al servicio de notificaciones
    const unsubscribe = notificationService.subscribe((event) => {
      addNotification(event.message, event.type);
    });

    // Limpiar suscripción al desmontar
    return unsubscribe;
  }, [addNotification]);
};
