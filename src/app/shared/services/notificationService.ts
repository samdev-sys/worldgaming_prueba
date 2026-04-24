/**
 * Servicio de notificaciones para uso fuera de componentes React
 * Permite que servicios como apiService puedan mostrar notificaciones
 */

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationEvent {
  type: NotificationType;
  message: string;
  title?: string;
}

class NotificationService {
  private listeners: ((event: NotificationEvent) => void)[] = [];
  private static instance: NotificationService;

  /**
   * Obtener instancia singleton
   */
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Suscribirse a notificaciones
   */
  subscribe(listener: (event: NotificationEvent) => void) {
    this.listeners.push(listener);
    
    // Retornar función para desuscribirse
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Mostrar notificación
   */
  notify(type: NotificationType, message: string, title?: string) {
    const event: NotificationEvent = { type, message, title: title || '' };
    this.listeners.forEach(listener => listener(event));
  }

  /**
   * Métodos de conveniencia
   */
  success(message: string, title?: string) {
    this.notify('success', message, title);
  }

  error(message: string, title?: string) {
    this.notify('error', message, title);
  }

  warning(message: string, title?: string) {
    this.notify('warning', message, title);
  }

  info(message: string, title?: string) {
    this.notify('info', message, title);
  }

  // Métodos para compatibilidad con NotificationCenterContext
  async getNotifications() {
    // Retornar estructura esperada por NotificationCenterContext
    return {
      success: true,
      data: [],
      error: null
    };
  }

  async addNotification(notification: any) {
    // Implementar si es necesario
    return {
      success: true,
      data: notification,
      error: null
    };
  }

  async markAsRead(_id: string) {
    // Implementar si es necesario
    return {
      success: true,
      data: null,
      error: null
    };
  }

  async markAllAsRead() {
    // Implementar si es necesario
    return {
      success: true,
      data: null,
      error: null
    };
  }

  async deleteNotification(_id: string) {
    // Implementar si es necesario
    return {
      success: true,
      data: null,
      error: null
    };
  }

  async clearAllNotifications() {
    // Implementar si es necesario
    return {
      success: true,
      data: null,
      error: null
    };
  }
}

// Instancia singleton
export const notificationService = new NotificationService();

// Export default para compatibilidad con NotificationCenterContext
export default NotificationService;