/**
 * Exportaciones centralizadas de hooks personalizados
 * Actualizado después de la optimización
 */

import React from 'react';

// Hooks de utilidad optimizados
export * from './useEntityManagement';
export * from './usePaginationDefaults';
export * from './useSearchStable';
export * from './useSearch';

// Hooks de API usando React Query
export * from './useApi';

// Hook de debounce temporal hasta instalar use-debounce
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};