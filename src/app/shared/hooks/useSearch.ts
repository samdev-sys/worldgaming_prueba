import { useSearchStable } from './useSearchStable';

/**
 * Hook simplificado para búsquedas que elimina toda la repetición de código
 * Solo necesitas especificar el endpoint y opcionalmente filtros por defecto
 * Versión completamente estable sin useEffect que evita bucles infinitos
 */
export const useSearch = <T = any>(
  endpoint: string, 
  defaultFilters?: Record<string, any>,
  additionalParams?: Record<string, any>
) => {
  return useSearchStable<T>(endpoint, defaultFilters, additionalParams);
};

export default useSearch;
