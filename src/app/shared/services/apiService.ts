import axios from 'axios';
import { notificationService } from './notificationService';
import { navigationService } from './navigationService';
import { performGlobalLogout } from '../../auth/AuthContext';

// Obtener URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Debug: Verificar que las variables se carguen correctamente
if (import.meta.env.MODE === 'development') {
  console.log('🔧 Variables de entorno cargadas:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'NO DEFINIDA',
    VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'DEFINIDA' : 'NO DEFINIDA',
    MODE: import.meta.env.MODE
  });
}

// Función para verificar si es un error de timeout de conexión
const isConnectionTimeoutError = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes('connection timeout expired') ||
    lowerMessage.includes('timeout period elapsed') ||
    lowerMessage.includes('connection could have timed out') ||
    lowerMessage.includes('post-login') ||
    lowerMessage.includes('pre-login') ||
    lowerMessage.includes('login process and respond') ||
    lowerMessage.includes('multiple active connections') ||
    lowerMessage.includes('duration spent while attempting to connect') ||
    lowerMessage.includes('initialization=') ||
    lowerMessage.includes('handshake=') ||
    lowerMessage.includes('authentication=') ||
    lowerMessage.includes('complete=')
  );
};

// Función para manejar errores de timeout
const handleConnectionTimeout = () => {
  console.log('Timeout de conexión detectado, cerrando sesión...');
  performGlobalLogout();
  
  setTimeout(() => {
    navigationService.navigateToHome();
  }, 1000);
};

const handleUnauthorized = () => {
  console.log('Usuario no autorizado, cerrando sesión...');
  performGlobalLogout();
  
  setTimeout(() => {
    navigationService.navigateToHome();
  }, 1000);
};

// Configuración optimizada de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request optimizado
api.interceptors.request.use(
  (config) => {
    // Adjuntar token de autenticación
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Si los datos son FormData, dejar que axios establezca el Content-Type automáticamente
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    
    // Log de requests en desarrollo
    if (import.meta.env.MODE === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response optimizado
api.interceptors.response.use(
  (response) => {
    // Log de responses en desarrollo
    if (import.meta.env.MODE === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    
    if (status === 401) {
      if (!url.includes('Auth/login')) {
        handleUnauthorized();
      }
    } else if (status === 403) {
      notificationService.error('No tienes permisos para realizar esta acción', 'Acceso Denegado');
    } else if (status === 404) {
      notificationService.error('El recurso solicitado no existe', 'No Encontrado');
    } else if (status >= 500) {
      notificationService.error('Ha ocurrido un error interno del servidor', 'Error del Servidor');
    }
    
    // Verificar errores de timeout de conexión
    const errorMessage = error.response?.data?.message || error.message || '';
    if (isConnectionTimeoutError(errorMessage)) {
      handleConnectionTimeout();
    }
    
    return Promise.reject(error);
  }
);

// Función para normalizar la respuesta
function normalizeResponse(response: any) {
  const status = response?.status ?? 200;
  const responseData = response?.data;
  if (responseData?.data?.listFind && Array.isArray(responseData.data.listFind)) {
    return {
      data: responseData.data.listFind,
      totalRecords: responseData.data.totalRecords,
      pageNumber: responseData.data.pageNumber,
      pageSize: responseData.data.pageSize,
      message: responseData.message ?? 'Operación exitosa',
      success: responseData.success ?? true,
      status
    };
  }
  
  if (responseData?.listFind && Array.isArray(responseData.listFind)) {
    return {
      data: responseData.listFind,
      totalRecords: responseData.totalRecords,
      pageNumber: responseData.pageNumber,
      pageSize: responseData.pageSize,
      message: responseData.message ?? 'Operación exitosa',
      success: responseData.success ?? true,
      status
    };
  }
  
  if ((responseData?.success !== undefined || responseData?.message !== undefined) && responseData?.data) {
    // Si data contiene listFind, extraerlo
    if (responseData.data.listFind && Array.isArray(responseData.data.listFind)) {
      return {
        data: responseData.data.listFind,
        totalRecords: responseData.data.totalRecords,
        pageNumber: responseData.data.pageNumber,
        pageSize: responseData.data.pageSize,
        message: responseData.message ?? 'Operación exitosa',
        success: responseData.success ?? true,
        status
      };
    }
    // Si no tiene listFind pero tiene data, devolver data
    return {
      data: responseData.data,
      message: responseData.message ?? 'Operación exitosa',
      success: responseData.success ?? true,
      status
    };
  }
  
  // Si la respuesta tiene success/message en nivel superior (sin data anidado)
  if (responseData?.success !== undefined || responseData?.message !== undefined) {
    return {
      data: responseData.data ?? responseData,
      message: responseData.message ?? 'Operación exitosa',
      success: responseData.success ?? true,
      status
    };
  }
  
  // Fallback: respuesta normal
  return {
    data: responseData ?? null,
    message: 'Operación exitosa',
    success: true,
    status
  };
}

function normalizeError(error: any) {
  let message = 'Error desconocido';
  let data = null;
  let success = false;
  let status = error.response?.status ?? 500;
  let validationErrors: Record<string, string[]> | null = null;

  if (error.response?.data) {
    const responseData = error.response.data;
    
    if (typeof responseData === 'string') {
      message = responseData;
    } else if (responseData.error) {
      message = responseData.error;
    } else if (responseData.errors && typeof responseData.errors === 'object') {
      // Manejar errores de validación con estructura de campos
      validationErrors = responseData.errors;
      
      // Crear mensaje consolidado de errores de validación
      const errorMessages: string[] = [];
      Object.entries(responseData.errors).forEach(([field, errors]) => {
        if (Array.isArray(errors)) {
          errors.forEach(errorMsg => {
            errorMessages.push(`${field}: ${errorMsg}`);
          });
        }
      });
      
      if (errorMessages.length > 0) {
        message = errorMessages.join(', ');
      } else {
        message = responseData.title || 'Errores de validación';
      }
      
      data = responseData;
    } else if (responseData.message) {
      message = responseData.message;
      data = responseData.data ?? null;
      success = responseData.success ?? false;
    } else {
      message = responseData.title || responseData.message || message;
      data = responseData;
    }
  } else if (error.message) {
    message = error.message;
  }

  // Verificar si es un error de timeout de conexión
  const isConnectionTimeout = isConnectionTimeoutError(message);

  return {
    data,
    message,
    success,
    status,
    validationErrors,
    isConnectionTimeout
  };
}

// Servicio de API optimizado
export const apiService = {
  get: async (endpoint: string, params?: any) => {
    try {
      const response = await api.get(endpoint, { params });
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  
  post: async (endpoint: string, data: any) => {
    try {
      const response = await api.post(endpoint, data);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  
  put: async (endpoint: string, data: any) => {
    try {
      const response = await api.put(endpoint, data);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  
  delete: async (endpoint: string, id: string | number) => {
    try {
      const response = await api.delete(`${endpoint}/${id}`);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  
  // Funciones utilitarias
  isConnectionTimeoutError,
  handleConnectionTimeout,
  handleUnauthorized,
  
  /**
   * Extrae errores de validación de una respuesta de error
   */
  getValidationErrors: (errorResponse: any) => {
    if (errorResponse.validationErrors) {
      return errorResponse.validationErrors;
    }
    return null;
  },
  
  /**
   * Verifica si una respuesta contiene errores de validación
   */
  hasValidationErrors: (errorResponse: any) => {
    return errorResponse.validationErrors && Object.keys(errorResponse.validationErrors).length > 0;
  }
};

// Exportar instancia de axios para uso directo con React Query
export { api };