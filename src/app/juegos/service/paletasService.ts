import { apiService } from '../../shared/services/apiService';
import { ColorPalette } from '../../shared/contexts/ColorPaletteContext';

export interface Paleta {
  id?: number;
  nombreJuego?: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  accentColor: string;
  lightColor: string;
}

// Interfaz para la respuesta de la API de paletas
interface GamePaletteResponse {
  palette: ColorPalette;
  gameId: string;
  gameName: string;
}

// Interfaz para juegos disponibles
interface AvailableGame {
  id: string;
  name: string;
  icon: string;
  palette?: ColorPalette;
}

// Función para obtener todas las paletas
const obtenerPaletas = async (): Promise<Paleta[]> => {
  const response: any = await apiService.get('PaletasJuego');
  return Array.isArray(response.data) ? response.data : response.data?.listFind || [];
};

// Función para obtener una paleta por ID
const obtenerPaletaPorId = async (id: number): Promise<Paleta> => {
  const response: any = await apiService.get(`PaletasJuego/${id}`);
  return response.data;
};

// Función para crear una nueva paleta
const crearPaleta = async (paletaData: Omit<Paleta, 'id'>): Promise<Paleta> => {
  const response = await apiService.post('PaletasJuego', paletaData);
  return response.data;
};

// Función para actualizar una paleta
const actualizarPaleta = async (id: number, paletaData: Partial<Omit<Paleta, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Paleta> => {
  const response = await apiService.put(`PaletasJuego/${id}`, paletaData);
  return response.data;
};

// Función para eliminar una paleta
const eliminarPaleta = async (id: number): Promise<void> => {
  await apiService.delete('PaletasJuego', id);
};

// Función para convertir Paleta a ColorPalette
const convertirPaletaAColorPalette = (paleta: Paleta): ColorPalette => {
  return {
    primary: paleta.primaryColor,
    secondary: paleta.secondaryColor,
    tertiary: paleta.tertiaryColor,
    accent: paleta.accentColor,
    light: paleta.lightColor
  };
};

// Función para obtener la paleta de colores para un juego específico
const getGamePalette = async (gameId: string): Promise<GamePaletteResponse> => {
  try {
    const paletas = await obtenerPaletas();
    const paleta = paletas.find(p => p.nombreJuego?.toLowerCase().replace(/\s+/g, '-') === gameId);
    
    if (!paleta) {
      // Retornar paleta por defecto si no se encuentra el juego
      const defaultPalette: ColorPalette = {
        primary: '#0A1128',
        secondary: '#001F54',
        tertiary: '#034078',
        accent: '#1282A2',
        light: '#FEFCFB'
      };
      
      return {
        palette: defaultPalette,
        gameId,
        gameName: 'Juego por defecto'
      };
    }

    return {
      palette: convertirPaletaAColorPalette(paleta),
      gameId,
      gameName: paleta.nombreJuego || 'Juego sin nombre'
    };
  } catch (error) {
    
    // Retornar paleta por defecto en caso de error
    const defaultPalette: ColorPalette = {
      primary: '#0A1128',
      secondary: '#001F54',
      tertiary: '#034078',
      accent: '#1282A2',
      light: '#FEFCFB'
    };
    
    return {
      palette: defaultPalette,
      gameId,
      gameName: 'Error - Usando paleta por defecto'
    };
  }
};

// Función para obtener la lista de juegos disponibles con sus paletas
const getAvailableGames = async (): Promise<AvailableGame[]> => {
  try {
    const paletas = await obtenerPaletas();
    
    return paletas.map(paleta => ({
      id: paleta.nombreJuego?.toLowerCase().replace(/\s+/g, '-') || `game-${paleta.id}`,
      name: paleta.nombreJuego || `Juego ${paleta.id}`,
      icon: '🎮', // Icono por defecto
      palette: convertirPaletaAColorPalette(paleta)
    }));
  } catch (error) {
    console.error('Error al obtener juegos disponibles:', error);
    return [];
  }
};

export { 
  obtenerPaletas, 
  obtenerPaletaPorId, 
  crearPaleta, 
  actualizarPaleta, 
  eliminarPaleta,
  getGamePalette,
  getAvailableGames,
  convertirPaletaAColorPalette
};
