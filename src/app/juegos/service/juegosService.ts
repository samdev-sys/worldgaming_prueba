import { apiService } from '../../shared/services/apiService';
import { DynamicSearchParams } from '../../shared/types';

// Interfaces para tipado
export interface PaletasJuego {
  id?: number;
  juegoId?: number;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  accentColor: string;
  lightColor: string;
}

export interface Juego {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoriaId?: string | null;
  categoriaNombre?: string; // Campo adicional del API
  icon?: string;
  logo?: string;
  isActive: boolean;
  PaletasJuego?: PaletasJuego;
}

// Función para crear un nuevo juego
const crearJuego = async (juegoData: Omit<Juego, 'id'>): Promise<Juego> => {
  const response = await apiService.post('Juegos', juegoData);
  return response.data;
};

// Función para obtener un juego por ID
const obtenerJuegoPorId = async (id: number): Promise<Juego> => {
  const response = await apiService.get(`Juegos/${id}`);
  return response.data;
};

// Función para actualizar un juego
const actualizarJuego = async (id: number, juegoData: Partial<Omit<Juego, 'id'>>): Promise<Juego> => {
  const response = await apiService.put(`Juegos/${id}`, juegoData);
  return response.data;
};

// Función para eliminar un juego
const eliminarJuego = async (id: number): Promise<any> => {
  return await apiService.delete('Juegos', id);
};

// Función para buscar juegos con filtros dinámicos
const buscarJuegos = async (filters: DynamicSearchParams, pageNumber?: number, pageSize?: number) => {
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

    const response = await apiService.get('Juegos', params);
    return response;
  } catch (error) {
    console.error('Error al buscar juegos:', error);
    return {
      success: false,
      message: 'Error al buscar juegos',
      data: { listFind: [], totalRecords: 0, pageNumber: 1, pageSize: 10 }
    };
  }
};

export { 
  crearJuego,  
  obtenerJuegoPorId, 
  actualizarJuego, 
  eliminarJuego,
  buscarJuegos
};
