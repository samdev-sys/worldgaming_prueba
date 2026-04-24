import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eliminarJuego, buscarJuegos, Juego } from '../service/juegosService';
import { DynamicSearchParams } from '../../shared/types';
import { useCategories } from './useCategories';
import { useConfirmation, useNotification } from '../../shared/contexts';
import { getDisplayIcon } from '../../shared/utils';
import { getDifficultyColor } from '../../shared/utils';
import { useDebounce, usePaginationDefaults } from '../../shared/hooks';

/**
 * Hook personalizado para manejar la gestión de juegos
 * Proporciona toda la lógica para listar, buscar, editar y eliminar juegos
 */
export const useGestionarJuegos = () => {
  const [games, setGames] = useState<Juego[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<DynamicSearchParams>({});
  
  // Hook para manejar valores por defecto de paginación globales
  const { defaults, normalizeParams } = usePaginationDefaults();
  
  const [paginationInfo, setPaginationInfo] = useState({
    totalRecords: 0,
    pageNumber: defaults.pageNumber as number,
    pageSize: defaults.pageSize as number
  });

  // Hook de debounce para búsquedas de texto
  const [debouncedFilters, setDebouncedFilters] = useState<DynamicSearchParams>({});
  const [debouncedPageNumber, setDebouncedPageNumber] = useState<number | undefined>(undefined);
  const [debouncedPageSize, setDebouncedPageSize] = useState<number | undefined>(undefined);
  
  // Aplicar debounce a los filtros
  const debouncedSearchFilters = useDebounce(debouncedFilters, 500);
  const debouncedPageNum = useDebounce(debouncedPageNumber, 500);
  const debouncedPageSz = useDebounce(debouncedPageSize, 500);

  const { showConfirm } = useConfirmation();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // Hook para manejar categorías
  const { categories, loading: loadingCategories } = useCategories();

  // Función para cargar juegos desde la API usando getDynamic
  const loadGames = async (pageNumber?: number, pageSize?: number) => {
    try {
      setLoading(true);
      // Normalizar parámetros de paginación usando utilidades globales
      const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams(pageNumber, pageSize);
      // Usar buscarJuegos con parámetros vacíos para obtener todos los juegos
      const response = await buscarJuegos({}, normalizedPageNumber, normalizedPageSize);
      if (response.success) {
        const gamesData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.listFind || [];
        setGames(gamesData);

        // Actualizar información de paginación
        const paginationData = Array.isArray(response.data) ? response : response.data;
        setPaginationInfo({
          totalRecords: paginationData?.totalRecords || 0,
          pageNumber: (paginationData?.pageNumber && paginationData.pageNumber > 0) ? paginationData.pageNumber : defaults.pageNumber as number,
          pageSize: (paginationData?.pageSize && paginationData.pageSize > 0) ? paginationData.pageSize : defaults.pageSize as number
        });
      } else {
        addNotification('Error al cargar los juegos: ' + response.message, 'error');
        setGames([]);
        setPaginationInfo({ totalRecords: 0, pageNumber: 1, pageSize: 6 });
      }
    } catch (error: any) {
      addNotification('Error al cargar los juegos', 'error');
      setGames([]);
      setPaginationInfo({ totalRecords: 0, pageNumber: 1, pageSize: 6 });
    } finally {
      setLoading(false);
    }
  };


  // Función para buscar juegos con filtros dinámicos
  const searchGames = async (filters: DynamicSearchParams, pageNumber?: number, pageSize?: number) => {
    try {
      setLoading(true);
      setSearchFilters(filters);
      
      // Normalizar parámetros de paginación usando utilidades globales
      const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams(pageNumber, pageSize);
      const response = await buscarJuegos(filters, normalizedPageNumber, normalizedPageSize);
      if (response.success) {
        const gamesData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.listFind || [];
        setGames(gamesData);

        // Actualizar información de paginación
        const paginationData = Array.isArray(response.data) ? response : response.data;
        setPaginationInfo({
          totalRecords: paginationData?.totalRecords || 0,
          pageNumber: (paginationData?.pageNumber && paginationData.pageNumber > 0) ? paginationData.pageNumber : defaults.pageNumber as number,
          pageSize: (paginationData?.pageSize && paginationData.pageSize > 0) ? paginationData.pageSize : defaults.pageSize as number
        });
      } else {
        addNotification('Error en la búsqueda: ' + response.message, 'error');
        setGames([]);
        setPaginationInfo({ totalRecords: 0, pageNumber: 1, pageSize: 6 });
      }
    } catch (error: any) {
      addNotification('Error al buscar juegos: ' + error.message, 'error');
      setGames([]);
      setPaginationInfo({ totalRecords: 0, pageNumber: 1, pageSize: 6 });
    } finally {
      setLoading(false);
    }
  };

  // Función para alternar estado de un juego
  const handleToggleStatus = (gameId: number) => {
    setGames(prev => prev.map(game =>
      game.id === gameId ? { ...game, isActive: !game.isActive } : game
    ));
  };

  // Función para editar un juego
  const handleEditGame = (gameId: number) => {
    navigate(`/worldGaming/juegos/editar/${gameId}`);
  };

  // Función para eliminar un juego
  const handleDeleteGame = async (gameId: number) => {
    const confirmed = await showConfirm({
      title: 'Eliminar Juego',
      message: '¿Estás seguro de que quieres eliminar este juego? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      try {
        const result = await eliminarJuego(gameId);
        setGames(prev => prev.filter(game => game.id !== gameId));
        if (result.success) {
          addNotification('Juego eliminado exitosamente', 'success');
        } else {
          addNotification('Error al eliminar el juego: ' + result.message, 'error');
        }
      } catch (error: any) {
        addNotification('Error al eliminar el juego: ' + error.message, 'error');
      }
    }
  };



  // Función para manejar cambios en los filtros
  const handleFilterChange = (filterType: string, value: any) => {
    const newFilters = { ...searchFilters };

    switch (filterType) {
      case 'search':
        if (value && value.trim()) {
          newFilters.Nombre = value.trim();
        } else {
          delete newFilters.Nombre;
        }
        // Usar debounce para búsquedas de texto
        setDebouncedFilters(newFilters);
        setDebouncedPageNumber(paginationInfo.pageNumber);
        setDebouncedPageSize(paginationInfo.pageSize);
        return; // Salir temprano para evitar búsqueda inmediata
      case 'category':
        if (value && value !== 'all') {
          newFilters.CategoriaId = parseInt(value);
        } else {
          delete newFilters.CategoriaId;
        }
        break;
      case 'status':
        if (value && value !== 'all') {
          newFilters.IsActive = value === 'active';
        } else {
          delete newFilters.IsActive;
        }
        break;
    }

    // Realizar búsqueda inmediata para filtros de selección (categoría, estado)
    searchGames(newFilters, paginationInfo.pageNumber, paginationInfo.pageSize);
  };

  // Función para refrescar los datos
  const handleRefresh = (pageNumber?: number, pageSize?: number) => {
    // Limpiar filtros y recargar todos los juegos
    setSearchFilters({});
    loadGames(pageNumber, pageSize);
  };

  // Función para manejar cambios de paginación
  const handlePaginationChange = (pageNumber: number, pageSize: number) => {
    // Realizar búsqueda con los filtros actuales y nueva paginación
    searchGames(searchFilters, pageNumber, pageSize);
  };

  // Efecto para manejar búsquedas con debounce
  useEffect(() => {
    if (Object.keys(debouncedSearchFilters).length > 0) {
      searchGames(debouncedSearchFilters, debouncedPageNum, debouncedPageSz);
    }
  }, [debouncedSearchFilters, debouncedPageNum, debouncedPageSz]);

  // Cargar juegos al montar el componente
  useEffect(() => {
    loadGames();
  }, []);


  return {
    // Estados
    games,
    loading,
    loadingCategories,
    searchFilters,
    paginationInfo,

    // Funciones de datos
    loadGames,
    searchGames,

    // Funciones de manejo
    handleToggleStatus,
    handleEditGame,
    handleDeleteGame,
    handleFilterChange,
    handleRefresh,
    handlePaginationChange,

    // Funciones utilitarias
    getDifficultyColor,
    getDisplayIcon,
    categories
  };
};
