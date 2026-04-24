import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eliminarCategoria, buscarCategorias, obtenerCategorias, Categoria } from '../service/categoriasService';
import { DynamicSearchParams } from '../../shared/types';
import { useConfirmation, useNotification } from '../../shared/contexts';
import { useDebounce, usePaginationDefaults } from '../../shared/hooks';

/**
 * Hook personalizado para manejar categorías
 * Proporciona funciones para cargar, gestionar y buscar categorías
 * Soporta tanto modo simple (para formularios) como modo completo (para gestión)
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<DynamicSearchParams>({});
  
  const { defaults, normalizeParams } = usePaginationDefaults();
  const [paginationInfo, setPaginationInfo] = useState({
    totalRecords: 0,
    pageNumber: defaults.pageNumber as number,
    pageSize: defaults.pageSize as number
  });

  const { showConfirm } = useConfirmation();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // Hook de debounce para búsquedas de texto
  const [debouncedFilters, setDebouncedFilters] = useState<DynamicSearchParams>({});
  const [debouncedPageNumber, setDebouncedPageNumber] = useState<number | undefined>(undefined);
  const [debouncedPageSize, setDebouncedPageSize] = useState<number | undefined>(undefined);
  
  // Aplicar debounce a los filtros
  const debouncedSearchFilters = useDebounce(debouncedFilters, 300);
  const debouncedPageNum = useDebounce(debouncedPageNumber, 300);
  const debouncedPageSz = useDebounce(debouncedPageSize, 300);

  // Función para cargar categorías desde la API
  const loadCategories = async (pageNumber?: number, pageSize?: number) => {
    try {
      setLoading(true);
      // Normalizar parámetros de paginación usando utilidades globales
      const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams(pageNumber, pageSize);
      const response = await buscarCategorias({}, normalizedPageNumber, normalizedPageSize);
      
      if (response.success) {
        const categoriasData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.listFind || [];
        setCategories(categoriasData as Categoria[]);
        
        const paginationData = Array.isArray(response.data) ? response : response.data;
        setPaginationInfo({
          totalRecords: paginationData?.totalRecords || 0,
          pageNumber: paginationData?.pageNumber || defaults.pageNumber as number,
          pageSize: paginationData?.pageSize || defaults.pageSize as number
        });
      } else {
        setCategories([]);
        addNotification('Error al cargar las categorías', 'error');
      }
    } catch (error: any) {
      addNotification('Error al cargar las categorías: ' + error.message, 'error');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar categorías con filtros
  const searchCategories = async (filters: DynamicSearchParams, pageNumber?: number, pageSize?: number) => {
    try {
      setLoading(true);
      // Normalizar parámetros de paginación usando utilidades globales
      const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams(pageNumber, pageSize);
      const response = await buscarCategorias(filters, normalizedPageNumber, normalizedPageSize);
      
      if (response.success) {
        const categoriasData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.listFind || [];
        setCategories(categoriasData as Categoria[]);
        
        const paginationData = Array.isArray(response.data) ? response : response.data;
        setPaginationInfo({
          totalRecords: paginationData?.totalRecords || 0,
          pageNumber: paginationData?.pageNumber || defaults.pageNumber as number,
          pageSize: paginationData?.pageSize || defaults.pageSize as number
        });
      } else {
        setCategories([]);
        addNotification('Error al buscar categorías', 'error');
      }
    } catch (error: any) {
      addNotification('Error al buscar categorías: ' + error.message, 'error');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para editar una categoría
  const handleEditCategory = (categoryId: number) => {
    navigate(`/worldGaming/juegos/editarCategoria/${categoryId}`);
  };

  // Función para crear una nueva categoría
  const handleCreateCategory = () => {
    navigate('/worldGaming/juegos/crearCategoria');
  };

  // Función para eliminar una categoría
  const handleDeleteCategory = async (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const confirmed = await showConfirm({
      title: 'Eliminar Categoría',
      message: `¿Estás seguro de que quieres eliminar la categoría "${category.nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      try {
        await eliminarCategoria(categoryId);
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        addNotification('Categoría eliminada exitosamente', 'success');
      } catch (error: any) {
        addNotification('Error al eliminar la categoría: ' + error.message, 'error');
      }
    }
  };

  // Función para manejar búsqueda
  const handleSearch = (term: string) => {
    const newFilters = { ...searchFilters };
    
    if (term && term.trim()) {
      newFilters.Nombre = term.trim();
    } else {
      delete newFilters.Nombre;
    }
    
    setSearchFilters(newFilters);
    setDebouncedFilters(newFilters);
    setDebouncedPageNumber(paginationInfo.pageNumber);
    setDebouncedPageSize(paginationInfo.pageSize);
  };

  // Función para manejar cambio de filtros
  const handleFilterChange = (filterType: string, value: any) => {
    const newFilters = { ...searchFilters };
    
    switch (filterType) {
      case 'search':
        if (value && value.trim()) {
          newFilters.Nombre = value.trim();
        } else {
          delete newFilters.Nombre;
        }
        break;
      default:
        break;
    }
    
    setSearchFilters(newFilters);
    searchCategories(newFilters, paginationInfo.pageNumber, paginationInfo.pageSize);
  };

  // Función para refrescar los datos
  const handleRefresh = (pageNumber?: number, pageSize?: number) => {
    setSearchFilters({});
    loadCategories(pageNumber, pageSize);
  };

  // Función para manejar cambio de paginación
  const handlePaginationChange = (pageNumber: number, pageSize: number) => {
    searchCategories(searchFilters, pageNumber, pageSize);
  };

  // Función simple para cargar categorías (para formularios)
  const loadCategoriesSimple = async () => {
    try {
      setLoading(true);
      const categoriasData = await obtenerCategorias();
      setCategories(categoriasData);
    } catch (error: any) {
      addNotification('Error al cargar las categorías', 'error');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener categoría por ID
  const getCategoryById = (id: number | string) => {
    return Array.isArray(categories) ? categories.find(cat => cat.id === Number(id)) : undefined;
  };

  // Obtener categoría por nombre
  const getCategoryByName = (name: string) => {
    return Array.isArray(categories) ? categories.find(cat => cat.nombre.toLowerCase() === name.toLowerCase()) : undefined;
  };

  // Obtener opciones para dropdowns
  const getCategoryOptions = () => {
    return [
      ...categories.map(cat => ({ value: cat.id.toString(), label: cat.nombre }))
    ];
  };

  // Efecto para manejar búsquedas con debounce
  useEffect(() => {
    if (Object.keys(debouncedSearchFilters).length > 0) {
      searchCategories(debouncedSearchFilters, debouncedPageNum, debouncedPageSz);
    }
  }, [debouncedSearchFilters, debouncedPageNum, debouncedPageSz]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();
  }, []);

  return {
    // Estados
    categories,
    loading,
    paginationInfo,
    
    // Funciones de gestión (modo completo)
    handleEditCategory,
    handleCreateCategory,
    handleDeleteCategory,
    handleSearch,
    handleFilterChange,
    handleRefresh,
    handlePaginationChange,
    
    
    // Funciones de carga
    loadCategories,
    
    // Funciones simples (para formularios)
    loadCategoriesSimple,
    getCategoryById,
    getCategoryByName,
    getCategoryOptions
  };
};
