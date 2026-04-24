import React from 'react';
import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { DynamicCardList, ManagementPageLayout } from '../../../shared/components/ui';
import { useGestionarJuegos } from '../../hooks/useGestionarJuegos';
import { Juego } from '../../service/juegosService';

const GestionarJuegos: React.FC = () => {
  const {
    // Estados
    games,
    loading,
    loadingCategories,
    paginationInfo,

    // Funciones de manejo
    handleToggleStatus,
    handleEditGame,
    handleDeleteGame,
    handleFilterChange,
    handleRefresh,
    handlePaginationChange,
    getDisplayIcon,
    categories
  } = useGestionarJuegos();


  const renderGameCard = (game: Juego) => (
    <div
      className="bg-black/20 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:border-white/40 transition-all duration-300 group"
    >
      {/* Header del juego */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getDisplayIcon(game.icon || '')}</div>
        <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-slate-300 transition-colors">
              {game.nombre}
            </h3>
            <p className="text-white/80 text-sm">{game.categoriaNombre}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => game.id && handleToggleStatus(game.id)}
            className={`p-1 rounded transition-colors duration-200 ${game.isActive
              ? 'text-green-400 hover:text-green-300'
              : 'text-red-400 hover:text-red-300'
              }`}
            title={game.isActive ? 'Desactivar juego' : 'Activar juego'}
          >
            {game.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-white/85 text-sm mb-4 line-clamp-2">
        {game.descripcion}
      </p>

      {/* Información del juego */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/75">Estado:</span>
          <span className={`font-medium ${game.isActive ? 'text-green-400' : 'text-red-400'}`}>
            {game.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>


      {/* Línea divisoria */}
      <div className="border-t border-white/10 my-4"></div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          onClick={() => game.id && handleEditGame(game.id)}
          className="flex-1 bg-blue-500/20 text-blue-400 py-2 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <Edit className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">Editar</span>
        </button>
        <button
          onClick={() => game.id && handleDeleteGame(game.id)}
          className="bg-red-500/20 text-red-400 py-2 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center"
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  );



  return (
    <ManagementPageLayout>
      <DynamicCardList
        title="Gestionar Juegos"
        subtitle="Administra los juegos de la plataforma"
        cardFields={[
          { label: 'Nombre', key: 'nombre' },
          { label: 'Categoría', key: 'categoriaId' },
          { label: 'Estado', key: 'isActive' }
        ]}
        data={games}
        renderCard={renderGameCard}
        isLoading={loading || loadingCategories}
        onRefresh={handleRefresh}
        onPaginationChange={handlePaginationChange}
        serverPagination={paginationInfo}
        newButtonText="Crear Juego"
        newButtonLink="/worldGaming/juegos/crear"
        filters={[
          {
            type: 'search',
            key: 'search',
            placeholder: 'Buscar por nombre...',
            onChange: (value: string) => handleFilterChange('search', value)
          },
          {
            type: 'category-picker',
            key: 'category',
            placeholder: 'Todas las categorías',
            categories: categories || [],
            loading: loadingCategories,
            onChange: (value: string) => handleFilterChange('category', value)
          },
          {
            type: 'select',
            key: 'status',
            placeholder: 'Todos los estados',
            options: [
              { value: 'active', label: 'Activos' },
              { value: 'inactive', label: 'Inactivos' }
            ],
            onChange: (value: string) => handleFilterChange('status', value)
          },
        ]}
      />
    </ManagementPageLayout>
  );
};

export default GestionarJuegos;
