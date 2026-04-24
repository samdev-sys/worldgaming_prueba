import React, { useEffect, useState, memo, useRef } from 'react';
import { Card } from './Card';
import Pagination from '../Pagination';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { RefreshCw, LucideIcon } from 'lucide-react';
import { PAGINATION_CONFIG } from '../../constants/pagination';
import CategoryPicker from './CategoryPicker';
import CustomSelect from './CustomSelect';

interface CardField {
  label: string;
  key: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface FilterConfig {
  type: 'search' | 'select' | 'category-picker';
  key: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  categories?: Array<{ id: number; nombre: string; descripcion: string; color: string }>;
  loading?: boolean;
  onChange?: (value: any) => void;
}

interface DynamicCardListProps {
  cardFields?: CardField[];
  filters?: FilterConfig[];
  pagination?: boolean;
  cardActions?: (item: any) => React.ReactNode;
  itemsPerPageOptions?: number[];
  className?: string;
  mockData?: any[];
  getCardClassName?: (item: any) => string;
  renderCard?: (item: any) => React.ReactNode;
  title?: string;
  subtitle?: string;
  newButtonText?: string;
  newButtonLink?: string;
  newButtonState?: any;
  onNew?: () => void;
  isLoading?: boolean;
  onRefresh?: (pageNumber?: number, pageSize?: number) => void;
  onPaginationChange?: (pageNumber: number, pageSize: number) => void;
  
  // Información de paginación del servidor
  serverPagination?: {
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
  };
  
  // Datos estáticos
  data?: any[];
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  
  // Nuevas props para personalización
  gridClassName?: string; // Clases CSS para el grid de cards
  renderPagination?: (paginationProps: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (size: number) => void;
    itemsPerPageOptions: number[];
  }) => React.ReactNode;
  renderFilters?: (filterProps: {
    filters: FilterConfig[];
    filterValues: Record<string, any>;
    onFilterChange: (key: string, value: any) => void;
    onRefresh: () => void;
    isLoading: boolean;
  }) => React.ReactNode;
  // Valores iniciales de filtros desde el hook (para sincronización)
  initialFilterValues?: Record<string, any>;
}

const DynamicCardList: React.FC<DynamicCardListProps> = memo(({
  cardFields = [],
  filters = [],
  pagination = true,
  cardActions,
  itemsPerPageOptions = PAGINATION_CONFIG.pageSizeOptions,
  className = '',
  mockData,
  getCardClassName,
  renderCard,
  title,
  subtitle,
  newButtonText,
  newButtonLink,
  newButtonState,
  onNew,
  isLoading = false,
  onRefresh,
  onPaginationChange,
  serverPagination,
  data: staticData,
  emptyMessage = "No se encontraron registros",
  emptyIcon: EmptyIcon,
  gridClassName,
  renderPagination,
  renderFilters,
  initialFilterValues
}) => {
  // Determinar si estamos en modo datos estáticos
  const isStaticMode = staticData !== undefined;
  
  const [data, setData] = useState<any[]>(isStaticMode ? staticData : (mockData || []));
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});
  // Estados locales para paginación (solo cuando no hay serverPagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [totalRecords] = useState(0);
  
  // Determinar si hay paginación del servidor (no solo si existe serverPagination, sino si tiene valores válidos)
  const hasServerPagination = serverPagination && 
    serverPagination.pageNumber !== null && 
    serverPagination.pageNumber > 0 && 
    serverPagination.pageSize !== null && 
    serverPagination.pageSize > 0;
  
  // Usar información del servidor si está disponible, sino usar estados locales
  const effectiveCurrentPage = hasServerPagination ? serverPagination.pageNumber : currentPage;
  // Para serverPagination, siempre usar el valor del servidor
  const effectiveItemsPerPage = hasServerPagination ? serverPagination.pageSize : itemsPerPage;
  const effectiveTotalRecords = serverPagination?.totalRecords || totalRecords;

  useEffect(() => {
    if (isStaticMode) {
      setData(staticData || []);
      return;
    }
    
    if (mockData) {
      setData(mockData);
      return;
    }
    // eslint-disable-next-line
  }, [mockData, isStaticMode]); // Removido staticData para evitar bucles

  // Efecto separado para manejar cambios en staticData sin bucles
  useEffect(() => {
    if (isStaticMode && staticData !== undefined) {
      setData(staticData);
    }
  }, [staticData, isStaticMode]);

  // Función helper para mapear claves de filtros a claves del backend
  const mapFilterKeyToBackendKey = (filterKey: string): string[] => {
    // Mapeo de claves conocidas
    const keyMap: Record<string, string> = {
      'estado': 'Estado',
      'dificultad': 'Dificultad',
      'juego': 'JuegoId',
      'search': 'Nombre',
      'categoria': 'CategoriaId'
    };
    
    const backendKey = keyMap[filterKey.toLowerCase()];
    if (backendKey) {
      return [filterKey, backendKey];
    }
    
    // Si no hay mapeo específico, intentar con mayúscula
    const capitalizedKey = filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
    return [filterKey, capitalizedKey];
  };

  // Sincronizar filterValues con initialFilterValues cuando cambien
  useEffect(() => {
    if (initialFilterValues && renderFilters) {
      const mapped: { [key: string]: string } = {};
      filters.forEach(filter => {
        const possibleKeys = mapFilterKeyToBackendKey(filter.key);
        // Buscar el valor en las claves posibles
        for (const key of possibleKeys) {
          if (initialFilterValues[key] !== undefined && initialFilterValues[key] !== null && initialFilterValues[key] !== '') {
            mapped[filter.key] = initialFilterValues[key];
            break;
          }
        }
      });
      setFilterValues(prev => {
        // Solo actualizar si hay cambios
        const hasChanges = Object.keys(mapped).some(key => prev[key] !== mapped[key]) ||
          Object.keys(prev).some(key => mapped[key] === undefined && prev[key] !== undefined);
        return hasChanges ? mapped : prev;
      });
    }
  }, [initialFilterValues, renderFilters, filters]);



  // Ref para el debounce del campo de búsqueda
  const searchDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filtros locales (search y select)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
    
    // Limpiar timeout anterior
    if (searchDebounceTimeoutRef.current) {
      clearTimeout(searchDebounceTimeoutRef.current);
    }
    
    // Crear nuevo timeout para debounce (500ms)
    searchDebounceTimeoutRef.current = setTimeout(() => {
      // Llamar al callback onChange si está disponible
      const filter = filters?.find(f => f.key === 'search');
      if (filter?.onChange) {
        filter.onChange(value);
      }
    }, 500);
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchDebounceTimeoutRef.current) {
        clearTimeout(searchDebounceTimeoutRef.current);
      }
    };
  }, []);
  const handleSelect = (key: string, value: string) => {
    // Actualizar estado local solo si no hay renderFilters o si el filtro no tiene onChange personalizado
    // Cuando hay renderFilters y el filtro tiene onChange, el onChange manejará la actualización
    const filter = filters?.find(f => f.key === key);
    if (!renderFilters || !filter?.onChange) {
      setFilterValues(prev => ({ ...prev, [key]: value }));
    }
    setCurrentPage(1);
    
    // Llamar al callback onChange si está disponible (esto actualizará el estado del hook)
    if (filter?.onChange) {
      filter.onChange(value);
      // Si el filtro tiene onChange personalizado, también actualizar el estado local para mantener sincronización
      if (renderFilters) {
        setFilterValues(prev => ({ ...prev, [key]: value }));
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    // Solo actualizar estado local si no hay serverPagination
    if (!hasServerPagination) {
      setCurrentPage(newPage);
    }
    
    // Llamar a onPaginationChange si está disponible
    if (onPaginationChange) {
      onPaginationChange(newPage, effectiveItemsPerPage);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    // Solo actualizar estado local si no hay serverPagination
    if (!hasServerPagination) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    }
    
    // Llamar a onPaginationChange si está disponible (esto actualizará el servidor)
    if (onPaginationChange) {
      onPaginationChange(1, newItemsPerPage);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      // Si se proporciona onRefresh, usarlo con los valores efectivos de paginación
      onRefresh(effectiveCurrentPage, effectiveItemsPerPage);
    } else if (isStaticMode || mockData) {
      // Para datos estáticos o mockData, solo resetear filtros y paginación
      setSearch('');
      setFilterValues({});
      if (!hasServerPagination) {
        setCurrentPage(1);
      }
    }
  };

  // Filtrado local solo para datos estáticos y mockData, NO para datos del servidor
  let filteredData = Array.isArray(data) ? data : [];
  if ((isStaticMode || mockData) && !hasServerPagination) {
    filteredData = (Array.isArray(data) ? data : []).filter(item => {
      let matches = true;
      filters.forEach(f => {
        if (f.type === 'search' && search) {
          const val = (item[f.key] || '').toString().toLowerCase();
          if (!val.includes(search.toLowerCase())) matches = false;
        }
        if (f.type === 'select' && filterValues[f.key]) {
          if ((item[f.key] || '') !== filterValues[f.key]) matches = false;
        }
      });
      return matches;
    });
  }

  let currentItems = data;
  if ((isStaticMode || mockData) && !hasServerPagination) {
    // paginación local solo para datos estáticos y mockData sin serverPagination
    const indexOfLastItem = effectiveCurrentPage * effectiveItemsPerPage;
    const indexOfFirstItem = indexOfLastItem - effectiveItemsPerPage;
    currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  } else {
    // Para datos del servidor, usar los datos tal como vienen (ya filtrados por el servidor)
    currentItems = Array.isArray(data) ? data : [];
  }

  // Paginación local
  const totalPages = Math.max(1, Math.ceil(effectiveTotalRecords / effectiveItemsPerPage));

  return (
    <div className={`w-full max-w-none space-y-6 ${className}`}>
      {/* Header reutilizable */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-white/80 mt-1 text-sm sm:text-base">{subtitle}</p>}
          </div>
          {newButtonText && (newButtonLink ? (
            <Link
              to={newButtonLink}
              state={newButtonState}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{newButtonText}</span>
            </Link>
          ) : (
            <button
              onClick={onNew}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{newButtonText}</span>
            </button>
          ))}
        </div>
      )}

      {/* Filtros - personalizables */}
      {filters.length > 0 && (
        <>
          {renderFilters ? (
            renderFilters({
              filters,
              filterValues,
              onFilterChange: handleSelect,
              onRefresh: handleRefresh,
              isLoading
            })
          ) : (
            <div className="bg-white/5 backdrop-blur-lg p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg relative z-50">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex gap-2 flex-1 w-full">
              {filters.map((filter) => {
                if (filter.type === 'search') {
                  return (
                    <div key={filter.key} className="w-2/3 relative z-50">
                      <input
                        type="text"
                        placeholder={filter.placeholder || 'Buscar...'}
                        value={search}
                        onChange={handleSearch}
                        className="w-full pl-4 pr-4 py-2 bg-slate-700/80 border border-orange-500/30 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                      />
                    </div>
                  );
                }
                if (filter.type === 'select') {
                  return (
                    <div key={filter.key} className="w-1/3 relative z-50">
                      <CustomSelect
                        options={filter.options || []}
                        value={filterValues[filter.key] || ''}
                        onChange={(value) => handleSelect(filter.key, value)}
                        placeholder={filter.placeholder || 'Todos'}
                        className="w-full"
                      />
                    </div>
                  );
                }
                if (filter.type === 'category-picker') {
                  return (
                    <div key={filter.key} className="flex items-center space-x-2 relative z-50">
                      <CategoryPicker
                        categories={filter.categories || []}
                        {...(filterValues[filter.key] && { selectedCategoryId: parseInt(filterValues[filter.key] as string) })}
                        onCategorySelect={(category) => {
                          const value = category ? category.id.toString() : '';
                          handleSelect(filter.key, value);
                        }}
                        placeholder={filter.placeholder || 'Todas las categorías'}
                        loading={filter.loading || false}
                        className="min-w-[180px]"
                        variant="compact"
                        showAllOption={true}
                        allOptionText="Todas las categorías"
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            {/* Botón de recarga */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              title="Recargar datos"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
          )}
        </>
      )}

      {/* Cards */}
      <div className={`w-full grid gap-4 sm:gap-6 mb-8 ${gridClassName || (isStaticMode ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2')}`} style={{ minWidth: '100%' }}>
        {isLoading ? (
          <div className="col-span-full w-full">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg overflow-hidden relative w-full min-h-[120px]">
              <div className="flex items-center justify-center p-6 space-x-6 min-h-[120px]">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className="mt-2 text-white/60">Cargando...</p>
                </div>
              </div>
            </div>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="col-span-full w-full">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg overflow-hidden relative w-full min-h-[120px]">
              <div className="flex items-center justify-center p-6 space-x-6 min-h-[120px]">
                <div className="flex flex-col items-center justify-center text-center">
                  {EmptyIcon ? (
                    <EmptyIcon className="text-white/60 text-4xl mb-4" />
                  ) : (
                    <div className="text-white/60 text-4xl mb-4">📋</div>
                  )}
                  <h3 className="text-lg font-medium text-white">{emptyMessage}</h3>
                  <p className="text-white/60 mt-1 text-sm">
                    {search || Object.values(filterValues).some(v => v) ? 'Intenta con otros filtros' : 'Comienza agregando un nuevo registro'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          currentItems.map((item, idx) => (
            renderCard ? (
              <React.Fragment key={item.id || idx}>{renderCard(item)}</React.Fragment>
            ) : (
              <Card key={item.id || idx} className={`p-6 ${getCardClassName ? getCardClassName(item) : ''}`}>
                {cardFields.map(field => (
                  <div key={field.key} className="mb-2">
                    <span className="font-semibold">{field.label}: </span>
                    {field.render ? field.render(item[field.key], item) : item[field.key]}
                  </div>
                ))}
                {cardActions && (
                  <div className="pt-4 border-t mt-2">{cardActions(item)}</div>
                )}
              </Card>
            )
          ))
        )}
      </div>

      {/* Paginación personalizable */}
      {pagination && currentItems.length > 0 && (
        <>
          {renderPagination ? (
            renderPagination({
              currentPage: effectiveCurrentPage,
              totalPages,
              itemsPerPage: effectiveItemsPerPage,
              totalItems: effectiveTotalRecords,
              onPageChange: handlePageChange,
              onItemsPerPageChange: handleItemsPerPageChange,
              itemsPerPageOptions: itemsPerPageOptions as number[]
            })
          ) : (
            <>
              <div className="mt-6 relative z-20">
                <Pagination
                  currentPage={effectiveCurrentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={effectiveItemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>

              {/* Info de paginación */}
              {effectiveTotalRecords > 0 && (
                <div className="flex justify-center sm:justify-end text-xs sm:text-sm text-white/60 text-center sm:text-left">
                  <span className="hidden sm:inline">Mostrando página {effectiveCurrentPage} de {totalPages} | Total de registros: {effectiveTotalRecords}</span>
                  <span className="sm:hidden">Página {effectiveCurrentPage} de {totalPages} | {effectiveTotalRecords} registros</span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
});

DynamicCardList.displayName = 'DynamicCardList';

export default DynamicCardList; 