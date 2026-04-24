/**
 * Configuración global de paginación
 * Todos los tipos de entidad usan exactamente los mismos valores
 */
export const PAGINATION_CONFIG = {
  /** Página inicial por defecto */
  defaultPageNumber: 1,
  /** Tamaño de página por defecto */
  defaultPageSize: 8,
  /** Opciones de tamaño de página disponibles */
  pageSizeOptions: [4, 8, 12, 20, 50],
  /** Tamaño de página mínimo */
  minPageSize: 1,
  /** Tamaño de página máximo */
  maxPageSize: 100
} as const;

/**
 * Utilidades para paginación
 */
export const PAGINATION_UTILS = {
  /**
   * Obtiene valores por defecto de paginación
   */
  getDefaults: () => ({
    pageNumber: PAGINATION_CONFIG.defaultPageNumber,
    pageSize: PAGINATION_CONFIG.defaultPageSize
  }),

  /**
   * Normaliza parámetros de paginación
   */
  normalize: (pageNumber?: number | null, pageSize?: number | null) => ({
    pageNumber: (pageNumber && pageNumber > 0) ? pageNumber : PAGINATION_CONFIG.defaultPageNumber,
    pageSize: (pageSize && pageSize > 0) ? pageSize : PAGINATION_CONFIG.defaultPageSize
  }),

  /**
   * Verifica si los parámetros de paginación son válidos
   */
  isValid: (pageNumber?: number | null, pageSize?: number | null): boolean => {
    return !!(
      pageNumber && pageNumber > 0 &&
      pageSize && pageSize > 0 && pageSize <= PAGINATION_CONFIG.maxPageSize
    );
  }
} as const;
