import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfirmation, useNotification } from '../contexts';

/**
 * Interface para operaciones CRUD
 */
export interface EntityService<T> {
  getAll: (filters?: any, pageNumber?: number, pageSize?: number) => Promise<any>;
  getById: (id: number) => Promise<T>;
  create: (data: any) => Promise<any>;
  update: (id: number, data: any) => Promise<any>;
  delete: (id: number) => Promise<any>;
}

/**
 * Interface para configuración de gestión de entidades
 */
export interface EntityManagementConfig {
  entityName: string;
  entityNamePlural: string;
  baseRoute: string;
  editRoute?: string;
  createRoute?: string;
  listRoute?: string;
}

/**
 * Hook personalizado para gestión de entidades (CRUD)
 * Proporciona funciones estándar para crear, leer, actualizar y eliminar entidades
 * 
 * @param service - Servicio que implementa las operaciones CRUD
 * @param config - Configuración de la entidad
 * @returns Objeto con funciones de gestión de entidades
 */
export const useEntityManagement = <T = any>(
  service: EntityService<T>,
  config: EntityManagementConfig
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showConfirm } = useConfirmation();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const {
    entityName,
    entityNamePlural,
    baseRoute,
    editRoute,
    createRoute,
    listRoute
  } = config;

  // Función para obtener todas las entidades
  const getAll = useCallback(async (filters?: any, pageNumber?: number, pageSize?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await service.getAll(filters, pageNumber, pageSize);
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || `Error al obtener ${entityNamePlural}`);
      }
    } catch (error: any) {
      const errorMessage = error.message || `Error al obtener ${entityNamePlural}`;
      setError(errorMessage);
      addNotification(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service, entityNamePlural, addNotification]);

  // Función para obtener una entidad por ID
  const getById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await service.getById(id);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || `Error al obtener ${entityName}`;
      setError(errorMessage);
      addNotification(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service, entityName, addNotification]);

  // Función para crear una entidad
  const create = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await service.create(data);
      
      if (response.success) {
        addNotification(`${entityName} creado exitosamente`, 'success');
        return response;
      } else {
        throw new Error(response.message || `Error al crear ${entityName}`);
      }
    } catch (error: any) {
      const errorMessage = error.message || `Error al crear ${entityName}`;
      setError(errorMessage);
      addNotification(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service, entityName, addNotification]);

  // Función para actualizar una entidad
  const update = useCallback(async (id: number, data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await service.update(id, data);
      
      if (response.success) {
        addNotification(`${entityName} actualizado exitosamente`, 'success');
        return response;
      } else {
        throw new Error(response.message || `Error al actualizar ${entityName}`);
      }
    } catch (error: any) {
      const errorMessage = error.message || `Error al actualizar ${entityName}`;
      setError(errorMessage);
      addNotification(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service, entityName, addNotification]);

  // Función para eliminar una entidad
  const remove = useCallback(async (id: number, customMessage?: string) => {
    const confirmed = await showConfirm({
      title: `Eliminar ${entityName}`,
      message: customMessage || `¿Estás seguro de que quieres eliminar este ${entityName}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await service.delete(id);
        
        if (response.success) {
          addNotification(`${entityName} eliminado exitosamente`, 'success');
          return response;
        } else {
          throw new Error(response.message || `Error al eliminar ${entityName}`);
        }
      } catch (error: any) {
        const errorMessage = error.message || `Error al eliminar ${entityName}`;
        setError(errorMessage);
        addNotification(errorMessage, 'error');
        throw error;
      } finally {
        setLoading(false);
      }
    }
    
    return null;
  }, [service, entityName, addNotification, showConfirm]);

  // Función para navegar a la página de edición
  const navigateToEdit = useCallback((id: number) => {
    const route = editRoute || `${baseRoute}/editar/${id}`;
    navigate(route);
  }, [navigate, editRoute, baseRoute]);

  // Función para navegar a la página de creación
  const navigateToCreate = useCallback(() => {
    const route = createRoute || `${baseRoute}/crear`;
    navigate(route);
  }, [navigate, createRoute, baseRoute]);

  // Función para navegar a la página de lista
  const navigateToList = useCallback(() => {
    const route = listRoute || baseRoute;
    navigate(route);
  }, [navigate, listRoute, baseRoute]);

  // Función para alternar estado de una entidad
  const toggleStatus = useCallback((entity: any, updateFunction: (id: number, data: any) => Promise<any>) => {
    return async () => {
      try {
        const newStatus = !entity.isActive;
        await updateFunction(entity.id, { isActive: newStatus });
        
        const statusText = newStatus ? 'activado' : 'desactivado';
        addNotification(`${entityName} ${statusText} exitosamente`, 'success');
      } catch (error: any) {
        const errorMessage = error.message || `Error al cambiar estado del ${entityName}`;
        addNotification(errorMessage, 'error');
      }
    };
  }, [entityName, addNotification]);

  // Función para duplicar una entidad
  const duplicate = useCallback(async (entity: any, excludeFields: string[] = ['id', 'createdAt', 'updatedAt']) => {
    try {
      const duplicateData = { ...entity };
      
      // Eliminar campos que no deben duplicarse
      excludeFields.forEach(field => {
        delete duplicateData[field];
      });
      
      // Agregar sufijo al nombre si existe
      if (duplicateData.nombre) {
        duplicateData.nombre = `${duplicateData.nombre} (Copia)`;
      } else if (duplicateData.name) {
        duplicateData.name = `${duplicateData.name} (Copia)`;
      }
      
      const response = await create(duplicateData);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || `Error al duplicar ${entityName}`;
      addNotification(errorMessage, 'error');
      throw error;
    }
  }, [create, entityName, addNotification]);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    loading,
    error,
    
    // Operaciones CRUD
    getAll,
    getById,
    create,
    update,
    remove,
    
    // Navegación
    navigateToEdit,
    navigateToCreate,
    navigateToList,
    
    // Funciones de utilidad
    toggleStatus,
    duplicate,
    clearError
  };
};
