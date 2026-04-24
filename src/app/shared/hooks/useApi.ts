/**
 * Hooks optimizados usando React Query
 * Reemplaza los hooks CRUD personalizados
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, queryKeys } from '../lib/react-query';
// import { useNotification } from '../context/NotificationContext';

// Hook para obtener lista de elementos
export const useList = <T>(
  key: string[],
  endpoint: string,
  params?: any,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery({
    queryKey: [...key, params],
    queryFn: async () => {
      const response = await apiService.get(endpoint, params);
      return response;
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener un elemento por ID
export const useItem = <T>(
  key: string[],
  endpoint: string,
  id: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: [...key, id],
    queryFn: async () => {
      const response = await apiService.get(`${endpoint}/${id}`);
      return response;
    },
    enabled: options?.enabled ?? !!id,
  });
};

// Hook para crear elementos
export const useCreate = <T>(
  key: string[],
  endpoint: string,
  options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }
) => {
  const queryClient = useQueryClient();
  // const { addNotification } = useNotification();

  return useMutation({
    mutationFn: async (data: Partial<T>) => {
      const response = await apiService.post(endpoint, data);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: key });
      // addNotification({
      //   type: 'success',
      //   title: 'Éxito',
      //   message: data.message || 'Elemento creado exitosamente'
      // });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      // addNotification({
      //   type: 'error',
      //   title: 'Error',
      //   message: error.message || 'Error al crear el elemento'
      // });
      options?.onError?.(error);
    },
  });
};

// Hook para actualizar elementos
export const useUpdate = <T>(
  key: string[],
  endpoint: string,
  options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }
) => {
  const queryClient = useQueryClient();
  // const { addNotification } = useNotification();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      const response = await apiService.put(`${endpoint}/${id}`, data);
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: [...key, variables.id] });
      // addNotification({
      //   type: 'success',
      //   title: 'Éxito',
      //   message: data.message || 'Elemento actualizado exitosamente'
      // });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      // addNotification({
      //   type: 'error',
      //   title: 'Error',
      //   message: error.message || 'Error al actualizar el elemento'
      // });
      options?.onError?.(error);
    },
  });
};

// Hook para eliminar elementos
export const useDelete = (
  key: string[],
  endpoint: string,
  options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }
) => {
  const queryClient = useQueryClient();
  // const { addNotification } = useNotification();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.delete(endpoint, id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      // addNotification({
      //   type: 'success',
      //   title: 'Éxito',
      //   message: 'Elemento eliminado exitosamente'
      // });
      options?.onSuccess?.();
    },
    onError: (error) => {
      // addNotification({
      //   type: 'error',
      //   title: 'Error',
      //   message: error.message || 'Error al eliminar el elemento'
      // });
      options?.onError?.(error);
    },
  });
};

// Hook para búsquedas dinámicas
export const useDynamicSearch = <T>(
  endpoint: string,
  params: any,
  options?: {
    enabled?: boolean;
    debounceDelay?: number;
  }
) => {
  return useQuery({
    queryKey: queryKeys.search(endpoint, params),
    queryFn: async () => {
      const response = await apiService.get(endpoint, params);
      return response;
    },
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
  });
};

// Hook para operaciones asíncronas con notificaciones
export const useAsyncOperation = <T>(
  operation: () => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  }
) => {
  // const { addNotification } = useNotification();

  return useMutation({
    mutationFn: operation,
    onSuccess: (data) => {
      // addNotification({
      //   type: 'success',
      //   title: 'Éxito',
      //   message: 'Operación completada exitosamente'
      // });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      // addNotification({
      //   type: 'error',
      //   title: 'Error',
      //   message: error.message || 'Error en la operación'
      // });
      options?.onError?.(error);
    },
  });
};