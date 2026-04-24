import { useState, useCallback } from 'react';

interface UseAsyncOperationOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

interface UseAsyncOperationReturn<T> {
  execute: (...args: any[]) => Promise<T | undefined>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useAsyncOperation<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: any[]): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction(...args);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
      options.onFinally?.();
    }
  }, [asyncFunction, options]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    execute,
    loading,
    error,
    reset
  };
}

// Hook específico para operaciones de notificaciones
export function useNotificationOperation<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  operationName: string
) {
  const [operationId] = useState(() => `${operationName}-${Date.now()}`);
  
  const execute = useCallback(async (...args: any[]): Promise<T | undefined> => {
    try {
      const result = await asyncFunction(...args);
      return result;
    } catch (error) {
      console.error(`Error en ${operationName}:`, error);
      throw error;
    }
  }, [asyncFunction, operationName]);

  return {
    execute,
    operationId
  };
}
