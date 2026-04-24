import React, { useMemo } from 'react';
import {
  Users,
  Calendar,
  Save,
  X,
  Upload,
  Trash2,
  Plus,
  Star,
  Shield,
  Minus,
  Loader2,
  ArrowRight
} from 'lucide-react';
import DynamicForm from '../../shared/components/ui/DynamicForm';
import { IFieldConfig } from '../../shared/interface/IFieldConfig';
import { 
  TOURNAMENT_DIFFICULTY_OPTIONS, 
  TOURNAMENT_STATUS_OPTIONS,
  getTournamentDifficultyColor,
  getTournamentStatusColor
} from '../../shared/constants/tournament';
import LoadingScreen from '../../shared/components/ui/LoadingScreen';
import { useCrearTorneo } from '../hooks/useCrearTorneo';

// Función para formatear números como dinero
const formatCurrency = (value: string | number | undefined): string => {
  const stringValue = String(value || '');
  const numericValue = stringValue.replace(/[^\d.]/g, '');
  if (!numericValue) return '0';
  const parts = numericValue.split('.');
  const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedDecimal = parts[1] ? parts[1].substring(0, 2) : '';
  return formattedInteger + (formattedDecimal ? '.' + formattedDecimal : '');
};

// Función para convertir formato de dinero a número
const parseCurrency = (value: string | number | undefined): string => {
  const cleaned = String(value || '').replace(/[$,\s]/g, '');
  return cleaned || '0';
};

const CrearTorneo: React.FC = () => {
  const {
    // Estados del formulario
    formData,
    imagePreview,
    newRule,
    setNewRule,
    isSubmitting,
    
    // Estados de carga y errores
    loadingJuegos,
    juegosError,
    loadingTournament,
    tournamentError,
    
    // Modo y ID
    isEditMode,
    tournamentId,
    
    // Datos dinámicos
    gameOptions,
    
    // Handlers
    handleInputChange,
    handleAddRule,
    handleRemoveRule,
    handleKeyPress,
    handleImageUpload,
    handleFormValuesChange,
    handleSubmitTournament,
    removeImage
  } = useCrearTorneo();

  const formFields: IFieldConfig[] = useMemo(() => [
    {
      name: 'name',
      label: 'Nombre del Torneo',
      type: 'text',
      required: true,
      placeholder: 'Ej: FPS Championship 2025',
      maxLength: 100
    },
    {
      name: 'game',
      label: 'Juego',
      type: 'select',
      required: true,
      options: gameOptions
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Describe el torneo, reglas especiales, formato...',
      maxLength: 500,
      colSpan: 2
    },
    {
      name: 'difficulty',
      label: 'Dificultad',
      type: 'select',
      required: true,
      options: TOURNAMENT_DIFFICULTY_OPTIONS
    },
    {
      name: 'status',
      label: 'Estado del Torneo',
      type: 'select',
      required: true,
      options: TOURNAMENT_STATUS_OPTIONS
    },
    {
      name: 'cantidadEquipos',
      label: 'Cantidad de Equipos',
      type: 'number',
      required: true,
      placeholder: '8',
      min: 2,
      max: 32
    },
    {
      name: 'maxParticipants',
      label: 'Máximo de Participantes',
      type: 'number',
      required: true,
      placeholder: '0',
      className: 'bg-gray-100 cursor-not-allowed pointer-events-none'
    },
    {
      name: 'entryFee',
      label: 'Costo de Entrada',
      type: 'text',
      required: true,
      placeholder: '0.00',
      formatValue: (value: string | number | undefined) => formatCurrency(value),
      parseValue: (value: string | number | undefined) => parseCurrency(value),
      prefix: '$ '
    },
    {
      name: 'prize',
      label: 'Premio',
      type: 'text',
      required: true,
      placeholder: '0.00',
      formatValue: (value: string | number | undefined) => formatCurrency(value),
      parseValue: (value: string | number | undefined) => parseCurrency(value),
      prefix: '$ '
    },
    {
      name: 'startDate',
      label: 'Fecha de Inicio',
      type: 'datetime-local',
      required: true
    },
    {
      name: 'endDate',
      label: 'Fecha de Fin',
      type: 'datetime-local',
      required: true
    },
    {
      name: 'isActive',
      label: 'Estado del Torneo (visible para los usuarios)',
      type: 'checkbox',
      required: false,
      className: 'flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10'
    }
  ], [gameOptions]);

  const initialValues = useMemo(() => ({
    name: formData.name,
    game: formData.game,
    description: formData.description,
    difficulty: formData.difficulty,
    status: formData.status,
    cantidadEquipos: formData.cantidadEquipos,
    maxParticipants: formData.maxParticipants,
    entryFee: formData.entryFee,
    prize: formData.prize,
    startDate: formData.startDate,
    endDate: formData.endDate,
    isActive: formData.isActive
  }), [formData]);

  // Mostrar loading al cargar torneo en modo edición
  if (isEditMode && loadingTournament) {
    return (
      <LoadingScreen
        title="Cargando Torneo"
        subtitle="Obteniendo información del torneo..."
        description="Estamos cargando los datos del torneo para su edición."
        variant="detailed"
      />
    );
  }

  // Mostrar error si no se pudo cargar el torneo
  if (isEditMode && tournamentError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error al cargar el torneo</h2>
          <p className="text-red-300">{tournamentError}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
            <span>Volver</span>
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <LoadingScreen
        title={isEditMode ? "Actualizando Torneo" : "Creando Torneo"}
        subtitle={isEditMode ? "Guardando los cambios del torneo..." : "Procesando la información del torneo..."}
        description={isEditMode ? "Estamos guardando todos los cambios realizados." : "Estamos guardando todos los datos del torneo. Esto puede tomar unos momentos."}
        showDetails={true}
        details={{
          title: `Torneo: ${formData.name || 'Sin nombre'}`,
          items: [
            {
              label: 'Juego',
              value: formData.game ? 'Cargando...' : 'No seleccionado'
            },
            {
              label: 'Dificultad',
              value: formData.difficulty
            },
            {
              label: 'Estado',
              value: formData.status
            },
            {
              label: 'Equipos',
              value: formData.cantidadEquipos.toString()
            },
            {
              label: 'Participantes',
              value: `${formData.titulares + formData.suplentes} por equipo`
            }
          ]
        }}
        variant="detailed"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
          </h1>
          <p className="text-white/80 mt-1">
            {isEditMode
              ? `Modifica la configuración del torneo (ID: ${tournamentId})`
              : 'Configura un nuevo torneo para la plataforma'
            }
          </p>
        </div>
      </div>

      {/* Indicadores de carga */}
      {loadingJuegos && (
        <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/20 text-blue-400">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium">Cargando juegos...</span>
          </div>
        </div>
      )}

      {loadingTournament && (
        <div className="p-4 rounded-lg border bg-green-500/10 border-green-500/20 text-green-400">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium">Cargando datos del torneo...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Información Básica</h2>

            {juegosError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">Error al cargar juegos: {juegosError}</p>
              </div>
            )}

            <DynamicForm
              fields={formFields}
              initialValues={initialValues}
              onChange={handleFormValuesChange}
              className="p-0"
              renderSubmitButton={() => null}
            />
          </div>

          <div className={`bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg transition-all duration-300 ${
            !formData.game ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Configuración de Jugadores</span>
              {!formData.game && (
                <span className="text-sm text-yellow-400 font-normal">
                  (Selecciona un juego primero)
                </span>
              )}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Jugadores Titulares</h3>
                    <p className="text-white/60 text-sm">Jugadores que participarán en los partidos</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('titulares', Math.max(1, formData.titulares - 1))}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formData.titulares <= 1}
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>

                  <div className="flex-1 text-center">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.titulares}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        handleInputChange('titulares', Math.max(1, Math.min(100, value)));
                      }}
                      className="w-30 text-3xl font-bold text-white/70 bg-transparent border-none outline-none text-center focus:text-yellow-300/90 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInputChange('titulares', formData.titulares + 1)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formData.titulares >= 100}
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Jugadores Suplentes</h3>
                    <p className="text-white/60 text-sm">Jugadores de respaldo para el equipo</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('suplentes', Math.max(0, formData.suplentes - 1))}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formData.suplentes <= 0}
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>

                  <div className="flex-1 text-center">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.suplentes}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        handleInputChange('suplentes', Math.max(0, Math.min(10, value)));
                      }}
                      className="w-30 text-3xl font-bold text-white/70 bg-transparent border-none outline-none text-center focus:text-blue-300/90 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInputChange('suplentes', formData.suplentes + 1)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formData.suplentes >= 10}
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Resumen de Configuración</h3>
                  <p className="text-white/60 text-sm">Total de jugadores requeridos por equipo</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{formData.titulares + formData.suplentes}</div>
                  <p className="text-white/60 text-sm">jugadores total</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="text-center">
                  <span className="text-yellow-400 font-bold">{formData.titulares}</span>
                  <p className="text-white/60 text-xs">Titulares</p>
                </div>
                <div className="text-center">
                  <span className="text-blue-400 font-bold">{formData.suplentes}</span>
                  <p className="text-white/60 text-xs">Suplentes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Reglas del Torneo</h2>

            <div className="space-y-2 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Agregar regla(s)... (separar múltiples reglas con comas)"
                  className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
                <button
                  onClick={handleAddRule}
                  disabled={!newRule.trim()}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:bg-gray-500/20 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar</span>
                </button>
              </div>
              <p className="text-white/50 text-xs">
                💡 Ejemplo: "No usar hacks, Respetar a otros jugadores, No abandonar partidas"
              </p>
            </div>

            {formData.rules.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-white/80 text-sm font-medium">Reglas actuales:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.rules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm"
                    >
                      <span className="truncate max-w-xs">{rule}</span>
                      <button
                        onClick={() => handleRemoveRule(index)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.rules.length === 0 && (
              <div className="text-center py-4">
                <p className="text-white/60 text-sm">No hay reglas agregadas. Agrega la primera regla arriba.</p>
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Imagen del Torneo</h2>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="tournament-image-upload"
              />
              <label htmlFor="tournament-image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-white/60 mx-auto mb-2" />
                <p className="text-white/60 text-sm">
                  {imagePreview ? 'Cambiar imagen' : 'Haz clic para subir una imagen'}
                </p>
              </label>
            </div>
            {imagePreview && (
              <div className="mt-3 flex items-center space-x-3">
                <img
                  src={imagePreview}
                  alt="Tournament preview"
                  className="w-16 h-16 object-cover rounded-lg border border-white/20"
                />
                <button
                  onClick={removeImage}
                  className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Eliminar</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleSubmitTournament}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>
                {isSubmitting 
                  ? (isEditMode ? 'Actualizando...' : 'Guardando...') 
                  : (isEditMode ? 'Actualizar Torneo' : 'Guardar Torneo')
                }
              </span>
            </button>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Vista Previa</h2>

              {/* Card de vista previa con el nuevo diseño */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg overflow-hidden relative group cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <div className="flex items-center p-6 space-x-6">
                  {/* Logo del juego */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/20">
                      <img
                        src={imagePreview || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"}
                        alt="Tournament preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Información del torneo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTournamentStatusColor(formData.status)}`}>
                        {formData.status.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTournamentDifficultyColor(formData.difficulty)}`}>
                        {formData.difficulty.toUpperCase()}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-1 truncate">
                      {formData.name || 'Nombre del Torneo'}
                    </h3>
                    <p className="text-white/60 text-sm mb-3">Juego</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-white/80">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-white/60" />
                        <span>0/{formData.maxParticipants || 64}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-white/60" />
                        <span>
                          {formData.startDate ? new Date(formData.startDate).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Fecha por definir'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información lateral */}
                  <div className="flex-shrink-0 text-right">
                    {/* Cupos disponibles */}
                    <div className="mb-3">
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg px-3 py-2">
                        <div className="text-white font-bold text-sm">
                          {formData.maxParticipants || 64} cupos
                        </div>
                        <div className="text-blue-300 text-xs">Disponibles</div>
                      </div>
                    </div>

                    {/* Botones de funcionalidad (simulados) */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                          <Star className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-400" />
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de entrada */}
                <div className="px-6 pb-4">
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-white/10">
                    <span className="text-white/60">Entrada:</span>
                    <span className="text-white font-semibold">${formData.entryFee || 25}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Detalles del Torneo</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Estado:</span>
                  <span className={`text-sm px-2 py-1 rounded border ${getTournamentStatusColor(formData.status)}`}>
                    {formData.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Dificultad:</span>
                  <span className={`text-sm px-2 py-1 rounded ${getTournamentDifficultyColor(formData.difficulty)}`}>
                    {formData.difficulty.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Fecha fin:</span>
                  <span className="text-white text-sm">
                    {formData.endDate ? new Date(formData.endDate).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'No definida'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Reglas:</span>
                  <span className="text-white text-sm">
                    {formData.rules.length > 0 ? `${formData.rules.length} regla${formData.rules.length !== 1 ? 's' : ''}` : 'Sin reglas'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Titulares:</span>
                  <span className="text-yellow-400 text-sm font-medium">{formData.titulares}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Suplentes:</span>
                  <span className="text-blue-400 text-sm font-medium">{formData.suplentes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Total por equipo:</span>
                  <span className="text-white text-sm font-semibold">{formData.titulares + formData.suplentes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearTorneo;