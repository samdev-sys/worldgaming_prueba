import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Trophy, MessageSquare, Trash2, Filter } from 'lucide-react';
import NotificationComponent from './Notification';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'tournament' | 'message';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

interface NotificationContextType {
  // Notificaciones simples (toast)
  addNotification: (message: string, type: NotificationType) => void;
  // Notificaciones completas (centro)
  addFullNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  // Centro de notificaciones
  notifications: Notification[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  // Modal
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  // Estados
  loading: boolean;
  error: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toastNotifications, setToastNotifications] = useState<Array<{ id: number; message: string; type: NotificationType }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Notificaciones simples (toast)
  const addNotification = useCallback((message: string, type: NotificationType) => {
    const id = Date.now();
    setToastNotifications(prev => {
      if (prev.some(n => n.message === message)) {
        return prev;
      }
      return [...prev, { id, message, type }];
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToastNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Notificaciones completas (centro)
  const addFullNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const removeToastNotification = useCallback((id: number) => {
    setToastNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{
      addNotification,
      addFullNotification,
      notifications,
      markAsRead,
      deleteNotification,
      markAllAsRead,
      clearAll,
      isModalOpen,
      openModal,
      closeModal,
      loading,
      error
    }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-[100] w-full max-w-sm flex flex-col gap-3">
        {toastNotifications.map(n => (
          <NotificationComponent
            key={n.id}
            notification={n}
            onClose={() => removeToastNotification(n.id)}
          />
        ))}
      </div>

      {/* Notification Center Modal */}
      <NotificationCenterModal />
    </NotificationContext.Provider>
  );
};

// Componente del Centro de Notificaciones
const NotificationCenterModal: React.FC = () => {
  const { 
    notifications, 
    markAsRead, 
    deleteNotification, 
    markAllAsRead, 
    clearAll,
    isModalOpen,
    closeModal,
    loading,
    error
  } = useNotification();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'tournament' | 'message'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'tournament':
        return <Trophy className="h-5 w-5 text-orange-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'tournament':
        return 'border-orange-500/30 bg-orange-500/10';
      case 'message':
        return 'border-purple-500/30 bg-purple-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays}d`;

    return date.toLocaleDateString('es-ES');
  };

  const handleMarkAsRead = async (id: string) => {
    setActionLoading(`read-${id}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay
      markAsRead(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setActionLoading('mark-all-read');
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      markAllAsRead();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteNotification(id);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'tournament') return notification.type === 'tournament';
    if (filter === 'message') return notification.type === 'message';
    return true;
  });

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900/95 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-white/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Centro de Notificaciones</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={closeModal}
            className="p-2 sm:p-3 hover:bg-white/10 rounded-lg sm:rounded-xl transition-colors duration-200"
          >
            <X className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 sm:p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
            <span className="text-xs sm:text-sm text-white/60">Filtros:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'unread', label: 'No leídas' },
              { key: 'tournament', label: 'Torneos' },
              { key: 'message', label: 'Mensajes' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filter === filterOption.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading || actionLoading === 'mark-all-read'}
              className={`text-sm transition-colors ${
                loading || actionLoading === 'mark-all-read'
                  ? 'text-white/40 cursor-not-allowed'
                  : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {actionLoading === 'mark-all-read' ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-400"></div>
                  Procesando...
                </span>
              ) : (
                'Marcar todas como leídas'
              )}
            </button>
            <button
              onClick={clearAll}
              disabled={loading || !!actionLoading}
              className={`text-sm transition-colors ${
                loading || !!actionLoading
                  ? 'text-white/40 cursor-not-allowed'
                  : 'text-red-400 hover:text-red-300'
              }`}
            >
              Limpiar todas
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto min-h-0 max-h-[calc(95vh-300px)]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-white/60">Cargando notificaciones...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No hay notificaciones</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 rounded-xl border transition-all duration-200 ${
                    getNotificationColor(notification.type)
                  } ${!notification.read ? 'ring-2 ring-orange-500/30' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {notification.title}
                          </h3>
                          <p className="text-base text-white/80 mb-3 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-4">
                            <span className="text-sm text-white/60">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <span className={`text-sm font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={loading || actionLoading === `read-${notification.id}`}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                loading || actionLoading === `read-${notification.id}`
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-white/10'
                              }`}
                              title="Marcar como leída"
                            >
                              {actionLoading === `read-${notification.id}` ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b border-green-400"></div>
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            disabled={loading || actionLoading === `delete-${notification.id}`}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              loading || actionLoading === `delete-${notification.id}`
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-white/10'
                            }`}
                            title="Eliminar"
                          >
                            {actionLoading === `delete-${notification.id}` ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b border-red-400"></div>
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {notification.action && (
                        <button className="mt-4 px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-all duration-200">
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>{filteredNotifications.length} notificaciones</span>
            <button className="text-orange-400 hover:text-orange-300 transition-colors">
              Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
