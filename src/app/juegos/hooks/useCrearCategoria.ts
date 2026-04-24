import { useState, useEffect } from 'react';
import { crearCategoria, obtenerCategoriaPorId, actualizarCategoria, Categoria } from '../service/categoriasService';
import { useNotification } from '../../shared/contexts';
import { useNavigate, useParams } from 'react-router-dom';
import { emojiToUnicode, unicodeToEmoji } from '../../shared/utils';

/**
 * Interface para el formulario de categoría
 */
export interface CategoryForm {
  nombre: string;
  descripcion: string;
  icon: string;
  color: string;
}

/**
 * Hook personalizado para crear y editar categorías
 * Maneja tanto la creación de nuevas categorías como la edición de existentes
 */
export const useCrearCategoria = () => {
  // Hook de notificaciones global
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Determinar si es modo edición
  const isEditMode = Boolean(id);
  const categoryId = id ? parseInt(id) : null;

  // Estados del formulario
  const [formData, setFormData] = useState<CategoryForm>({
    nombre: '',
    descripcion: '',
    icon: '📁',
    color: '#3B82F6',
  });

  // Estados de carga
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  // Función para cargar categoría existente en modo edición
  const loadCategory = async () => {
    if (!isEditMode || !categoryId) return;

    try {
      setIsLoadingCategory(true);
      const category = await obtenerCategoriaPorId(categoryId);
      
      setFormData({
        nombre: category.nombre,
        descripcion: category.descripcion,
        icon: '📁',
        color: category.color
      });
    } catch (error: any) {
      addNotification('Error al cargar la categoría: ' + error.message, 'error');
      navigate('/worldGaming/juegos/categorias');
    } finally {
      setIsLoadingCategory(false);
    }
  };

  // Función para manejar cambios en el formulario
  const handleFormChange = (field: keyof CategoryForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para manejar cambios en el icono
  const handleIconChange = (icon: string) => {
    setFormData(prev => ({
      ...prev,
      icon
    }));
  };

  // Función para manejar cambios en el color
  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  // Función para validar el formulario
  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      addNotification('El nombre de la categoría es obligatorio', 'error');
      return false;
    }

    if (!formData.descripcion.trim()) {
      addNotification('La descripción de la categoría es obligatoria', 'error');
      return false;
    }

    if (!formData.color) {
      addNotification('El color de la categoría es obligatorio', 'error');
      return false;
    }

    return true;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const categoryData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        icon: emojiToUnicode(formData.icon),
        color: formData.color
      };

      if (isEditMode && categoryId) {
        // Actualizar categoría existente
        await actualizarCategoria(categoryId, categoryData);
        addNotification('Categoría actualizada exitosamente', 'success');
      } else {
        // Crear nueva categoría
        await crearCategoria(categoryData);
        addNotification('Categoría creada exitosamente', 'success');
      }

      // Navegar de vuelta a la lista
      navigate('/worldGaming/juegos/categorias');
    } catch (error: any) {
      addNotification('Error al guardar la categoría: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cancelar y volver
  const handleCancel = () => {
    navigate('/worldGaming/juegos/categorias');
  };

  // Cargar categoría en modo edición
  useEffect(() => {
    if (isEditMode) {
      loadCategory();
    }
  }, [isEditMode, categoryId]);

  return {
    // Estados
    formData,
    isLoading,
    isLoadingCategory,
    isEditMode,
    categoryId,
    
    // Funciones de manejo
    handleFormChange,
    handleIconChange,
    handleColorChange,
    handleSubmit,
    handleCancel,
    
    // Funciones de validación
    validateForm
  };
};

