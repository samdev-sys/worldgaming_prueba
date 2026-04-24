import { useState, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import { DynamicSearchParams } from '../types';
import { usePaginationDefaults } from './usePaginationDefaults';

export interface SearchResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  paginationInfo: {
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
  };
  searchFilters: DynamicSearchParams;
  handleSearch: (searchTerm: string) => void;
  handleFilterChange: (filterKey: string, value: any) => void;
  handlePageChange: (pageNumber: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  handleRefresh: () => void;
  clearFilters: () => void;
}

/**
 * Hook de búsqueda completamente estable sin useEffect
 * Usa solo useRef y useCallback para evitar todos los problemas de dependencias
 */
export const useSearchStable = <T = any>(
  endpoint: string,
  defaultFilters: DynamicSearchParams = {},
  additionalParams: Record<string, any> = {}
): SearchResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<DynamicSearchParams>(defaultFilters);
  
  const { defaults, normalizeParams } = usePaginationDefaults();
  
  const [paginationInfo, setPaginationInfo] = useState({
    totalRecords: 0,
    pageNumber: defaults.pageNumber as number,
    pageSize: defaults.pageSize as number
  });

  // Refs para evitar recreaciones
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Función para limpiar filtros vacíos
  const cleanFilters = (filters: DynamicSearchParams): DynamicSearchParams => {
    const cleaned: DynamicSearchParams = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && 
          value !== '' && 
          value !== 'Seleccionar...' && 
          value !== 'select' &&
          value !== null && 
          value !== undefined) {
        cleaned[key as keyof DynamicSearchParams] = value;
      }
    });
    
    return cleaned;
  };

  // Función de búsqueda estable
  const performSearch = useCallback(async (filters: DynamicSearchParams, pageNumber?: number, pageSize?: number) => {
    try {
      setLoading(true);
      setSearchFilters(filters);
      
      const cleanedFilters = cleanFilters(filters);
      
      // Agregar parámetros adicionales
      Object.assign(cleanedFilters, additionalParams);
      
      const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams(pageNumber, pageSize);
      
      // Construir parámetros de consulta
      const params: any = {
        ...cleanedFilters,
        pageNumber: normalizedPageNumber,
        pageSize: normalizedPageSize
      };

      // Remover parámetros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key];
        }
      });

      const response = await apiService.get(endpoint, params);
      
      if (response.success) {
        const responseData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.listFind || [];
        setData(responseData as T[]);

        const paginationData = Array.isArray(response.data) ? response : response.data;
        setPaginationInfo({
          totalRecords: paginationData?.totalRecords || 0,
          pageNumber: (paginationData?.pageNumber && paginationData.pageNumber > 0) ? paginationData.pageNumber : defaults.pageNumber as number,
          pageSize: pageSize || defaults.pageSize as number
        });
        
        setError(null);
      } else {
        setError('Error en la búsqueda: ' + response.message);
        setData([]);
        setPaginationInfo({ totalRecords: 0, pageNumber: 1, pageSize: pageSize || defaults.pageSize as number });
      }
    } catch (error: any) {
      setError('Error al buscar: ' + error.message);
      setData([]);
      setPaginationInfo({ totalRecords: 0, pageNumber: 1, pageSize: pageSize || defaults.pageSize as number });
    } finally {
      setLoading(false);
    }
  }, [endpoint, additionalParams, normalizeParams, defaults]);

  // Inicialización única
  if (!isInitializedRef.current) {
    isInitializedRef.current = true;
    performSearch(defaultFilters);
  }

  // Función para manejar búsqueda de texto con debounce manual
  const handleSearch = useCallback((searchTerm: string) => {
    // Limpiar timeout anterior
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Crear nuevo timeout
    debounceTimeoutRef.current = setTimeout(() => {
      const newFilters = { ...searchFilters };
      
      if (searchTerm && searchTerm.trim() !== '') {
        newFilters['Nombre'] = searchTerm;
      } else {
        delete newFilters['Nombre'];
      }
      
      performSearch(newFilters, 1, paginationInfo.pageSize);
    }, 500); // 500ms de debounce
  }, [searchFilters, performSearch, paginationInfo.pageSize]);

  // Función para manejar cambios de filtros (sin debounce)
  const handleFilterChange = useCallback((filterKey: string, value: any) => {
    const newFilters = { ...searchFilters };
    
    if (value && 
        value !== '' && 
        value !== 'Seleccionar...' && 
        value !== 'select') {
      newFilters[filterKey as keyof DynamicSearchParams] = value;
    } else {
      delete newFilters[filterKey as keyof DynamicSearchParams];
    }
    
    performSearch(newFilters, 1, paginationInfo.pageSize);
  }, [searchFilters, performSearch, paginationInfo.pageSize]);

  // Función para manejar cambio de página
  const handlePageChange = useCallback((pageNumber: number) => {
    performSearch(searchFilters, pageNumber, paginationInfo.pageSize);
  }, [searchFilters, performSearch, paginationInfo.pageSize]);

  // Función para manejar cambio de tamaño de página
  const handlePageSizeChange = useCallback((pageSize: number) => {
    performSearch(searchFilters, 1, pageSize);
  }, [searchFilters, performSearch]);

  // Función para refrescar datos
  const handleRefresh = useCallback(() => {
    performSearch(searchFilters, paginationInfo.pageNumber, paginationInfo.pageSize);
  }, [searchFilters, paginationInfo.pageNumber, paginationInfo.pageSize, performSearch]);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    performSearch(defaultFilters, 1, paginationInfo.pageSize);
  }, [defaultFilters, paginationInfo.pageSize, performSearch]);

  return {
    data,
    loading,
    error,
    paginationInfo,
    searchFilters,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    clearFilters
  };
};
