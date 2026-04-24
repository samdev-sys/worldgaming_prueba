import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import NotificationService from '../services/notificationService';
import { AsyncOperation } from '../components/AsyncOperationStatus';

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'tournament' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  priority: 'low' | 'medium' | 'high';
}

interface NotificationCenterContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  asyncOperations: AsyncOperation[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  clearAsyncOperations: () => void;
}

const NotificationCenterContext = createContext<NotificationCenterContextType | undefined>(undefined);

export const useNotificationCenter = () => {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error('useNotificationCenter must be used within a NotificationCenterProvider');
  }
  return context;
};

export const NotificationCenterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asyncOperations, setAsyncOperations] = useState<AsyncOperation[]>([]);
  const notificationService = NotificationService.getInstance();

  const unreadCount = notifications.filter(n => !n.read).length;

    // Cargar notificaciones iniciales
  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      } else {
        setError(response.error || 'Error al cargar notificaciones');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [notificationService]);

  // Cargar notificaciones al montar el componente (comentado para cargar solo cuando se abre el modal)
  // useEffect(() => {
  //   refreshNotifications();
  // }, [refreshNotifications]);

  const addNotification = useCallback(async (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.addNotification(notification);
      if (response.success) {
        setNotifications(prev => [response.data, ...prev]);
      } else {
        setError(response.error || 'Error al agregar notificación');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [notificationService]);

  const markAsRead = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.markAsRead(id);
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
      } else {
        setError(response.error || 'Error al marcar como leída');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [notificationService]);

  const markAllAsRead = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
      } else {
        setError(response.error || 'Error al marcar todas como leídas');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [notificationService]);

  const deleteNotification = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.deleteNotification(id);
      if (response.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else {
        setError(response.error || 'Error al eliminar notificación');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [notificationService]);

  const clearAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.clearAllNotifications();
      if (response.success) {
        setNotifications([]);
      } else {
        setError(response.error || 'Error al limpiar notificaciones');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [notificationService]);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      } else {
        setError(response.error || 'Error al cargar notificaciones');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [notificationService]);

  const clearAsyncOperations = useCallback(() => {
    setAsyncOperations([]);
  }, []);

  return (
    <NotificationCenterContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      error,
      asyncOperations,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      refreshNotifications,
      loadNotifications,
      clearAsyncOperations
    }}>
      {children}
    </NotificationCenterContext.Provider>
  );
};
