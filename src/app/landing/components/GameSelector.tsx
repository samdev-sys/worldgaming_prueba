import React from 'react';
import { ChevronDown, ChevronUp, Search, Loader2, Star, Zap, RefreshCw } from 'lucide-react';
import { useGameSelector, GameSelectorProps } from '../hooks/useGameSelector';

const GameSelector: React.FC<GameSelectorProps> = ({ onPaletteUpdate }) => {
  const {
    // Estados
    filteredGames,
    loadingGames,
    hoveredGame,
    isExpanded,
    searchTerm,
    selectedGame,
    currentGame,
    
    // Acciones
    setHoveredGame,
    setSearchTerm,
    handleGameSelect,
    handleExpandToggle,
    clearSelection,
    refreshGames,
    
    // Utilidades
    getGameCardStyle
  } = useGameSelector(onPaletteUpdate);

  if (loadingGames) {
    return (
      <div className="fixed top-24 right-6 z-50">
        <div className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-3 text-white">
            <div className="relative">
              <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
              <div className="absolute inset-0 w-5 h-5 border-2 border-orange-400/30 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm font-medium">Inicializando universo gaming...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-24 right-6 z-50">
      <div className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Selector de Juegos</h3>
                <p className="text-gray-300 text-sm">Elige tu aventura</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshGames}
                disabled={loadingGames}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                title="Actualizar lista de juegos"
              >
                <RefreshCw className={`w-5 h-5 text-white group-hover:text-orange-400 transition-colors ${loadingGames ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleExpandToggle}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                title={isExpanded ? "Contraer selector" : "Expandir selector"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-white group-hover:text-orange-400 transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white group-hover:text-orange-400 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar juegos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all"
            />
          </div>
        </div>

        {/* Contenido expandible */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto">
            {filteredGames.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">
                  {searchTerm ? 'No se encontraron juegos' : 'No hay juegos disponibles'}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      selectedGame === game.id?.toString()
                        ? 'border-orange-400/50 bg-orange-400/10'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                    }`}
                    style={getGameCardStyle(game)}
                    onClick={() => game.id && handleGameSelect(game.id)}
                    onMouseEnter={() => setHoveredGame(game.id || null)}
                    onMouseLeave={() => setHoveredGame(null)}
                  >
                    {/* Indicador de selección */}
                    {selectedGame === game.id?.toString() && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    )}

                    <div className="flex items-start space-x-4">
                      {/* Icono del juego */}
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {game.icon}
                      </div>

                      {/* Información del juego */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-white font-semibold text-sm truncate">
                            {game.nombre}
                          </h4>
                        </div>
                        
                        <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                          {game.descripcion}
                        </p>

                        {/* Estadísticas del juego */}
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          {game.categoriaNombre && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span className="truncate">{game.categoriaNombre}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Efecto hover */}
                    {hoveredGame === game.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-red-500/5 rounded-xl pointer-events-none"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {filteredGames.length} {filteredGames.length === 1 ? 'juego' : 'juegos'} disponible{filteredGames.length !== 1 ? 's' : ''}
            </span>
            {currentGame && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-400 font-medium">Activo: {currentGame.nombre}</span>
                <button
                  onClick={clearSelection}
                  className="ml-2 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors"
                  title="Limpiar selección"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSelector;