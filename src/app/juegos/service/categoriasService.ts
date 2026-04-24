import { apiService } from '../../shared/services/apiService';
import { DynamicSearchParams } from '../../shared/types';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
}

export interface CategoriasResponse {
  success: boolean;
  message: string;
  data: {
    listFind: Categoria[];
    totalRecords: number;
    pageNumber: number | null;
    pageSize: number | null;
  };
}

// Función para obtener todas las categorías
const obtenerCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await apiService.get('CategoriasJuegos');
    return response.success ? response.data : [];
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
};

// Función para buscar categorías con filtros
const buscarCategorias = async (filters: DynamicSearchParams = {}, pageNumber?: number, pageSize?: number) => {
  try {
    // Construir parámetros de consulta
    const params: any = {
      ...filters,
      pageNumber: pageNumber || 1,
      pageSize: pageSize || 10
    };

    // Remover parámetros vacíos
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    const response = await apiService.get('CategoriasJuegos', params);
    return response;
  } catch (error) {
    console.error('Error al buscar categorías:', error);
    return {
      success: false,
      message: 'Error al buscar categorías',
      data: { listFind: [], totalRecords: 0, pageNumber: 1, pageSize: 10 }
    };
  }
};

// Función para obtener una categoría por ID
const obtenerCategoriaPorId = async (id: number): Promise<Categoria> => {
  const response = await apiService.get(`CategoriasJuegos/${id}`);
  return response.data;
};

// Función para crear una nueva categoría
const crearCategoria = async (categoriaData: Omit<Categoria, 'id'>): Promise<Categoria> => {
  const response = await apiService.post('CategoriasJuegos', categoriaData);
  return response.data;
};

// Función para actualizar una categoría
const actualizarCategoria = async (id: number, categoriaData: Partial<Omit<Categoria, 'id'>>): Promise<Categoria> => {
  const response = await apiService.put(`CategoriasJuegos/${id}`, categoriaData);
  return response.data;
};

// Función para eliminar una categoría
const eliminarCategoria = async (id: number): Promise<void> => {
  await apiService.delete('CategoriasJuegos', id);
};

export { 
  obtenerCategorias, 
  buscarCategorias,
  obtenerCategoriaPorId, 
  crearCategoria, 
  actualizarCategoria, 
  eliminarCategoria 
};
