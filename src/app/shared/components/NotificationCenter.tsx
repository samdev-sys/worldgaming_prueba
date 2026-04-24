import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Trophy,
  MessageSquare,
  Trash2,
  Archive,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useNotificationCenter } from '../contexts/NotificationCenterContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen }) => {
    const { 
    notifications, 
    markAsRead, 
    deleteNotification, 
    markAllAsRead, 
    loading, 
    error,
    refreshNotifications,
    loadNotifications
  } = useNotificationCenter();
  const [filter, setFilter] = useState<'all' | 'unread' | 'tournament' | 'message'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
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

  const getNotificationColor = (type: string) => {
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

  // Efecto para cargar notificaciones cuando se abre el modal
  React.useEffect(() => {
    if (isOpen && notifications.length === 0) {
      setInitialLoading(true);
      loadNotifications().finally(() => {
        setInitialLoading(false);
      });
    }
  }, [isOpen, notifications.length, loadNotifications]);

  // Efecto para limpiar estados cuando se cierra el modal
  React.useEffect(() => {
    if (!isOpen) {
      setInitialLoading(false);
      setActionLoading(null);
      setRefreshLoading(false);
    }
  }, [isOpen]);

  const handleRefreshNotifications = async () => {
    setRefreshLoading(true);
    try {
      await refreshNotifications();
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setActionLoading(`read-${id}`);
    try {
      await markAsRead(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setActionLoading('mark-all-read');
    try {
      await markAllAsRead();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      await deleteNotification(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchiveNotification = async (id: string) => {
    setActionLoading(`archive-${id}`);
    try {
      // Simular delay de archivado
      await new Promise(resolve => setTimeout(resolve, 500));
      await deleteNotification(id);
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

  if (!isOpen) return null;

  return (
    <div className="w-full h-full">
      {/* Notification Panel */}
      <div className="w-full h-full bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Notificaciones</h2>
            {initialLoading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b border-orange-400"></div>
                <span className="text-xs text-orange-400">Cargando...</span>
              </div>
            )}
            {unreadCount > 0 && !initialLoading && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshNotifications}
              disabled={loading || refreshLoading || initialLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${loading || refreshLoading || initialLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white/10'
                }`}
              title="Actualizar notificaciones"
            >
              <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 text-white ${loading || refreshLoading || initialLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 sm:p-4 border-b border-white/10 flex-shrink-0">
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
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${filter === filterOption.key
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
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading || actionLoading === 'mark-all-read' || initialLoading}
              className={`text-sm transition-colors ${loading || actionLoading === 'mark-all-read' || initialLoading
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
              onClick={() => setShowArchived(!showArchived)}
              disabled={loading || !!actionLoading || initialLoading}
              className={`text-sm transition-colors ${loading || !!actionLoading || initialLoading
                ? 'text-white/40 cursor-not-allowed'
                : 'text-white/60 hover:text-white'
                }`}
            >
              {showArchived ? 'Ocultar archivadas' : 'Mostrar archivadas'}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto min-h-0">
                      {initialLoading || loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-white/60">
                  {initialLoading ? 'Cargando notificaciones...' : 'Actualizando notificaciones...'}
                </p>
                {initialLoading && (
                  <div className="mt-4 space-y-2">
                    <p className="text-white/40 text-sm">Esperando respuesta del servidor</p>
                    <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={handleRefreshNotifications}
                disabled={refreshLoading}
                className={`px-4 py-2 bg-orange-500 text-white rounded-lg transition-colors ${refreshLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-orange-600'
                  }`}
              >
                {refreshLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                    Reintentando...
                  </span>
                ) : (
                  'Reintentar'
                )}
              </button>
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
                  className={`p-6 rounded-xl border transition-all duration-200 ${getNotificationColor(notification.type)
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
                              className={`p-2 rounded-lg transition-all duration-200 ${loading || actionLoading === `read-${notification.id}`
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
                            onClick={() => handleArchiveNotification(notification.id)}
                            disabled={loading || actionLoading === `archive-${notification.id}`}
                            className={`p-2 rounded-lg transition-all duration-200 ${loading || actionLoading === `archive-${notification.id}`
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-white/10'
                              }`}
                            title="Archivar"
                          >
                            {actionLoading === `archive-${notification.id}` ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b border-white/60"></div>
                            ) : (
                              <Archive className="h-4 w-4 text-white/60" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            disabled={loading || actionLoading === `delete-${notification.id}`}
                            className={`p-2 rounded-lg transition-all duration-200 ${loading || actionLoading === `delete-${notification.id}`
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
        <div className="p-4 border-t border-white/10 flex-shrink-0">
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

export default NotificationCenter;
