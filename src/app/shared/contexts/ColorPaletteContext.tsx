import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getGamePalette } from '../../juegos/service/paletasService';

// Interfaz para la paleta de colores
export interface ColorPalette {
  primary: string;      // Color más oscuro (0A1128)
  secondary: string;    // Azul profundo (001F54)
  tertiary: string;     // Azul medio (034078)
  accent: string;       // Teal/azul-verde (1282A2)
  light: string;        // Off-white/crema (FEFCFB)
}

// Paleta por defecto (la que mostraste)
const defaultPalette: ColorPalette = {
  primary: '#0A1128',
  secondary: '#001F54',
  tertiary: '#034078',
  accent: '#1282A2',
  light: '#FEFCFB'
};

interface ColorPaletteContextType {
  currentPalette: ColorPalette;
  setGamePalette: (gameId: string) => Promise<void>;
  isLoading: boolean;
}

const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(undefined);

interface ColorPaletteProviderProps {
  children: ReactNode;
}

export const ColorPaletteProvider: React.FC<ColorPaletteProviderProps> = ({ children }) => {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(defaultPalette);
  const [isLoading, setIsLoading] = useState(false);

  // Función para obtener la paleta de colores según el juego
  const setGamePalette = async (gameId: string) => {
    setIsLoading(true);
    try {
      // Llamada a la API real
      const response = await getGamePalette(gameId);
      setCurrentPalette(response.palette);
      
      // Aplicar los colores al CSS
      applyPaletteToCSS(response.palette);
      
    } catch (error) {
      setCurrentPalette(defaultPalette);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para aplicar la paleta al CSS
  const applyPaletteToCSS = (palette: ColorPalette) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-secondary', palette.secondary);
    root.style.setProperty('--color-tertiary', palette.tertiary);
    root.style.setProperty('--color-accent', palette.accent);
    root.style.setProperty('--color-light', palette.light);
  };

  // Aplicar paleta por defecto al cargar
  React.useEffect(() => {
    applyPaletteToCSS(currentPalette);
  }, []);

  return (
    <ColorPaletteContext.Provider value={{
      currentPalette,
      setGamePalette,
      isLoading
    }}>
      {children}
    </ColorPaletteContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useColorPalette = () => {
  const context = useContext(ColorPaletteContext);
  if (context === undefined) {
    throw new Error('useColorPalette must be used within a ColorPaletteProvider');
  }
  return context;
}; 