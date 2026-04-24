import { useState, useEffect } from 'react';
import { buscarJuegos, Juego } from '../../juegos/service/juegosService';
import { useNotification } from '../../shared/contexts';
import { usePaginationDefaults } from '../../shared/hooks';

/**
 * Hook personalizado para cargar juegos para usar en torneos
 * Reutiliza la lógica de carga de juegos del módulo de juegos
 */
export const useJuegos = () => {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reutilizar hooks existentes
  const { addNotification } = useNotification();
  const { normalizeParams } = usePaginationDefaults();

  // Función para cargar todos los juegos activos (reutiliza lógica de useGestionarJuegos)
  const loadJuegos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Reutilizar la misma lógica que useGestionarJuegos pero solo para juegos activos
      const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams();
      const response = await buscarJuegos({ IsActive: true }, normalizedPageNumber, normalizedPageSize);
      
      if (response.success) {
        const juegosData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.listFind || [];
        setJuegos(juegosData);
      } else {
        const errorMessage = response.message || 'Error al cargar juegos';
        setError(errorMessage);
        addNotification('Error al cargar los juegos: ' + errorMessage, 'error');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error de conexión';
      setError(errorMessage);
      addNotification('Error al cargar los juegos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cargar juegos al montar el componente
  useEffect(() => {
    loadJuegos();
  }, []);

  // Función para refrescar la lista de juegos
  const refreshJuegos = () => {
    loadJuegos();
  };

  // Función para obtener un juego por ID
  const getJuegoById = (id: number): Juego | undefined => {
    return Array.isArray(juegos) ? juegos.find(juego => juego.id === id) : undefined;
  };

  // Función para obtener juegos por categoría
  const getJuegosByCategoria = (categoriaId: string): Juego[] => {
    return Array.isArray(juegos) ? juegos.filter(juego => juego.categoriaId === categoriaId) : [];
  };

  // Función para obtener opciones de juegos para dropdowns (similar a useCategories)
  const getJuegoOptions = () => {
    return Array.isArray(juegos) ? juegos.map(juego => ({
      value: juego.id?.toString() || '',
      label: juego.nombre
    })) : [];
  };

  return {
    juegos,
    loading,
    error,
    loadJuegos,
    refreshJuegos,
    getJuegoById,
    getJuegosByCategoria,
    getJuegoOptions
  };
};
