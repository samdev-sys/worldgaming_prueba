import { useMemo } from 'react';
import { PAGINATION_UTILS, PAGINATION_CONFIG } from '../constants/pagination';

/**
 * Hook para manejar valores por defecto de paginación globales
 */
export const usePaginationDefaults = () => {
  const defaults = useMemo(() => PAGINATION_UTILS.getDefaults(), []);
  const normalizeParams = useMemo(() => PAGINATION_UTILS.normalize, []);
  const isValidPagination = useMemo(() => PAGINATION_UTILS.isValid, []);

  return {
    defaults,
    normalizeParams,
    isValidPagination,
    pageSizeOptions: PAGINATION_CONFIG.pageSizeOptions
  };
};
