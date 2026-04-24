import React from 'react';
import {
  Gamepad2,
  Save,
  X,
  Loader2
} from 'lucide-react';
import DynamicForm, { FormField } from '../../../shared/components/ui/DynamicForm';
import LoadingScreen from '../../../shared/components/ui/LoadingScreen';
import ReactColorPicker from '../../../shared/components/ui/ReactColorPicker';
import { useCrearJuego } from '../../hooks/useCrearJuego';
import { GameForm } from '../../types/GameForm';
import { COLOR_PURPOSES, COLOR_ICONS } from '../../constants';

const CrearJuego: React.FC = () => {
  const {
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
    getCategoryName
  } = useCrearJuego();

  // Configuración de campos para DynamicForm
  const formFields: FormField[] = [
    {
      name: 'nombre',
      label: 'Nombre del Juego',
      type: 'text',
      required: true,
      placeholder: 'Ej: League of Legends'
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Describe el juego...'
    },
    {
      name: 'categoriaId',
      label: 'Categoría',
      type: 'category',
      required: true,
      placeholder: 'Seleccionar categoría...',
      categoryConfig: {
        categories: categories || [],
        loading: isLoadingAllData,
        variant: 'default'
      }
    }
  ];

  // Mostrar loading al cargar juego en modo edición
  if (isEditMode && isLoadingGame) {
    return (
      <LoadingScreen
        title="Cargando Juego"
        subtitle="Obteniendo información del juego..."
        description="Estamos cargando los datos del juego para su edición."
        variant="detailed"
      />
    );
  }

  // Mostrar loading al guardar
  if (isLoading) {
    return (
      <LoadingScreen
        title={isEditMode ? "Actualizando Juego" : "Creando Juego"}
        subtitle={isEditMode ? "Guardando los cambios del juego..." : "Procesando la información del juego..."}
        description={isEditMode ? "Estamos guardando todos los cambios realizados." : "Estamos guardando todos los datos del juego. Esto puede tomar unos momentos."}
        showDetails={true}
        details={{
          title: `Juego: ${formData.nombre || 'Sin nombre'}`,
          items: [
            {
              label: 'Categoría',
              value: getCategoryName(formData.categoriaId)
            },
            {
              label: 'Estado',
              value: formData.isActive ? 'Activo' : 'Inactivo'
            },
            {
              label: 'Icono',
              value: formData.icon || '🎮'
            }
          ]
        }}
        variant="detailed"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? 'Editar Juego' : 'Crear Nuevo Juego'}
          </h1>
          <p className="text-white/80 mt-1">
            {isEditMode
              ? `Modifica la configuración del juego (ID: ${gameId})`
              : 'Configura un nuevo juego para la plataforma'
            }
          </p>
        </div>
      </div>


      {/* Indicadores de carga */}
      {isLoadingData && (
        <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/20 text-blue-400">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium">Cargando datos del formulario...</span>
          </div>
        </div>
      )}

      {isLoadingGame && (
        <div className="p-4 rounded-lg border bg-green-500/10 border-green-500/20 text-green-400">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium">Cargando datos del juego...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Formulario - 2 columnas */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg relative z-10">
            <h2 className="text-xl font-semibold text-white mb-4">Información Básica</h2>

            <DynamicForm
              fields={formFields}
              initialValues={{
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                categoriaId: formData.categoriaId
              }}
              onChange={handleFormChange}
              onSubmit={() => { }}
              className="p-0"
              showCancelButton={false}
              renderSubmitButton={() => null}
            />
          </div>



          {/* Paleta de Colores */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Paleta de Colores</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Paletas Realizadas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {presetPalettes && presetPalettes.length > 0 ? (
                    presetPalettes.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPresetPalette(preset)}
                        className="p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200"
                        disabled={isLoading}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex space-x-1">
                            {[
                              preset.primaryColor,
                              preset.secondaryColor,
                              preset.tertiaryColor,
                              preset.accentColor,
                              preset.lightColor
                            ].map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded border border-white/20"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-white/80 text-xs">{preset.nombreJuego}</p>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-2 p-4 text-center text-white/60">
                      {isLoadingData ? (
                        <p>Cargando paletas...</p>
                      ) : (
                        <p>No hay paletas disponibles. Configura los colores manualmente.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.palette).map(([key, value]) => {

                  return (
                    <div key={key}>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        <span className="flex items-center space-x-2">
                          <span>{COLOR_ICONS[key as keyof typeof COLOR_ICONS]}</span>
                          <span className="capitalize">{key}</span>
                        </span>
                        <span className="text-white/60 text-xs font-normal block mt-1">
                          {COLOR_PURPOSES[key as keyof typeof COLOR_PURPOSES]}
                        </span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => openColorModal(key as keyof GameForm['palette'])}
                          className="w-12 h-10 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: value as string }}
                          disabled={isLoading}
                          title={`Seleccionar color ${key} - ${COLOR_PURPOSES[key as keyof typeof COLOR_PURPOSES]}`}
                        >
                          <div className="w-8 h-6 rounded border border-white/30" style={{ backgroundColor: value as string }} />
                        </button>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handlePaletteChange(key as keyof GameForm['palette'], e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Icono y Logo */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Icono y Logo</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Icono del Juego
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {gameIcons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleInputChange('icon', icon)}
                      className={`p-2 text-2xl rounded-lg border transition-all duration-200 ${formData.icon === icon
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                        }`}
                      disabled={isLoading}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Estado</h2>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2"
              />
              <label htmlFor="isActive" className="text-white/80">
                Juego activo (visible para los usuarios)
              </label>
            </div>
          </div>

          {/* Resumen del Juego */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Save className="w-5 h-5 text-blue-400" />
              <span>Resumen del Juego</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Nombre:</span>
                  <span className="text-white font-medium">{formData.nombre || 'Sin nombre'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Categoría:</span>
                  <span className="text-white font-medium">{getCategoryName(formData.categoriaId)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Estado:</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-white font-medium">{formData.isActive ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar Juego' : 'Guardar Juego')}</span>
            </button>

            <button
              onClick={() => window.history.back()}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>

        {/* Vista Previa - Siempre visible */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Vista Previa</h2>

              {/* Vista Previa Mejorada */}
              <div className="relative overflow-hidden rounded-2xl border border-white/20 transition-all duration-300">
                {/* Fondo con gradiente suave */}
                <div
                  className="absolute inset-0 opacity-90"
                  style={{
                    background: `linear-gradient(135deg, ${formData.palette.primaryColor || '#1a1a2e'}, ${formData.palette.secondaryColor || '#16213e'})`
                  }}
                />

                {/* Patrón de textura sutil */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, ${formData.palette.accentColor || '#0f3460'} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${formData.palette.tertiaryColor || '#533483'} 0%, transparent 50%)`
                  }}
                />

                {/* Contenido */}
                <div className="relative p-6">
                  {/* Header con icono y título */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                        style={{
                          backgroundColor: formData.palette.accentColor || '#0f3460',
                          color: formData.palette.lightColor || '#ffffff'
                        }}
                      >
                        {formData.icon || '🎮'}
                      </div>
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: formData.palette.tertiaryColor || '#533483' }}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {formData.nombre || 'Nombre del Juego'}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: formData.palette.accentColor || '#0f3460',
                            color: formData.palette.lightColor || '#ffffff'
                          }}
                        >
                          {getCategoryName(formData.categoriaId)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">
                    {formData.descripcion || 'Descripción del juego...'}
                  </p>

                  {/* Footer con información */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-white/70 text-sm">
                        <Gamepad2 className="h-4 w-4" />
                        <span>Juego configurado</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: formData.palette.accentColor || '#0f3460' }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: formData.palette.lightColor || '#ffffff' }}
                      >
                        {formData.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Muestra de Colores */}
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Paleta de Colores</h3>

              {/* Vista previa de la paleta completa */}
              <div className="mb-4">
                <div className="flex rounded-lg overflow-hidden border border-white/20">
                  {Object.entries(formData.palette).map(([key, color]) => (
                    <div
                      key={key}
                      className="flex-1 h-8"
                      style={{ backgroundColor: color || '#000000' }}
                      title={`${key}: ${color || '#000000'}`}
                    />
                  ))}
                </div>
                <p className="text-white/60 text-xs mt-2 text-center">Vista previa de la paleta completa</p>
              </div>

              {/* Colores individuales */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(formData.palette).map(([key, color]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-full h-12 rounded-lg border border-white/20 mb-2 shadow-lg"
                      style={{ backgroundColor: color || '#000000' }}
                    />
                    <p className="text-white/60 text-xs capitalize">{key}</p>
                    <p className="text-white/40 text-xs font-mono">{color || '#000000'}</p>
                  </div>
                ))}
              </div>

              {/* Aplicación de colores Accent y Light */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="text-white/80 text-sm font-medium mb-3">Aplicación de Colores</h4>
                <div className="space-y-3">
                  {/* Botón de ejemplo con accent */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">Botón (Accent):</span>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: formData.palette.accentColor || '#85C1E9',
                        color: formData.palette.lightColor || '#D7BDE2'
                      }}
                    >
                      Ejemplo
                    </button>
                  </div>

                  {/* Texto de ejemplo con light */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">Texto (Light):</span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: formData.palette.lightColor || '#D7BDE2' }}
                    >
                      Texto de ejemplo
                    </span>
                  </div>

                  {/* Indicador de ejemplo con accent */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">Indicador (Accent):</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: formData.palette.accentColor || '#85C1E9' }}
                      ></div>
                      <span className="text-white/60 text-xs">Estado activo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Colores - Paleta Completa */}
      {showColorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-lg w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Seleccionar Color - {selectedColorField ? selectedColorField.charAt(0).toUpperCase() + selectedColorField.slice(1) : ''}
              </h3>
              <button
                type="button"
                onClick={closeColorModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Selector de color con react-color */}
            <div className="w-full">
              <ReactColorPicker
                value={selectedColorField ? (formData.palette[selectedColorField] || '#1A1A2E') : '#1A1A2E'}
                onChange={(color) => selectColor(color)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearJuego;
