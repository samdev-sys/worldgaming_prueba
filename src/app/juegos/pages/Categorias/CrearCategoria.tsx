import React, { useState } from 'react';
import { useCrearCategoria } from '../../hooks/useCrearCategoria';
import DynamicForm from '../../../shared/components/ui/DynamicForm';
import ManagementPageLayout from '../../../shared/components/ui/ManagementPageLayout';

/**
 * Página para crear y editar categorías
 * Utiliza el hook useCrearCategoria para manejar la lógica
 */
const CrearCategoria: React.FC = () => {
  const {
    formData,
    isLoading,
    isLoadingCategory,
    isEditMode,
    handleFormChange,
    handleColorChange,
    handleSubmit,
    handleCancel
  } = useCrearCategoria();

  const [showColorPicker, setShowColorPicker] = useState(false);

  // Colores predefinidos
  const presetColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
    '#14B8A6', '#F43F5E', '#8B5CF6', '#06B6D4', '#84CC16'
  ];

  // Configuración del formulario dinámico
  const formFields = [
    {
      name: 'nombre',
      type: 'text' as const,
      label: 'Nombre de la Categoría',
      placeholder: 'Ej: Acción, Aventura, Estrategia...',
      required: true,
      colSpan: 2,
      maxLength: 50
    },
    {
      name: 'descripcion',
      type: 'textarea' as const,
      label: 'Descripción',
      placeholder: 'Describe brevemente qué tipo de juegos incluye esta categoría...',
      required: true,
      colSpan: 2,
      maxLength: 200
    }
  ];

  if (isLoadingCategory) {
    return (
      <ManagementPageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-white/70">Cargando categoría...</p>
          </div>
        </div>
      </ManagementPageLayout>
    );
  }

  return (
    <ManagementPageLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {isEditMode ? 'Editar Categoría' : 'Crear Nueva Categoría'}
              </h1>
              <p className="text-white/70 text-lg">
                {isEditMode
                  ? 'Modifica los datos de la categoría existente'
                  : 'Crea una nueva categoría para organizar los juegos'
                }
              </p>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Información Básica
              </h2>

              <DynamicForm
                fields={formFields}
                initialValues={formData}
                onChange={(values: Record<string, any>) => {
                  Object.entries(values).forEach(([field, value]) => {
                    handleFormChange(field as keyof typeof formData, value);
                  });
                }}
                onSubmit={() => { }} // El submit se maneja con el botón personalizado
                renderSubmitButton={() => null} // No renderizar botón de submit
              />
            </div>
          </div>

          {/* Panel de Personalización */}
          <div className="lg:col-span-2 space-y-6">

            {/* Selector de Color */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Color de la Categoría
              </h3>

              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                    style={{ backgroundColor: formData.color }}
                  ></div>
                  <div>
                    <p className="text-white/90 font-medium">Color Actual</p>
                    <p className="text-white/60 text-sm font-mono">
                      {formData.color}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-lg py-2 px-4 transition-colors"
                >
                  {showColorPicker ? 'Ocultar Selector' : 'Cambiar Color'}
                </button>
              </div>

              {showColorPicker && (
                <div className="space-y-4">
                  {/* Colores predefinidos */}
                  <div>
                    <p className="text-white/70 text-sm mb-2">Colores Predefinidos</p>
                    <div className="grid grid-cols-5 gap-2">
                      {presetColors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleColorChange(color);
                            setShowColorPicker(false);
                          }}
                          className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${formData.color === color
                              ? 'border-white'
                              : 'border-white/30 hover:border-white/60'
                            }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Selector de color personalizado */}
                  <div>
                    <p className="text-white/70 text-sm mb-2">Color Personalizado</p>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-full h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Vista Previa */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Vista Previa
              </h3>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-2xl flex-shrink-0">
                    {formData.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white/90 font-semibold truncate">
                      {formData.nombre || 'Nombre de la Categoría'}
                    </h4>
                    <p className="text-white/60 text-sm line-clamp-2 break-words">
                      {formData.descripcion || 'Descripción de la categoría...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: formData.color }}
                  ></div>
                  <span className="text-white/60 text-sm font-mono">
                    {formData.color}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 disabled:bg-gray-500/20 disabled:text-gray-400 disabled:border-gray-500/30 px-8 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                <span>Guardando...</span>
              </span>
            ) : (
              isEditMode ? 'Actualizar Categoría' : 'Crear Categoría'
            )}
          </button>
        </div>
      </div>
    </ManagementPageLayout>
  );
};

export default CrearCategoria;
