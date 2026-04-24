import { useState, useEffect, useCallback } from 'react';
import { useColorPalette, useGame, useNotification } from '../../shared/contexts';
import { apiService } from '../../shared/services/apiService';
import { unicodeToEmoji } from '../../shared/utils';
import { usePaginationDefaults } from '../../shared/hooks';

export interface Game {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoriaId?: string | null;
  categoriaNombre?: string;
  icon?: string;
  logo?: string;
  isActive: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  accentColor?: string;
  lightColor?: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  light: string;
}

export interface GameSelectorProps {
  onPaletteUpdate?: (palette: ColorPalette) => void;
}

const applyPaletteToCSS = (palette: ColorPalette) => {
  const root = document.documentElement;
  

  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-secondary', palette.secondary);
  root.style.setProperty('--color-tertiary', palette.tertiary);
  root.style.setProperty('--color-accent', palette.accent);
  root.style.setProperty('--color-light', palette.light);
};

export const useGameSelector = (onPaletteUpdate?: (palette: ColorPalette) => void) => {
  const { isLoading } = useColorPalette();
  const { selectedGame, setSelectedGame } = useGame();
  const { addNotification } = useNotification();
  const { normalizeParams } = usePaginationDefaults();
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [hoveredGame, setHoveredGame] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const stableOnPaletteUpdate = useCallback((palette: ColorPalette) => {
    if (onPaletteUpdate) {
      onPaletteUpdate(palette);
    }
  }, [onPaletteUpdate]);
  const SELECTED_GAME_KEY = 'worldGaming_selectedGame';
  const GAME_PALETTE_KEY = 'worldGaming_gamePalette';
  
  const saveSelectedGame = (gameId: string) => {
    try {
      localStorage.setItem(SELECTED_GAME_KEY, gameId);
    } catch (error) {
      console.warn('No se pudo guardar el juego seleccionado en localStorage:', error);
    }
  };

  const loadSelectedGame = (): string | null => {
    try {
      return localStorage.getItem(SELECTED_GAME_KEY);
    } catch (error) {
      console.warn('No se pudo cargar el juego seleccionado desde localStorage:', error);
      return null;
    }
  };

  const saveGamePalette = (palette: ColorPalette) => {
    try {
      localStorage.setItem(GAME_PALETTE_KEY, JSON.stringify(palette));
    } catch (error) {
      console.warn('No se pudo guardar la paleta del juego en localStorage:', error);
    }
  };

  const loadGamePalette = (): ColorPalette | null => {
    try {
      const saved = localStorage.getItem(GAME_PALETTE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      addNotification('Error al cargar la paleta del juego. Intenta nuevamente.' + error, 'error');
      return null;
    }
  };


  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoadingGames(true);
        
        const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams();
        const response = await apiService.get('Juegos', { 
          pageNumber: normalizedPageNumber, 
          pageSize: normalizedPageSize 
        });

        if (response.success) {
          const juegosData = Array.isArray(response.data) 
            ? response.data 
            : response.data?.listFind || [];

          const gamesWithEmojis = juegosData.map((game: any) => ({
            ...game,
            icon: unicodeToEmoji(game.icon)
          }));
          setGames(gamesWithEmojis);
          setFilteredGames(gamesWithEmojis);
        } else {
          addNotification('Error al cargar los juegos: ' + response.message, 'error');
          setGames([]);
          setFilteredGames([]);
        }
        
        const savedGameId = loadSelectedGame();
        if (savedGameId) {
          setSelectedGame(savedGameId);
          const savedPalette = loadGamePalette();
          if (savedPalette) {
            applyPaletteToCSS(savedPalette);
            stableOnPaletteUpdate(savedPalette);
          }
        }
        
      } catch (error: any) {
        addNotification('Error al cargar los juegos. Intenta nuevamente.', 'error');
        setGames([]);
        setFilteredGames([]);
      } finally {
        setLoadingGames(false);
      }
    };

    loadGames();
  }, [addNotification, setSelectedGame, stableOnPaletteUpdate, normalizeParams]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredGames(games);
    } else {
      const filtered = games.filter(game =>
        game.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.descripcion && game.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        game.categoriaNombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGames(filtered);
      
    }
  }, [searchTerm, games, addNotification]);

  const handleGameSelect = async (gameId: number) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      try {
        if (game.primaryColor && game.secondaryColor) {
          const gamePalette: ColorPalette = {
            primary: game.primaryColor,
            secondary: game.secondaryColor,
            tertiary: game.tertiaryColor || game.primaryColor,
            accent: game.accentColor || game.secondaryColor,
            light: game.lightColor || '#FEFCFB'
          };
          
          applyPaletteToCSS(gamePalette);
          saveGamePalette(gamePalette);
          stableOnPaletteUpdate(gamePalette);
        } else {
          addNotification(`Juego "${game.nombre}" seleccionado (sin paleta personalizada)`, 'info');
        }
        
        saveSelectedGame(gameId.toString());
        setSelectedGame(gameId.toString());
        setIsExpanded(false);
        
      } catch (error) {
        addNotification('Error al seleccionar el juego. Intenta nuevamente.', 'error');
      }
    }
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const getGameCardStyle = (game: Game) => {
    if (game.primaryColor && game.secondaryColor) {
      return {
        background: `linear-gradient(135deg, ${game.primaryColor}25, ${game.secondaryColor}25, ${game.tertiaryColor || game.primaryColor}15)`,
        borderColor: `${game.accentColor || game.secondaryColor}40`,
        boxShadow: `0 4px 20px ${game.primaryColor}20`
      };
    }
    return {
      background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(239, 68, 68, 0.2))',
      borderColor: 'rgba(251, 146, 60, 0.3)'
    };
  };

  const currentGame = games.find(g => g.id?.toString() === selectedGame);

  const clearSelection = () => {
    try {
      localStorage.removeItem(SELECTED_GAME_KEY);
      localStorage.removeItem(GAME_PALETTE_KEY);
      setSelectedGame('');
      addNotification('Selección de juego limpiada', 'info');
    } catch (error) {
      console.warn('Error al limpiar la selección:', error);
    }
  };

  const refreshGames = async () => {
    try {
      setLoadingGames(true);
      
      const { pageNumber: normalizedPageNumber, pageSize: normalizedPageSize } = normalizeParams();
      const response = await apiService.get('Juegos', { 
        pageNumber: normalizedPageNumber, 
        pageSize: normalizedPageSize 
      });

      if (response.success) {
        const juegosData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.listFind || [];

        const gamesWithEmojis = juegosData.map((game: any) => ({
          ...game,
          icon: unicodeToEmoji(game.icon)
        }));
        setGames(gamesWithEmojis);
        setFilteredGames(gamesWithEmojis);
      } else {
        addNotification('Error al actualizar los juegos: ' + response.message, 'error');
      }
      
    } catch (error: any) {
      addNotification('Error al actualizar los juegos. Intenta nuevamente.', 'error');
    } finally {
      setLoadingGames(false);
    }
  };

  return {
    games,
    filteredGames,
    loadingGames,
    hoveredGame,
    isExpanded,
    searchTerm,
    selectedGame,
    currentGame,
    isLoading,
    
    setHoveredGame,
    setSearchTerm,
    handleGameSelect,
    handleExpandToggle,
    clearSelection,
    refreshGames,
    
    getGameCardStyle,
    
    applyPaletteToCSS
  };
};
