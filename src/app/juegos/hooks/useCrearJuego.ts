import { useState, useEffect } from 'react';
import { crearJuego, obtenerJuegoPorId, actualizarJuego } from '../service/juegosService';
import { obtenerPaletas, Paleta } from '../service/paletasService';
import { useNotification } from '../../shared/contexts';
import { useCategories } from './useCategories';
import { useNavigate, useParams } from 'react-router-dom';
import { GAME_ICONS } from '../constants';
import { GameForm } from '../types/GameForm';
import { GameMapper } from '../mappers';
import { emojiToUnicode } from '../../shared/utils';

export const useCrearJuego = () => {
  // Hook de notificaciones global
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Hook para manejar categorías
  const { categories, loading: loadingCategories } = useCategories();
  
  // Determinar si es modo edición
  const isEditMode = Boolean(id);
  const gameId = id ? parseInt(id) : null;

  // Estados del formulario
  const [formData, setFormData] = useState<GameForm>(GameMapper.getInitialFormData());

  // Estados de UI
  const [selectedColorField, setSelectedColorField] = useState<keyof GameForm['palette'] | null>(null);
  const [showColorModal, setShowColorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGame, setIsLoadingGame] = useState(false);

  // Estados para datos dinámicos
  const [presetPalettes, setPresetPalettes] = useState<Paleta[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Estado combinado de carga
  const isLoadingAllData = isLoadingData || loadingCategories;

  // Usar constantes importadas
  const gameIcons = GAME_ICONS;


  // Función para cargar un juego existente
  const loadGame = async (id: number) => {
    setIsLoadingGame(true);
    try {
      const game = await obtenerJuegoPorId(id);
      
      // Usar el mapper para convertir los datos del juego al formulario
      setFormData(GameMapper.toFormData(game));

    } catch (error) {
      console.error('Error al cargar el juego:', error);
      addNotification('Error al cargar el juego', 'error');
      navigate('/worldGaming/juegos');
    } finally {
      setIsLoadingGame(false);
    }
  };

  // Método para cargar todos los datos
  const loadAllData = async () => {
    try {
      setIsLoadingData(true);
      const [paletasData] = await Promise.all([
        obtenerPaletas().catch((error: any) => {
          console.error('Error al cargar paletas:', error);
          if (error.response?.status !== 404) {
            addNotification('Error al cargar las paletas de colores', 'error');
          }
          return [];
        })
      ]);
      
      setPresetPalettes(paletasData);
    } finally {
      setIsLoadingData(false);
    }
  };


  // Handlers del formulario
  const handleInputChange = (field: keyof GameForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para manejar cambios del DynamicForm
  const handleFormChange = (values: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      ...values
    }));
  };

  const handlePaletteChange = (field: keyof GameForm['palette'], value: string) => {
    setFormData(prev => ({
      ...prev,
      palette: {
        ...prev.palette,
        [field]: value
      }
    }));
  };


  const applyPresetPalette = (palette: Paleta) => {
    setFormData(prev => ({
      ...prev,
      palette: {
        primaryColor: palette.primaryColor,
        secondaryColor: palette.secondaryColor,
        tertiaryColor: palette.tertiaryColor,
        accentColor: palette.accentColor,
        lightColor: palette.lightColor
      }
    }));
  };

  // Handlers del modal de colores
  const openColorModal = (field: keyof GameForm['palette']) => {
    setSelectedColorField(field);
    setShowColorModal(true);
  };

  const closeColorModal = () => {
    setShowColorModal(false);
    setSelectedColorField(null);
  };

  const selectColor = (color: string) => {
    if (selectedColorField) {
      handlePaletteChange(selectedColorField, color);
    }
    // No cerrar el modal automáticamente para permitir previsualización
  };



  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validaciones
    if (!formData.nombre?.trim()) {
      addNotification('El nombre del juego es obligatorio', 'error');
      return;
    }
    
    if (!formData.descripcion?.trim()) {
      addNotification('La descripción del juego es obligatoria', 'error');
      return;
    }
    
    if (!formData.categoriaId) {
      addNotification('Debes seleccionar una categoría', 'error');
      return;
    }

    if (formData.palette.primaryColor === null || formData.palette.secondaryColor === null || formData.palette.tertiaryColor === null || formData.palette.accentColor === null || formData.palette.lightColor === null) {
      addNotification('Paleta de colores requerida', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const juegoData = {
        id: formData.id || 0,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || undefined,
        categoriaId: formData.categoriaId || null,
        icon: emojiToUnicode(formData.icon || '🎮'),
        logo: formData.logo ? (typeof formData.logo === 'string' ? formData.logo : URL.createObjectURL(formData.logo)) : undefined,
        isActive: formData.isActive,
        PaletasJuego: formData.palette
      };


      let response;
      if (isEditMode && gameId) {
        response = await actualizarJuego(gameId, juegoData);
        addNotification(`¡Juego "${response.nombre}" actualizado exitosamente!`, 'success');
      } else {
        response = await crearJuego(juegoData);
        addNotification(`¡Juego "${response.nombre}" creado exitosamente!`, 'success');
      }
      
      navigate('/worldGaming/juegos');
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      addNotification(
        error.response?.data?.message || 'Error al crear el juego. Inténtalo de nuevo.', 
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      categoriaId: '',
      icon: '🎮',
      logo: undefined,
      isActive: true,
      palette: {
        primaryColor: '',
        secondaryColor: '',
        tertiaryColor: '',
        accentColor: '',
        lightColor: ''
      }
    });
  };

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId || !categories) return 'Sin categoría';
    const category = categories.find(cat => cat.id.toString() === categoryId);
    return category ? category.nombre : 'Sin categoría';
  };

  // Cargar datos cuando se monta el componente
  useEffect(() => {
    const initializeData = async () => {
      await loadAllData();
      
      // Si está en modo edición, cargar el juego
      if (isEditMode && gameId) {
        await loadGame(gameId);
      }
    };
    
    initializeData();
  }, [isEditMode, gameId]);

  return {
    // Estados
    formData,
    selectedColorField,
    showColorModal,
    isLoading,
    isLoadingData,
    isLoadingAllData,
    isLoadingGame,
    isEditMode,
    gameId,
    
    // Datos dinámicos
    categories,
    presetPalettes,
    gameIcons,
    
    // Handlers
    handleInputChange,
    handleFormChange,
    handlePaletteChange,
    applyPresetPalette,
    openColorModal,
    closeColorModal,
    selectColor,
    handleSubmit,
    resetForm,
    getCategoryName,
    // Métodos de carga
    loadAllData,
    loadGame
  };
};
